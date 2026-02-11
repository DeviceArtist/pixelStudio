
import './App.css';
import { useEffect, useState } from 'react';
import { Button, Space, Drawer, Card } from 'antd';
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
  const [pixelSize, setPixelSize] = useState(0);

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
    setWidth(8);
    setHeight(8);
    setPixelSize(8);
    setKeyFrames([makePixels(8, 8)]);
  }, [])

  return (
    <div className="app">
      <Create onCreate={(width, height, pixelSize, keyframes) => {
        setWidth(width);
        setHeight(height);
        setPixelSize(pixelSize);
        setKeyFrames(keyframes);
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
        <ImportCode onFinish={(keyframes, pixelSize, w, h) => {
          setWidth(w);
          setHeight(h);
          setPixelSize(pixelSize);
          setKeyFrames(keyframes);
          setImportisOpen(false);
        }} />

      </Drawer>

      <Drawer
        title="Export"
        closable={{ 'aria-label': 'Close Button' }}
        onClose={() => { setExportisOpen(false) }}
        open={exportisOpen}
      >
        <ExportCode keyframes={keyframes} pixelSize={pixelSize} width={width} height={height} />
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
        <PreviewCanvas width={width} height={height} keyframes={keyframes} pixelSize={pixelSize} />
        <Card title="Editor" style={{ width: "100%" }}
          extra={<Button icon={<FileAddOutlined />} onClick={() => {
            const kf = makePixels(width, height);
            const newKeyframes = [...keyframes];
            newKeyframes.push(kf);
            setKeyFrames(newKeyframes);
          }} />}
        >
          {
            keyframes.map((pixels, index) => {
              return <PixelEditor title={"KeyFrame" + (index + 1)} pixels={pixels} pixelSize={pixelSize} onPixelsChange={(arr) => {
                const temp = [...keyframes];
                temp.forEach((pixels, pixelsIndex) => {
                  if (index === pixelsIndex) {
                    pixels = arr;
                  }
                });
                setKeyFrames(temp);
              }} />
            })
          }
        </Card>
      </Space>
    </div >

  );
}

export default App;
