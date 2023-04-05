const useColor = (color: string | string[] | undefined) => {
    if (color === undefined) return "#000000";

    let textColor = "#000000";
    if (Array.isArray(color)) {
        for (let i = 0; i < color.length; i++) {
            const isLight =
                0.2126 * parseInt(color[i].slice(1, 3), 16) +
                0.7152 * parseInt(color[i].slice(3, 5), 16) +
                0.0722 * parseInt(color[i].slice(5, 7), 16) >
                255 / 2;
            if (isLight) {
                textColor = "#ffffff";
                break;
            }
        }
    } else {
        const isLight =
            0.2126 * parseInt(color.slice(1, 3), 16) +
            0.7152 * parseInt(color.slice(3, 5), 16) +
            0.0722 * parseInt(color.slice(5, 7), 16) >
            255 / 2;
        if (isLight) {
            textColor = "#ffffff";
        }
    }
    return textColor;
}

export { useColor };
