import * as React from "react";
import { Link } from "react-router-dom";

export default class Home extends React.Component {

    render () {
        return (
            <div>
                <h1>Home Page</h1>
                <Link to="/label">to Label</Link>
            </div>
        );
    }
    
}