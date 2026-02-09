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
            <TextArea autoSize style={{ display: "none" }} />
            <Editor
              height="200px"
              language="javascript"
              onChange={(value) => {
                setSampleCode(value);
                importForm.setFieldsValue({
                  code: value
                })
              }}
              value={sampleCode}

            />
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
            children: <div>
              {contextHolder}
              <Button icon={<CopyOutlined />} onClick={async () => {
                try {
                  await navigator.clipboard.writeText(code);
                  messageApi.open({
                    type: 'success',
                    content: 'Copied!',
                  });
                } catch (err) {
                  messageApi.open({
                    type: 'error',
                    content: 'Failed to copy!',
                  });
                }
              }} />
              <SyntaxHighlighter language="javascipt" style={docco}>
                {code}
              </SyntaxHighlighter>
            </div>,
          },
          {
            key: '2',
            label: 'microPython Code',
            children: <div>
              {contextHolder}
              <Button icon={<CopyOutlined />} onClick={async () => {
                try {
                  await navigator.clipboard.writeText(microPythonCode);
                  messageApi.open({
                    type: 'success',
                    content: 'Copied!',
                  });
                } catch (err) {
                  messageApi.open({
                    type: 'error',
                    content: 'Failed to copy!',
                  });
                }
              }} />
              <Editor
                height="500px"
                language="python"
                value={microPythonCode}
              />
              {/* <SyntaxHighlighter language="python" style={docco}>
                {microPythonCode}
              </SyntaxHighlighter> */}
            </div>,
          },
          {
            key: '3',
            label: 'image',
            children: <Card title="image" extra={<Button icon={<DownloadOutlined onClick={() => {
              const a = document.createElement("a");
              a.href = base64;
              a.download = `pixel.jpg`;
              a.click();
            }} />} onClick={() => {

            }} />} style={{ width: 300 }}>
              <Image src={base64} />
            </Card>,
          }
        ]} onChange={() => { }} />
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
            const canvas = canvasRef.current;
            const base64String = canvas.toDataURL("image/jpeg");
            setBase64(base64String);
          }}>
            export
          </Button>
          <Button icon={<InfoCircleOutlined />} onClick={() => setAboutisOpen(true)}>about</Button>
        </Space>
      </div>


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
    setCode(text);

    let t = `from machine import Pin, I2C
import ssd1306
import framebuf
import time
i2c = I2C(sda=Pin(4), scl=Pin(5))
display = ssd1306.SSD1306_I2C(${width}, ${height}, i2c)

ICON = ${text}

display.fill(0)
#display.contrast(1)

def draw(ICON):
    for y, row in enumerate(ICON):
        for x, value in enumerate(row):
            display.fill_rect(x*${pixelSize}, y*${pixelSize},x*${pixelSize}+${pixelSize},y*${pixelSize}+${pixelSize},value)


draw(ICON)
display.show()
`

    setMicroPythonCode(t)
  }

  const DrawToCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pixels.map((row, rowIndex) => {
      row.map((pixel, colIndex) => {
        ctx.fillStyle = pixel === 1 ? "#08f4fa" : "#000";
        ctx.fillRect(colIndex * pixelSize * zoom, rowIndex * pixelSize * zoom, pixelSize * zoom, pixelSize * zoom);
      });
    });
  }