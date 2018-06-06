import * as React from "react";
import { Redirect } from "react-router-dom";
import { Select, Input, Tag, Form, Button, message } from "antd";
const { Item } = Form;
const { Option } = Select;
import { getSentences, setSentences } from "./sentences";

export default class Label extends React.Component {

    constructor (props) {
        super(props);

        getSentences().forEach(obj => {
            const sentence = obj.data.map(i => i.text).join("");
            if (sentence === props.match.params.label) {
                this.state.domain = obj.domain;
                this.state.intent = obj.intent;
                this.state.entities = obj.data.filter(i => i.name).map(i => {
                    return {
                        start: i.start,
                        end: i.end,
                        value: i.text,
                        name: i.name,
                    };
                });
            }
        });
        
        this.state.currentLabel = props.match.params.label;
    }

    state = {
        redirect: null,
        currentLabel: "",
        infoBox: "",
        selectedText: "",
        selectedStart: -1,
        selectedEnd: -1,
        entities: [],
        domain: "",
        intent: "",
    }

    taggedLabel () {
        const { currentLabel, entities } = this.state;
        const ret = [];

        Array.from(currentLabel).forEach((c, i) => {
            let inEntity = null;
            let isStart = false;
            for (const e of entities) {
                if (e.start === i) {
                    inEntity = e;
                    isStart = true;
                    break;
                } else if (i >= e.start && i < e.end) {
                    inEntity = e;
                    break;
                }
            }
            if (isStart) {
                ret.push(
                    <span
                        style={{backgroundColor: "red"}}
                    >
                        {inEntity.value}
                    </span>
                );
            } else if (inEntity) {
                return;
            } else {
                if (ret.length && typeof ret[ret.length - 1] === "string") {
                    ret[ret.length - 1] += c;
                } else {
                    ret.push(c);
                }
            }
        });

        return ret;
    }

    render () {
        const {
            redirect,
            currentLabel, infoBox,
            selectedText, selectedStart, selectedEnd,
            entities,
            domain, intent,
        } = this.state;
        
        return (
            <div>
                {redirect ? <Redirect to={redirect} /> : null}
                <h1>Label Page</h1>
                <div>
                    <Form>
                        <Item
                            label="语句"
                            labelCol={{ span: 2 }}
                            wrapperCol={{ span: 12 }}
                        >
                            <div
                                id="labelText"
                                onMouseUp={() => {
                                    const s = window.getSelection();
                                    const range = s.getRangeAt(0);

                                    if (range.startContainer.parentNode !== range.endContainer.parentNode) {
                                        this.setState({
                                            infoBox: "错误领域",
                                            selectedText: "",
                                            selectedStart: -1,
                                            selectedEnd: -1,
                                        });
                                        return;
                                    }
                                    
                                    if (s.baseNode) {
                                        if (s.baseNode.parentNode !== document.querySelector("#labelText")) {
                                            this.setState({
                                                infoBox: "跨实体",
                                                selectedText: "",
                                                selectedStart: -1,
                                                selectedEnd: -1,
                                            });
                                            return;
                                        }
                                    }

                                    console.log("range", range);

                                    let base = 0;
                                    let startContainer = range.startContainer.previousSibling;
                                    while (startContainer) {

                                        if (startContainer.textContent && startContainer.textContent.length) {
                                            base += startContainer.textContent.length;
                                        }

                                        startContainer = startContainer.previousSibling;
                                    }

                                    this.setState({
                                        selectedText: s.toString(),
                                        selectedStart: range.startOffset + base,
                                        selectedEnd: range.endOffset + base,
                                    });
                                }}
                            >{ this.taggedLabel() }</div>
                        </Item>
                        <Item
                            label="领域"
                            labelCol={{ span: 2 }}
                            wrapperCol={{ span: 12 }}
                        >
                            <Input
                                placeholder="选填"
                                style={{width: 200}}
                                value={domain}
                                onChange={e => this.setState({ domain: e.target.value })}
                            />
                        </Item>
                        <Item
                            label="意图"
                            labelCol={{ span: 2 }}
                            wrapperCol={{ span: 12 }}
                        >
                            <Input
                                placeholder="必填"
                                style={{width: 200}}
                                value={intent}
                                onChange={e => this.setState({ intent: e.target.value })}
                            />
                        </Item>
                        <Item
                            label="选择"
                            labelCol={{ span: 2 }}
                            wrapperCol={{ span: 12 }}
                        >

                            {entities.map((e) => (
                                <Tag
                                    key={e.start}
                                    closable
                                    onClose={() => {
                                        const newEntities = entities.filter(ne => {
                                            if (e.start === ne.start) {
                                                return false;
                                            }
                                            return true;
                                        });
                                        this.setState({
                                            entities: newEntities
                                        });
                                    }}
                                >
                                    <label>{e.name} : {e.value} （{e.start}-{e.end}）</label>
                                </Tag>
                            ))}
                            { this.showSelect() }
                        </Item>
                        <Item
                            label="管理"
                            labelCol={{ span: 2 }}
                            wrapperCol={{ span: 12 }}
                        >
                            <Button
                                onClick={() => {
                                    const ret = [];

                                    if (intent.trim().length <= 0) {
                                        return message.warning("意图必填");
                                    }

                                    Array.from(currentLabel).forEach((c, i) => {
                                        let inEntity = null;
                                        let isStart = false;
                                        for (const e of entities) {
                                            if (e.start === i) {
                                                inEntity = e;
                                                isStart = true;
                                                break;
                                            } else if (i >= e.start && i < e.end) {
                                                inEntity = e;
                                                break;
                                            }
                                        }
                                        if (isStart) {
                                            ret.push({
                                                text: inEntity.value,
                                                start: inEntity.start,
                                                end: inEntity.end,
                                                name: inEntity.name,
                                            });
                                        } else if (inEntity) {
                                            return;
                                        } else {
                                            if (ret.length && !ret[ret.length - 1].name) {
                                                ret[ret.length - 1].text += c;
                                            } else {
                                                ret.push({
                                                    text: c
                                                });
                                            }
                                        }
                                    });

                                    const obj = {
                                        domain,
                                        intent,
                                        data: ret,
                                    };

                                    const sentence = obj.data.map(i => i.text).join("");
                                    const sentences = getSentences();
                                    setSentences(sentences.filter(o => {
                                        if (sentence === o.data.map(i => i.text).join("")) {
                                            return false;
                                        }
                                        return true;
                                    }).concat([obj]))

                                    // console.log(obj);
                                    this.setState({
                                        redirect: "/labels"
                                    });
                                }}
                            >
                                保存
                            </Button>
                            <Button
                                onClick={() => this.setState({
                                    redirect: "/labels"
                                })}
                            >
                                返回
                            </Button>
                        </Item>
                    </Form>
                    <div>{ infoBox }</div>
                </div>
            </div>
        );
    }

