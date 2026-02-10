import { useEffect, useState } from "react";
import { Tabs, Card, Button, Switch, Space } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
    CopyOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import { array2DToHex, download } from "./Tool";

export const ExportCode = ({ keyframes, pixelSize, width, height }) => {
    const [hexCode, setHexCode] = useState("");
    const [microPythonCode, setMicroPythonCode] = useState("");
    const [arrCode, setArrCode] = useState("");
    const [selectedTab, setSelectedTab] = useState("");

    useEffect(() => {
        if (keyframes.length > 0) {
            const pixels = keyframes[0];
            const col = pixels.length;
            if (col > 0) {
                const row = pixels[0].length
                if (row > 0) {
                    let text = `${row},${col},${pixelSize}`;
                    keyframes.forEach(pixels => {
                        const hex = array2DToHex(pixels);
                        text += `,${hex}`;
                    });
                    setHexCode(text);
                    setArrCode(JSON.stringify(keyframes));
                }
            }
        }

    }, [keyframes, pixelSize, width, height])


    const request = (name) => {
        fetch(`/${name}.txt?${Math.floor(Math.random() * (99))}`).then(res => res.text()).then(text => {
            let tempText = text.replace("${width}", width).replace("${height}", height).replaceAll("${pixelSize}", pixelSize);

            if (name === "hex") {
                tempText = tempText.replace("${HEX}", hexCode);
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

    return <Card extra={
        <Space>
            <Button icon={<CopyOutlined />} onClick={() => {
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
            }} />
            <Button icon={<DownloadOutlined />} onClick={() => {
                switch (selectedTab) {
                    case "HexCode":
                        download(hexCode, `${width}${height}.text`);
                        break;
                    case "MicroPythonCode":
                        download(microPythonCode, `${width}${height}.py`);
                        // a.href = microPythonCode;
                        // a.download = `${width}${height}.py`;
                        break;
                    default:
                        break;
                }
            }} />
        </Space>
    }>
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
                    <p>&nbsp;</p>
                    <p>For MicroPython v1.16 on 2021-06-18</p>
                    <p>ESP module with ESP8266</p>
                    <p></p>
                    <SyntaxHighlighter language="javascipt" style={docco}>
                        {microPythonCode}
                    </SyntaxHighlighter>
                </>
            }
        ]} />

    </Card>
}