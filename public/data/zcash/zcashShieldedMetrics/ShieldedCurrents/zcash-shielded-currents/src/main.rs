use anyhow::{Context, Result};
use clap::Parser;
use serde::Deserialize;
use serde_json::Value;
use std::collections::HashMap;
use std::fs::{self, File};
use std::io::Write;
use std::path::Path;
use std::sync::{Arc, Mutex};
use std::time::Instant;
use chrono::{DateTime, Utc};
use tokio::sync::Semaphore;
use futures::future::join_all;


#[derive(Parser, Debug)]
#[command(author, version, about, arg_required_else_help = true)]
struct Args {
    #[arg(long, default_value_t = 500)]
    last: u32,

    #[arg(long)]
    diagnose: bool,

    #[arg(long, alias = "test-block")]
    block: Option<u32>,

    #[arg(long)]
    from: Option<u32>,

    #[arg(long)]
    to: Option<u32>,

    #[arg(long, default_value = "http://127.0.0.1:8232")]
    rpc: String,

    #[arg(long)]
    cookie_file: Option<String>,

    #[arg(long, default_value = ".")]
    out: String,

    #[arg(long, default_value_t = 4)]
    parallel: usize,

    #[arg(long, default_value_t = false)]
    skip_fees: bool,
}

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

#[derive(Deserialize, Debug, Clone, Default)]
struct RawTx {
    #[serde(default)]
    txid: String,
    #[serde(default)]
    height: Option<u32>,
    #[serde(default)]
    time: Option<u64>,
    #[serde(default)]
    vin: Vec<Vin>,
    #[serde(default)]
    vout: Vec<Vout>,
    #[serde(rename = "vjoinsplit", default)]
    v_joinsplit: Option<Vec<Value>>,
    #[serde(rename = "vShieldedSpend", default)]
    v_shielded_spend: Option<Vec<Value>>,
    #[serde(rename = "vShieldedOutput", default)]
    v_shielded_output: Option<Vec<Value>>,
    #[serde(default)]
    orchard: Option<Orchard>,
    #[serde(rename = "valueBalanceZat", default)]
    value_balance_zat: Option<i64>,
}

#[derive(Debug, Clone)]
struct TxMetrics {
    block: u32,
    time: u64,
    txid: String,
    transfers: u32,
    fee_zec: f64,
    value_out: f64,
    transparent: f64,
    sapling: f64,
    orchard: f64,
    pool_type: String,
    is_coinbase: bool,
    vout_count: u32,
    vshielded_count: u32,
    orchard_count: u32,
}

#[derive(Clone)]
struct Rpc {
    client: reqwest::Client,
    url: String,
    prevout_cache: Arc<Mutex<HashMap<String, Vec<i64>>>>,
    auth: Option<(String, String)>,
}

impl Rpc {
    fn new(url: String, cookie_file: Option<String>) -> Result<Self> {
        let auth = if let Some(path) = cookie_file {
            Self::read_cookie(&path)?
        } else {
            Self::auto_detect_cookie()?
        };

        Ok(Self {
            client: reqwest::Client::new(),
            url,
            prevout_cache: Arc::new(Mutex::new(HashMap::new())),
            auth,
        })
    }

    fn read_cookie(path: &str) -> Result<Option<(String, String)>> {
        let content = fs::read_to_string(path).context(format!("Cannot read cookie file: {}", path))?;
        let line = content.trim();
        if let Some((user, pass)) = line.split_once(':') {
            Ok(Some((user.to_string(), pass.to_string())))
        } else {
            anyhow::bail!("Invalid cookie format in {}", path)
        }
    }

    fn auto_detect_cookie() -> Result<Option<(String, String)>> {
        let home = std::env::var("HOME").unwrap_or_else(|_| "/root".to_string());
        let candidates = [
            format!("{}/.cache/zebra/.cookie", home),
            format!("{}/.zcash/.cookie", home),
            "/home/zebra/.cache/zebra/.cookie".to_string(),
        ];

        for path in candidates {
            if Path::new(&path).exists() {
                if let Ok(Some(auth)) = Self::read_cookie(&path) {
                    println!("Using Zebra cookie: {}", path);
                    return Ok(Some(auth));
                }
            }
        }
        println!("No cookie file found - running without auth");
        Ok(None)
    }

