import { Modal, Form, Radio } from 'antd';
import { useEffect } from 'react';
import { makePixels } from "./Tool";
export const Create = ({ onCreate, isOpen, onClose }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue({
            screenSize: 12832,
            pixelSize: 8
        });
    }, [form]);
    return <Modal
        title="New"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isOpen}
        onOk={() => {
            form.submit();
        }}
        onCancel={() => onClose()}
    >
        <Form
            form={form}
            name="new"
            onFinish={({ screenSize, pixelSize }) => {
                console.log(screenSize, pixelSize);
                const screenWidth = 128;
                let screenHeight;
                let pixels;
                switch (screenSize) {
                    case 12832:
                        screenHeight = 32;
                        pixels = makePixels(128 / pixelSize, 32 / pixelSize);
                        break;
                    case 12864:
                        screenHeight = 64;
                        pixels = makePixels(128 / pixelSize, 64 / pixelSize);
                        break;
                    default:
                        break;
                }
                onCreate(screenWidth, screenHeight, pixelSize, pixels);
                onClose();
            }}
            style={{ width: "100%" }}
        >
            <Form.Item name={"screenSize"} label="Screen size">
                <Radio.Group
                    style={{
                        display: "flex",
                        alignItems: "center"
                    }}
                    options={[
                        {
                            value: 12832, label: <div className='createImageLabel'>
                                <img src="/12832.jpg" />
                                <p>128x32</p>
                            </div>
                        },
                        {
                            value: 12864, label: <div className='createImageLabel'>
                                <img src="/12864.jpg" />
                                <p>128x64</p>
                            </div>
                        },
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
}