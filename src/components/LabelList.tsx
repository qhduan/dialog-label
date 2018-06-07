import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { Table, Input, Form, message, Button, Row, Col, Icon, Dropdown, Menu } from "antd";
import { getSentences, setSentences, intentNames, domainNames } from "./sentences";
import { EntityName } from "./EntityName";

const Columns = [
    {
        key: "domain",
        dataIndex: "domain",
        title: "领域",
    },
    {
        key: "intent",
        dataIndex: "intent",
        title: "意图",
    },
    {
        key: "sentence",
        dataIndex: "sentence",
        title: "句子",
        render: s => <Link to={`/label/${s}`}>{ s }</Link>,
    },
    {
        key: "entities",
        dataIndex: "entities",
        title: "实体",
    },
    {
        key: "manage",
        dataIndex: "manage",
        title: "管理",
    },
];


export default class LabelList extends React.Component {

    state = {
        newText: "",
        redirect: null,
    }

    constructor (props) {
        super(props);
    }

    render () {

        document.title = "对话标注 — 意图列表";

        const sentences = getSentences();
        const { newText, redirect } = this.state;
        return (
            <div>
                {redirect ? <Redirect to={redirect} /> : null}
                <Row>
                    <Col span={18} offset={3}>
                        {domainNames.length ? (
                            <Dropdown
                                overlay={
                                    <Menu
                                        onClick={item => {
                                            this.setState({
                                                newText: item.key
                                            });
                                        }}
                                    >
                                        {domainNames.map(i => (
                                            <Menu.Item key={i}>
                                                {i}
                                            </Menu.Item>
                                        ))}
                                    </Menu>
                                }
                                trigger={['click']}
                            >
                                <Button style={{ marginRight: "20px" }}>
                                    领域列表
                                    <Icon type="down" />
                                </Button>
                                </Dropdown>
                            ) : (
                            <span style={{ marginRight: "20px" }}>
                                当前语料没有领域
                            </span>
                        )}
                        {intentNames.length ? (
                            <Dropdown
                                overlay={
                                    <Menu
                                        onClick={item => {
                                            this.setState({
                                                newText: item.key
                                            });
                                        }}
                                    >
                                        {intentNames.map(i => (
                                            <Menu.Item key={i}>
                                                {i}
                                            </Menu.Item>
                                        ))}
                                    </Menu>
                                }
                                trigger={['click']}
                            >
                                <Button style={{ marginRight: "20px" }}>
                                    意图列表
                                    <Icon type="down" />
                                </Button>
                            </Dropdown>
                        ) : (
                            <span style={{ marginRight: "20px" }}>
                                当前语料没有意图
                            </span>
                        )}
                    </Col>
                </Row>
                <div>
                    <Form
                        onSubmit={e => {
                            e.preventDefault();
                            if (newText.trim().length <= 0) {
                                return message.warning("不能为空");
                            }
                            this.setState({
                                redirect: `/label/${newText.trim()}`
                            });
                        }}
                    >
                        <Form.Item
                            label="新建"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 18 }}
                        >
                            <Input
                                value={newText}
                                onChange={e => this.setState({newText: e.target.value})}
                                suffix={newText.length ? <Icon type="close-circle" onClick={() => this.setState({ newText: "" })} /> : null}
                                onKeyUp={e => {
                                    if (e.keyCode === 27) {
                                        this.setState({ newText: "" });
                                    }
                                }}
                            />
                        </Form.Item>
                    </Form>
                </div>
                <Row>
                    <Col span={18} offset={3}>
                        {newText.trim().length ? (
                            <div>
                                {`筛选 “${newText.trim()}” ：`}
                            </div>
                        ) : null}
                        <Table
                            pagination={{ defaultPageSize: 100 }}
                            columns={Columns}
                            dataSource={sentences.filter(item => {
                                const t = newText.trim();
                                if (t.length <= 0) {
                                    return true;
                                }
                                if (item.domain === t) {
                                    return true;
                                }
                                if (item.intent === t) {
                                    return true;
                                }
                                const text = item.data.map(i => i.text).join("");
                                if (text.indexOf(t) >= 0) {
                                    return true;
                                }
                                return false;
                            }).map(item => {
                                const sentence = item.data.map(i => i.text).join("");
                                return {
                                    key: sentence,
                                    domain: item.domain,
                                    intent: item.intent,
                                    sentence,
                                    entities: (
                                        <div>
                                            {item.data.filter(i => i.name).map(i => {
                                                return (
                                                    <EntityName
                                                        name={i.name}
                                                        value={i.text}
                                                    />
                                                );
                                            })}
                                        </div>
                                    ),
                                    manage: (
                                        <Button
                                            onClick={() => {
                                                const newSentences = sentences.filter(item => {
                                                    const s = item.data.map(i => i.text).join("");
                                                    if (s === sentence) {
                                                        return false;
                                                    }
                                                    return true;
                                                });
                                                setSentences(newSentences);
                                                this.setState({})
                                            }}
                                        >
                                            删除
                                        </Button>
                                    )
                                };
                            })}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
    
}