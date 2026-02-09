import { useEffect, useState } from "react";
import { Tabs, Card, Button } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
    CopyOutlined,
} from '@ant-design/icons';
export const ExportCode = ({ pixels, pixelSize, width, height }) => {
    const [pythonCodeTemp, setPythonCodeTemp] = useState("");
    const [hexCode, setHexCode] = useState("");
    const [microPythonCode, setMicroPythonCode] = useState("");
    const [arrCode, setArrCode] = useState("");
    const [selectedTab, setSelectedTab] = useState("");

    const array2DToHex = (arr) => {
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

    useEffect(() => {
        const col = pixels.length;
        if (col > 0) {
            const row = pixels[0].length
            if (row > 0) {
                const hex = array2DToHex(pixels)
                setHexCode(`${row},${col},${pixelSize},${hex}`);
            }
        }

    }, [pixels, pixelSize, width, height])

    useEffect(() => {
        let text = "[";
        text += "\r\n";
        pixels.map((row, rowIndex) => {
            text += "  [";
            row.map((pixel, colIndex) => {
                text += pixel;
                text += colIndex === row.length - 1 ? "" : ",";
            });
            text += "]";
            text += rowIndex === pixels.length - 1 ? "" : ","
            text += "\r\n";
        });
        text += "]"
        setArrCode(text);
    }, [pixelSize]);

    useEffect(() => {
        fetch("/default.txt").then(res => res.text()).then(text => setPythonCodeTemp(text));
    }, [])


    useEffect(() => {
        let t = `from machine import Pin, I2C
import ssd1306
import framebuf
import time
i2c = I2C(sda=Pin(4), scl=Pin(5))
display = ssd1306.SSD1306_I2C(${width}, ${height}, i2c)

ICON = ${arrCode}

display.fill(0)
#display.contrast(1)

def draw(ICON):
    for y, row in enumerate(ICON):
        for x, value in enumerate(row):
            display.fill_rect(x*${pixelSize}, y*${pixelSize},x*${pixelSize}+${pixelSize},y*${pixelSize}+${pixelSize},value)


draw(ICON)
display.show()
`

        setMicroPythonCode(t)
    }, [pythonCodeTemp])

    return <Card extra={<Button icon={<CopyOutlined />} onClick={() => {

        switch (selectedTab) {
            case "ArrayCode":
                navigator.clipboard.writeText(arrCode);
                break;
            case "HexCode":
                navigator.clipboard.writeText(hexCode);
                break;
            case "MicroPythonCode":
                navigator.clipboard.writeText(microPythonCode);
                break;
            default:
                break;
        }
    }} />}>
        <Tabs defaultActiveKey="1" onChange={(key) => {
            setSelectedTab(key);
        }} items={[
            {
                key: 'ArrayCode',
                label: 'ArrayCode',
                children:
                    <SyntaxHighlighter language="javascipt" style={docco}>
                        {arrCode}
                    </SyntaxHighlighter>
            },
            {
                key: 'HexCode',
                label: 'Hex Code',
                children:
                    <SyntaxHighlighter language="javascipt" style={docco}>
                        {hexCode}
                    </SyntaxHighlighter>

            }, {
                key: 'MicroPythonCode',
                label: 'MicroPython Code',
                children: <SyntaxHighlighter language="javascipt" style={docco}>
                    {microPythonCode}
                </SyntaxHighlighter>
            }
        ]} />

    </Card>
}