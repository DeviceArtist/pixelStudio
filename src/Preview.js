import { useEffect, useRef, useState } from "react";
import { Space, Button, Card, Progress, Input, Form } from 'antd';
import {
    DownloadOutlined
} from '@ant-design/icons';
import * as GIF from "gif.js";
const img = new Image();

export const PreviewCanvas = ({ width, height, keyframes, pixelSize }) => {
    const canvasRef = useRef(null);

    const [timeHander, setTimeHander] = useState(null);
    const [makingGIF, setMakingGIF] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const [delay, setDealy] = useState(1000);

    const render = (ctx, w, h) => {
        let index = 0;
        return setInterval(() => {
            if (keyframes.length > index) {
                const pixels = keyframes[index];
                ctx.clearRect(0, 0, w, h);

                pixels.map((row, rowIndex) => {
                    row.map((pixel, colIndex) => {
                        ctx.fillStyle = pixel === 1 ? "#000" : "#fff";
                        ctx.fillRect(colIndex * pixelSize, rowIndex * pixelSize, pixelSize, pixelSize);
                    });
                });

            }
            index += 1;
            if (index >= keyframes.length) {
                index = 0;
            }
        }, delay);
    }

    useEffect(() => {
        if (makingGIF) {
            clearInterval(timeHander);
        }
        if (width > 0 && height > 0) {
            const canvas = canvasRef.current;
            const ctx = canvasRef.current.getContext('2d');
            canvas.width = width * pixelSize;
            canvas.height = height * pixelSize;
            clearInterval(timeHander);
            setTimeHander(render(ctx, canvas.width, canvas.height));
        }
    }, [delay, pixelSize, keyframes, makingGIF]);

    return <Card title={
        <Space>
            <span>preview</span>
            <Form layout="inline" onFinish={({ delay }) => {
                console.log(delay);
                setDealy(delay);
            }} >
                <Form.Item name="delay" label="Delay">
                    <Input defaultValue={delay} />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">change</Button>
                </Form.Item>
            </Form>
        </Space>
    } extra={
        <Button icon={makingGIF ? <Progress type="circle" percent={progressValue} size={20} /> : <DownloadOutlined />} onClick={() => {
            if (keyframes.length >= 2) {
                if (width > 0 && height > 0) {
                    setMakingGIF(true);

                    const canvas = canvasRef.current;
                    canvas.width = width * pixelSize;
                    canvas.height = height * pixelSize;
                    const ctx = canvasRef.current.getContext('2d');

                    const gif = new GIF({
                        workers: 2,
                        quality: 100,
                        width: canvas.width,
                        height: canvas.height,
                    });

                    keyframes.forEach(pixels => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        pixels.map((row, rowIndex) => {
                            row.map((pixel, colIndex) => {
                                ctx.fillStyle = pixel === 1 ? "#000" : "#fff";
                                ctx.fillRect(colIndex * pixelSize, rowIndex * pixelSize, pixelSize, pixelSize);
                            });
                        });

                        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        gif.addFrame(frame, { delay: delay });
                    });
                    gif.render();

                    gif.on('progress', (p) => {
                        const percent = Math.round(p * 100);
                        const showText = `${percent}%`;
                        setProgressValue(percent);
                    });

                    gif.on('finished', (blob) => {
                        setMakingGIF(false);
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${width}${height}.gif`;
                        a.click();
                    });
                }
            }

        }} />}>
        <canvas ref={canvasRef}></canvas>
    </Card>
}