'use client'
import { useState, useEffect } from "react";
import { getRoot } from "@/lib/authAndFetch";

const Explorer = async () => {
const folders = await getRoot('/site')
 console.log(folders)
  return (
    <div >
        <h1 className="text-3xl my-5 text-center">Explore Zcash</h1>
    </div>
  )
}

export default Explorer;