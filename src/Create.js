import { Modal, Form, Input } from 'antd';
import { useEffect } from 'react';
import { makePixels } from "./Tool";
export const Create = ({ onCreate, isOpen, onClose }) => {
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue({
            width: 8,
            height: 8,
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
            onFinish={({ width, height, pixelSize }) => {
                onCreate(width, height, pixelSize, [makePixels(width, height)]);
                onClose();
            }}
            style={{ width: "100%" }}
        >
            <Form.Item name={"width"} label="width (rols)">
                <Input />
            </Form.Item>
            <Form.Item name={"height"} label="height (rows)">
                <Input />
            </Form.Item>
            <Form.Item name="pixelSize" label="pixel size">
                <Input />
            </Form.Item>
        </Form>
    </Modal>
}