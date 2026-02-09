export const PixelEditor = ({ pixels, pixelSize, editZoom, onPixelsChange }) => {
    const togglePixel = (rowIndex, colIndex) => {
        const newPixels = [...pixels];
        newPixels[rowIndex][colIndex] = newPixels[rowIndex][colIndex] === 0 ? 1 : 0;
        onPixelsChange(newPixels);
    };
    return <div className='editor'>
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
}