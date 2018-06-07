import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { Table, Input, Form, message, Button, Row, Col, Icon, Dropdown, Menu } from "antd";
import { getSentences, setSentences, intentNames, domainNames } from "./sentences";
import { EntityName } from "./EntityName";
import { entityNames } from "./entities";


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
                                                newText: `domain:${item.key}`
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
                                                newText: `intent:${item.key}`
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
                        {entityNames.length ? (
                            <Dropdown
                                overlay={
                                    <Menu
                                        onClick={item => {
                                            this.setState({
                                                newText: `entity:${item.key}`
                                            });
                                        }}
                                    >
                                        {entityNames.map(i => (
                                            <Menu.Item key={i}>
                                                {i}
                                            </Menu.Item>
                                        ))}
                                    </Menu>
                                }
                                trigger={['click']}
                            >
                                <Button style={{ marginRight: "20px" }}>
                                    实体列表
                                    <Icon type="down" />
                                </Button>
                            </Dropdown>
                        ) : (
                            <span style={{ marginRight: "20px" }}>
                                当前语料没有实体
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
                                suffix={newText.length ? (
                                    <Icon style={{cursor: "pointer"}} type="close-circle" onClick={() => this.setState({ newText: "" })} >esc</Icon>
                                ) : null}
                                onKeyUp={e => {
                                    if (e.keyCode === 27) {
                                        this.setState({ newText: "" });
                                    }
                                }}
                                placeholder="要新建意图请 输入一句话 并 回车"
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
                            columns={[
                                {
                                    key: "domain",
                                    dataIndex: "domain",
                                    title: "领域",
                                    render: s => (
                                        <a
                                            href=""
                                            onClick={e => { e.preventDefault(); this.setState({ newText: `domain:${s}` }) }}
                                            style={{ color: "gray" }}
                                            title={`筛选领域${s}`}
                                        >
                                            { s }
                                        </a>
                                    ),
                                },
                                {
                                    key: "intent",
                                    dataIndex: "intent",
                                    title: "意图",
                                    render: s => (
                                        <a
                                            href=""
                                            onClick={e => { e.preventDefault(); this.setState({ newText: `intent:${s}` }) }}
                                            style={{ color: "gray" }}
                                            title={`筛选实体${s}`}
                                        >
                                            { s }
                                        </a>
                                    ),
                                },
                                {
                                    key: "sentence",
                                    dataIndex: "sentence",
                                    title: "句子",
                                    render: s => (
                                        <Link
                                            to={`/label/${s}`}
                                            title={`编辑句子“${s}”`}
                                        >
                                            { s }
                                        </Link>
                                    ),
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
                            ]}
                            dataSource={sentences.filter(item => {
                                // 过滤
                                const t = newText.trim();
                                if (t.length <= 0) {
                                    return true;
                                }
                                let m;

                                m = t.match(/^domain:(.*)$/);
                                if (m) {
                                    if (item.domain === m[1])
                                        return true;
                                    else
                                        return false;
                                }

                                m = t.match(/^intent:(.*)$/);
                                if (m) {
                                    if (item.intent === m[1])
                                        return true;
                                    else
                                        return false;
                                }

                                m = t.match(/^entity:(.*)$/);
                                if (m) {
                                    for (const e of item.data) {
                                        if (e.name === m[1]) {
                                            return true;
                                        }
                                    }
                                    return false;
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
                                                        key={`${i.name} ${i.text}`}
                                                        name={i.name}
                                                        value={i.text}
                                                        onClick={() => {
                                                            this.setState({
                                                                newText: `entity:${i.name}`
                                                            });
                                                        }}
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