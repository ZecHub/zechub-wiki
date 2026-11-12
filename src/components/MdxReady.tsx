"use client";
import { useEffect } from "react";

/** Fires the client event that previously came from MdxRenderer. */
export default function MdxReady() {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("zechub:mdx-ready"));
  }, []);
  return null;
}
