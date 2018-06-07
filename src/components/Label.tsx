import * as React from "react";
import { Redirect } from "react-router-dom";
import { Select, Input, Tag, Form, Button, message, Icon } from "antd";
const { Item } = Form;
const { Option } = Select;
import { getSentences, setSentences, domainNames, intentNames } from "./sentences";
import { getRandomColor } from "./colors";
import { entityNames } from "./entities";

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
                        style={{
                            backgroundColor: getRandomColor(inEntity.name),
                            padding: "5px",
                            paddingLeft: "3px",
                            paddingBottom: "3px",
                            borderRadius: "5px",
                            marginLeft: "5px",
                            marginRight: "5px",
                        }}
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

        document.title = "对话标注 — 意图标注 — " + this.state.currentLabel;

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
                <div style={{ marginTop: "10px" }}>
                    <Form>
                        <Item
                            label="语句"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 18 }}
                        >
                            <div
                                style={{
                                    fontSize: "20px"
                                }}
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
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 18 }}
                        >
                            <HintInput
                                placeholder="选填"
                                style={{width: 200}}
                                value={domain}
                                onChange={domain => this.setState({ domain })}
                                options={domainNames}
                            />
                        </Item>
                        <Item
                            label="意图"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 18 }}
                        >
                            <HintInput
                                placeholder="必填"
                                style={{width: 200}}
                                value={intent}
                                onChange={intent => this.setState({ intent })}
                                options={intentNames}
                            />
                        </Item>
                        <Item
                            label="选择"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 18 }}
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
                                    style={{
                                        borderColor: getRandomColor(e.name)
                                    }}
                                >
                                    {entityNames.indexOf(e.name) === -1 ? (
                                        <Icon
                                            type="exclamation-circle"
                                            title="这个实体还未在实体界面添加！"
                                            style={{ marginRight: "5px" }}
                                        />
                                    ) : null}
                                    {e.name} : {e.value}
                                </Tag>
                            ))}
                            { this.showSelect() }
                        </Item>
                        <Item
                            label="管理"
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 18 }}
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
                                style={{ marginRight: "20px" }}
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





interface HintInputProps {
    placeholder?: undefined|string,
    style?: undefined|object,
    state?: any,
    value?: string,
    onChange?: any,
    options?: any[],
}

interface HintInputState {
}

class HintInput extends React.Component<HintInputProps, HintInputState> {

    render () {
        const { placeholder, style, value, onChange, options } = this.props;
        if (options && options.length) {
            return (
                <Select
                    mode="combobox"
                    onChange={ onChange }
                    value={ value }
                    placeholder={ placeholder }
                    style={ style }
                >
                    {options.map(i => (
                        <Option key={i}>
                            {i}
                        </Option>
                    ))}
                </Select>
            )
        } else {
            return (
                <Select
                    mode="combobox"
                    onChange={ onChange }
                    value={ value }
                    placeholder={ placeholder }
                    style={ style }
                />
            )
        }
        
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

    handleChange = (value, option) => {
        this.setState({ value });
        // console.log("option", option);
        if (option && option.ref) {
            this.submit(null, option.key);
        }
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
            <div
                onSubmit={this.submit}
            >
                { this.inner() }
            </div>
        )
    }

    inner () {
        const { data, placeholder, style } = this.props;
        const { value } = this.state;

        const options = entityNames.map(i => (
            <Option
                ref={i}
                key={i}
            >
                {i}
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
