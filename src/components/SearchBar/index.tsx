import Link from "next/link";
import { useState, ChangeEvent, useRef } from "react";
import { SearchInput } from "./SearchInput";
import { searcher } from "@/constants/searcher";
import { Dialog, Transition } from '@headlessui/react';
import { motion } from "framer-motion";
import { IoMdClose as closeIcon } from "react-icons/io";
import { MdArrowForward as ArrowIcon } from "react-icons/md";
import { Icon } from "../UI/Icon";
import { SearchBarProps } from "@/types";
import { debounce } from 'lodash';

const SearchBar = ({ openSearch, setOpenSearch }: SearchBarProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const observerRef = useRef<HTMLDivElement>(null);

  const onClose = () => {
    setSearchInput('');
    setOpenSearch(false);
  };

  // Debounced search function
  const debouncedSearch = debounce((inputValue: string) => {
    const results = searcher.filter((item) =>
      item.name && item.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSearchResults(results);
  }, 300); // Delay in milliseconds

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim();
    setSearchInput(inputValue);
    debouncedSearch(inputValue);
  };

  return (
    <Transition
      show={openSearch}
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto"
        onClose={() => { }}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-75 z-10" />

        <div className="flex items-center justify-center min-h-screen  z-20">
          <motion.div
            className="w-2/3 max-w-md h-auto p-4 bg-white rounded-lg shadow-lg dark:bg-slate-900 dark:text-white z-30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <div className="flex items-center justify-between p-4 md:py-3 border-b rounded-t dark:border-gray-600">
              <h2 className="text-xl font-bold">Zechub Wiki</h2>
              <Icon
                icon={closeIcon}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-5 h-5 ms-auto inline-flex justify-center items-center hover:cursor-pointer dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={onClose}
              />
            </div>

            <div className="my-3">
              <SearchInput searchInput={searchInput} handleSearch={handleChange} />
            </div>

            {searchInput.length > 0 ? (
              <div className="flex flex-col px-3 items-center overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="mt-4 h-72" ref={observerRef}>
                    {searchResults.map((result) => (
                      <Link key={result.name} href={result.url} onClick={onClose}>
                        <div
                          className="inline-flex mb-2 items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
                        >
                          <div className="block">
                            <div className="w-full text-lg font-semibold">{result.name}</div>
                            <div className="w-full text-gray-500 justify-self-auto dark:text-gray-400">{result.desc}</div>
                          </div>

                          <Icon
                            className="w-4 h-4 ms-3 text-gray-500 dark:text-gray-400"
                            icon={ArrowIcon}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center text-bold justify-center mt-3 w-full h-full py-32">
                    No Results yet...
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center text-bold justify-center mt-3 w-full h-full py-32">
                No Results yet...
              </div>
            )}
          </motion.div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SearchBar;
