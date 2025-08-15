import { exploreFolders } from "@/constants/exploreFolders";
import ListExplorer from "./ListExplorer";

const Explorer = () => {
  return (
    <div className="flex w-full justify-items-center items-center flex-col h-auto border border-slate-200 dark:border-slate-700 rounded-md">
      <h4 className="text-3xl font-bold text-center my-12 text-gray-900 dark:text-white">
        Explore Zcash
      </h4>

      <div className="w-full grid grid-cols-1 space-x-4 space-y-2 md:grid-cols-3 md:gap-3 justify-items-center mt-4 p-2">
        {exploreFolders &&
          exploreFolders.map(({ img, description, name, url }, i) => (
            <ListExplorer
              key={name + i}
              image={img}
              description={description}
              name={name}
              url={url}
              className={i === exploreFolders.length - 1 ? "mb-24" : ""}
            />
          ))}
      </div>
    </div>
  );
};

export default Explorer;
