use anyhow::{bail, Context, Result};
use clap::Parser;
use crossterm::{
    event::{self, Event, KeyCode, KeyModifiers, MouseEventKind},
    terminal::{disable_raw_mode, enable_raw_mode, EnterAlternateScreen, LeaveAlternateScreen},
    ExecutableCommand,
};
use ratatui::{
    prelude::*,
    widgets::{Block, Borders, Cell, Paragraph, Row, Scrollbar, ScrollbarOrientation, ScrollbarState, Sparkline, Table, TableState},
};
use serde::Deserialize;
use serde_json::{json, Value};
use std::collections::{BTreeMap, HashMap};
use std::io;
use std::path::Path;
use std::sync::Arc;
use std::time::{Duration, Instant};
use tokio::time::sleep;
use std::env;
use std::fs;

#[derive(Parser, Debug)]
struct Args {
    /// Zebra RPC URL (default: http://127.0.0.1:8232)
    #[arg(long, default_value = "http://127.0.0.1:8232")]
    rpc_url: String,

    /// RPC cookie file path (for auth)
    #[arg(long)]
    cookie_file: Option<String>,

    /// Refresh interval for sparkline + summary + fee history (seconds)
    #[arg(short = 'i', long, default_value_t = 10)]
    interval: u64,

    /// Refresh interval for the detailed transactions table (seconds)
    #[arg(short = 't', long, default_value_t = 5)]
    tx_interval: u64,

    /// Batch size for RPC calls
    #[arg(long, default_value_t = 50)]
    batch_size: usize,
}

#[allow(dead_code)]
#[derive(Deserialize, Debug, Default, Clone)]
struct MempoolInfo {
    size: usize,
    bytes: u64,
    usage: u64,
    maxmempool: Option<u64>,
    mempoolminfee: Option<f64>,
}

#[allow(dead_code)]
#[derive(Deserialize, Debug, Clone, Default)]
struct Vin {
    coinbase: Option<String>,
    txid: Option<String>,
    vout: Option<u32>,
}

#[derive(Deserialize, Debug, Clone, Default)]
struct Vout {
    #[serde(rename = "valueZat", default)]
    value_zat: i64,
}

#[derive(Deserialize, Debug, Clone, Default)]
struct Orchard {
    actions: Option<Vec<Value>>,
    #[serde(rename = "valueBalanceZat", default)]
    value_balance_zat: Option<i64>,
}

#[allow(dead_code)]
#[derive(Deserialize, Debug, Clone, Default)]
struct RawTx {
    txid: String,
    vin: Vec<Vin>,
    vout: Vec<Vout>,
    #[serde(rename = "vjoinsplit", default)]
    v_joinsplit: Option<Vec<Value>>,
    #[serde(rename = "vShieldedSpend", default)]
    v_shielded_spend: Option<Vec<Value>>,
    #[serde(rename = "vShieldedOutput", default)]
    v_shielded_output: Option<Vec<Value>>,
    orchard: Option<Orchard>,
    #[serde(rename = "valueBalanceZat", default)]
    value_balance_zat: Option<i64>,
    #[serde(rename = "fee", default)]
    fee: Option<f64>,
    #[serde(rename = "vsize", default)]
    vsize: Option<u64>,
}

#[allow(dead_code)]
#[derive(Debug, Clone)]
struct TxClass {
    txid: String,
    pool_type: String,
    flow_type: String,
    is_coinbase: bool,
    transparent_value: f64,
    sapling_value: f64,
    orchard_value: f64,
    fee_rate: f64,
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();

    let client = reqwest::Client::new();
    let rpc = Arc::new(client);

    let auth = if let Some(ref path) = args.cookie_file {
        read_cookie(path)?
    } else {
        auto_detect_cookie()?
    };

    io::stdout().execute(EnterAlternateScreen)?;
    enable_raw_mode()?;
    let backend = CrosstermBackend::new(io::stdout());
    let mut terminal = Terminal::new(backend)?;
    terminal.clear()?;

    let mut size_history: Vec<u64> = Vec::with_capacity(120);
    let mut fee_history: Vec<u64> = Vec::with_capacity(120);

