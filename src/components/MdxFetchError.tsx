export function MdxFetchError({ error }: { error: unknown }) {
  console.error({ MdxFetchError: error });
  
  const message = getFriendlyError(error);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-3xl font-bold text-red-400 mb-4">
        Oops! Something went wrong
      </h1>
      <p className="text-lg text-slate-500 mb-6 max-w-xl">{message}</p>
      {/* <a
        href="/"
        className="rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
      >
        Go Home
      </a> */}
    </div>
  );
}

function getFriendlyError(err: unknown): string {
  const msg = (err as Error)?.message ?? String(err);

  if (msg.includes("Not Found")) return "This document was not found.";
  if (msg.includes("Forbidden"))
    return "You don’t have permission to view this content.";
  if (msg.includes("rate limit"))
    return "GitHub API rate limit exceeded. Please try again later.";

  return "We couldn’t load this page. Please try again later.";
}
