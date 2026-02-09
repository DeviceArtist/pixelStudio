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
          // {
          //   key: '3',
          //   label: 'image',
          //   children: <Card title="image" extra={<Button icon={<DownloadOutlined onClick={() => {
          //     const a = document.createElement("a");
          //     a.href = base64;
          //     a.download = `pixel.jpg`;
          //     a.click();
          //   }} />} onClick={() => {

          //   }} />} style={{ width: 300 }}>
          //     <Image src={base64} />
          //   </Card>,
          // }
        ]} onChange={() => { }} />