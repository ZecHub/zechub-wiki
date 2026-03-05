use anyhow::{Context, Result};
use clap::Parser;
use dashmap::DashMap;
use futures::StreamExt;
use reqwest::Client;
use serde_json::{json, Value};
use std::env;
use std::fs;
use std::path::Path;
use std::sync::Arc;
use std::time::Instant;
use tokio::sync::Semaphore;

#[derive(Parser, Debug)]
#[command(author, version, about = "Ultra-fast async Zcash tx fee calculator (Zebrad)")]
struct Args {
    /// Single txid (hex)
    txid: Option<String>,

    /// File with one txid per line
    #[arg(short, long, value_name = "FILE")]
    file: Option<std::path::PathBuf>,

    /// RPC URL
    #[arg(long, default_value = "http://127.0.0.1:8232")]
    rpc_url: String,

    /// Classic zcashd user
    #[arg(long)]
    user: Option<String>,

    /// Classic zcashd pass
    #[arg(long)]
    pass: Option<String>,

    /// Explicit cookie file
    #[arg(long, value_name = "FILE")]
    cookie_file: Option<std::path::PathBuf>,

    /// Max concurrent RPC calls
    #[arg(long, default_value_t = 24)]
    concurrency: usize,

    /// Save results to CSV
    #[arg(short, long)]
    output: Option<std::path::PathBuf>,

    /// Quiet mode – no individual fee lines (summary + CSV only)
    #[arg(short = 'q', long)]
    quiet: bool,
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();
    let client = Arc::new(Client::new());
    let (user, pass) = get_credentials(&args)?;

    if let Some(file_path) = &args.file {
        let start = Instant::now();
        let stats = process_file(
            client,
            &args.rpc_url,
            &user,
            &pass,
            file_path,
            args.concurrency,
            args.output.as_deref(),
            args.quiet,
        )
        .await?;

        let elapsed = start.elapsed().as_secs_f64();
        println!("\n=== Summary ===");
        println!("Processed : {} txids", stats.processed);
        println!("Skipped   : {} lines", stats.skipped);
        println!("Total fee : {} Zats ({:.4} ZEC)", stats.total_fee, stats.total_fee as f64 / 1e8);
        if stats.processed > 0 {
            println!("Avg fee   : {:.0} Zats/tx", stats.total_fee as f64 / stats.processed as f64);
        }
        println!("Time      : {:.2}s  (~{:.0} tx/s)", elapsed, stats.processed as f64 / elapsed);
    } else if let Some(txid) = &args.txid {
        let fee = calculate_fee(&client, &args.rpc_url, &user, &pass, txid).await?;
        if !args.quiet {
            print_fee(txid, fee);
        }
    } else {
        anyhow::bail!("Provide a txid or -f/--file <TXIDS.txt>");
    }
    Ok(())
}

struct Stats {
    processed: usize,
    skipped: usize,
    total_fee: i64,
}

async fn process_file(
    client: Arc<Client>,
    url: &str,
    user: &str,
    pass: &str,
    path: &std::path::PathBuf,
    concurrency: usize,
    output_path: Option<&Path>,
    quiet: bool,
) -> Result<Stats> {
    let content = fs::read_to_string(path)
        .with_context(|| format!("Failed to read {}", path.display()))?;

    let lines: Vec<String> = content.lines().map(|s| s.trim().to_string()).collect();

    let cache: Arc<DashMap<String, Value>> = Arc::new(DashMap::new());
    let semaphore = Arc::new(Semaphore::new(concurrency));

    let mut stats = Stats { processed: 0, skipped: 0, total_fee: 0 };

    let mut csv_writer = output_path.map(|p| {
        let mut w = csv::Writer::from_path(p).expect("failed to create CSV");
        w.write_record(["txid", "fee_zats", "fee_zec"]).unwrap();
        w
    });

    let tasks = futures::stream::iter(lines.into_iter().enumerate())
        .map(|(i, line)| {
            let client = client.clone();
            let cache = cache.clone();
            let semaphore = semaphore.clone();
            let user = user.to_string();
            let pass = pass.to_string();
            let url = url.to_string();

            async move {
                if line.is_empty() || line.starts_with('#') {
                    return (i, None::<(String, i64)>, None::<String>);
                }

                let txid = match clean_txid(&line) {
                    Ok(t) => t,
                    Err(_) => return (i, None, Some(format!("invalid txid → {}", line))),
                };

                let _permit = semaphore.acquire().await.unwrap();

                match calculate_fee_with_cache(&client, &url, &user, &pass, &txid, &cache).await {
                    Ok(fee) => (i, Some((txid, fee)), None),
                    Err(e) => (i, None, Some(format!("{} → {}", txid, e))),
                }
            }
        })
        .buffer_unordered(concurrency);

    let mut results: Vec<_> = tasks.collect().await;
    results.sort_by_key(|(i, _, _)| *i);

    for (_, result, err_msg) in results {
        if let Some((txid, fee)) = result {
            if !quiet {
                print_fee(&txid, fee);
            }
            stats.processed += 1;
            stats.total_fee += fee;

            if let Some(wtr) = &mut csv_writer {
                wtr.write_record(&[&txid, &fee.to_string(), &format!("{:.8}", fee as f64 / 1e8)])
                    .unwrap();
            }
        } else if let Some(e) = err_msg {
            eprintln!("  {}", e);
            stats.skipped += 1;
        }
    }

    if let Some(mut w) = csv_writer {
        w.flush().unwrap();
    }
    Ok(stats)
}