    async fn rpc<T: for<'de> Deserialize<'de>>(&self, method: &str, params: Value) -> Result<T> {
        let mut req = self.client.post(&self.url).json(&serde_json::json!({
            "jsonrpc": "2.0",
            "method": method,
            "params": params,
            "id": 1
        }));

        if let Some((user, pass)) = &self.auth {
            req = req.basic_auth(user, Some(pass));
        }

        let res: Value = req.send().await?.json().await?;

        if let Some(err) = res.get("error") {
            anyhow::bail!("Zebra RPC error: {:?}", err);
        }

        let result = res.get("result").context("no 'result' field")?;
        if result.is_null() {
            anyhow::bail!("Zebra returned null result");
        }

        serde_json::from_value(result.clone()).context("deserialize failed")
    }

    async fn get_block(&self, height: u32) -> Result<Value> {
        if let Ok(block) = self.rpc("getblock", serde_json::json!([height, 2])).await {
            return Ok(block);
        }
        let hash: String = self.rpc("getblockhash", serde_json::json!([height])).await?;
        self.rpc("getblock", serde_json::json!([hash, 2])).await
    }

    async fn get_raw_tx(&self, txid: &str) -> Result<RawTx> {
        self.rpc("getrawtransaction", serde_json::json!([txid, 1])).await
    }

    async fn get_vout_value(&self, txid: &str, vout_idx: u32) -> Result<i64> {
        let key = txid.to_string();
        {
            let cache = self.prevout_cache.lock().unwrap();
            if let Some(vals) = cache.get(&key) {
                if (vout_idx as usize) < vals.len() {
                    return Ok(vals[vout_idx as usize]);
                }
            }
        }

        let tx: RawTx = self.get_raw_tx(txid).await?;
        let vals: Vec<i64> = tx.vout.iter().map(|v| v.value_zat).collect();

        self.prevout_cache.lock().unwrap().insert(key, vals.clone());
        Ok(vals[vout_idx as usize])
    }
}

fn detect_pools_and_values(tx: &RawTx) -> (String, bool, i64, i64, i64, u32, u32, u32, u32) {
    let is_cb = tx.vin.first().and_then(|v| v.coinbase.as_deref()).is_some();

    let mut pools = Vec::new();
    if tx.vin.iter().any(|v| v.txid.is_some()) || tx.vout.iter().any(|v| v.value_zat > 0) {
        pools.push("Transparent");
    }
    if tx.v_joinsplit.as_ref().map_or(false, |v| !v.is_empty()) {
        pools.push("Sprout");
    }
    if tx.v_shielded_spend.as_ref().map_or(false, |v| !v.is_empty()) ||
       tx.v_shielded_output.as_ref().map_or(false, |v| !v.is_empty()) {
        pools.push("Sapling");
    }
    if tx.orchard.as_ref().and_then(|o| o.actions.as_ref()).map_or(false, |a| !a.is_empty()) {
        pools.push("Orchard");
    }

    let pool_type = if is_cb {
        "Coinbase".to_string()
    } else if pools.is_empty() {
        "Unknown".to_string()
    } else {
        pools.join(",")
    };

    let vout_count = tx.vout.len() as u32;
    let vshielded_count = tx.v_shielded_output.as_ref().map_or(0, |v| v.len() as u32);
    let orchard_count = tx.orchard.as_ref().and_then(|o| o.actions.as_ref()).map_or(0, |a| a.len() as u32);

    let transfers = vout_count + vshielded_count + orchard_count;

    let t = tx.vout.iter().map(|v| v.value_zat).sum::<i64>();
    let s = tx.value_balance_zat.unwrap_or(0);
    let o = tx.orchard.as_ref().and_then(|or| or.value_balance_zat).unwrap_or(0);

    (pool_type, is_cb, t, s, o, transfers, vout_count, vshielded_count, orchard_count)
}

