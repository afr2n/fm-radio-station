export const generateRandom = (min, max, exclude) => {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return (num === exclude) ? generateRandom(min, max, exclude) : num;
}
export const trim = (str) => {
    var s = new String(str);
    return s.replace(/^\s+|\s+$/g, "");
}