import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { Table, Input, Form, message, Button, Row, Col, Icon, Dropdown, Menu } from "antd";
import { getSentences, setSentences, intentNames, domainNames } from "./sentences";
import { EntityName } from "./EntityName";
import { entityNames } from "./entities";


interface LabelListProps {
    state?: any,
    match?: any,
    history?: any,
}

interface LabelListState {
    newText: string,
    redirect: any,
    filterText: string,
}

export default class LabelList extends React.Component<LabelListProps, LabelListState> {

    state = {
        newText: "",
        filterText: "",
        redirect: null,
    }

    constructor (props) {
        super(props);
        this.state.filterText = this.props.match.params.text && decodeURIComponent(this.props.match.params.text) || "";
    }

    componentDidUpdate (prevPrpos) {
        if (
            prevPrpos.match.params.text !== this.props.match.params.text
            && decodeURIComponent(this.props.match.params.text) !== this.state.filterText
        ) {
            this.setState({
                filterText: decodeURIComponent(this.props.match.params.text)
            });
        }
    }

    render () {

        document.title = "对话标注 — 意图列表";

        const sentences = getSentences();
        const { history } = this.props;
        const { newText, redirect, filterText } = this.state;
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
                                            if (filterText.match(/domain:/)) {
                                                history.replace(`/labels/${filterText} domain:${item.key}`);
                                            } else {
                                                history.replace(`/labels/domain:${item.key}`);
                                            }
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
                                <Button style={{ marginRight: "20px" }} title="筛选领域">
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
                                            if (filterText.match(/intent:/)) {
                                                history.replace(`/labels/${filterText} intent:${item.key}`);
                                            } else {
                                                history.replace(`/labels/intent:${item.key}`);
                                            }
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
                                <Button style={{ marginRight: "20px" }} title="筛选意图">
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
                                            if (filterText.match(/entity:/)) {
                                                history.replace(`/labels/${filterText} entity:${item.key}`);
                                            } else {
                                                history.replace(`/labels/entity:${item.key}`);
                                            }
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
                                <Button style={{ marginRight: "20px" }} title="筛选实体">
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
                <Form
                    onSubmit={e => {
                        e.preventDefault();
                        if (filterText.trim().length <= 0) {
                            return message.warning("筛选条件不能为空");
                        }
                        this.props.history.replace(`/labels/${filterText.trim()}`);
                    }}
                >
                    <Form.Item
                        label="筛选"
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <Input
                            value={filterText}
                            onChange={e => this.setState({filterText: e.target.value})}
                            suffix={filterText.length ? (
                                <Icon style={{cursor: "pointer"}} type="close-circle" onClick={() => this.setState({ filterText: "" })} >esc</Icon>
                            ) : null}
                            onKeyUp={e => {
                                if (e.keyCode === 27) {
                                    // this.setState({ filterText: "" });
                                    this.props.history.replace(`/labels`);
                                }
                            }}
                            placeholder="输入筛选条件并回车应用"
                        />
                    </Form.Item>
                </Form>
                <Form
                    onSubmit={e => {
                        e.preventDefault();
                        if (newText.trim().length <= 0) {
                            return message.warning("不能为空");
                        }
                        if (filterText.trim()) {
                            this.setState({
                                redirect: `/label/${encodeURIComponent(filterText.trim())}/${encodeURIComponent(newText.trim())}`
                            });
                        } else {
                            this.setState({
                                redirect: `/label/${encodeURIComponent(newText.trim())}`
                            });
                        }
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
                <Row>
                    <Col span={18} offset={3}>
                        {filterText.trim().length ? (
                            <div>
                                {`筛选 “${filterText.trim()}” ：`}
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
                                            onClick={e => { e.preventDefault(); this.setState({ filterText: `domain:${s}` }) }}
                                            style={{ color: "gray" }}
                                            title={`筛选领域${s}`}
                                        >
                                            { s }
                                        </a>
                                    ),
                                    width: 100,
                                },
                                {
                                    key: "intent",
                                    dataIndex: "intent",
                                    title: "意图",
                                    render: s => (
                                        <a
                                            href=""
                                            onClick={e => { e.preventDefault(); this.setState({ filterText: `intent:${s}` }) }}
                                            style={{ color: "gray" }}
                                            title={`筛选实体${s}`}
                                        >
                                            { s }
                                        </a>
                                    ),
                                    width: 100,
                                },
                                {
                                    key: "sentence",
                                    dataIndex: "sentence",
                                    title: "句子",
                                    render: s => filterText.trim() ? (
                                        <a
                                            href={`#/label/${encodeURIComponent(filterText.trim())}/${encodeURIComponent(s)}`}
                                            title={`编辑句子“${s}”`}
                                        >
                                            { s }
                                        </a>
                                    ) : (
                                        <a
                                            href={`#/label/${encodeURIComponent(s)}`}
                                            title={`编辑句子“${s}”`}
                                        >
                                            { s }
                                        </a>
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
                                const t = filterText.trim();
                                if (t.length <= 0) {
                                    return true;
                                }
                                let m;

                                m = t.match(/domain:([^$\s]+)/g);
                                if (m) {
                                    for (const mm of m) {
                                        if (mm.split(":")[1] === item.domain) {
                                            return true;
                                        }
                                    }
                                    return false;
                                }

                                m = t.match(/intent:([^$\s]+)/g);
                                if (m) {
                                    for (const mm of m) {
                                        if (mm.split(":")[1] === item.intent) {
                                            return true;
                                        }
                                    }
                                    return false;
                                }

                                m = t.match(/entity:([^$\s]+)/g);
                                if (m) {
                                    for (const mm of m) {
                                        const mmm = mm.split(":")[1];
                                        for (const e of item.data) {
                                            if (e.name === mmm) {
                                                return true;
                                            }
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
                                                                filterText: `entity:${i.name}`
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
                                            title="删除这条标注，注意删除后无法恢复"
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