    let mut historical_counts: BTreeMap<String, u32> = BTreeMap::new();
    let mut total_tx_seen: u32 = 0;

    let mut current_main_interval = args.interval;
    let mut current_tx_interval = args.tx_interval;

    let mut last_main = Instant::now();
    let mut last_tx = Instant::now();

    let mut cached_info: Option<MempoolInfo> = None;
    let mut cached_tx_classes: Option<Vec<TxClass>> = None;
    let mut cached_total_fee: f64 = 0.0;

    let mut table_state = TableState::default();
    let mut scrollbar_state = ScrollbarState::default();

    loop {
        if event::poll(Duration::from_millis(150))? {
            match event::read()? {
                Event::Key(key) => match key.code {
                    KeyCode::Char('q') | KeyCode::Char('Q') | KeyCode::Esc => {
                        disable_raw_mode()?;
                        io::stdout().execute(LeaveAlternateScreen)?;
                        return Ok(());
                    }
                    KeyCode::Char('c') if key.modifiers.contains(KeyModifiers::CONTROL) => {
                        disable_raw_mode()?;
                        io::stdout().execute(LeaveAlternateScreen)?;
                        return Ok(());
                    }
                    KeyCode::Char('r') | KeyCode::Char('R') => {
                        last_main = Instant::now() - Duration::from_secs(current_main_interval);
                        last_tx = Instant::now() - Duration::from_secs(current_tx_interval);
                    }
                    KeyCode::Char('+') => {
                        current_main_interval = (current_main_interval + 5).min(60);
                    }
                    KeyCode::Char('-') => {
                        current_main_interval = current_main_interval.saturating_sub(5).max(5);
                    }
                    KeyCode::Char('T') => {  // Capital T = increase TxTable
                        current_tx_interval = (current_tx_interval + 5).min(60);
                    }
                    KeyCode::Char('t') => {  // lowercase t = decrease TxTable
                        current_tx_interval = current_tx_interval.saturating_sub(5).max(5);
                    }
                    _ => {}
                },
                Event::Mouse(mouse) => {
                    if let Some(tx_classes) = &cached_tx_classes {
                        let row_count = tx_classes.len();
                        match mouse.kind {
                            MouseEventKind::ScrollDown => {
                                let current = table_state.selected().unwrap_or(0);
                                if current < row_count.saturating_sub(1) {
                                    table_state.select(Some(current + 1));
                                }
                            }
                            MouseEventKind::ScrollUp => {
                                let current = table_state.selected().unwrap_or(0);
                                if current > 0 {
                                    table_state.select(Some(current - 1));
                                }
                            }
                            _ => {}
                        }
                        scrollbar_state = scrollbar_state.position(table_state.selected().unwrap_or(0));
                    }
                }
                _ => {}
            }
        }

        let now = Instant::now();
        let needs_main = now.duration_since(last_main) >= Duration::from_secs(current_main_interval);
        let needs_tx = now.duration_since(last_tx) >= Duration::from_secs(current_tx_interval);

        if needs_main || needs_tx || cached_info.is_none() {
            let (info, mut tx_classes, total_fee) = fetch_and_classify_mempool(
                Arc::clone(&rpc),
                &args,
                &auth,
            ).await?;

            tx_classes.sort_by(|a, b| b.fee_rate.partial_cmp(&a.fee_rate).unwrap_or(std::cmp::Ordering::Equal));

            cached_info = Some(info);
            cached_tx_classes = Some(tx_classes);
            cached_total_fee = total_fee;

            for cls in cached_tx_classes.as_ref().unwrap() {
                *historical_counts.entry(cls.flow_type.clone()).or_insert(0) += 1;
            }
            total_tx_seen += cached_tx_classes.as_ref().unwrap().len() as u32;

            size_history.push(cached_info.as_ref().unwrap().size as u64);
            fee_history.push((total_fee * 1_000_000.0) as u64);

            if size_history.len() > 120 {
                size_history.remove(0);
                fee_history.remove(0);
            }

            if needs_main { last_main = now; }
            if needs_tx { last_tx = now; }
        }

        terminal.draw(|f| {
            let chunks = Layout::default()
                .direction(Direction::Vertical)
                .constraints([
                    Constraint::Length(4),
                    Constraint::Length(8),
                    Constraint::Length(12),
                    Constraint::Min(0),
                    Constraint::Length(8),
                    Constraint::Length(2),
                ])
                .split(f.area());

            if let Some(info) = &cached_info {
                let status = format!("Zebra Mempool • {} txs • {:.1} MB", info.size, info.bytes as f64 / 1_000_000.0);
                f.render_widget(Paragraph::new(status).block(Block::default().title("Status").borders(Borders::ALL)), chunks[0]);
            }

            f.render_widget(
                Sparkline::default()
                    .block(Block::default().title("Tx Count History (last ~20 min)").borders(Borders::ALL))
                    .data(&size_history)
                    .style(Style::default().fg(Color::Cyan)),
                chunks[1],
            );

            if let Some(tx_classes) = &cached_tx_classes {
                let split = Layout::default()
                    .direction(Direction::Horizontal)
                    .constraints([Constraint::Percentage(50), Constraint::Percentage(50)])
                    .split(chunks[2]);

                let mut type_counts: BTreeMap<String, (u32, f64)> = BTreeMap::new();
                for cls in tx_classes {
                    let e = type_counts.entry(cls.flow_type.clone()).or_insert((0, 0.0));
                    e.0 += 1;
                    e.1 += cls.transparent_value.abs() + cls.sapling_value.abs() + cls.orchard_value.abs();
                }
                let current_rows: Vec<Row> = type_counts.iter().map(|(t, (c, v))| {
                    Row::new(vec![Cell::from(t.clone()), Cell::from(format!("{}", c)), Cell::from(format!("{:.2} ZEC", v))])
                }).collect();
                let current_table = Table::new(current_rows, [Constraint::Percentage(55), Constraint::Percentage(20), Constraint::Percentage(25)])
                    .block(Block::default().title("Current").borders(Borders::ALL));
                f.render_widget(current_table, split[0]);

                let total_hist = total_tx_seen as f64;
                let hist_rows: Vec<Row> = historical_counts.iter().map(|(typ, cnt)| {
                    let pct = if total_hist > 0.0 { (*cnt as f64 / total_hist) * 100.0 } else { 0.0 };
                    Row::new(vec![Cell::from(typ.clone()), Cell::from(format!("{:.1}%", pct))])
                }).collect();
                let hist_table = Table::new(hist_rows, [Constraint::Percentage(70), Constraint::Percentage(30)])
                    .header(Row::new(vec!["Type", "Hist %"]).style(Style::default().fg(Color::Yellow)))
                    .block(Block::default().title("Historical % since start").borders(Borders::ALL));
                f.render_widget(hist_table, split[1]);
            }

            if let Some(tx_classes) = &cached_tx_classes {
                let table_area = chunks[3];
                let scrollbar_area = Rect {
                    x: table_area.x + table_area.width.saturating_sub(1),
                    y: table_area.y,
                    width: 1,
                    height: table_area.height,
                };

                let rows: Vec<Row> = tx_classes.iter().enumerate().map(|(i, c)| {
                    Row::new(vec![
                        Cell::from(format!("{:02}", i + 1)),
                        Cell::from(c.txid.clone()),
                        Cell::from(format!("{:.3}", c.fee_rate)),
                        Cell::from(format!("{:.4}", c.transparent_value)),
                        Cell::from(format!("{:.4}", c.sapling_value)),
                        Cell::from(format!("{:.4}", c.orchard_value)),
                        Cell::from(c.flow_type.clone()),
                    ])
                }).collect();

                let table = Table::new(
                    rows,
                    [Constraint::Length(4), Constraint::Length(68), Constraint::Length(8), Constraint::Length(10), Constraint::Length(10), Constraint::Length(10), Constraint::Percentage(30)],
                )
                .header(Row::new(vec!["#", "TxID", "Fee", "T", "S", "O", "Type"]).style(Style::default().fg(Color::Yellow)))
                .block(Block::default().title("Mempool Transactions (mouse wheel to scroll)").borders(Borders::ALL))
                .highlight_style(Style::default().bg(Color::DarkGray));

                f.render_stateful_widget(table, table_area, &mut table_state);

                let scrollbar = Scrollbar::new(ScrollbarOrientation::VerticalRight)
                    .begin_symbol(Some("↑"))
                    .end_symbol(Some("↓"));
                f.render_stateful_widget(scrollbar, scrollbar_area, &mut scrollbar_state);
            }

            let fee_title = format!(
                "Total Mempool Fees History (µZEC) — Current: {:.8} ZEC",
                cached_total_fee
            );
            f.render_widget(
                Sparkline::default()
                    .block(Block::default().title(fee_title).borders(Borders::ALL))
                    .data(&fee_history)
                    .style(Style::default().fg(Color::Green)),
                chunks[4],
            );

            let footer = format!(
                " q/Esc/Ctrl+C: Quit | r: Refresh | +/-: Main({}s) | T/t: TxTable({}s) ",
                current_main_interval, current_tx_interval
            );
            f.render_widget(Paragraph::new(footer).style(Style::default().fg(Color::DarkGray)), chunks[5]);
        })?;

        sleep(Duration::from_millis(50)).await;
    }
}

