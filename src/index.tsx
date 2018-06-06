import * as React from "react";
import { render } from "react-dom";
import {AppContainer} from "react-hot-loader";
import RootRouter from "./components/RootRouter";


const rootEl = document.getElementById("root");

render(
    <AppContainer>
        <RootRouter />
    </AppContainer>,
    rootEl
);
