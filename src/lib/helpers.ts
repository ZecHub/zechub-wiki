import { contentBanners } from '@/constants/contentBanners';
import { getRoot } from './authAndFetch';

export const getName = (item: string) => {
  const newItem = item.substring(item.lastIndexOf('/') + 1);
  const newFolder = newItem.split('_').join(' ');
  if (newFolder === 'Glossary and FAQs') {
    return `Glossary & FAQ's`;
  } else {
    return newFolder;
  }
};

export const getDynamicRoute = (slug: string): string => {
  let uri = '/site';

  for (let i = 0; i < slug.length; i++) {
    uri += '/' + slug[i];
    if (i === slug.length - 1) uri += '.md';
  }

  return uri;
};

export const getFiles = (data: any) => {
  return data.filter((e: any) => e.path).map((element: any) => element.path);
};

export const getFolders = (folder: string[]) => {
  return folder.filter((st: string) => !st.endsWith('.md'));
};

export const firstFileForFolders = async (folders: string[]) => {
  let files: string[] = [''];
  for (let i = 0; i <= folders.length; i++) {
    const res = await getRoot(folders[i]);
    files.push(res[0]);
  }
  return files;
};

export const getBanner = (name: string) => {
  for (let i = 0; i <= contentBanners.length; i++) {
    if (contentBanners[i].name === name) {
      return contentBanners[i].url;
    }
  }
  return '';
};

/* The function wrap a sentence at particular length of characters
 * @param txt The sentence body
 * @param wrapAfter The number of characters to start
 * @returns The wrapped sentence
 */
export const wordWrap = (txt: string, wrapAfter: number) => {
  if (txt.trim().length > wrapAfter) {
    return txt.slice(0, wrapAfter) + '...';
  }

  return txt;
};

type LoggerType = {
  description: string;
  data: any;
  type: 'error' | 'log' | 'warn' | 'debug';
};
/**
 * This function logs error
 * @param args
 */
export const logger = (args: LoggerType) => {
  if (process.env.NODE_ENV != 'production') {
    switch (args.type) {
      case 'debug':
        console.debug(`${args.description}: `, args.data);
        break;
      case 'error':
        console.error(`${args.description}: `, args.data);
        break;
      case 'warn':
        console.warn(`${args.description}: `, args.data);
        break;
      default:
        console.log(`${args.description}: `, args.data);
        break;
    }
  } else {
    // TODO: set up ErrorService
  }
};