async fn process_block(rpc: Arc<Rpc>, height: u32, quiet: bool, calculate_fees: bool) -> Vec<TxMetrics> {
    let mut res = Vec::new();

    let block_data = match rpc.get_block(height).await {
        Ok(b) => b,
        Err(e) => {
            if e.to_string().contains("Invalid params") {
                if !quiet { eprintln!("Skipping block {}: Invalid params (node not ready yet)", height); }
            } else {
                if !quiet { eprintln!("Error fetching block {}: {}", height, e); }
            }
            return res;
        }
    };

    let block_height = block_data["height"].as_u64().unwrap_or(height as u64) as u32;
    let block_time = block_data["time"].as_u64().unwrap_or(0);

    if let Some(tx_field) = block_data.get("tx") {
        if tx_field.is_array() {
            let txs = tx_field.as_array().unwrap();
            if !quiet {
                println!("Block {}: {} transactions", height, txs.len());
            }

            for tx_json in txs {
                match serde_json::from_value::<RawTx>(tx_json.clone()) {
                    Ok(mut tx) => {
                        if tx.height.is_none() { tx.height = Some(block_height); }
                        if tx.time.is_none() { tx.time = Some(block_time); }

                        let vout_values: Vec<i64> = tx.vout.iter().map(|v| v.value_zat).collect();
                        {
                            let mut cache = rpc.prevout_cache.lock().unwrap();
                            cache.insert(tx.txid.clone(), vout_values);
                        }

                        let (pool_type, is_cb, t_zat, s_zat, o_zat, transfers, vout_count, vshielded_count, orchard_count) = detect_pools_and_values(&tx);

                        let fee_zat = if !calculate_fees || is_cb {
                            0
                        } else {
                            let mut input_sum = 0i64;
                            for vin in &tx.vin {
                                if let (Some(txid), Some(vout_idx)) = (&vin.txid, vin.vout) {
                                    if let Ok(val) = rpc.get_vout_value(txid, vout_idx).await {
                                        input_sum += val;
                                    }
                                }
                            }
                            let output_sum = tx.vout.iter().map(|v| v.value_zat).sum::<i64>();
                            input_sum - output_sum - s_zat - o_zat
                        };

                        res.push(TxMetrics {
                            block: tx.height.unwrap_or(block_height),
                            time: tx.time.unwrap_or(block_time),
                            txid: tx.txid,
                            transfers,
                            fee_zec: fee_zat as f64 / 100_000_000.0,
                            value_out: (t_zat + s_zat + o_zat) as f64 / 100_000_000.0,
                            transparent: t_zat as f64 / 100_000_000.0,
                            sapling: s_zat as f64 / 100_000_000.0,
                            orchard: o_zat as f64 / 100_000_000.0,
                            pool_type,
                            is_coinbase: is_cb,
                            vout_count,
                            vshielded_count,
                            orchard_count,
                        });
                    }
                    Err(e) => if !quiet { eprintln!("Block {} tx deserial error: {}", height, e); },
                }
            }
        }
    }
    res
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();
    let out_dir = Path::new(&args.out);
    fs::create_dir_all(out_dir)?;

    let rpc = Arc::new(Rpc::new(args.rpc.clone(), args.cookie_file)?);

    let start_time = Instant::now();

    if args.diagnose {
        println!("Running full RPC diagnostics...");
        let info: Value = rpc.rpc("getblockchaininfo", serde_json::json!([])).await?;
        let tip: u32 = info["blocks"].as_u64().context("no blocks field")? as u32;
        println!("RPC connection successful!");
        println!("Tip height: {}", tip);
        println!("Chain: {}", info["chain"]);
        println!("Best block hash: {}", info["bestblockhash"]);

        let test_height = if tip > 1000 { tip - 1000 } else { tip / 2 };
        match rpc.get_block(test_height).await {
            Ok(block) => println!("getblock({}) succeeded", block["height"]),
            Err(e) => println!("getblock failed (normal for recent blocks): {}", e),
        }
        println!("\nDiagnostics complete.");
        let elapsed = start_time.elapsed();
        println!("Completed in {:.2} seconds", elapsed.as_secs_f64());
        return Ok(());
    }

    if let Some(height) = args.block {
        println!("Testing single block {}", height);

        let info: Value = rpc.rpc("getblockchaininfo", serde_json::json!([])).await?;
        println!("Current blockchain info:");
        println!("  Tip height       : {}", info["blocks"]);
        println!("  Best block hash  : {}", info["bestblockhash"]);
        println!("  Chain            : {}", info["chain"]);
        println!("  Validated height : {}", info["blocks"]);
        println!("  Blocks           : {}", info["blocks"]);
        println!("  Headers          : {}", info["headers"]);
        println!("  Difficulty       : {}", info["difficulty"]);

        let metrics = process_block(rpc.clone(), height, false, !args.skip_fees).await;
        println!("Block {} processed: {} transactions", height, metrics.len());

        write_myresults_md(&metrics, out_dir)?;
        write_summary_md(&metrics, height, height, out_dir, &rpc).await?;
        write_pool_currents(&metrics, out_dir)?;

        println!("Single-block output written to {}/", out_dir.display());
        let elapsed = start_time.elapsed();
        println!("Completed in {:.2} seconds", elapsed.as_secs_f64());
        return Ok(());
    }

    let (start, end) = if let (Some(f), Some(t)) = (args.from, args.to) {
        if f > t { anyhow::bail!("--from must be <= --to"); }
        (f, t)
    } else {
        let info: Value = rpc.rpc("getblockchaininfo", serde_json::json!([])).await?;
        let tip: u32 = info["blocks"].as_u64().context("no blocks field")? as u32;
        let end = if tip > 1000 { tip - 1000 } else { tip };
        let start = end.saturating_sub(args.last.saturating_sub(1));
        (start, end)
    };

    println!("\nProcessing blocks {}–{} with max {} concurrent RPCs …", start, end, args.parallel);

    let semaphore = Arc::new(Semaphore::new(args.parallel));
    let tasks: Vec<_> = (start..=end).map(|h| {
        let rpc_clone = rpc.clone();
        let sem_clone = semaphore.clone();
        tokio::spawn(async move {
            let _permit = sem_clone.acquire().await.unwrap();
            process_block(rpc_clone, h, true, !args.skip_fees).await
        })
    }).collect();

    let all_results = join_all(tasks).await;
    let all_metrics: Vec<TxMetrics> = all_results.into_iter().filter_map(|r| r.ok()).flatten().collect();

    println!("Processed {} transactions", all_metrics.len());

    write_myresults_md(&all_metrics, out_dir)?;
    write_summary_md(&all_metrics, start, end, out_dir, &rpc).await?;
    write_pool_currents(&all_metrics, out_dir)?;

    println!("All outputs written to {}/", out_dir.display());
    let elapsed = start_time.elapsed();
    println!("Completed in {:.2} seconds", elapsed.as_secs_f64());

    Ok(())
}