    showSelect () {
        const {
            selectedText, selectedStart, selectedEnd,
            entities,
        } = this.state;

        if (selectedText && selectedText.length) {
            return (
                <div>
                    已选择“{ selectedText }”，从 { selectedStart } 到 { selectedEnd }

                    <SlotNameInput
                        onSubmit={(name) => {
                            const newEntities = entities.concat([{
                                start: selectedStart,
                                end: selectedEnd,
                                value: selectedText,
                                name,
                            }]);
                            newEntities.sort((a, b) => {
                                return a.start - b.start;
                            });
                            this.setState({
                                infoBox: "",
                                selectedText: "",
                                selectedStart: -1,
                                selectedEnd: -1,
                                entities: newEntities,
                            });
                        }}
                        placeholder="实体名称"
                        data={entities.map(e => {
                            return {
                                text: e.name,
                                value: e.name,
                            };
                        })}
                        style={{
                            width: 200,
                        }}
                    />
                </div>
            );
        }

        return null;
    }
    
}

interface SlotNameInputProps {
    placeholder?: undefined|string,
    style?: undefined|object,
    state?: any,
    data?: Array<any>,
    onSubmit: any,
}

interface SlotNameInputState {
    value: string,
    data: Array<any>,
}

class SlotNameInput extends React.Component<SlotNameInputProps, SlotNameInputState> {

    state = {
        value: "",
        data: []
    }

    submit = (e, value=null) => {
        if (e) {
            e.preventDefault();
        }
        this.props.onSubmit(value || this.state.value);
    }

    handleChange = (value) => {
        this.setState({ value });
    }

    constructor (props) {
        super(props);
        this.state.data = props.data;
    }

    getValue () {
        return this.state.value;
    }

    render () {
        return (
            <form
                onSubmit={this.submit}
            >
                { this.inner() }
            </form>
        )
    }

    inner () {
        const { data, placeholder, style } = this.props;
        const { value } = this.state;

        const options = (data || []).filter(d => {
            if (value.trim().length <= 0) {
                return true;
            }
            if (d && d.text && d.text.indexOf && d.text.indexOf(value) >= 0) {
                return true;
            }
            return false;
        }).map((d, i) => (
            <Option
                key={ d.value }
            >
                { d.text }
            </Option>
        ));

        if (options.length) {
            return (
                <Select
                    mode="combobox"
                    value={ value }
                    placeholder={ placeholder }
                    style={ style }
                    defaultActiveFirstOption={ false }
                    showSearch={ false }
                    filterOption={ false }
                    onChange={ this.handleChange }
                >
                    { options }
                </Select>
            );
        }

        return (
            <Select
                mode="combobox"
                value={ value }
                placeholder={ placeholder }
                style={ style }
                defaultActiveFirstOption={ false }
                showSearch={ false }
                filterOption={ false }
                onChange={ this.handleChange }
            />
        );
    }

}