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