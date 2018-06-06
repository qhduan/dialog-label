import * as React from "react";
import { Link, Route, BrowserRouter as Router } from "react-router-dom";

const Home = () => (
    <div>
        Hello Home
        <Link to="/about">ToAbout</Link>
    </div>
);

const About = () => (
    <div>
        Hello About
        <Link to="/">ToHome</Link>
    </div>
);

export default class RootRouter extends React.Component {
    render() {
        return (
            <div>
                <h1>RootRouter</h1>
        
                <Router>
                    <div>
                        <Route path="/" exact component={Home} />
                        <Route path="/about" exact component={About} />
                    </div>
                </Router>
            </div>
        );
    }
}
