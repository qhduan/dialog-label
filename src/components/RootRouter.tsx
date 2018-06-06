import * as React from "react";
import { Route, HashRouter as Router } from "react-router-dom";
import Label from "./Label";
import Home from "./Home";
import LabelList from "./LabelList";
import SlotList from "./SlotList";
import Slot from "./Slot";
import "antd/dist/antd.css";

export default class RootRouter extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Route path="/" exact component={Home} />
                    <Route path="/label/:label" exact component={Label} />
                    <Route path="/labels" exact component={LabelList} />
                    <Route path="/slots" exact component={SlotList} />
                    <Route path="/slot/:entity" exact component={Slot} />
                </div>
            </Router>
        );
    }
}
