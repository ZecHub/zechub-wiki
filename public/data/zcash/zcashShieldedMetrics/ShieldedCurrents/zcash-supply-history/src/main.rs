use base64::Engine;
use chrono::{TimeZone, Utc};
use clap::Parser;
use futures::stream::{self, StreamExt};
use indicatif::{ProgressBar, ProgressStyle};
use reqwest::header;
use serde::{Deserialize, Serialize};
use std::error::Error;
use std::path::PathBuf;
use std::time::Instant;

#[derive(Parser, Debug)]
#[command(author, version, about = "Fast Zcash total supply history generator (with cookie auth)")]
struct Args {
    /// RPC URL[](http://127.0.0.1:8232). URL credentials work but cookie takes precedence.
    #[arg(long, env = "RPC_URL", default_value = "http://127.0.0.1:8232")]
    rpc_url: String,

    /// Path to .cookie file. If omitted, auto-detection is used.
    #[arg(long)]
    cookie_file: Option<PathBuf>,

    /// Starting block height
    #[arg(long, default_value_t = 0)]
    start: u64,

    /// Step size (blocks between samples)
    #[arg(long, default_value_t = 300)]
    step: usize,

    /// Max parallel batches (96 + batch-size 7 = your fastest stable combo)
    #[arg(long, default_value_t = 96)]
    parallel: usize,

    /// Number of getblock calls per HTTP request (7 is the sweet spot for Zebra)
    #[arg(long, default_value_t = 7)]
    batch_size: usize,

    /// Output file
    #[arg(short, long, default_value = "newDataTotalSupply")]
    output: String,
}

#[derive(Deserialize)]
struct RpcResponse<T> {
    result: Option<T>,
    error: Option<RpcError>,
}

#[derive(Deserialize)]
struct RpcError {
    code: i32,
    message: String,
}

#[derive(Deserialize)]
struct Block {
    time: i64,
    #[serde(rename = "chainSupply")]
    chain_supply: ChainSupply,
}

#[derive(Deserialize)]
struct ChainSupply {
    #[serde(rename = "chainValue")]
    chain_value: f64,
}

#[derive(Serialize)]
struct DataPoint {
    supply: i64,
    close: String,
}

#[derive(Serialize)]
struct RpcRequest {
    jsonrpc: String,
    id: String,
    method: String,
    params: serde_json::Value,
}

fn auto_detect_cookie() -> Option<PathBuf> {
    let home = std::env::var("HOME").unwrap_or_else(|_| "/root".to_string());
    let candidates = [
        format!("{}/.cache/zebra/.cookie", home),
        format!("{}/.zcash/.cookie", home),
        "/home/zebra/.cache/zebra/.cookie".to_string(),
    ];

    for path_str in candidates {
        let path = PathBuf::from(path_str);
        if path.exists() {
            return Some(path);
        }
    }
    None
}

fn build_client(cookie_path: Option<&PathBuf>) -> Result<reqwest::Client, Box<dyn Error>> {
    let mut headers = header::HeaderMap::new();

    if let Some(path) = cookie_path {
        let content = std::fs::read_to_string(path)?.trim().to_string();
        if !content.is_empty() {
            let encoded = base64::engine::general_purpose::STANDARD.encode(content.as_bytes());
            headers.insert(
                header::AUTHORIZATION,
                format!("Basic {}", encoded).parse()?,
            );
            println!("Using cookie authentication from: {}", path.display());
        }
    }

    let client = reqwest::Client::builder()
        .default_headers(headers)
        .build()?;

    Ok(client)
}

async fn rpc_call<T: for<'de> Deserialize<'de>>(
    client: &reqwest::Client,
    url: &str,
    method: &str,
    params: serde_json::Value,
) -> Result<T, Box<dyn Error>> {
    let payload = serde_json::json!({
        "jsonrpc": "2.0",
        "id": "supply-tool",
        "method": method,
        "params": params
    });

    let response: RpcResponse<T> = client
        .post(url)
        .json(&payload)
        .send()
        .await?
        .json()
        .await?;

    if let Some(err) = response.error {
        return Err(format!("RPC Error {}: {}", err.code, err.message).into());
    }

    response.result.ok_or_else(|| "No result in RPC response".into())
}

