import { useEffect, useState } from "react";
import { Tabs, Card, Button, Switch } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
    CopyOutlined,
} from '@ant-design/icons';
import { array2DToHex } from "./Tool";

export const ExportCode = ({ pixels, pixelSize, width, height }) => {
    const [hexCode, setHexCode] = useState("");
    const [microPythonCode, setMicroPythonCode] = useState("");
    const [arrCode, setArrCode] = useState("");
    const [selectedTab, setSelectedTab] = useState("");

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

    const request = (name) => {
        fetch(`/${name}.txt`).then(res => res.text()).then(text => {
            let tempText = text.replace("${width}", width).replace("${height}", height).replaceAll("${pixelSize}", pixelSize);

            if (name === "hex") {
                const arr = hexCode.split(",");
                tempText = tempText.replace("${code}", arr[3]);
                tempText = tempText.replace("${rows}", parseInt(arr[0]));
                tempText = tempText.replace("${cols}", parseInt(arr[1]));
            }
            if (name === "arr") {
                tempText = tempText.replace("${code}", arrCode);
            }

            setMicroPythonCode(tempText);
        });
    }

    useEffect(() => {
        request("hex");
    }, [hexCode])

    return <Card extra={<Button icon={<CopyOutlined />} onClick={() => {

        switch (selectedTab) {
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
                key: 'HexCode',
                label: 'Hex Code',
                children:
                    <SyntaxHighlighter language="javascipt" style={docco}>
                        {hexCode}
                    </SyntaxHighlighter>

            }, {
                key: 'MicroPythonCode',
                label: 'MicroPython Code',
                children: <>
                    <Switch onChange={(checked) => {
                        if (checked) {
                            request("hex");
                        } else {
                            request("arr");
                        }
                    }} checkedChildren="stringCode" unCheckedChildren="arrayCode" defaultChecked />
                    <SyntaxHighlighter language="javascipt" style={docco}>
                        {microPythonCode}
                    </SyntaxHighlighter>
                </>
            }
        ]} />

    </Card>
}