import * as React from "react";
import { Redirect } from "react-router-dom";
import { Row, Col, Icon, Upload, message } from "antd";
import * as yaml from "js-yaml";
import { setSentences } from "./sentences";
import { setEntities } from "./entities";

export default class Home extends React.Component {

    state = {
        redirect: null,
    }

    render () {

        document.title = "对话标注 —— 导入";

        const { redirect } = this.state;

        return (
            <div>
                { redirect ? <Redirect to={ redirect } /> : null }
                <Row>
                    <Col offset={3} span={18}>
                        <div>
                            <Upload.Dragger
                                name="file"
                                fileList={[]}
                                customRequest={e => {
                                    return false;
                                }}
                                onChange={e => {
                                    const { file } = e;
                                    const fr = new FileReader();
                                    fr.onload = () => {
                                        try {
                                            const text = fr.result;
                                            const data = yaml.safeLoad(text);
                                            const sentences = data.filter(i => i.intent);
                                            const entities = data.filter(i => i.entity);
                                            const msg = `读取了 ${sentences.length} 条意图标注， ${entities.length} 个实体`;
                                            message.info(msg);
                                            setSentences(sentences);
                                            setEntities(entities);
                                            this.setState({ redirect: "/labels" });
                                        } catch (e) {
                                            message.error("读取错误！");
                                        }
                                    };
                                    fr.readAsText(file.originFileObj);
                                    
                                }}
                            >
                                <p className="ant-upload-drag-icon">
                                <Icon type="inbox" />
                                </p>
                                <p className="ant-upload-text">点击这里上传 或者 把语料文件拖动到这个区域</p>
                                <p className="ant-upload-hint">默认数据会保存在localStorage中，一般情况不能超过5MB，如果有很多实体、意图的情况，可以拆分多个文件</p>
                                <p className="ant-upload-hint">请拖动单个文件，YAML格式（.yml或后缀名，或者其他后缀名符合YAML语法的文本文件）</p>
                            </Upload.Dragger>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
    
}