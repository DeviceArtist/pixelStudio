import { useEffect, useRef, useState } from "react";
import { Button, Card, Progress } from 'antd';
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
        }, 1000);
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
    }, [pixelSize, keyframes, makingGIF]);

    return <Card title="preview" extra={
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
                        gif.addFrame(frame, { delay: 1000 });
                    });
                    gif.render();

                    gif.on('progress', (p) => {
                        const percent = Math.round(p * 100);
                        const showText = `${percent}%`;
                        setProgressValue(percent);
                    });

                    gif.on('finished', (blob) => {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${width}${height}.gif`;
                        a.click();
                        setMakingGIF(false);
                    });
                }
            }

        }} />}>
        <canvas ref={canvasRef}></canvas>
    </Card>
}