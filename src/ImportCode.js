import { Button, Form, Input, message } from 'antd';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
import { useState, useEffect, use } from 'react';

export const ImportCode = ({ onFinish }) => {
    const [code, setCode] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    loader.config({ monaco });
    const hexToArray2D = (hexStr, rows, cols) => {
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
    useEffect(() => {
        if (monaco) {
            monaco.editor.EditorOptions.minimap.defaultValue.enabled = false;
            // monaco.editor.EditorOptions.readOnly.defaultValue = false;
        }
    }, [monaco]);
    useEffect(() => {
        setCode("");
    }, [])
    return <div>
        {contextHolder}
        <Editor
            height="400px"
            language="text"
            onChange={(value) => {
                setCode(value);
            }}
            defaultValue={code}
        />
        <Button type="primary" onClick={() => {
            try {
                const cols = code.split(",")[0];
                const rows = code.split(",")[1];
                const pixelSize = code.split(",")[2];
                const hexStr = code.split(",")[3];
                const arr = hexToArray2D(hexStr, rows, cols);
                onFinish(arr, pixelSize, cols, rows);
            } catch (error) {
                console.error(error);
                messageApi.open({
                    type: 'error',
                    content: 'error',
                });
            }

        }}>OK</Button>
    </div>
}   