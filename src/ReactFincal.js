import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  AppRegistry
} from 'react-native';
import Style from './Style';
import InputButton from './InputButton';
import {
  opLogic,
  mapButtons
} from './MathLogic';

// Define the input buttons that will be displayed in the calculator.
const inputButtons = [
  [1, 2, 3, '/'],
  [4, 5, 6, '*'],
  [7, 8, 9, '-'],
  [0, '.', '+|-', '+'],
  ['CE|C', '(',')','=']
];

export default class ReactFincal extends Component {
  render() {
    return (
      <View style={Style.rootContainer}>
        <View style={Style.displayCalculus}>
          <Text style={Style.displayCalcTxt}>{this.state.displayCalc}</Text>
        </View>
        <View style={Style.displayContainer}>
          <Text style={Style.displayText}>{this.state.displayValue}</Text>
        </View>
        <View style={Style.inputContainer}>
          {this._renderInputButtons() }
        </View>
      </View>
    )
  }

  /**
   * For each row in `inputButtons`, create a row View and add create an InputButton for each input in the row.
   */
  _renderInputButtons() {
    let views = [];

    views = inputButtons.map(nested =>
      <View style={Style.inputRow} key={nested[0]}>
        {nested.map(input => <InputButton value={input}
          key={input}
          highlight={this.state.selectedSymbol === input}
          onPress={this._onInputButtonPressed.bind(this, input) } />) }
      </View>);

    return views;
  }

  constructor(props) {
    super(props);

    this.state = {
      displayCalc: "",
      displayValue: "0",
      infix: [],
      RPN: [],
      stack: [],
      replaceDisplay: true
    }
  }

  _onInputButtonPressed(input) {
    const opType = (mapButtons.get(input))[0]
    this.setState(opLogic[opType](input,this.state))
  }
}
AppRegistry.registerComponent('ReactFincal', () => ReactFincal);
