import React, {Component} from "react";
import { render } from "react-dom";
import Nav from "./Nav";

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Nav />;
    }
}

const appDiv = document.getElementById('app');
render(<App />, appDiv);

