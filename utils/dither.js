export const floydSteinbergDither = (imageData) => {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;

    const getPixel = (x, y) => {
        const index = (y * width + x) * 4;
        return {
            r: data[index],
            g: data[index + 1],
            b: data[index + 2],
            a: data[index + 3],
        };
    };

    const setPixel = (x, y, color) => {
        const index = (y * width + x) * 4;
        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = color.a;
    };

    const closestColor = (color) => {
        return {
            r: color.r > 128 ? 255 : 0,
            g: color.g > 128 ? 255 : 0,
            b: color.b > 128 ? 255 : 0,
            a: color.a,
        };
    };

    const diffColor = (color1, color2) => {
        return {
            r: color1.r - color2.r,
            g: color1.g - color2.g,
            b: color1.b - color2.b,
            a: color1.a - color2.a,
        };
    };

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const oldColor = getPixel(x, y);
            const newColor = closestColor(oldColor);
            setPixel(x, y, newColor);
            const error = diffColor(oldColor, newColor);

            const distributeError = (dx, dy, factor) => {
                const newX = x + dx;
                const newY = y + dy;
                if (newX < 0 || newX >= width || newY < 0 || newY >= height) return;
                const pixel = getPixel(newX, newY);
                pixel.r += error.r * factor;
                pixel.g += error.g * factor;
                pixel.b += error.b * factor;
                setPixel(newX, newY, pixel);
            };

            distributeError(1, 0, 7 / 16);
            distributeError(-1, 1, 3 / 16);
            distributeError(0, 1, 5 / 16);
            distributeError(1, 1, 1 / 16);
        }
    }

    return imageData;
};