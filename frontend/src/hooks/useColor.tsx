const useColor = (color: string | undefined) => {
    if (color === undefined) return "#000000";

    const isLight =
        0.2126 * parseInt(color.slice(1, 3), 16) +
        0.7152 * parseInt(color.slice(3, 5), 16) +
        0.0722 * parseInt(color.slice(5, 7), 16) >
        255 / 2;
    return isLight ? "#000000" : "#ffffff";
};

export { useColor };
