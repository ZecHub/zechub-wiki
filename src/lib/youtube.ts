// Pull a YouTube video id out of any embed/watch/short/v/youtu.be URL form.
// Requires a YouTube host first (no over-match of unrelated iframes).
export const youTubeId = (src: string): string | null => {
  if (!/(?:youtube(?:-nocookie)?\.com|youtu\.be)/i.test(src)) return null;
  const path = src.match(
    /(?:\/embed\/|\/v\/|\/shorts\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/i,
  );
  if (path) return path[1];
  const q = src.match(/[?&]v=([A-Za-z0-9_-]{6,})/i); // watch?v= (v anywhere)
  return q ? q[1] : null;
};
