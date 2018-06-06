import * as React from "react";
import { Link, Redirect } from "react-router-dom";
import { Table, Input, Form, message, Button } from "antd";
const { Item } = Form;
import { getSentences, setSentences } from "./sentences";

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
        const sentences = getSentences();
        const { newText, redirect } = this.state;
        return (
            <div>
                {redirect ? <Redirect to={redirect} /> : null}
                <h1>Label List Page</h1>
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
                        <Item
                            label="新建"
                            labelCol={{ span: 2 }}
                            wrapperCol={{ span: 12 }}
                        >
                            <Input
                                value={newText}
                                onChange={e => this.setState({newText: e.target.value})}
                            />
                        </Item>
                    </Form>
                </div>
                <div>
                    <Table
                        columns={Columns}
                        dataSource={sentences.map(item => {
                            const sentence = item.data.map(i => i.text).join("");
                            return {
                                key: sentence,
                                domain: item.domain,
                                intent: item.intent,
                                sentence,
                                entities: item.data.filter(i => i.name).map(i => {
                                    return `${i.name}: ${i.text}`;
                                }).join(", "),
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
                </div>
            </div>
        );
    }
    
}