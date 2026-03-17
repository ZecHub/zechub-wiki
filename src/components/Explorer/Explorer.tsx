"use client";
import { exploreFolders } from "@/constants/exploreFolders";
import ListExplorer from "./ListExplorer";
import { useLanguage } from "@/context/LanguageContext";

const Explorer = () => {
  const { t } = useLanguage();
  
  const getTranslatedName = (name: string): string => {
    const keyMap: Record<string, keyof typeof t.home.explore> = {
      'Start_Here': 'startHere',
      'Tutorials': 'tutorials',
      'Using_Zcash': 'usingZcash',
      'Guides': 'guides',
      'Zcash_Tech': 'zcashTech',
      'Zcash_Organizations': 'organizations',
      'Zcash_Community': 'community',
      'ZKAV_Club': 'zkavClub',
      'Privacy_Tools': 'privacyTools',
      'Research': 'research',
      'Glossary_and_FAQs': 'glossary',
      'Contribute': 'contribute'
    };
    
    const key = keyMap[name];
    return key && t.home?.explore?.[key] ? t.home.explore[key] : name;
  };
  
  return (
    <div className="flex w-full justify-items-center items-center flex-col h-auto border border-slate-200 dark:border-slate-700 rounded-md">
      <h4 className="text-3xl font-bold text-center my-12 text-gray-900 dark:text-white">
        {t.home?.exploreZcash || "Explore Zcash"}
      </h4>

      <div className="w-full grid grid-cols-1 space-x-4 space-y-2 md:grid-cols-3 md:gap-3 justify-items-center mt-4 p-2">
        {exploreFolders &&
          exploreFolders.map(({ img, imgLight, imgDark, description, name, url }, i) => (
            <ListExplorer
              key={name + i}
              image={img}
              imageLight={imgLight}
              imageDark={imgDark}
              description={description}
              name={getTranslatedName(name)}
              url={url}
              className={i === exploreFolders.length - 1 ? "mb-24" : ""}
            />
          ))}
      </div>
    </div>
  );
};

export default Explorer;
