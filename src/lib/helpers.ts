export const getName = (item: string) => {
    const newItem = item.substring(item.lastIndexOf("/") + 1)
    return newItem.split('_').join(" ")
}