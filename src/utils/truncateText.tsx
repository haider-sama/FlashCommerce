export const truncateText = (str: string) => {
    if (str.length < 16) {
        return str
    }

    return str.substring(0, 8) + "...";
}