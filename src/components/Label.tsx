import * as React from "react";
import { Redirect } from "react-router-dom";
import { Select, Input, Tag, Form, Button, message, Icon, List, Row, Col } from "antd";
const { Item } = Form;
const { Option } = Select;
import * as jaccard from "jaccard";
import { getSentences, setSentences, domainNames, intentNames } from "./sentences";
import { getRandomColor } from "./colors";
import { entityNames, getEntities } from "./entities";


interface LabelProps {
    state?: any,
    match?: any,
}

interface LabelState {
    redirect: any,
    currentLabel: any,
    infoBox: any,
    selectedText: any,
    selectedStart: any,
    selectedEnd: any,
    entities: any,
    domain: any,
    intent: any,
    listData: any,
    listLabel: any,
    title: any,
}

export default class Label extends React.Component<LabelProps, LabelState> {

    constructor (props) {
        super(props);

        let title = "新建";

        getSentences().forEach(obj => {
            const sentence = obj.data.map(i => i.text).join("");
            if (sentence === props.match.params.label) {
                title = "修改";
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
        
        this.state.title = title;
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
        listData: [],
        listLabel: "",
        title: "",
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
                        key={i}
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
            title,
            currentLabel, infoBox,
            selectedText, selectedStart, selectedEnd,
            entities,
            domain, intent,
            listData,
            listLabel,
        } = this.state;
        
        return (
            <div>
                {redirect ? <Redirect to={redirect} /> : null}
                <div style={{ marginTop: "10px" }}>
                    <Row>
                        <Col offset={3} span={18}>
                            <h2>{ title }</h2>
                        </Col>
                    </Row>
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
                        <div style={{ float: "left" }}>↑拖动并选中部分文字来标注实体↑</div>
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
                        label="实体"
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

                                if (intent.trim().length <= 0) {
                                    return message.warning("意图必填");
                                }

                                if (intent.trim().indexOf(" ") !== -1) {
                                    return message.warning("意图不能有空格，请使用下划线");
                                }

                                if (domain.trim().indexOf(" ") !== -1) {
                                    return message.warning("领域不能有空格，请使用下划线");
                                }

                                const obj = this.generate();

                                const sentence = obj.data.map(i => i.text).join("");
                                const sentences = getSentences();

                                const result = sentences.filter(o => {
                                    if (sentence === o.data.map(i => i.text).join("")) {
                                        return false;
                                    }
                                    return true;
                                }).concat([obj]);
                                setSentences(result);

                                if (this.props.match.params.filter) {
                                    this.setState({
                                        redirect: `/labels/${this.props.match.params.filter}`
                                    });
                                } else {
                                    this.setState({
                                        redirect: "/labels"
                                    });
                                }
                            }}
                            style={{ marginRight: "20px" }}
                            title="返回意图列表 并且 保存结果"
                        >
                            保存
                        </Button>
                        <Button
                            onClick={() => {
                                if (entities.length <= 0) {
                                    return message.info("必须有实体标注，才能展示样例");
                                }
                                let rets = [];
                                for (let i = 0; i < 100; i++) {
                                    const s = this.generateSample();
                                    if (rets.indexOf(s) === -1 && currentLabel !== s) {
                                        rets.push(s);
                                    }
                                    if (rets.length >= 5) {
                                        break;
                                    }
                                }
                                this.setState({
                                    listLabel: "样例结果",
                                    listData: rets,
                                })
                            }}
                            style={{ marginRight: "20px" }}
                            title="点击查看此句子配合实体类型中其他实体的情况"
                        >
                            样例
                        </Button>
                        <Button
                            title="点击查看意图句子列表中的相似句子（如果这是修改句子而不是新建，会有一个相似度为 1 的句子）"
                            onClick={() => {
                                const distance = this.findSimilar();
                                this.setState({
                                    listLabel: "相似结果",
                                    listData: distance.slice(0, 5).map(item => (
                                        <span>
                                            <span style={{minWidth: "60px", display: "inline-block", textAlign: "left"}}>
                                                {item.distance.toFixed(2)}
                                            </span>
                                            <span style={{minWidth: "120px", display: "inline-block", textAlign: "left"}}>
                                                {item.domain}
                                            </span>
                                            <span style={{minWidth: "120px", display: "inline-block", textAlign: "left"}}>
                                                {item.intent}
                                            </span>
                                            <span>{item.text}</span>
                                        </span>
                                    ))
                                })
                            }}
                            style={{ marginRight: "20px" }}
                        >
                            相似
                        </Button>
                        <Button
                            onClick={() => {
                                if (this.props.match.params.filter) {
                                    this.setState({
                                        redirect: `/labels/${this.props.match.params.filter}`
                                    });
                                } else {
                                    this.setState({
                                        redirect: "/labels"
                                    });
                                }
                            }}
                            style={{ marginRight: "20px" }}
                            title="返回意图列表，不保存结果"
                        >
                            返回
                        </Button>
                    </Item>
                    {listLabel && listLabel.length && listData && listData.length ? (
                        <Item
                            label={listLabel}
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 18 }}
                        >
                            <Button onClick={() => this.setState({ listLabel: "", listData: [] })} >关闭</Button>
                            <List
                                dataSource={listData}
                                renderItem={t => (
                                    <List.Item>
                                        {t}
                                    </List.Item>
                                )}
                            />
                        </Item>
                    ) : null}
                </div>
            </div>
        );
    }

    /**
     * 计算字符串数组的n-gram
     * @param arr 数组或者字符串
     * @param n gram
     */
    nGram (arr, n) {
        arr = Array.from(arr);
        let ret = [];
        for (let i = n - 1; i < arr.length; i++) {
            let c = [];
            for (let j = i - (n - 1); j <= i; j++) {
                c.push(arr[j]);
            }
            if (c.length) {
                ret.push(c.join(""));
            }
        }
        return ret;
    }

    findSimilar () {
        const sentences = getSentences();
        const database = [];
        for (const s of sentences) {
            let parts = [];
            for (const part of s.data) {
                if (part.name) {
                    parts.push(part.name);
                } else {
                    parts = parts.concat(Array.from(part.text));
                }
            }
            if (parts) {
                database.push({
                    parts,
                    text: s.data.map(i => i.text).join(""),
                    domain: s.domain,
                    intent: s.intent,
                });
            }
        }
        
        const obj = this.generate();
        let self = [];
        for (const part of obj.data) {
            if (part.name) {
                self.push(part.name);
            } else {
                self = self.concat(Array.from(part.text));
            }
        }
        const selfText = self.join("");
        const self2Gram = this.nGram(self, 2);
        const self3Gram = this.nGram(self, 3);
        const selfAll = self.concat(self2Gram).concat(self3Gram);

        const distance = database.map(item => {

            const item2Gram = this.nGram(item.parts, 2);
            const item3Gram = this.nGram(item.parts, 3);
            const itemAll = item.parts.concat(item2Gram).concat(item3Gram);
            return {
                ...item,
                distance: jaccard.index(itemAll, selfAll),
            }
        });
        distance.sort((a, b) => {
            return b.distance - a.distance;
        });

        // console.log("self", distance);
        return distance;
    }

    generateSample () {
        const obj = this.generate();
        const allEntities = getEntities();
        const entityData = {};
        for (const o of allEntities) {
            entityData[o.entity] = o.data;
        }

        let sen = [];
        for (const o of obj.data) {
            if (o.name) {
                if (entityNames.indexOf(o.name) === -1) {
                    sen.push(o.text);
                } else if (entityData[o.name].length <= 0) {
                    sen.push(o.text);
                } else {
                    let has = false;
                    for (let i = 0; i < 10; i++) {
                        const ind = Math.floor(Math.random() * entityData[o.name].length);
                        const newText = entityData[o.name][ind];
                        if (typeof newText === "string" && newText !== o.text) {
                            sen.push(newText);
                            has = true;
                            break;
                        } else if (newText.join) {
                            const indSub = Math.floor(Math.random() * newText.length);
                            const nt = newText[indSub];
                            if (typeof nt === "string" && nt !== o.text) {
                                sen.push(nt);
                                has = true;
                                break;
                            }
                        }
                    }
                    if (!has) {
                        sen.push(o.text);
                    }
                }
            } else {
                sen.push(o.text);
            }
        }
        return sen.join("");
    }

    generate () {
        const { currentLabel, entities, domain, intent } = this.state;
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
            domain: domain.trim(),
            intent: intent.trim(),
            data: ret,
        };

        return obj;
    }

    showSelect () {
        const {
            selectedText, selectedStart, selectedEnd,
            entities,
        } = this.state;

        if (selectedText && selectedText.length) {
            return (
                <div>
                    已选择“{ selectedText }”，位置从 { selectedStart } 到 { selectedEnd }，
                    实体出现在上面↑才是真的添加成功了

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
                        placeholder="点击这里选择实体名称，或者输入新实体名称并回车"
                        data={entities.map(e => {
                            return {
                                text: e.name,
                                value: e.name,
                            };
                        })}
                        style={{
                            width: 500,
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
                    onSelect={ value => {
                        this.handleChange(value);
                        this.submit(null, value);
                    }}
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
                onSelect={ value => {
                    this.handleChange(value);
                    this.submit(null, value);
                }}
            />
        );
    }

}
