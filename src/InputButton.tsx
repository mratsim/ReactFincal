// InputButton.js
/// <reference path="../.vscode/typings/react-native/react-native.d.ts"/>


import React, { Component } from "react";
import {
    Text,
    TouchableHighlight,
} from "react-native";
import Style from "./Style";

// Typescript Interfaces
interface InpProps {
    highlight: any;
    onPress: any;
    value: any;
}

export default class InputButton extends Component<InpProps, {}> {

    render() {
        return (
            <TouchableHighlight style={[Style.inputButton, this.props.highlight ? Style.inputButtonHighlighted : null]}
                                underlayColor="#193441"
                                onPress={this.props.onPress}>
                <Text style={Style.inputButtonText}>{this.props.value}</Text>
            </TouchableHighlight>
        );
    }

}
