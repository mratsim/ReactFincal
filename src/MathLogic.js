var Decimal = require('decimal.js');

// Implement peek for array (used as stack)
Array.prototype.peek = function () {
  return this[this.length - 1];
}

// Implement isNumeric check
const isNumeric = n => typeof n === "number" && !isNaN(n)

//Define Operations preperties
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
  .set('.', ["decimalpoint"])
  // key, type, precedence/priority 1-->10, associativity
  .set('/', ["binary operator", 1, "left"])
  .set('*', ["binary operator", 1, "left"])
  .set('+', ["binary operator", 0, "left"])
  .set('-', ["binary operator", 0, "left"])
  .set('CE|C', ["reset"])
  .set('+|-', ["toggleSign"])
  .set('=', ["="])
  .set('(', ["("])
  .set(')',[')']);

//Strings that are replaced on digit input
//"Parenthesis Mismatch"

// Operator/Operand logic
//Operations corresponding to Operators
const Operations = { //Need to precise Decimal otherwise JS complains about add/div/mul/sub not existing
'/': ([x,y, ...ys]) => [Decimal(y).div(x),...ys],
'*': ([x,y, ...ys]) => [Decimal(y).mul(x),...ys],
'+': ([x,y, ...ys]) => [Decimal(y).add(x),...ys],
'-': ([x,y, ...ys]) => [Decimal(y).sub(x),...ys]
};

//Calling those operations
const ApplyOp = (iniArr, op) => isNumeric(Number(op)) ? [Decimal(Number(op)),...iniArr] : Operations[op](iniArr);


export const opLogic = {
    'digit': (input, displayState) => opDigit(input, displayState),
    'decimalpoint': (input,displayState) => opDecPoint(input, displayState),
    'toggleSign': (input,displayState) => opSign(input, displayState),
    'reset': (input,displayState) => opReset(input, displayState),
    'binary operator': (input,displayState) => opBin(input, displayState),
    '=': (input,displayState) => opEqual(input, displayState),
    '(': (input,displayState) => opLPar(input, displayState),
    ')': (input,displayState) => opRPar(input, displayState)
};

const helperCheckPush = (displayState) => {
        const {displayValue,infix} = displayState
        if (infix.length>0) {
            switch (infix.peek()) {
                case '=':
                    displayState.infix = [] //if we just finished a compute, reset infix and RPN
                    displayState.RPN   = []
                    break;
                case ')':
                    return displayState; //if we just had an ending parenthesis do not add again the previous value
            }
        }
        displayState.infix.push(displayValue)
        displayState.RPN.push(displayValue)
        return displayState;
}

const opDigit = (input,displayState) => {
          const {displayValue, replaceDisplay} = displayState

                    if (!replaceDisplay) {
                        displayState.displayValue = displayValue === '0' ? String(input) : displayValue + input
                    } else {
                          displayState.displayValue = String(input)
                          displayState.replaceDisplay = false
                    }
          return displayState;
};

const opDecPoint = (_,displayState) => {
        const {displayValue} = displayState
        if (!(/\./).test(displayValue)) {
            displayState.displayValue = displayValue + '.',
            displayState.replaceDisplay = false
        }
        return displayState;
};

const opSign = (_,displayState) => {
        const {displayValue} = displayState
        const newValue = parseFloat(displayValue) * -1

        displayState.displayValue= String(newValue)
        return displayState;
};

const opReset = (_,displayState) => {

          displayState = {
            displayCalc:"",
            displayValue: "0",
            infix: [],
            RPN: [],
            stack: [],
            replaceDisplay: true
          }
        
        return displayState;
};

const opBin = (input,displayState) => {
        const inpmap = mapButtons.get(input)

        displayState = helperCheckPush(displayState) //Check adjustment to infix and RPN display
        displayState.infix.push(input)

        //Left-associative operator : pop lower precedence op on the stack
        //Right-associative operator : pop equal or lower precedence op on the stack
        while (displayState.stack.length != 0 &&
          (
            (inpmap[2] == 'left' && inpmap[1] <= mapButtons.get(displayState.stack.peek())[1])
            ||
            (inpmap[2] == 'right' && inpmap[1] < mapButtons.get(displayState.stack.peek())[1])
          )
        ) {
          displayState.RPN.push(displayState.stack.pop());
        }

        displayState.stack.push(input)

          displayState.displayCalc = 'Classic: ' + displayState.infix.join(" ") + ' | RPN: ' + displayState.RPN.join(" ")
          displayState.replaceDisplay = true
        
        return displayState;
};

const opEqual = (input,displayState) => {

        displayState = helperCheckPush(displayState) //Check adjustment to infix and RPN display

        while (!(displayState.stack.length == 0)) {
          displayState.RPN.push(displayState.stack.pop());
        }

        //RPN computation
        var stackRPN = []
        const result = displayState.RPN.reduce(ApplyOp,stackRPN)[0].toNumber()

        displayState.infix.push(input)

          displayState.displayCalc = 'Classic: ' + displayState.infix.join(" ") + ' | RPN: ' + displayState.RPN.join(" ")
          displayState.displayValue = result
          displayState.replaceDisplay = true
        
        return displayState;
};

const opLPar = (input,displayState) => {
    const {infix} = displayState
    if (infix.length>0 && infix.peek()=='=') {
                    displayState.infix = [] //if we just finished a compute, reset infix and RPN
                    displayState.RPN   = [] //Helper function has extra functionnality
    }

    displayState.stack.push(input)
    displayState.infix.push(input)
    displayState.replaceDisplay = true

    return displayState;
};

const opRPar = (input,displayState) => {

    if (!displayState.stack.includes("(")) {
        alert("Parenthesis Mismatch")
        return opReset(input,displayState);
    }

    displayState = helperCheckPush(displayState)
    displayState.infix.push(input)

    while (displayState.stack.peek()!='(') {
        displayState.RPN.push(displayState.stack.pop());
    }
    displayState.stack.pop()


    displayState.displayCalc = 'Classic: ' + displayState.infix.join(" ") + ' | RPN: ' + displayState.RPN.join(" ")
    displayState.replaceDisplay = true

    return displayState;
};