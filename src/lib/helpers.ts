import { getRoot } from "./authAndFetch"

export const getName = (item: string) => {
    const newItem = item.substring(item.lastIndexOf("/") + 1)
    const newFolder = newItem.split('_').join(" ")
    if (newFolder === 'Glossary and FAQs') {
        return `Glossary & FAQ's`
    } else {
        return newFolder
    }
}

export const getDynamicRoute = (slug: string): string => {
    let uri = "/site"
  
    for (let i = 0; i < slug.length; i++) {
        uri += "/" + slug[i]
        if (i === slug.length - 1) uri += '.md'
    }
    
    return uri;
}

export const getFiles = (data: any) => {
    return data.filter((e: any) => e.path).map((element: any) => element.path)
}

export const getFolders = (folder: string[]) => {
   return folder.filter((st: string) => !st.endsWith('.md'))
}

export const firstFileForFolders = async (folders: string[]) => {
    let files: string[] = ['']
    for(let i = 0 ; i <= folders.length; i++){
        const res = await getRoot(folders[i])
        files.push(res[0])
    }
    return files
}