import { useState, useEffect } from 'react';
import { Button, message, Input } from 'antd';
import { hexToArray2D } from "./Tool";
const { TextArea } = Input;
export const ImportCode = ({ onFinish }) => {
    const [code, setCode] = useState("");
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        setCode("");
    }, [])

    return <div>
        {contextHolder}
        <TextArea rows={4} value={code} onChange={({ target: { value } }) => {
            setCode(value);
        }} />
        <Button style={{ marginTop: "10px" }} type="primary" onClick={() => {
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