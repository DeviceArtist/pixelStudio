import { useEffect, useRef } from "react";

export const PreviewCanvas = ({ width, height, pixels, pixelSize }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width, height);
        pixels.map((row, rowIndex) => {
            row.map((pixel, colIndex) => {
                ctx.fillStyle = pixel === 1 ? "#08f4fa" : "#000";
                ctx.fillRect(colIndex * pixelSize, rowIndex * pixelSize, pixelSize, pixelSize);
            });
        });
    }, [pixelSize, pixels]);
    return <div className={`canvasWrapper_${width}${height}`}>
        <canvas ref={canvasRef}></canvas>
    </div>
}