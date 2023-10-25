import { useState, useEffect } from "react";
import ListExplorer from "./ListExplorer";

interface Props{
  roots: string[]
  files: string[]
}

const Explorer = ({roots, files}: Props) => {

  
  return (
    <div className="flex w-full justify-items-center items-center flex-col h-auto">
        <h1 className="text-3xl my-5 text-center">Explore Zcash</h1>
        <div className="flex flex-col w-full items-center justify-items-center">
          <ListExplorer root={roots} files={files}/>
        </div>
    </div>
  )
}

export default Explorer;