fn read_cookie(path: &str) -> Result<Option<(String, String)>> {
    let content = fs::read_to_string(path).context(format!("Cannot read cookie file: {}", path))?;
    let line = content.trim();
    if let Some((user, pass)) = line.split_once(':') {
        Ok(Some((user.to_string(), pass.to_string())))
    } else {
        bail!("Invalid cookie format in {}", path)
    }
}

fn auto_detect_cookie() -> Result<Option<(String, String)>> {
    let home = env::var("HOME").unwrap_or_else(|_| "/root".to_string());
    let candidates = [
        format!("{}/.cache/zebra/.cookie", home),
        format!("{}/.zcash/.cookie", home),
        "/home/zebra/.cache/zebra/.cookie".to_string(),
    ];
    for path in candidates {
        if Path::new(&path).exists() {
            if let Ok(Some(auth)) = read_cookie(&path) {
                println!("✓ Cookie found: {}", path);
                return Ok(Some(auth));
            }
        }
    }
    println!("No cookie file found - running without authentication");
    Ok(None)
}

async fn fetch_and_classify_mempool(
    rpc: Arc<reqwest::Client>,
    args: &Args,
    auth: &Option<(String, String)>,
) -> Result<(MempoolInfo, Vec<TxClass>, f64)> {
    let payload = json!({ "jsonrpc": "2.0", "method": "getmempoolinfo", "params": [], "id": 1 });
    let mut req = rpc.post(&args.rpc_url).json(&payload);
    if let Some((user, pass)) = auth { req = req.basic_auth(user, Some(pass)); }
    let resp: Value = req.send().await?.json().await?;
    let info: MempoolInfo = serde_json::from_value(resp["result"].clone())?;

    let payload = json!({ "jsonrpc": "2.0", "method": "getrawmempool", "params": [true], "id": 2 });
    let mut req = rpc.post(&args.rpc_url).json(&payload);
    if let Some((user, pass)) = auth { req = req.basic_auth(user, Some(pass)); }
    let resp: Value = req.send().await?.json().await?;
    let mempool_entries: HashMap<String, Value> = serde_json::from_value(resp["result"].clone())?;
    let txids: Vec<String> = mempool_entries.keys().cloned().collect();

    let mut txs: Vec<RawTx> = vec![];
    for chunk in txids.chunks(args.batch_size) {
        let mut requests = vec![];
        for (i, txid) in chunk.iter().enumerate() {
            requests.push(json!({
                "jsonrpc": "2.0",
                "method": "getrawtransaction",
                "params": [txid, 1],
                "id": i
            }));
        }
        let mut req = rpc.post(&args.rpc_url).json(&requests);
        if let Some((user, pass)) = auth { req = req.basic_auth(user, Some(pass)); }
        let responses: Vec<Value> = req.send().await?.json().await?;
        for r in responses {
            if let Some(result) = r.get("result") {
                if let Ok(tx) = serde_json::from_value::<RawTx>(result.clone()) {
                    txs.push(tx);
                }
            }
        }
    }

    let mut tx_classes: Vec<TxClass> = vec![];
    let mut total_fee_zec = 0.0;

    for tx in txs {
        let (pool_type, is_coinbase, t_zat, s_zat, o_zat) = detect_pools(&tx);
        let transparent_value = t_zat as f64 / 100_000_000.0;
        let sapling_value = s_zat as f64 / 100_000_000.0;
        let orchard_value = o_zat as f64 / 100_000_000.0;

        let flow_type = if is_coinbase {
            "Coinbase (T)".to_string()
        } else if pool_type == "Transparent" {
            "Transparent".to_string()
        } else if !pool_type.contains("Transparent") {
            if pool_type == "Orchard" { "Private (o → o)".to_string() }
            else if pool_type == "Sapling" { "Private (s → s)".to_string() }
            else { "Private (s+o → s+o)".to_string() }
        } else if tx.v_joinsplit.as_ref().map_or(false, |v| !v.is_empty()) {
            "Sprout Mixed".to_string()
        } else {
            match (s_zat.signum(), o_zat.signum()) {
                (-1, 0) => "Shielding: T → S".to_string(),
                (0, -1) => "Shielding: T → O".to_string(),
                (-1, -1) => "Shielding: T → S+O".to_string(),
                (1, 0) => "Deshielding: S → T".to_string(),
                (0, 1) => "Deshielding: O → T".to_string(),
                (1, 1) => "Deshielding: S+O → T".to_string(),
                (1, -1) => "Deshielding: S → T + T → O".to_string(),
                (-1, 1) => "Deshielding: O → T + T → S".to_string(),
                _ => {
                    if s_zat == 0 && o_zat == 0 {
                        "Zero-net Shielded (z→z)".to_string()
                    } else {
                        format!("Complex Mixed [{}]", pool_type)
                    }
                }
            }
        };

        let entry = mempool_entries.get(&tx.txid).unwrap_or(&Value::Null);
        let vsize = entry["vsize"].as_u64().unwrap_or(tx.vsize.unwrap_or(1));
        let fee_zec = entry["fee"].as_f64().unwrap_or(0.0);
        total_fee_zec += fee_zec;
        let fee_zat = (fee_zec * 100_000_000.0) as u64;
        let fee_rate = if vsize > 0 { fee_zat as f64 / vsize as f64 } else { 0.0 };

        tx_classes.push(TxClass {
            txid: tx.txid.clone(),
            pool_type,
            flow_type,
            is_coinbase,
            transparent_value,
            sapling_value,
            orchard_value,
            fee_rate,
        });
    }

    Ok((info, tx_classes, total_fee_zec))
}

