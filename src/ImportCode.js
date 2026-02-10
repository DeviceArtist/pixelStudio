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
                const arr = code.split(",");
                console.log(arr);
                const cols = parseInt(arr[0]);    // image's width
                const rows = parseInt(arr[1]);    // image's height
                const pixelSize = parseInt(arr[2]);

                const keyframes = [];

                for (let index = 3; index < arr.length; index++) {
                    const hexStr = arr[index];
                    const pixels = hexToArray2D(hexStr, rows, cols);
                    keyframes.push(pixels);
                }

                onFinish(keyframes, pixelSize, cols * pixelSize, rows * pixelSize);
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