import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { Table, Select, Form, Button, Input, message, Row, Col, Tag } from "antd";
const { Option } = Select;
const { Item } = Form;
import { getEntities, setEntities, entitiyInnerSort } from "./entities";

export default class Slot extends React.Component {

    state = {
        entity: null,
        data: [],
        newEntity: "",
        redirect: null,
        regex: "",
    }

    constructor (props) {
        super(props);
        this.state.entity = props.match.params.entity;
        const s = getEntities().filter(i => i.entity === this.state.entity);
        if (s.length) {
            this.state.data = s[0].data;
            this.state.regex = s[0].regex || "";
        } else {
            this.state.data = [];
            this.state.regex = "";
        }
    }

    render () {

        document.title = "对话标注 — 实体标注 — " + this.state.entity;

        const { data, newEntity, redirect, entity, regex } = this.state;
        return (
            <div>
                { redirect ? <Redirect to={redirect} /> : null }
                <div>
                    <Item
                        label="管理"
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <span
                            style={{
                                fontSize: "20px",
                                marginRight: "50px",
                            }}
                        >
                            {entity}
                        </span>
                        <Button
                            onClick={() => {
                                const n = getEntities().filter(i => i.entity !== entity).concat({
                                    entity,
                                    data,
                                    regex,
                                });
                                setEntities(n);
                                this.setState({ redirect: "/slots" })
                            }}
                            style={{ marginRight: "20px" }}
                        >
                            保存
                        </Button>
                        <Button
                            onClick={() => this.setState({
                                redirect: "/slots"
                            })}
                        >
                            返回
                        </Button>
                    </Item>
                </div>
                <div>
                    <Form onSubmit={e => e.preventDefault()}>
                        <Item
                            label="正则表达式"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 18 }}
                        >
                            <Input
                                value={regex}
                                onChange={e => this.setState({ regex: e.target.value })}
                            />
                        </Item>
                    </Form>
                    <Form
                        onSubmit={e => {
                            e.preventDefault();
                            if (newEntity.trim().length) {
                                for (const d of data) {
                                    if (d.indexOf(newEntity) !== -1) {
                                        return message.warning("重复了");
                                    }
                                }
                                let newData = data;
                                newData.push(newEntity.trim());
                                newData.sort(entitiyInnerSort);
                                this.setState({ data: newData, newEntity: "" });
                            } else {
                                return message.warning("不能为空");
                            }
                        }}
                    >
                        <Item
                            label="新建"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 18 }}
                        >
                            <Input
                                value={newEntity}
                                onChange={e => this.setState({ newEntity: e.target.value })}
                            />
                        </Item>
                    </Form>
                </div>
                <Row>
                    <Col offset={3} span={18}>
                    {/* data.map((item, i) => (
                        <div key={item.join ? item.join(", ") : item}>
                            <Select
                                mode="tags"
                                style={{ width: "100%", marginTop: 5 }}
                                placeholder="..."
                                showSearch={false}
                                onChange={value => {
                                    if (value && value.hasOwnProperty("length") && value["length"] <= 0) {
                                        const newData = data.filter((_, j) => j !== i);
                                        newData.sort(entitiyInnerSort);
                                        this.setState({ data: newData });
                                    } else {
                                        data[i] = value;
                                        this.setState({ data });
                                    }
                                }}
                            >
                            {item.join ? item.map(i => <Select.Option key={i}>{i}</Select.Option>) : <Select.Option key={item}>{item}</Select.Option>}</Select>
                        </div>
                    )) */}
                        {data.map((item, itemInd) => (
                            <div
                                key={item.join ? item.join(", ") : item}
                                style={{ width: "100%", marginTop: 5 }}
                            >
                                {item.join ? item.map((i, ind) => (
                                    <Tag
                                        closable
                                        afterClose={() => {
                                            let newData = data;
                                            if (item.length === 1) {
                                                newData = data.filter((_, j) => j !== itemInd);
                                            } else {
                                                newData[itemInd] = item.filter((_, j) => j !== ind);
                                                if (newData[itemInd].length === 1) {
                                                    newData[itemInd] = newData[itemInd][0];
                                                }
                                            }
                                            this.setState({ data: newData });
                                        }}
                                        color={ind === 0 ? "blue" : ""}
                                        key={i}
                                        style={{ minWidth: "80px", textAlign: "center" }}
                                    >
                                        {i}
                                    </Tag>
                                )) : (
                                    <Tag
                                        color="blue"
                                        style={{ minWidth: "80px", textAlign: "center" }}
                                        closable
                                        afterClose={() => {
                                            const newData = data.filter((j) => j !== item);
                                            this.setState({ data: newData });
                                        }}
                                    >
                                        {item}
                                    </Tag>
                                )}

                                <form
                                    style={{ display: "inline-block" }}
                                    onSubmit={e => {
                                        e.preventDefault();
                                        const k = `add${itemInd}`;
                                        if (this.refs[k] && this.refs[k]["input"]) {
                                            const value = this.refs[k]["input"]["value"].trim();
                                            if (value.length <= 0) {
                                                return message.warning("不能为空");
                                            }
                                            if (item.push) {
                                                item.push(value);
                                            } else {
                                                data[itemInd] = [item, value];
                                            }
                                            this.setState({ data });
                                        }
                                    }}
                                >
                                    <Input
                                        ref={`add${itemInd}`}
                                        placeholder="加备选"
                                        style={{
                                            width: "100px",
                                            height: "20px",
                                            marginTop: "1px",
                                            lineHeight: "60px",
                                            textAlign: "center",
                                        }}
                                    />
                                </form>
                            </div>
                        ))}
                    </Col>
                </Row>
            </div>
        );
    }
    
}