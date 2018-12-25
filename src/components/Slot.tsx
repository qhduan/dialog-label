import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import * as _ from "lodash";
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
        copyFrom: "",
    }

    constructor (props) {
        super(props);
        this.state.entity = decodeURIComponent(props.match.params.entity);
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

        const { data, newEntity, redirect, entity, regex, copyFrom } = this.state;
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
                                    copyFrom,
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
                                placeholder="可选正则表达式，注意要把“\”写成“\\”"
                            />
                        </Item>
                        <Item
                            label="包含其他实体数据"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 18 }}
                        >
                            <Input
                                value={copyFrom}
                                onChange={e => this.setState({ copyFrom: e.target.value })}
                                placeholder="导入某个其他名字的实体数据到这里，也就是数据会变成此实体数据+指定实体数据"
                            />
                        </Item>
                    </Form>
                    <Form
                        onSubmit={e => {
                            e.preventDefault();
                            if (newEntity.trim().length) {
                                for (const d of data) {
                                    if (_.isString(d) && d === newEntity) {
                                        return message.warning("重复了");
                                    } else if (_.isArray(d) && d.indexOf(newEntity) !== -1) {
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
                                placeholder="输入一个 新实体 并 回车"
                            />
                        </Item>
                    </Form>
                </div>
                <Row>
                    <Col offset={3} span={18}>
                        <div>
                            <p>
                                提示：
                                <br />
                                每行第一个是实体结果，之后是此实体的别称
                                <br />
                                别称是主要实体的别称，例如标注了实体“北京市”，备选可以是“北京”、“首都”、“帝都”
                                <br />
                                如果标注了实体“星期三”，备选可以是“周三”，“水曜日”，“Wed”
                            </p>
                        </div>
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
                                        placeholder="加别称"
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