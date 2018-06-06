import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { Table, Select, Form, Button, Input, message } from "antd";
const { Option } = Select;
const { Item } = Form;
import { getEntities, setEntities, entitiyInnerSort } from "./entities";

export default class Slot extends React.Component {

    state = {
        entity: null,
        data: [],
        newEntity: "",
        redirect: null,
    }

    constructor (props) {
        super(props);
        this.state.entity = props.match.params.entity;
        const s = getEntities().filter(i => i.entity === this.state.entity)[0];
        this.state.data = s.data;
    }

    render () {
        const { data, newEntity, redirect } = this.state;
        return (
            <div>
                { redirect ? <Redirect to={redirect} /> : null }
                <h1>SLot Page d</h1>
                <div>
                    <Item
                        label="管理"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 12 }}
                    >
                        <Button
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
                            labelCol={{ span: 2 }}
                            wrapperCol={{ span: 12 }}
                        >
                            <Input
                                value={newEntity}
                                onChange={e => this.setState({ newEntity: e.target.value })}
                            />
                        </Item>
                    </Form>
                </div>
                <div>
                    {data.map((item, i) => (
                        <div key={item.join ? item.join(", ") : item}>
                            <Select
                                mode="tags"
                                style={{ width: "100%" }}
                                placeholder="..."
                                value={item.join ? item : [item]}
                                showSearch={false}
                                onChange={value => {
                                    console.log("value", value);
                                    if (value && value.hasOwnProperty("length") && value["length"] <= 0) {
                                        const newData = data.filter((_, j) => j !== i);
                                        newData.sort(entitiyInnerSort);
                                        this.setState({ data: newData });
                                    } else {
                                        data[i] = value;
                                        this.setState({ data });
                                    }
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
}