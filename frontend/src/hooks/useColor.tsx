const useColor = (color: string | string[] | undefined) => {
    if (color === undefined) return "#000000";

    let textColor = "#000000";
    let lights = 0;

    if (Array.isArray(color)) {
        for (let i = 0; i < color.length; i++) {
            const col = color[i] ?? "#000000";
            const isLight =
                0.2126 * parseInt(col.slice(1, 3), 16) +
                0.7152 * parseInt(col.slice(3, 5), 16) +
                0.0722 * parseInt(col.slice(5, 7), 16) >
                255 / 2;

            if (isLight) lights++;
        }

        if (lights <= color.length / 2) textColor = "#FFFFFF";

        return textColor;
    } else {
        const isLight =
            0.2126 * parseInt(color.slice(1, 3), 16) +
            0.7152 * parseInt(color.slice(3, 5), 16) +
            0.0722 * parseInt(color.slice(5, 7), 16) >
            255 / 2;

        if (isLight) textColor = "#FFFFFF";
    }

    return textColor;
}

export { useColor };
