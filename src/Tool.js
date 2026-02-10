export const makePixels = (w, h) => {
    const arr = [];
    for (let i = 0; i < h; i++) {
        const row = [];
        for (let j = 0; j < w; j++) {
            row.push(0);
        }
        arr.push(row);
    }
    return (arr);
};

export const hexToArray2D = (hexStr, rows, cols) => {
    const arr = [];
    let index = 0;
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const hexByte = hexStr.substr(index, 2);
            const byteValue = parseInt(hexByte, 16);
            if (isNaN(byteValue)) throw new Error("无效的hex字符");
            row.push(byteValue);
            index += 2;
        }
        arr.push(row);
    }
    return arr;
}

export const array2DToHex = (arr) => {
    if (!Array.isArray(arr)) throw new Error("输入必须是数组");
    let hexStr = '';
    for (let i = 0; i < arr.length; i++) {
        if (!Array.isArray(arr[i])) throw new Error("二维数组的每一行必须也是数组");
        for (let j = 0; j < arr[i].length; j++) {
            const val = arr[i][j];
            if (typeof val !== 'number' || val < 0 || val > 255 || val % 1 !== 0)
                throw new Error("数组元素必须是0-255之间的整数");
            hexStr += val.toString(16).padStart(2, '0');
        }
    }
    return hexStr;
}

export const download = (text, filename) => {
    const file = new File([text], filename, {
        type: "text/plain"
    });
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
}