import { useEffect, useRef, useState } from "react";
import { Button, Card } from 'antd';
import {
    DownloadOutlined
} from '@ant-design/icons';
import * as GIF from "gif.js";
const img = new Image();

export const PreviewCanvas = ({ width, height, keyframes, pixelSize }) => {
    const canvasRef = useRef(null);
    const [timeHander, setTimeHander] = useState(null);
    const [makingGIF, setMakingGIF] = useState(false);

    const render = (ctx, img, w, h, offsetX, offsetY) => {
        let index = 0;
        return setInterval(() => {
            console.log('rending...', index);
            if (keyframes.length > index) {
                const pixels = keyframes[index];
                ctx.clearRect(0, 0, w, h);
                ctx.drawImage(img, 0, 0, w, h);
                ctx.fillStyle = "#000";

                pixels.map((row, rowIndex) => {
                    row.map((pixel, colIndex) => {
                        ctx.fillStyle = pixel === 1 ? "#08f4fa" : "#000";
                        ctx.fillRect(colIndex * pixelSize + offsetX, rowIndex * pixelSize + offsetY, pixelSize, pixelSize);
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
            return;
        }

        if (width > 0 && height > 0) {

            let offsetX, offsetY = 0;
            let w, h = 0;
            switch (height) {
                case 32:
                    img.src = "/12832.jpg";
                    offsetX = 40;
                    offsetY = 20;
                    w = 210;
                    h = 70;
                    break;
                case 64:
                    img.src = "/12864.jpg";
                    offsetX = 10;
                    offsetY = 38;
                    w = 150;
                    h = 140;
                    break;
                default:
                    break;
            }

            img.onload = () => {
                const canvas = canvasRef.current;
                const ctx = canvasRef.current.getContext('2d');
                canvas.width = w;
                canvas.height = h;
                clearInterval(timeHander);
                setTimeHander(render(ctx, img, w, h, offsetX, offsetY));
            }
        }
    }, [pixelSize, keyframes, makingGIF]);

    return <Card title="preview" extra={
        <Button icon={<DownloadOutlined />} onClick={() => {
            const canvas = canvasRef.current;
            const ctx = canvasRef.current.getContext('2d');
            if (keyframes.length === 1) {
                const base64String = canvas.toDataURL("image/jpeg");
                const a = document.createElement("a");
                a.href = base64String;
                a.download = `${width}${height}.jpg`;
                a.click();
            }
            if (keyframes.length >= 2) {
                if (width > 0 && height > 0) {

                    let offsetX, offsetY = 0;
                    let w, h = 0;
                    switch (height) {
                        case 32:
                            img.src = "/12832.jpg";
                            offsetX = 40;
                            offsetY = 20;
                            w = 210;
                            h = 70;
                            break;
                        case 64:
                            img.src = "/12864.jpg";
                            offsetX = 10;
                            offsetY = 38;
                            w = 150;
                            h = 140;
                            break;
                        default:
                            break;
                    }


                    img.onload = () => {
                        const canvas = canvasRef.current;
                        const ctx = canvasRef.current.getContext('2d');
                        canvas.width = w;
                        canvas.height = h;
                        const gif = new GIF({
                            workers: 2,
                            quality: 100,
                            width: canvas.width,
                            height: canvas.height,
                            // workerScript: '/gif.worker.js'
                        });

                        let index = 0;

                        const render = () => {
                            if (index < keyframes.length) {
                                const pixels = keyframes[index];
                                ctx.clearRect(0, 0, w, h);
                                ctx.drawImage(img, 0, 0, w, h);
                                ctx.fillStyle = "#000";

                                pixels.map((row, rowIndex) => {
                                    row.map((pixel, colIndex) => {
                                        ctx.fillStyle = pixel === 1 ? "#08f4fa" : "#000";
                                        ctx.fillRect(colIndex * pixelSize + offsetX, rowIndex * pixelSize + offsetY, pixelSize, pixelSize);
                                    });
                                });

                                const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
                                gif.addFrame(frame, { delay: 1000 });


                                setTimeout(() => {
                                    index += 1;
                                    render();
                                }, 1000);

                            } else {
                                gif.render();
                            }
                        }

                        setMakingGIF(true);
                        render();

                        gif.on('progress', (p) => {
                            const percent = Math.round(p * 100);
                            const showText = `${percent}%`;
                            console.log(showText);
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
            }

        }} />}>
        <canvas ref={canvasRef}></canvas>
    </Card>
}