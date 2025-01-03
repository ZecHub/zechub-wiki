import { NextRequest, NextResponse } from "next/server";
import { writeFile, appendFile } from "fs/promises";
import path from "path";

const FILE_PATHS = {
  networkstats: path.join(process.cwd(), "public/shieldednewsletter/networkstats.txt"),
  ecosystemnews: path.join(process.cwd(), "public/shieldednewsletter/ecosystemnews.txt"),
};

export async function POST(req: NextRequest, { params }: { params: { type: string } }) {
  const { type } = params;

  // Validate the type
  if (!FILE_PATHS[type]) {
    return NextResponse.json({ error: "Invalid subscription type." }, { status: 400 });
  }

  try {
    // Parse the unified address from the request body
    const body = await req.json();
    const { unifiedAddress } = body;

    // Validate the unified address
    if (!unifiedAddress || typeof unifiedAddress !== "string" || unifiedAddress.trim() === "") {
      return NextResponse.json({ error: "Invalid unified address." }, { status: 400 });
    }

    // Get the file path based on the type
    const filePath = FILE_PATHS[type];

    // Append the unified address to the corresponding file
    await appendFile(filePath, `${unifiedAddress}\n`, "utf8");

    return NextResponse.json({ success: true, message: "Address added successfully." });
  } catch (error) {
    console.error("Error saving unified address:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
