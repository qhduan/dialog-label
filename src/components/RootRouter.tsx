import * as React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import Label from "./Label";
import Home from "./Home";

export default class RootRouter extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Route path="/" exact component={Home} />
                    <Route path="/label" exact component={Label} />
                </div>
            </Router>
        );
    }
}
