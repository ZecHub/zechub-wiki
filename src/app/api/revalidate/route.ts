import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response("Invalid secret", { status: 401 });
  }

  // ←←← FIXED: Added "await" to satisfy Next.js 16 type checker
  await revalidateTag("github-content");

  return Response.json({ 
    success: true, 
    message: "All markdown cache cleared!" 
  });
}