fn format_date(ts: u64) -> String {
    DateTime::<Utc>::from_timestamp(ts as i64, 0)
        .unwrap_or_default()
        .format("%c")
        .to_string()
}

fn write_myresults_md(metrics: &[TxMetrics], out: &Path) -> Result<()> {
    let mut f = File::create(out.join("myresults.md"))?;
    writeln!(f, "================================================================================")?;
    writeln!(f, "Finding TXs ...")?;
    writeln!(f)?;

    for m in metrics {
        let date = format_date(m.time);
        let cb = if m.is_coinbase { "IsCoinbase" } else { "" };
        writeln!(f,
            "{} | {} | {} | {} | {:.8} | {:.8} | {:.8} | {:.8} | {:.8} | {} | {}",
            date, m.block, m.txid, m.transfers, m.fee_zec, m.value_out,
            m.transparent, m.sapling, m.orchard, m.pool_type, cb
        )?;
    }
    Ok(())
}

async fn write_summary_md(metrics: &[TxMetrics], start: u32, end: u32, out: &Path, rpc: &Rpc) -> Result<()> {
    let total_txs = metrics.len();

    let pure_t = metrics.iter().filter(|m| m.pool_type == "Transparent").count();
    let pure_s = metrics.iter().filter(|m| m.pool_type == "Sapling").count();
    let pure_o = metrics.iter().filter(|m| m.pool_type == "Orchard").count();
    let pure_sprout = metrics.iter().filter(|m| m.pool_type == "Sprout").count();
    let mixed = metrics.iter().filter(|m| m.pool_type.contains(',')).count();
    let cb = metrics.iter().filter(|m| m.is_coinbase).count();
    let unknown = metrics.iter().filter(|m| m.pool_type == "Unknown").count();
    let sum = pure_t + pure_s + pure_o + pure_sprout + mixed + cb + unknown;

    println!("Pool verification: Pure T={} | S={} | O={} | Sprout={} | Mixed={} | CB={} | Unknown={} -> Sum={} / Total={}",
        pure_t, pure_s, pure_o, pure_sprout, mixed, cb, unknown, sum, total_txs);

    if sum == total_txs {
        println!("All transactions perfectly categorized!");
    } else {
        println!("WARNING: Categories do not add up (difference = {})", (sum as i64 - total_txs as i64));
    }

    let coinbase_count = cb;
    let coinbase_pct = if total_txs > 0 { (coinbase_count as f64 / total_txs as f64 * 100.0).round() } else { 0.0 };

    let t_transfer: u32 = metrics.iter().map(|m| m.vout_count).sum();
    let s_transfer: u32 = metrics.iter().map(|m| m.vshielded_count).sum();
    let o_transfer: u32 = metrics.iter().map(|m| m.orchard_count).sum();
    let total_transfer = t_transfer + s_transfer + o_transfer;

    let t_tx_count = metrics.iter().filter(|m| m.pool_type.contains("Transparent")).count();

    let shielded_pct = if total_txs > 0 {
        let ratio = 100.0 - ((t_tx_count as f64 / total_txs as f64) * 100.0);
        (ratio * 100.0).round() / 100.0
    } else { 0.0 };

    let s_in = metrics.iter().filter(|m| m.sapling < 0.0).count();
    let s_out = metrics.iter().filter(|m| m.sapling > 0.0).count();
    let s_total = s_in + s_out;
    let s_pct = if total_txs > 0 { (s_total as f64 / total_txs as f64 * 100.0).round() } else { 0.0 };

    let o_in = metrics.iter().filter(|m| m.orchard < 0.0).count();
    let o_out = metrics.iter().filter(|m| m.orchard > 0.0).count();
    let o_total = o_in + o_out;
    let o_pct = if total_txs > 0 { (o_total as f64 / total_txs as f64 * 100.0).round() } else { 0.0 };

    let s_inflow: f64 = metrics.iter().filter(|m| m.sapling < 0.0).map(|m| m.sapling).sum();
    let s_outflow: f64 = metrics.iter().filter(|m| m.sapling > 0.0).map(|m| m.sapling).sum();
    let s_flow = s_outflow + s_inflow;

    let o_inflow: f64 = metrics.iter().filter(|m| m.orchard < 0.0).map(|m| m.orchard).sum();
    let o_outflow: f64 = metrics.iter().filter(|m| m.orchard > 0.0).map(|m| m.orchard).sum();
    let o_flow = o_outflow + o_inflow;

    let info = rpc.rpc::<Value>("getblockchaininfo", serde_json::json!([])).await?;
    let chain_supply = info["chainSupply"]["chainValue"].as_f64().unwrap_or(0.0);

    let value_pools = if let Some(pools) = info["valuePools"].as_array() {
        pools
    } else {
        &vec![]
    };

    let mut transparent = 0.0;
    let mut sprout = 0.0;
    let mut sapling = 0.0;
    let mut orchard = 0.0;
    let mut lockbox = 0.0;

    for pool in value_pools {
        if let (Some(id), Some(val)) = (pool["id"].as_str(), pool["chainValue"].as_f64()) {
            match id {
                "transparent" => transparent = val,
                "sprout" => sprout = val,
                "sapling" => sapling = val,
                "orchard" => orchard = val,
                "lockbox" => lockbox = val,
                _ => {}
            }
        }
    }

    let total_chain = chain_supply;
    let total_shielded = sprout + sapling + orchard + lockbox;

    let content = format!(
        "Between [{start}],[{end}]\n\
         {total_txs} txs\n\
         {coinbase_count} coinbase txs (=> {coinbase_pct:.2}% Coinbase txs)\n\
         {t_transfer} t transfer txs\n\
         {s_transfer} s transfer txs\n\
         {o_transfer} o transfer txs\n\
         {total_transfer} total transfer txs\n\
         T txs     : {t_tx_count} (=> {shielded_pct:.2}% Shielded)\n\
         S txs in  : {s_in}\n\
         S txs out : {s_out}\n\
         S txs     : {s_total} ( {s_pct:.2}% )\n\
         S Inflows : {s_inflow:.8} ZEC\n\
         S Outflows: {s_outflow:.8} ZEC\n\
         S flow => : {s_flow:.8} ZEC\n\
         O txs in  : {o_in}\n\
         O txs out : {o_out}\n\
         O txs     : {o_total} ( {o_pct:.2}% )\n\
         O Inflows : {o_inflow:.8} ZEC\n\
         O Outflows: {o_outflow:.8} ZEC\n\
         O flow => : {o_flow:.8} ZEC\n\
         Total Chain supply      : {total_chain:.8}\n\
         Total Transparent supply: {transparent:.8}\n\
         Total Sprout supply     : {sprout:.8}\n\
         Total Sapling supply    : {sapling:.8}\n\
         Total Orchard supply    : {orchard:.8}\n\
         Total Lockbox supply    : {lockbox:.8}\n\
         -------------------------------------------\n\
         Total Shielded supply   : {total_shielded:.8}\n\
         \\_-ZECHUB-_/\n",
        start = start,
        end = end,
        total_txs = total_txs,
        coinbase_count = coinbase_count,
        coinbase_pct = coinbase_pct,
        t_transfer = t_transfer,
        s_transfer = s_transfer,
        o_transfer = o_transfer,
        total_transfer = total_transfer,
        t_tx_count = t_tx_count,
        shielded_pct = shielded_pct,
        s_in = s_in,
        s_out = s_out,
        s_total = s_total,
        s_pct = s_pct,
        s_inflow = s_inflow,
        s_outflow = s_outflow,
        s_flow = s_flow,
        o_in = o_in,
        o_out = o_out,
        o_total = o_total,
        o_pct = o_pct,
        o_inflow = o_inflow,
        o_outflow = o_outflow,
        o_flow = o_flow,
        total_chain = total_chain,
        transparent = transparent,
        sprout = sprout,
        sapling = sapling,
        orchard = orchard,
        lockbox = lockbox,
        total_shielded = total_shielded,
    );

    fs::write(out.join("summaryOnly.md"), content)?;
    Ok(())
}

