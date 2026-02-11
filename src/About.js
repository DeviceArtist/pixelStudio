import { Button } from 'antd';
import {
    GithubOutlined,
} from '@ant-design/icons';
export const About = () => {
    return <>
        <p>A screen designer</p>
        <Button icon={<GithubOutlined />} type="link" href="https://github.com/DeviceArtist/pixelStudio" target="_blank">Github</Button>
    </>
}