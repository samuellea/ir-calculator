import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    previous: null,
    input: '',
    total: undefined,
    operator: null,
    sum: '‎‎',
    flash: ''
  }

  updateTotal = (previous, operator, input) => {
    if (operator === '+') {
      return Math.round((previous + Number(input)) * 1e12) / 1e12
    }
    if (operator === '-') {
      return Math.round((previous - Number(input)) * 1e12) / 1e12
    }
    if (operator === '×') {
      return Math.round((previous * Number(input)) * 1e12) / 1e12
    }
    if (operator === '÷') {
      return Math.round((previous / Number(input)) * 1e12) / 1e12
    }
  }

  handleDigit = (event) => {
    const { value } = event.target;
    let { previous, input, operator, sum } = this.state;
    let updatedInput = input += value;

    if (operator === null) {
      this.setState({
        input: updatedInput
      })
    }

    this.setState({
      input: updatedInput,
      total: this.updateTotal(previous, operator, input),
      sum: sum += value
    })
  }


  handleOperator = (event) => {
    const { value } = event.target;
    let { input, total, previous, sum, operator } = this.state;
    let updatedPrevious;

    if (sum.endsWith(operator) && input === '') {
      this.setState({
        operator: value,
        sum: sum.slice(0, -1) + value
      })
    } else {

      if (total === undefined) {
        if (input !== '') {
          updatedPrevious = Number(input)
        } else {
          updatedPrevious = previous
        }
      } else {
        updatedPrevious = total
      }

      this.setState({
        operator: value,
        previous: updatedPrevious,
        input: '',
        sum: sum += value
      })
    }
  }

  handleDecimal = () => {
    let { input, sum } = this.state;
    let updatedInput;
    let updatedSum;

    if (!input.includes('.')) {
      if (input.length !== 0) {
        updatedInput = input += '.'
        updatedSum = sum += '.'
      } else {
        updatedInput = input += '0.'
        updatedSum = sum += '0.'
      }
      this.setState({
        input: updatedInput,
        sum: updatedSum
      })
    }
  }

  handleEquals = () => {
    let { sum, total, operator } = this.state;
    if (!sum.endsWith(operator) && operator !== null) {
      this.setState({
        sum: total.toString(),
        input: total.toString(),
        total: undefined,
        previous: null,
        operator: null,
      })
    }
  }

  handlePlusMinus = () => {
    let { input, sum, previous, operator } = this.state;

    if (!sum.endsWith(operator)) {
      let inputUpdated;
      let sumUpdated;

      if (input[0] !== '-') {
        inputUpdated = '-' + input; // -1.1
        let sumEnd = sum.match(/[/\*+-](\d+)$/g);
        if (sumEnd !== null) {
          sumUpdated = sum.slice(0, -sumEnd[0].slice(1).length) + '(-' + input;
        } else {
          sumUpdated = sum.slice(0, -(inputUpdated.length - 1)) + '(' + inputUpdated;
        }
      } else {
        inputUpdated = input.slice(1) // -9.2 becomes 9.2
        let sumEnd = sum.match(/\(-(\d*\.?\d*)$/g); // 
        if (sumEnd !== null) {
          sumUpdated = sum.slice(0, -sumEnd[0].length) + inputUpdated
        } else {
          sumUpdated = inputUpdated
        }
      }

      this.setState({
        input: inputUpdated,
        total: this.updateTotal(previous, operator, inputUpdated),
        sum: sumUpdated
      })
    }
  }

  handleClear = () => {
    this.setState({
      previous: null,
      input: '',
      total: undefined,
      operator: null,
      sum: '',
      flash: 'flash'
    }, () => {
      setTimeout(() => {
        this.setState({
          flash: ''
        })
      }, 500);
    })
  }

  render() {
    let { sum, total, flash } = this.state;
    return (
      <div className="App">
        <div className="calculator-container">
          <div className={`display ${flash}`}>
            <div className="main-display" style={{ fontSize: sum.length < 13 ? 42 : 28, top: sum.length < 35 ? '25%' : '10%' }}>{sum}</div>
            <div className="sub-display">{total}</div>
          </div>

          <div className="buttons">
            <button id="ac bold" className="bold" onClick={this.handleClear}>AC</button>
            <button id="plus-minus" className="bold" onClick={this.handlePlusMinus}>±</button>
            <button id="percent" className="bold">%</button>
            <button id="plus" className="operator" value="+" onClick={this.handleOperator}>+</button>

            <button id="one" value="1" onClick={this.handleDigit}>1</button>
            <button id="two" value="2" onClick={this.handleDigit}>2</button>
            <button id="three" value="3" onClick={this.handleDigit}>3</button>
            <button id="minus" className="operator" value="-" onClick={this.handleOperator}>-</button>

            <button id="four" value="4" onClick={this.handleDigit}>4 </button>
            <button id="five" value="5" onClick={this.handleDigit}>5</button>
            <button id="six" value="6" onClick={this.handleDigit}>6</button>
            <button id="multiply" className="operator" value="×" onClick={this.handleOperator}>×</button>

            <button id="seven" value="7" onClick={this.handleDigit}>7</button>
            <button id="eight" value="8" onClick={this.handleDigit}>8</button>
            <button id="nine" value="9" onClick={this.handleDigit}>9</button>
            <button id="divide" className="operator" value="÷" onClick={this.handleOperator}>÷</button>

            <button id="zero" value="0" onClick={this.handleDigit}>0</button>
            <button id="decimal" value="." onClick={this.handleDecimal}>.</button>
            <button id="equals" onClick={this.handleEquals}>=</button>

          </div>

        </div>
      </div>
    );
  }
}

export default App;
