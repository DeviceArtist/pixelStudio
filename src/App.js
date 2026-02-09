
import './App.css';
import { useEffect, useState } from 'react';
import { Button, Space, Drawer } from 'antd';
import {
  FileImageOutlined,
  ImportOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  ClearOutlined,
  FileAddOutlined
} from '@ant-design/icons';

import { About } from './About';
import { Create } from "./Create";
import { PixelEditor } from './Editor';
import { PreviewCanvas } from './Preview';
import { ImportCode } from './ImportCode';
import { ExportCode } from "./ExportCode";
import { makePixels } from "./Tool";


function App() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [pixelSize, setPixelSize] = useState(1);
  const [aboutisOpen, setAboutisOpen] = useState(false);
  const [newImageisModalOpen, setNewImageIsModalOpen] = useState(false);
  const [importisOpen, setImportisOpen] = useState(false);
  const [exportisOpen, setExportisOpen] = useState(false);

  const [keyframes, setKeyFrames] = useState([]);

  const clear = () => {
    // const newPixels = [...pixels];
    // pixels.map((row, rowIndex) => {
    //   row.map((pixel, colIndex) => {
    //     newPixels[rowIndex][colIndex] = 0;
    //   });
    // });
    // setPixels(newPixels);
    setKeyFrames([]);
  }

  useEffect(() => {
    setWidth(128);
    setHeight(32);
    setPixelSize(8);
    setKeyFrames([makePixels(16, 4)]);
  }, [])

  return (
    <div className="app">
      <Create onCreate={(screenWidth, screenHeight, pixelSize, pixels) => {
        setWidth(screenWidth);
        setHeight(screenHeight);
        setPixelSize(pixelSize);
        setKeyFrames([pixels]);
      }} isOpen={newImageisModalOpen} onClose={() => {
        setNewImageIsModalOpen(false);
      }} />

      <Drawer
        title="About"
        placement="bottom"
        closable={{ 'aria-label': 'Close Button' }}
        onClose={() => { setAboutisOpen(false) }}
        open={aboutisOpen}
      >
        <About />
      </Drawer>

      <Drawer
        title="Import"
        placement="left"
        closable={{ 'aria-label': 'Close Button' }}
        onClose={() => { setImportisOpen(false) }}
        open={importisOpen}
      >
        <ImportCode onFinish={(pixels, pixelSize, w, h) => {
          console.log(pixels, pixelSize, w, h);
          setWidth(w);
          setHeight(h);
          setPixelSize(pixelSize);
          setKeyFrames([pixels]);
          setImportisOpen(false);
        }} />

      </Drawer>

      <Drawer
        title="Export"
        closable={{ 'aria-label': 'Close Button' }}
        onClose={() => { setExportisOpen(false) }}
        open={exportisOpen}
      >
        {/* <ExportCode pixels={pixels} pixelSize={pixelSize} width={width} height={height} /> */}
      </Drawer>

      <div>
        <Space>
          <Button icon={<FileImageOutlined />} onClick={() => {
            setNewImageIsModalOpen(true);
          }}>
            New
          </Button>
          <Button
            icon={<ClearOutlined />}
            onClick={() => clear()}
            className="button"
          >
            clean
          </Button>
          <Button icon={<ImportOutlined />} onClick={() => {
            setImportisOpen(true);
          }}>
            import
          </Button>
          <Button icon={<ExportOutlined />} onClick={() => {
            setExportisOpen(true);
          }}>
            export
          </Button>
          <Button icon={<InfoCircleOutlined />} onClick={() => setAboutisOpen(true)}>about</Button>
        </Space>
      </div>

      <Space orientation="vertical" style={{ margin: "20px auto", width: "100%" }}>
        {keyframes.length}
        <Button icon={<FileAddOutlined />} onClick={() => {
          const kf = makePixels(width / pixelSize, height / pixelSize);
          const newKeyframes = [...keyframes];
          newKeyframes.push(kf);
          setKeyFrames(newKeyframes);
        }} />
        {
          keyframes.map((pixels, index) => {
            return <PixelEditor pixels={pixels} pixelSize={pixelSize} onPixelsChange={(arr) => {
              const temp = [...keyframes];
              temp.map((pixels, pixelsIndex) => {
                if (index === pixelsIndex) {
                  pixels = arr;
                }
              });
              setKeyFrames(temp);
            }} />
          })
        }
        <PreviewCanvas width={width} height={height} keyframes={keyframes} pixelSize={pixelSize} />
      </Space>
    </div >

  );
}

export default App;
