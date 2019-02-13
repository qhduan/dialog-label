import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { Table, Row, Col, message, Form, Input, Button, Icon } from "antd";
const { Item } = Form;
import { getEntities, setEntities } from "./entities";

const Columns = [
    {
        key: "name",
        dataIndex: "name",
        title: "名称",
        render: t => <a title={`奠基修改${t}的数据`} href={`#/slot/${encodeURIComponent(t)}`}>{ t }</a>,
    },
    {
        key: "count",
        dataIndex: "count",
        title: "数量",
    },
    {
        key: "manage",
        dataIndex: "manage",
        title: "管理",
    },
];

export default class SlotList extends React.Component {

    state = {
        redirect: null,
        newText : "",
    }

    render () {

        document.title = "对话标注 — 实体列表";

        const { redirect, newText } = this.state;

        const entities = getEntities();
        return (
            <div>
                {redirect ? <Redirect to={ redirect } /> : null}
                <div>
                    <Form
                        onSubmit={e => {
                            e.preventDefault();
                            if (newText.trim().length <= 0) {
                                return message.warning("不能为空");
                            }
                            this.setState({
                                redirect: `/slot/${encodeURIComponent(newText.trim())}`
                            });
                        }}
                    >
                        <Item
                            label="新建"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 18 }}
                        >
                            <Input
                                value={newText}
                                onChange={e => this.setState({newText: e.target.value})}
                                suffix={
                                    <Button
                                        style={{cursor: "pointer", border: 0, height: '24px'}}
                                        icon="close-circle"
                                        onClick={() => this.setState({ newText: "" })}
                                        disabled={newText.length <= 0}
                                    />
                                }
                                onKeyUp={e => {
                                    if (e.keyCode === 27) {
                                        this.setState({ newText: "" });
                                    }
                                }}
                                placeholder="要新建实体请 输入一个名称 并 回车"
                            />
                        </Item>
                    </Form>
                </div>
                <Row>
                    <Col offset={3} span={18}>
                        {newText.trim().length ? (
                            <div>
                                {`筛选 “${newText.trim()}” ：`}
                            </div>
                        ) : null}
                        <Table
                            pagination={{ defaultPageSize: 100 }}
                            columns={Columns}
                            dataSource={entities.filter(item => {
                                const t = newText.trim();
                                if (t.length <= 0) {
                                    return true;
                                }
                                if (item.entity === t) {
                                    return true;
                                }
                                let text = "";
                                for (const d of item.data) {
                                    if (d.join) {
                                        text += d.join("");
                                    } else {
                                        text += d;
                                    }
                                }
                                if (text.indexOf(t) >= 0) {
                                    return true;
                                }
                                return false;
                            }).map(item => {
                                return {
                                    key: item.entity,
                                    name: item.entity,
                                    count: item.data.length,
                                    manage: (
                                        <Button
                                            onClick={() => {
                                                const newEntities = entities.filter(i => i.entity !== item.entity);
                                                setEntities(newEntities);
                                                this.setState({});
                                            }}
                                            title="删除这条记录、包括的所有实体，注意删除后无法恢复"
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