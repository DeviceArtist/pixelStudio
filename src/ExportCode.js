import { useEffect, useState } from "react";
import { Card, Button, Space } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
    CopyOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import { array2DToHex, download } from "./Tool";

export const ExportCode = ({ keyframes, pixelSize, width, height }) => {
    const [hexCode, setHexCode] = useState("");

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
                }
            }
        }

    }, [keyframes, pixelSize, width, height])

    return <Card extra={
        <Space>
            <Button icon={<CopyOutlined />} onClick={() => {
                navigator.clipboard.writeText(hexCode);
            }} />
            <Button icon={<DownloadOutlined />} onClick={() => {
                download(hexCode, `${width}${height}-${pixelSize}.text`);
            }} />
        </Space>
    }>
        <SyntaxHighlighter language="javascipt" style={docco}>
            {hexCode}
        </SyntaxHighlighter>
    </Card>
}