fn detect_pools(tx: &RawTx) -> (String, bool, i64, i64, i64) {
    let is_coinbase = tx.vin.first().and_then(|v| v.coinbase.as_deref()).is_some();

    let mut pools = vec![];
    if !tx.vin.is_empty() || !tx.vout.is_empty() { pools.push("Transparent".to_string()); }
    if tx.v_joinsplit.as_ref().map_or(false, |v| !v.is_empty()) { pools.push("Sprout".to_string()); }
    if tx.v_shielded_spend.as_ref().map_or(false, |v| !v.is_empty()) || tx.v_shielded_output.as_ref().map_or(false, |v| !v.is_empty()) {
        pools.push("Sapling".to_string());
    }
    if tx.orchard.as_ref().and_then(|o| o.actions.as_ref()).map_or(false, |a| !a.is_empty()) {
        pools.push("Orchard".to_string());
    }

    let pool_type = if pools.is_empty() { "Unknown".to_string() } else { pools.join(",") };

    let t_zat: i64 = tx.vout.iter().map(|v| v.value_zat).sum();
    let s_zat = tx.value_balance_zat.unwrap_or(0);
    let o_zat = tx.orchard.as_ref().and_then(|or| or.value_balance_zat).unwrap_or(0);

    (pool_type, is_coinbase, t_zat, s_zat, o_zat)
}