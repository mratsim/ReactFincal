import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    AppRegistry
} from 'react-native';
import Style from './Style';
import InputButton from './InputButton';

var Decimal = require('decimal.js');

// Define the input buttons that will be displayed in the calculator.
const inputButtons = [
    [1, 2, 3, '/'],
    [4, 5, 6, '*'],
    [7, 8, 9, '-'],
    [0, '.', '=', '+']
];

// key, type, precedence/priority 1-->10, associativity
const  mapButtons = new Map()
  .set(1,"digit","","")
  .set(2,"digit","","")
  .set(3,"digit","","")
  .set(4,"digit","","")
  .set(5,"digit","","")
  .set(6,"digit","","")
  .set(7,"digit","","")
  .set(8,"digit","","")
  .set(9,"digit","","")
  .set('/',"binary operator",1,"left")
  .set('*',"binary operator",1,"left")
  .set('+',"binary operator",0,"left")
  .set('-',"binary operator",0,"left");

class ReactFincal extends Component {
  render() {
    return (
      <View style={Style.rootContainer}>
        <View style={Style.displayContainer}>
            <Text style={Style.displayText}>{this.state.inputValue}</Text>
        </View>
        <View style={Style.inputContainer}>
            {this._renderInputButtons()}
        </View>
      </View>
    )
  }

  /**
   * For each row in `inputButtons`, create a row View and add create an InputButton for each input in the row.
   */
  _renderInputButtons() {
      let views = [];

      views = inputButtons.map ( nested =>
          <View style={Style.inputRow} key={nested[0]}>
            {nested.map ( input => <InputButton value={input}
                                  key={input}
                                  highlight={this.state.selectedSymbol === input}
                                  onPress={this._onInputButtonPressed.bind(this, input)} /> )}
          </View>);

      return views;
  }

  constructor(props) {
      super(props);

      this.state = {
          inputValue: 0
      }
  }

  _onInputButtonPressed(input) {
    switch (typeof input) {
        case 'number':
            return this._handleNumberInput(input)
        case 'string':
            return this._handleStringInput(input)
    }
  }

_handleNumberInput(num) {
    let inputValue = (this.state.inputValue * 10) + num;

    this.setState({
        inputValue: inputValue
    })
  }

  _handleStringInput(str) {
    switch (str) {
        case '/':
        case '*':
        case '+':
        case '-':
            this.setState({
                selectedSymbol: str,
                previousInputValue: this.state.inputValue,
                inputValue: 0
            });
            break;

        case '=':
                let symbol = this.state.selectedSymbol,
                    inputValue = this.state.inputValue,
                    previousInputValue = this.state.previousInputValue;

                if (!symbol) {
                    return;
                }

                this.setState({
                    previousInputValue: 0,
                    inputValue: eval(previousInputValue + symbol + inputValue),
                    selectedSymbol: null
                });
                break;
    }
  }
}
AppRegistry.registerComponent('ReactFincal', () => ReactFincal);
