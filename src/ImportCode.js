import { useState, useEffect, use } from 'react';
import { Button, Form, Input, message } from 'antd';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
import { hexToArray2D } from "./Tool";

export const ImportCode = ({ onFinish }) => {
    const [code, setCode] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    loader.config({ monaco });

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
            value={code}
        />
        <Button type="primary" onClick={() => {
            try {
                const cols = parseInt(code.split(",")[0]);    // image's width
                const rows = parseInt(code.split(",")[1]);    // image's height
                const pixelSize = parseInt(code.split(",")[2]);
                const hexStr = code.split(",")[3];
                const pixels = hexToArray2D(hexStr, rows, cols);
                onFinish(pixels, pixelSize, cols * pixelSize, rows * pixelSize);
                setCode("");
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