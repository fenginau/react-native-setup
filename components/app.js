import React from 'react';
import Navigator from './navigator';
import { Root } from "native-base";

export default class App extends React.Component {
    render() {
        return (
            <Root>
                <Navigator />
            </Root>
        );
    }
}
