"use client";
import HomePage from "@/components/Home/Home";
// Keep this client boundary so page.tsx can export homepage metadata.
// HomePage reads localized copy directly from the language context.
export default function HomeClient() {
  return <HomePage />;
}
