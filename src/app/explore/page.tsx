import { getSiteFolders, getRoot } from "@/lib/authAndFetch";
import { getFolders, firstFileForFolders } from "@/lib/helpers";
import Explorer from "@/components/explorer/Explorer";

const Explore = async () => {

    const roots = await getSiteFolders('/site')
    const folders = getFolders(roots)
    
    const files = await firstFileForFolders(folders)

    return (
        <main className="">
           <Explorer roots={folders} files={files} />
        </main>
    )
}

export default Explore;