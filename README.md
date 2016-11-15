# ReactFincal

There are very few financial calculators on the app store, and the one that exists are either destined to the general public or for experts, use BA-II+ or HP-12C UI.
There is a billion dollar opportunity there to transform the financial calculator business.

Or not ...

In any case, I wanted a pretext to learn mobile dev. I considered other frameworks:
* PhoneGap, Ionic, Cordova ... : rejected due to non-native
* Flutter.io: not mature enough
* Vue.js + Weex: didn't know about that

And choose React Native. Then I found a great tutorial [here](https://kylewbanks.com/blog/react-native-tutorial-part-1-hello-react).
As things were too easy with a great tuto, I decided to do the extra mile and use React Native with Typescript.
And that wasn't enough, with my setup you should be abe to debug variables and set breakpoints in Visual Studio Code.


So what do you have :
- The same bare bone UI as in Kyle Bank tuto
- The same basic functionalities:
    * build on iOS and Android
    * Touch interface
        * Highlighting of active computation
- Proper operator precedence, parenthesis included
- Display of the current operation in Classic and Reverse Polish Notation
- Support for arbitrary precision via Decimal.js.
    Otherwise
    > (.2 + .1) * 10 == 3
    >
    > evaluates to false.


What can you learn ?
* How to manage operator precedence via a subjectively beautiful and handcrafted [Shunting-Yard Algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm)
* Reduce/Fold a Reverse Polish Notation expression in one liner and avoid
a if/then/elseif or case mess (if "+" then elseif "-" then ...)
    * Thank you ES6 destructuring, I haz Haskell list desctructuring in JS :
        > const Operations = {
        >
        > "/": ([x, y, ...ys]: Iterable<number>) => [Decimal(y).div(x), ...ys],
        >
        > "*": ([x, y, ...ys]: Iterable<number>) => [Decimal(y).times(x), ...ys],
        >
        > "+": ([x, y, ...ys]: Iterable<number>) => [Decimal(y).plus(x), ...ys],
        >
        > "-": ([x, y, ...ys]: Iterable<number>) => [Decimal(y).minus(x), ...ys]
        >
        > };
* React Native + Typescript setup


Next :
* Implement TVM (Time Value of Money) functions in JS.
    * Kind of stump on the Interest function. it's the i that solves this equation:
    ![](http://www.getobjects.com/Graphics/zero.gif)
    Where:
        * PV = Present Value
        * ip = Interest Rate per period
        * N = Number of periods
        * PMT = Payment
        * k = 1 if payment is made at the end of the period; 1 + ip if made at the beginning of the period
        * FV = Future Value
* Add useful functions : cos, ln, power
* Add Irregular Cashflows, NPV, IRR
* Add Amortization/Depreciation schedule
* Work on UI, maybe calculator mode and various othe rmodes (TVM, loan ...)
* Display/modify previous computations