fn write_pool_currents(metrics: &[TxMetrics], out: &Path) -> Result<()> {
    let mut out_t = File::create(out.join("myResultsOutT.md"))?;
    let mut in_s  = File::create(out.join("myResultsInS.md"))?;
    let mut out_s = File::create(out.join("myResultsOutS.md"))?;
    let mut in_o  = File::create(out.join("myResultsInO.md"))?;
    let mut out_o = File::create(out.join("myResultsOutO.md"))?;

    for m in metrics {
        let date = format_date(m.time);
        let line = format!(
            "{} | {} | {} | {} | {:.8} | {:.8} | {:.8} | {:.8} | {:.8} | {} | {}\n",
            date, m.block, m.txid, m.transfers, m.fee_zec, m.value_out,
            m.transparent, m.sapling, m.orchard, m.pool_type,
            if m.is_coinbase { "IsCoinbase" } else { "" }
        );

        if m.pool_type.contains("Transparent") && m.transparent > 0.0 { let _ = out_t.write_all(line.as_bytes()); }
        if m.pool_type.contains("Sapling") && m.sapling < 0.0 { let _ = in_s.write_all(line.as_bytes()); }
        if m.pool_type.contains("Sapling") && m.sapling > 0.0 { let _ = out_s.write_all(line.as_bytes()); }
        if m.pool_type.contains("Orchard") && m.orchard < 0.0 { let _ = in_o.write_all(line.as_bytes()); }
        if m.pool_type.contains("Orchard") && m.orchard > 0.0 { let _ = out_o.write_all(line.as_bytes()); }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_test_tx(
        has_transparent_vout: bool,
        has_transparent_vin: bool,
        has_sprout: bool,
        has_sapling_spend: bool,
        has_sapling_output: bool,
        has_orchard: bool,
        is_coinbase: bool,
    ) -> RawTx {
        RawTx {
            txid: "testtx".to_string(),
            height: Some(1_234_567),
            time: Some(1_700_000_000),
            vin: if is_coinbase {
                vec![Vin { coinbase: Some("0100000000000000".to_string()), txid: None, vout: None }]
            } else if has_transparent_vin {
                vec![Vin { coinbase: None, txid: Some("prevtx".to_string()), vout: Some(0) }]
            } else {
                vec![]
            },
            vout: if has_transparent_vout {
                vec![Vout { value_zat: 1_000_000_000 }]
            } else {
                vec![]
            },
            v_joinsplit: if has_sprout { Some(vec![serde_json::json!({})]) } else { None },
            v_shielded_spend: if has_sapling_spend { Some(vec![serde_json::json!({})]) } else { None },
            v_shielded_output: if has_sapling_output { Some(vec![serde_json::json!({})]) } else { None },
            orchard: if has_orchard {
                Some(Orchard {
                    actions: Some(vec![serde_json::json!({})]),
                    value_balance_zat: Some(-500_000_000),
                })
            } else {
                None
            },
            value_balance_zat: if has_sapling_spend || has_sapling_output {
                Some(-250_000_000)
            } else {
                None
            },
        }
    }

    #[test]
    fn test_detect_coinbase() {
        let tx = make_test_tx(false, false, false, false, false, false, true);
        let (pool, is_cb, _, _, _, transfers, _, _, _) = detect_pools_and_values(&tx);
        assert_eq!(pool, "Coinbase");
        assert!(is_cb);
        assert_eq!(transfers, 0);
    }

    #[test]
    fn test_detect_transparent() {
        let tx = make_test_tx(true, true, false, false, false, false, false);
        let (pool, is_cb, _, _, _, transfers, _, _, _) = detect_pools_and_values(&tx);
        assert_eq!(pool, "Transparent");
        assert!(!is_cb);
        assert_eq!(transfers, 1);
    }

    #[test]
    fn test_detect_sapling_only() {
        let tx = make_test_tx(false, false, false, true, true, false, false);
        let (pool, _, _, _, _, transfers, _, _, _) = detect_pools_and_values(&tx);
        assert_eq!(pool, "Sapling");
        assert_eq!(transfers, 1);
    }

    #[test]
    fn test_detect_orchard_only() {
        let tx = make_test_tx(false, false, false, false, false, true, false);
        let (pool, _, _, _, _, transfers, _, _, _) = detect_pools_and_values(&tx);
        assert_eq!(pool, "Orchard");
        assert_eq!(transfers, 1);
    }

    #[test]
    fn test_detect_mixed_t_s_o() {
        let tx = make_test_tx(true, true, false, true, false, true, false);
        let (pool, _, _, _, _, transfers, _, _, _) = detect_pools_and_values(&tx);
        assert_eq!(pool, "Transparent,Sapling,Orchard");
        assert_eq!(transfers, 2);
    }

    #[test]
    fn test_detect_sprout() {
        let tx = make_test_tx(false, false, true, false, false, false, false);
        let (pool, _, _, _, _, _, _, _, _) = detect_pools_and_values(&tx);
        assert_eq!(pool, "Sprout");
    }

    #[test]
    fn test_transfers_count() {
        let tx = make_test_tx(true, false, false, false, true, true, false);
        let (_, _, _, _, _, transfers, _, _, _) = detect_pools_and_values(&tx);
        assert_eq!(transfers, 3);
    }

    #[test]
    fn test_empty_tx() {
        let tx = make_test_tx(false, false, false, false, false, false, false);
        let (pool, _, _, _, _, transfers, _, _, _) = detect_pools_and_values(&tx);
        assert_eq!(pool, "Unknown");
        assert_eq!(transfers, 0);
    }

    #[test]
    fn test_shielded_with_zero_value_vout() {
        let mut tx = make_test_tx(false, false, false, true, true, false, false);
        tx.vout = vec![Vout { value_zat: 0 }];
        let (pool, _, _, _, _, _, _, _, _) = detect_pools_and_values(&tx);
        assert_eq!(pool, "Sapling");
    }

    #[test]
    fn test_coinbase_with_orchard() {
        let tx = make_test_tx(true, false, false, false, false, true, true);
        let (pool, is_cb, _, _, _, _, _, _, _) = detect_pools_and_values(&tx);
        assert_eq!(pool, "Coinbase");
        assert!(is_cb);
    }

    #[test]
    fn test_getblock_parsing() {
        let sample_json = r#"{
            "hash": "0000000000000000000000000000000000000000000000000000000000000000",
            "height": 3257342,
            "time": 1725123456,
            "tx": [
                {
                    "txid": "testtx1",
                    "vin": [{"txid": "prevtx", "vout": 0}],
                    "vout": [{"valueZat": 100000000}],
                    "vShieldedOutput": [{}],
                    "orchard": {"actions": [{}], "valueBalanceZat": -50000000}
                }
            ]
        }"#;

        let block_data: Value = serde_json::from_str(sample_json).unwrap();
        let block_height = block_data["height"].as_u64().unwrap() as u32;
        let block_time = block_data["time"].as_u64().unwrap();

        let txs = block_data["tx"].as_array().unwrap();
        assert_eq!(txs.len(), 1);

        let tx: RawTx = serde_json::from_value(txs[0].clone()).unwrap();
        let (pool_type, _, _, _, _, transfers, _, _, _) = detect_pools_and_values(&tx);

        assert_eq!(pool_type, "Transparent,Sapling,Orchard");
        assert_eq!(transfers, 3);
        assert_eq!(block_height, 3257342);
        assert_eq!(block_time, 1725123456);
    }
}