
import './App.css';
import { useEffect, useState, useRef } from 'react';
import { Modal, Button, Form, Input, Space, Drawer, Tabs, Card } from 'antd';
import {
  FileImageOutlined,
  ImportOutlined,
  ExportOutlined,
  GithubOutlined,
  InfoCircleOutlined,
  ClearOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  DownloadOutlined

} from '@ant-design/icons';
const { TextArea } = Input;

function App() {
  const [aboutisOpen, setAboutisOpen] = useState(false);
  const [newImageisModalOpen, setNewImageIsModalOpen] = useState(false);
  const [importisOpen, setImportisOpen] = useState(false);
  const [exportisOpen, setExportisOpen] = useState(false);
  const [pixels, setPixels] = useState([]);
  const [code, setCode] = useState("");
  const [microPythonCode, setMicroPythonCode] = useState("");
  const [form] = Form.useForm();
  const [importForm] = Form.useForm();
  const canvasRef = useRef(null);
  const [base64, setBase64] = useState("");
  const [eraserMode, setEraserMode] = useState(false);
  const [zoom, setZoom] = useState(1);

  // 初始化像素网格
  const makePixels = (rows, cols) => {
    const canvas = canvasRef.current;
    canvas.width = rows;
    canvas.height = cols;
    const arr = [];
    for (let i = 0; i < cols; i++) {
      const row = [];
      for (let j = 0; j < rows; j++) {
        row.push(0);
      }
      arr.push(row);
    }
    setPixels(arr);
  };

  // 切换像素状态
  const togglePixel = (rowIndex, colIndex) => {
    const newPixels = [...pixels];
    newPixels[rowIndex][colIndex] = newPixels[rowIndex][colIndex] === 0 ? 1 : 0;
    setPixels(newPixels);
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
    let text = "[";
    text += "\r\n";
    pixels.map((row, rowIndex) => {
      text += "  [";
      row.map((pixel, colIndex) => {
        text += pixel;
        text += colIndex === row.length - 1 ? "" : ",";
      });
      text += "]";
      text += rowIndex === pixels.length - 1 ? "" : ","
      text += "\r\n";
    });
    text += "]"
    if (pixels.length !== 0) {
      form.setFieldValue("width", pixels[0].length);
      form.setFieldValue("height", pixels.length);
    }

    setCode(text);

    let t = `
from machine import Pin, I2C
import ssd1306
import framebuf
import time
i2c = I2C(sda=Pin(4), scl=Pin(5))
display = ssd1306.SSD1306_I2C(128, 32, i2c)

ICON = ${text}

display.fill(0)
#display.contrast(1)

def draw(ICON):
    for y, row in enumerate(ICON):
        for x, value in enumerate(row):
            display.pixel(x, y, value)


draw(ICON)
display.show()
`

    setMicroPythonCode(t)
  }

  const DrawToCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pixels.map((row, rowIndex) => {
      row.map((pixel, colIndex) => {
        ctx.fillStyle = pixel === 1 ? "#000" : "#fff";
        ctx.fillRect(colIndex, rowIndex, 1, 1);
      });
    });
  }

  useEffect(() => {
    updateCode();
    DrawToCanvas();
  }, [pixels])

  useEffect(() => {
    form.setFieldsValue({ width: 8, height: 8 });
    makePixels(8, 8);
  }, [])

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
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          form={form}
          name="control-hooks"
          onFinish={({ width, height }) => {
            makePixels(width, height);
            setNewImageIsModalOpen(false);
          }}
          style={{ width: "100%" }}
        >
          <Form.Item name="width" label="width" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="height" label="height" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title="About version 0.1"
        placement="bottom"
        closable={{ 'aria-label': 'Close Button' }}
        onClose={() => { setAboutisOpen(false) }}
        open={aboutisOpen}
      >
        <Button icon={<GithubOutlined />} type="link" href="https://github.com/DeviceArtist/pixelStudio" target="_blank">Github</Button>
      </Drawer>

      <Drawer
        title="Import"
        placement="left"
        closable={{ 'aria-label': 'Close Button' }}
        onClose={() => { setImportisOpen(false) }}
        open={importisOpen}
      >
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          form={importForm}
          name="import"
          onFinish={({ code }) => {
            console.log(code);
            const arr = eval(code);
            setPixels(arr);
            setImportisOpen(false);
          }}
          style={{ width: "100%" }}
        >
          <Form.Item name="code" label="code" rules={[{ required: true }]}>
            <TextArea autoSize />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">OK</Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="Export"
        closable={{ 'aria-label': 'Close Button' }}
        onClose={() => { setExportisOpen(false) }}
        open={exportisOpen}
      >
        <Tabs defaultActiveKey="1" items={[
          {
            key: '1',
            label: 'Array Code',
            children: <TextArea value={code} autoSize />,
          },
          {
            key: '2',
            label: 'microPython Code',
            children: <TextArea value={microPythonCode} autoSize />,
          },
          {
            key: '3',
            label: 'image',
            children: <Card title="image" extra={<Space>
              <Button icon={<ZoomInOutlined />} onClick={() => {
                setZoom(zoom * 2);
              }} />
              <Button icon={<ZoomOutOutlined />} onClick={() => {
                setZoom(zoom / 2);
              }} />
            </Space>} style={{ width: 300 }}>
              <img style={{zoom:zoom}} src={base64} />
            </Card>,
          }
        ]} onChange={() => { }} />
      </Drawer>

      <div>
        <Space>
          <Button icon={<FileImageOutlined />} onClick={() => setNewImageIsModalOpen(true)}>
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
            const canvas = canvasRef.current;
            const base64String = canvas.toDataURL("image/jpeg");
            setBase64(base64String);
          }}>
            export
          </Button>
          <Button icon={<InfoCircleOutlined />} onClick={() => setAboutisOpen(true)}>about</Button>
        </Space>
      </div>

      <Space orientation="vertical" style={{ margin: "20px auto" }}>

        <Card title="editor">
          <div className='editor'>
            {pixels.map((row, rowIndex) =>
              <div className='row'>
                {
                  row.map((pixel, colIndex) => (
                    <span
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

        <Card title="preview">
          <canvas ref={canvasRef}></canvas>
        </Card>
      </Space>
    </div>

  );
}

export default App;
