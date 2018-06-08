import * as React from "react";
import { Route, HashRouter as Router, Redirect } from "react-router-dom";
import { Row, Col, Menu, Button, Icon, Popconfirm } from "antd";
const { Item } = Menu;
import "antd/dist/antd.css";
import * as yaml from "js-yaml";
import { saveAs } from "file-saver";

import { getSentences } from "./sentences";
import { getEntities } from "./entities";

import Label from "./Label";
import Home from "./Home";
import LabelList from "./LabelList";
import SlotList from "./SlotList";
import Slot from "./Slot";

export default class RootRouter extends React.Component {

    state = {
        redirect: null,
        currentMenu: null,
    }

    handleClick = (e) => {
        this.setState({
            redirect: e.key,
            currentMenu: e.key,
        });
    }

    componentDidMount () {
        const menus = [
            [/\/labels/, "/labels"],
            [/\/slots/, "/slots"],
        ];
        for (const m of menus) {
            if (document.URL.match(m[0])) {
                this.setState({
                    currentMenu: m[1]
                });
                return;
            }
        }
        this.setState({
            currentMenu: "/"
        });
    }

    componentDidUpdate () {
        if (this.state.redirect) {
            this.setState({
                redirect: null
            });
        }
    }

    exportClick = () => {
        const data = getSentences().concat(getEntities());
        const dump = yaml.safeDump(data);
        // console.log(dump);
        const getDate = () => {
            const t = new Date();
            t.setMinutes(t.getMinutes() - t.getTimezoneOffset())
            return t.toJSON().substring(0, 16).replace(/T|:|-/g, "");
        };
        const file = new File(
            [dump],
            `dialog_data_${getDate()}.yml`,
            {
                type: "text/plain;charset=utf-8",
            }
        );
        saveAs(file);
    }

    deleteAll = e => {
        localStorage.removeItem("sentences");
        localStorage.removeItem("entities");
        this.setState({
            redirect: "/"
        });
    }

    render() {
        const { redirect, currentMenu } = this.state;
        let selectedKeys = [];
        if (currentMenu) {
            selectedKeys = [currentMenu];
        }
        return (
            <Router>
                <div>
                    {redirect ? <Redirect to={ redirect } /> : null}
                    <header style={{ marginBottom: "10px" }}>
                        <Row>
                            <Col span={18} offset={3}>

                                <Button
                                    style={{
                                        float: "right",
                                        marginTop: "7px",
                                    }}
                                    onClick={this.exportClick}
                                >
                                    <Icon type="download" />
                                    导出
                                </Button>

                                <Popconfirm
                                    title="危险操作！会清空所有浏览器保存的内容！"
                                    onConfirm={this.deleteAll}
                                >
                                    <Button
                                        style={{
                                            float: "right",
                                            marginTop: "7px",
                                            marginRight: "20px",
                                        }}
                                    >
                                        <Icon type="delete" />
                                        清空
                                    </Button>
                                </Popconfirm>

                                <Menu
                                    selectedKeys={selectedKeys}
                                    mode="horizontal"
                                    onClick={this.handleClick}
                                    style={{
                                        fontSize: "20px"
                                    }}
                                >
                                    <Item key="/">
                                        导入
                                    </Item>
                                    <Item key="/labels">
                                        意图
                                    </Item>
                                    <Item key="/slots">
                                        实体
                                    </Item>
                                </Menu>
                            </Col>
                        </Row>
                    </header>
                    <Route path="/" exact component={Home} />
                    <Route path="/label/:label" exact component={Label} />
                    <Route path="/label/:filter/:label" exact component={Label} />
                    <Route path="/labels" exact component={LabelList} />
                    <Route path="/labels/:text" exact component={LabelList} />
                    <Route path="/slots" exact component={SlotList} />
                    <Route path="/slot/:entity" exact component={Slot} />
                </div>
            </Router>
        );
    }
}