// (clean_txid, print_fee, get_credentials, read_cookie_file, rpc_call, get_raw_tx, calculate_fee_with_cache, calculate_fee stay exactly the same as previous version)

fn clean_txid(raw: &str) -> Result<String> {
    let cleaned: String = raw
        .trim()
        .trim_start_matches("0x")
        .trim()
        .to_lowercase()
        .chars()
        .filter(|c| c.is_ascii_hexdigit())
        .collect();
    if cleaned.len() != 64 {
        anyhow::bail!("not 64 hex chars");
    }
    Ok(cleaned)
}

fn print_fee(txid: &str, fee_zats: i64) {
    let short = format!("{}...{}", &txid[0..8], &txid[56..64]);
    println!("{}  {:>12} Zats  ({:.8} ZEC)", short, fee_zats, fee_zats as f64 / 1e8);
}

fn get_credentials(args: &Args) -> Result<(String, String)> {
    if let (Some(u), Some(p)) = (&args.user, &args.pass) {
        return Ok((u.clone(), p.clone()));
    }
    if let Some(p) = &args.cookie_file {
        return read_cookie_file(p);
    }
    let home = dirs::home_dir().context("no home dir")?;
    let candidates = vec![
        home.join(".cache").join("zebra").join(".cookie"),
        home.join(".zcash").join(".cookie"),
        std::path::PathBuf::from(".cookie"),
    ];
    for p in candidates {
        if p.exists() {
            if let Ok(creds) = read_cookie_file(&p) {
                eprintln!("🔑 Using cookie: {}", p.display());
                return Ok(creds);
            }
        }
    }
    Ok((String::new(), String::new()))
}

fn read_cookie_file(p: &std::path::PathBuf) -> Result<(String, String)> {
    let s = fs::read_to_string(p)?;
    let line = s.lines().next().context("empty cookie")?.trim();
    let (u, pw) = line.split_once(':').context("bad cookie format")?;
    Ok((u.trim().to_string(), pw.trim().to_string()))
}

async fn rpc_call(
    client: &Client,
    url: &str,
    user: &str,
    pass: &str,
    method: &str,
    params: Vec<Value>,
) -> Result<Value> {
    let req = json!({
        "jsonrpc": "1.0",
        "id": "zcash-tx-fee",
        "method": method,
        "params": params,
    });

    let mut builder = client.post(url).json(&req);
    if !user.is_empty() {
        builder = builder.basic_auth(user, (!pass.is_empty()).then_some(pass));
    }

    let resp: Value = builder
        .send()
        .await
        .context("RPC send failed")?
        .json()
        .await
        .context("RPC JSON parse failed")?;

    if let Some(err) = resp.get("error") {
        if !err.is_null() {
            anyhow::bail!("RPC error from node: {}", err);
        }
    }

    Ok(resp["result"].clone())
}

async fn get_raw_tx(client: &Client, url: &str, user: &str, pass: &str, txid: &str) -> Result<Value> {
    rpc_call(client, url, user, pass, "getrawtransaction", vec![json!(txid), json!(1)]).await
}

async fn calculate_fee_with_cache(
    client: &Client,
    url: &str,
    user: &str,
    pass: &str,
    txid: &str,
    cache: &DashMap<String, Value>,
) -> Result<i64> {
    let tx = get_raw_tx(client, url, user, pass, txid).await?;

    if tx["vin"]
        .as_array()
        .and_then(|v| v.first())
        .and_then(|v| v["coinbase"].as_str())
        .is_some()
    {
        return Ok(0);
    }

    let mut vin_sum: i64 = 0;
    if let Some(vins) = tx["vin"].as_array() {
        for vin in vins {
            if let (Some(ptxid), Some(idx)) = (vin["txid"].as_str(), vin["vout"].as_u64()) {
                let prev_tx = if let Some(entry) = cache.get(ptxid) {
                    entry.value().clone()
                } else {
                    let fetched = get_raw_tx(client, url, user, pass, ptxid).await?;
                    cache.insert(ptxid.to_string(), fetched.clone());
                    fetched
                };

                if let Some(vout_arr) = prev_tx["vout"].as_array() {
                    if let Some(vout) = vout_arr.get(idx as usize) {
                        if let Some(v) = vout["valueZat"].as_i64() {
                            vin_sum += v;
                        }
                    }
                }
            }
        }
    }

    let vout_sum: i64 = tx["vout"]
        .as_array()
        .map(|a| a.iter().filter_map(|v| v["valueZat"].as_i64()).sum())
        .unwrap_or(0);

    let mut vpub_old: i64 = 0;
    let mut vpub_new: i64 = 0;
    if let Some(js) = tx["vjoinsplit"].as_array() {
        for j in js {
            vpub_old += j["vpub_oldZat"].as_i64().unwrap_or(0);
            vpub_new += j["vpub_newZat"].as_i64().unwrap_or(0);
        }
    }

    let sapling = tx["valueBalanceZat"].as_i64().unwrap_or(0);
    let orchard = tx["orchard"]
        .as_object()
        .and_then(|o| o["valueBalanceZat"].as_i64())
        .unwrap_or(0);

    Ok(vin_sum + vpub_old + sapling + orchard - vout_sum - vpub_new)
}

async fn calculate_fee(
    client: &Client,
    url: &str,
    user: &str,
    pass: &str,
    txid: &str,
) -> Result<i64> {
    let cache: DashMap<String, Value> = DashMap::new();
    calculate_fee_with_cache(client, url, user, pass, txid, &cache).await
}