async fn rpc_batch_call(
    client: &reqwest::Client,
    url: &str,
    heights: Vec<u64>,
) -> Result<Vec<Block>, Box<dyn Error>> {
    let mut requests = Vec::with_capacity(heights.len());
    for (i, &height) in heights.iter().enumerate() {
        requests.push(RpcRequest {
            jsonrpc: "2.0".to_string(),
            id: i.to_string(),
            method: "getblock".to_string(),
            params: serde_json::json!([height.to_string(), 2]),
        });
    }

    let resp = client.post(url).json(&requests).send().await?;
    let status = resp.status();

    if !status.is_success() {
        let body = resp.text().await.unwrap_or_default();
        return Err(format!("HTTP {}: {}", status, &body[..body.len().min(300)]).into());
    }

    let text = resp.text().await?;
    match serde_json::from_str::<Vec<RpcResponse<Block>>>(&text) {
        Ok(response) => {
            let mut blocks = Vec::with_capacity(response.len());
            for (i, r) in response.into_iter().enumerate() {
                if let Some(err) = r.error {
                    return Err(format!("RPC Error in batch (height {}): {} {}", heights[i], err.code, err.message).into());
                }
                if let Some(block) = r.result {
                    blocks.push(block);
                } else {
                    return Err("No result in batch response".into());
                }
            }
            Ok(blocks)
        }
        Err(e) => {
            Err(format!("Decode failed: {}. Raw response: {}", e, &text[..text.len().min(400)]).into())
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let start_time = Instant::now();

    let args = Args::parse();

    let cookie_path: Option<PathBuf> = args.cookie_file.clone().or_else(auto_detect_cookie);

    let client = build_client(cookie_path.as_ref())?;

    println!("Fetching current block height from {}...", args.rpc_url);
    let end_block: u64 = rpc_call(&client, &args.rpc_url, "getblockcount", serde_json::json!([])).await?;

    println!("Latest block: {}. Sampling every {} blocks from {}...", end_block, args.step, args.start);

    let heights: Vec<u64> = (args.start..=end_block).step_by(args.step).collect();

    let pb = ProgressBar::new(heights.len() as u64);
    pb.set_style(
        ProgressStyle::default_bar()
            .template("{msg} [{bar:40}] {pos}/{len} ({eta})")
            .unwrap()
            .progress_chars("=>-"),
    );
    pb.set_message("Fetching blocks (batched)");

    let data_points: Vec<DataPoint> = stream::iter(heights.chunks(args.batch_size))
        .map(|chunk| {
            let client = client.clone();
            let url = args.rpc_url.clone();
            let chunk: Vec<u64> = chunk.to_vec();
            let pb = pb.clone();
            async move {
                match rpc_batch_call(&client, &url, chunk.clone()).await {
                    Ok(blocks) => {
                        let mut points = Vec::with_capacity(blocks.len());
                        for block in blocks {
                            let supply = block.chain_supply.chain_value.round() as i64;
                            let close = Utc
                                .timestamp_opt(block.time, 0)
                                .unwrap()
                                .format("%m/%d/%Y")
                                .to_string();
                            points.push(DataPoint { supply, close });
                        }
                        pb.inc(chunk.len() as u64);
                        points
                    }
                    Err(e) => {
                        if e.to_string().contains("Exceeded max limit") {
                            eprintln!("Zebra batch limit reached — using single requests");
                        } else {
                            eprintln!("Batch failed for heights {:?}: {}", chunk, e);
                        }

                        let mut points = Vec::with_capacity(chunk.len());
                        for &h in &chunk {
                            match rpc_call::<Block>(&client, &url, "getblock", serde_json::json!([h.to_string(), 2])).await {
                                Ok(block) => {
                                    let supply = block.chain_supply.chain_value.round() as i64;
                                    let close = Utc.timestamp_opt(block.time, 0).unwrap().format("%m/%d/%Y").to_string();
                                    points.push(DataPoint { supply, close });
                                }
                                Err(err) => eprintln!("Warning: Block {} failed: {}", h, err),
                            }
                        }
                        pb.inc(chunk.len() as u64);
                        points
                    }
                }
            }
        })
        .buffered(args.parallel)
        .flat_map(|batch| stream::iter(batch))
        .collect()
        .await;

    pb.finish();

    let json = serde_json::to_string_pretty(&data_points)?;
    std::fs::write(&args.output, json + "\n")?;

    let elapsed = start_time.elapsed();
    println!("Done! {} data points written to {}", data_points.len(), args.output);
    println!("Total time: {:.2} seconds", elapsed.as_secs_f64());
    println!("(batch_size={}, parallel={})", args.batch_size, args.parallel);

    Ok(())
}