import ListExplorer from "./ListExplorer";
import { exploreFolders } from "@/constants/exploreFolders";

const Explorer = () => {
  return (
    <div className="flex w-full justify-items-center items-center flex-col h-auto">
      <h1 className="text-3xl my-5 font-bold text-center">Explore Zcash</h1>
      <div className="w-full grid grid-cols-1 space-x-4 space-y-2 md:grid-cols-3 md:gap-3 justify-items-center mt-4 p-2">
        {exploreFolders &&
          exploreFolders.map(({ img, description, name, url }, i) => (
            <ListExplorer key={name} image={img} description={description} name={name} url={url} />
          ))}
      </div>
    </div>
  );
};

export default Explorer;
