
import './App.css';
import { useEffect, useState } from 'react';
import { Image, Modal, Button, Form, Input, Space, Drawer, Tabs, Card, Slider, message, Radio } from 'antd';
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

import { About } from './About';
import { PixelEditor } from './Editor';
import { PreviewCanvas } from './Preview';
import { ImportCode } from './ImportCode';
import { ExportCode } from "./ExportCode";
const { TextArea } = Input;


function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [pixelSize, setPixelSize] = useState(1);
  const [aboutisOpen, setAboutisOpen] = useState(false);
  const [newImageisModalOpen, setNewImageIsModalOpen] = useState(false);
  const [importisOpen, setImportisOpen] = useState(false);
  const [exportisOpen, setExportisOpen] = useState(false);
  const [pixels, setPixels] = useState([]);
  const [form] = Form.useForm();
  const [importForm] = Form.useForm();

  const [base64, setBase64] = useState("");
  const [eraserMode, setEraserMode] = useState(false);
  const [editZoom, setEditZoom] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [sampleCode, setSampleCode] = useState("");

  // 初始化像素网格
  const makePixels = (w, h) => {
    console.log(w, h)
    const arr = [];
    for (let i = 0; i < h; i++) {
      const row = [];
      for (let j = 0; j < w; j++) {
        row.push(0);
      }
      arr.push(row);
    }
    setPixels(arr);
  };

  const clear = () => {
    const newPixels = [...pixels];
    pixels.map((row, rowIndex) => {
      row.map((pixel, colIndex) => {
        newPixels[rowIndex][colIndex] = 0;
      });
    });
    setPixels(newPixels);
  }

  const updateCode = () => {

  }

  useEffect(() => {
    updateCode();
  }, [pixels])

  useEffect(() => {
    setWidth(128);
    setHeight(32);
    setPixelSize(8);
    makePixels(16, 4);
    form.setFieldsValue({
      screenSize: 12832,
      pixelSize: 8
    });
  }, [])




  useEffect(() => {
    updateCode();
  }, [zoom, pixels]);

  return (
    <div className="app">
      <Modal
        title="New"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={newImageisModalOpen}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => setNewImageIsModalOpen(false)}
      >
        <Form
          form={form}
          name="new"
          onFinish={({ screenSize, pixelSize }) => {
            console.log(screenSize, pixelSize);
            setWidth(128);
            setPixelSize(pixelSize);
            switch (screenSize) {
              case 12832:
                setHeight(32);
                makePixels(128 / pixelSize, 32 / pixelSize);
                break;
              case 12864:
                setHeight(64);
                makePixels(128 / pixelSize, 64 / pixelSize);
                break;
              default:
                break;
            }
            setNewImageIsModalOpen(false);
          }}
          style={{ width: "100%" }}
        >
          <Form.Item name={"screenSize"} label="Screen size">
            <Radio.Group
              options={[
                { value: 12832, label: '128x32' },
                { value: 12864, label: '128x64' },
              ]}
            />
          </Form.Item>
          <Form.Item name="pixelSize" label="pixel size">
            <Radio.Group
              options={[
                { value: 1, label: '1' },
                { value: 2, label: '2' },
                { value: 4, label: '4' },
                { value: 8, label: '8' },
                { value: 16, label: '16' },
                { value: 32, label: '32' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

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
          console.log(pixels);
          setWidth(128);
          setHeight(32);
          setPixelSize(pixelSize);
          makePixels(w, h);
          setPixels(pixels);
          setImportisOpen(false);
        }} />

      </Drawer>

      <Drawer
        title="Export"
        closable={{ 'aria-label': 'Close Button' }}
        onClose={() => { setExportisOpen(false) }}
        open={exportisOpen}
      >
        <ExportCode pixels={pixels} pixelSize={pixelSize} width={width} height={height} />
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
            importForm.setFieldsValue({
              code: `[
              [1, 0, 1, 1, 1, 0, 1, 1, 1],
              [1, 0, 0, 0, 1, 0, 0, 0, 1],
              [1, 0, 1, 1, 1, 0, 1, 1, 1],
              [1, 0, 1, 0, 0, 0, 0, 0, 1],
              [1, 0, 1, 1, 1, 0, 1, 1, 1]
]`
            });
            setImportisOpen(true);
          }}>
            import
          </Button>
          <Button icon={<ExportOutlined />} onClick={() => {
            setExportisOpen(true);
            // const canvas = canvasRef.current;
            // const base64String = canvas.toDataURL("image/jpeg");
            // setBase64(base64String);
          }}>
            export
          </Button>
          <Button icon={<InfoCircleOutlined />} onClick={() => setAboutisOpen(true)}>about</Button>
        </Space>
      </div>

      <Space orientation="vertical" style={{ margin: "20px auto", width: "100%" }}>

        <Card title="editor" style={{ width: "100%" }}
          extra={<Slider value={editZoom} min={1} max={10} onChange={(value) => setEditZoom(value)} style={{ width: "100px" }} />}
        >
          <PixelEditor pixels={pixels} pixelSize={pixelSize} editZoom={editZoom} onPixelsChange={(arr) => setPixels(arr)} />
        </Card>
        <Card title="preview" extra={
          <></>
          // <Slider value={zoom} min={1} max={10} onChange={(value) => setZoom(value)} style={{ width: "100px" }} />
        }>
          <PreviewCanvas width={width} height={height} pixels={pixels} pixelSize={pixelSize} />
        </Card>
      </Space>
    </div >

  );
}

export default App;
