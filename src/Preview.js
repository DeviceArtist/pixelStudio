import { useEffect, useRef } from "react";
import { Modal, Button, Form, Input, Space, Drawer, Tabs, Card, Slider, message, Radio } from 'antd';
import {
    FileImageOutlined,
    ImportOutlined,
    ExportOutlined,
    GithubOutlined,
    InfoCircleOutlined,
    ClearOutlined,
    CopyOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
    DownloadOutlined
} from '@ant-design/icons';
const img = new Image();

export const PreviewCanvas = ({ width, height, pixels, pixelSize }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
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
                canvas.width = w;
                canvas.height = h;

                const ctx = canvasRef.current.getContext('2d');

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
        }
    }, [pixelSize, pixels]);
    return <Card title="preview" extra={
        <Button icon={<DownloadOutlined />} onClick={() => {
            const canvas = canvasRef.current;
            const base64String = canvas.toDataURL("image/jpeg");
            const a = document.createElement("a");
            a.href = base64String;
            a.download = `${width}${height}.jpg`;
            a.click();
        }} />}>
        <canvas ref={canvasRef}></canvas>
    </Card>
}