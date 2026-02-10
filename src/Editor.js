import { useEffect, useState } from 'react';
import { Card, Slider } from 'antd';
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

export const PixelEditor = ({ title, pixels, pixelSize, onPixelsChange }) => {
    const [editZoom, setEditZoom] = useState(1);
    const togglePixel = (rowIndex, colIndex) => {
        const newPixels = [...pixels];
        newPixels[rowIndex][colIndex] = newPixels[rowIndex][colIndex] === 0 ? 1 : 0;
        onPixelsChange(newPixels);
    };

    return <Card title={title} style={{ width: "100%" }}
        extra={
            <Slider value={editZoom} min={1} max={10} onChange={(value) => setEditZoom(value)} style={{ width: "100px" }} />
        }
    >
        <div className='editor'>
            {pixels.map((row, rowIndex) =>
                <div className='row'>
                    {
                        row.map((pixel, colIndex) => (
                            <span
                                style={{ width: `${pixelSize * editZoom}px`, height: `${pixelSize * editZoom}px` }}
                                key={`${rowIndex}-${colIndex}`}
                                onClick={() => togglePixel(rowIndex, colIndex)}
                                className={`pixel ${pixel === 1 ? "black" : "white"
                                    }`}
                            />
                        ))
                    }
                </div>
            )}
        </div>
    </Card>
}