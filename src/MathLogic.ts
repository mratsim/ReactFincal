/// <reference path="../.vscode/typings/react-native/react-native.d.ts"/>
/// <reference path="../typings/globals/decimal.js/index.d.ts" />

import {CalcState} from "./ReactFincal";

import * as Decimal from "decimal.js";

// Implement peek for array (used as stack)
declare global {
    interface Array<T> {
        peek: () => T;
    }
}

Array.prototype.peek = function(): any {
  return this[this.length - 1];
};

type strnum = string | number

// Implement isNumeric check
const isNumeric = (n: any) => typeof n === "number" && !isNaN(n);

// Define Operations properties
export const mapButtons = new Map()
  // key, type //Note utiliser des champs nommés
  .set(1, ["digit"])
  .set(2, ["digit"])
  .set(3, ["digit"])
  .set(4, ["digit"])
  .set(5, ["digit"])
  .set(6, ["digit"])
  .set(7, ["digit"])
  .set(8, ["digit"])
  .set(9, ["digit"])
  .set(0, ["digit"])
  .set(".", ["decimalpoint"])
  // key, type, precedence/priority 1-->10, associativity
  .set("/", ["binary operator", 1, "left"])
  .set("*", ["binary operator", 1, "left"])
  .set("+", ["binary operator", 0, "left"])
  .set("-", ["binary operator", 0, "left"])
  .set("CE|C", ["reset"])
  .set("+|-", ["toggleSign"])
  .set("=", ["="])
  .set("(", ["("])
  .set(")", [")"]);

// Strings that are replaced on digit input
// "Parenthesis Mismatch"

// Operator/Operand logic
// Operations corresponding to Operators
const Operations = { // Need to precise Decimal otherwise JS complains about add/div/mul/sub not existing
"/": ([x, y, ...ys]: Iterable<number>) => [Decimal(y).div(x), ...ys],
"*": ([x, y, ...ys]: Iterable<number>) => [Decimal(y).times(x), ...ys],
"+": ([x, y, ...ys]: Iterable<number>) => [Decimal(y).plus(x), ...ys],
"-": ([x, y, ...ys]: Iterable<number>) => [Decimal(y).minus(x), ...ys]
};

// Calling those operations
const ApplyOp = (iniArr: strnum[], op: strnum) => isNumeric(Number(op)) ? [Decimal(Number(op)), ...iniArr] : Operations[op](iniArr);


export const opLogic = {
    "digit": (input: number, displayState: CalcState) => opDigit(input, displayState),
    "decimalpoint": (input: string, displayState: CalcState) => opDecPoint(input, displayState),
    "toggleSign": (input: string, displayState: CalcState) => opSign(input, displayState),
    "reset": (input: string, displayState: CalcState) => opReset(input, displayState),
    "binary operator": (input: string, displayState: CalcState) => opBin(input, displayState),
    "=": (input: string, displayState: CalcState) => opEqual(input, displayState),
    "(": (input: string, displayState: CalcState) => opLPar(input, displayState),
    ")": (input: string, displayState: CalcState) => opRPar(input, displayState)
};

const helperCheckPush = (displayState: CalcState) => {
    const {displayValue, infix} = displayState;
    if (infix.length > 0) {
        switch (infix.peek()) {
            case "=":
                displayState.infix = []; // if we just finished a compute, reset infix and RPN
                displayState.RPN = [];
                break;
            case ")":
                return displayState; // if we just had an ending parenthesis do not add again the previous value
        }
    }
    displayState.infix.push(displayValue);
    displayState.RPN.push(displayValue);
    return displayState;
};

const opDigit = (input: number, displayState: CalcState) => {
    const {displayValue, replaceDisplay} = displayState;

    if (!replaceDisplay) {
        displayState.displayValue = displayValue === "0" ? String(input) : displayValue + input;
    } else {
        displayState.displayValue = String(input);
        displayState.replaceDisplay = false;
    }
    return displayState;
};

const opDecPoint = (_: any, displayState: CalcState) => {
    const {displayValue} = displayState;
    if (!(/\./).test(displayValue)) {
        displayState.displayValue = displayValue + ".",
            displayState.replaceDisplay = false;
    }
    return displayState;
};

const opSign = (_: any, displayState: CalcState) => {
    const {displayValue} = displayState;
    const newValue = parseFloat(displayValue) * -1;

    displayState.displayValue = String(newValue);
    return displayState;
};

const opReset = (_: any, displayState: CalcState) => {
    displayState = {
        displayCalc: " ", // will be set properly in ReactFincal.js
        displayValue: "0",
        infix: [],
        RPN: [],
        stack: [],
        replaceDisplay: true
    };
    return displayState;
};

const opBin = (input: string, displayState: CalcState) => {
    const inpmap = mapButtons.get(input);

    displayState = helperCheckPush(displayState); // Check adjustment to infix and RPN display
    displayState.infix.push(input);

    // Left-associative operator : pop lower precedence op on the stack
    // Right-associative operator : pop equal or lower precedence op on the stack
    while (displayState.stack.length !== 0 &&
        (
            (inpmap[2] === "left" && inpmap[1] <= mapButtons.get(displayState.stack.peek())[1])
            ||
            (inpmap[2] === "right" && inpmap[1] < mapButtons.get(displayState.stack.peek())[1])
        )
    ) {
        displayState.RPN.push(displayState.stack.pop());
    }

    displayState.stack.push(input);
    displayState.replaceDisplay = true;
    return displayState;
};

const opEqual = (input: string, displayState: CalcState) => {
    displayState = helperCheckPush(displayState); // Check adjustment to infix and RPN display

    while (!(displayState.stack.length === 0)) {
        displayState.RPN.push(displayState.stack.pop());
    }

    // RPN computation
    let stackRPN = [];
    const result = displayState.RPN.reduce(ApplyOp, stackRPN)[0].toNumber();

    displayState.infix.push(input);

    displayState.displayValue = result;
    displayState.replaceDisplay = true;

    return displayState;
};

const opLPar = (input: string, displayState: CalcState) => {
    const {infix} = displayState;
    if (infix.length > 0 && infix.peek() === "=") {
        displayState.infix = []; // if we just finished a compute, reset infix and RPN
        displayState.RPN = []; // Helper function has extra functionnality
    }

    displayState.stack.push(input);
    displayState.infix.push(input);
    displayState.replaceDisplay = true;

    return displayState;
};

const opRPar = (input: string, displayState: CalcState) => {

    if (!displayState.stack.includes("(")) {
        alert("Parenthesis Mismatch");
        return opReset(input, displayState);
    }

    displayState = helperCheckPush(displayState);
    displayState.infix.push(input);

    while (displayState.stack.peek() !== "(") {
        displayState.RPN.push(displayState.stack.pop());
    }
    displayState.stack.pop();
    displayState.replaceDisplay = true;

    return displayState;
};