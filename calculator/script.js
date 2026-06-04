console.log("testing update");
class Calculator {
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.waitingForNewValue = false;
    }

    delete() {
        // iPhone doesn't traditionally have a backspace button on the UI,
        // but we'll support it via keyboard.
        if (this.currentOperand.length > 1) {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        } else {
            this.currentOperand = '0';
        }
    }

    appendNumber(number) {
        if (this.waitingForNewValue) {
            this.currentOperand = number.toString();
            this.waitingForNewValue = false;
        } else {
            if (number === '.' && this.currentOperand.includes('.')) return;
            if (this.currentOperand === '0' && number !== '.') {
                this.currentOperand = number.toString();
            } else {
                // limit digits on screen to somewhat mimic iPhone
                if (this.currentOperand.replace('.', '').length < 9) {
                    this.currentOperand = this.currentOperand.toString() + number.toString();
                }
            }
        }
    }

    toggleSign() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.toString().startsWith('-')) {
            this.currentOperand = this.currentOperand.toString().slice(1);
        } else {
            this.currentOperand = '-' + this.currentOperand.toString();
        }
    }

    calculatePercentage() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === 'Error') this.clear();
        
        if (this.previousOperand !== '' && !this.waitingForNewValue) {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.waitingForNewValue = true;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.operation = undefined;
                    this.previousOperand = '';
                    this.waitingForNewValue = true;
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Handle floating point precision issues
        computation = Math.round(computation * 100000000) / 100000000;
        
        // Convert to exponential if it's too large
        if (computation.toString().replace('.', '').length > 9) {
            this.currentOperand = computation.toPrecision(6).toString();
        } else {
            this.currentOperand = computation.toString();
        }
        
        this.operation = undefined;
        this.previousOperand = '';
        this.waitingForNewValue = true;
    }

    updateDisplay() {
        // Adjust font size based on length
        if (this.currentOperand.length > 7) {
            this.displayElement.style.fontSize = '3.5rem';
        } else if (this.currentOperand.length > 5) {
            this.displayElement.style.fontSize = '4.5rem';
        } else {
            this.displayElement.style.fontSize = '5rem';
        }

        // Format number with commas
        if (this.currentOperand === 'Error') {
            this.displayElement.innerText = 'Error';
        } else {
            const stringNumber = this.currentOperand.toString();
            // check if it's exponential
            if (stringNumber.includes('e')) {
                this.displayElement.innerText = stringNumber;
            } else {
                const integerDigits = parseFloat(stringNumber.split('.')[0]);
                const decimalDigits = stringNumber.split('.')[1];
                let integerDisplay;
                if (isNaN(integerDigits)) {
                    integerDisplay = '0';
                } else {
                    integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
                }
                
                if (decimalDigits != null) {
                    this.displayElement.innerText = `${integerDisplay}.${decimalDigits}`;
                } else {
                    this.displayElement.innerText = integerDisplay;
                }
            }
        }

        // Change AC to C if we have a current operand that is not 0 and not waiting for new value
        const clearBtn = document.getElementById('clear');
        if (this.currentOperand !== '0' && !this.waitingForNewValue) {
            clearBtn.innerText = 'C';
        } else {
            clearBtn.innerText = 'AC';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const displayElement = document.getElementById('display');
    const calculator = new Calculator(displayElement);

    const numberButtons = document.querySelectorAll('.number');
    const operationButtons = document.querySelectorAll('.operator:not(.equals)');
    const equalsButton = document.getElementById('equals');
    const clearButton = document.getElementById('clear');
    const signButton = document.getElementById('sign');
    const percentButton = document.getElementById('percent');

    function removeActiveOperators() {
        operationButtons.forEach(btn => btn.classList.remove('active'));
    }

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            removeActiveOperators();
            calculator.appendNumber(button.innerText);
            calculator.updateDisplay();
        });
    });

    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            removeActiveOperators();
            button.classList.add('active'); // highlight the operation being used
            calculator.chooseOperation(button.getAttribute('data-action'));
            calculator.updateDisplay();
        });
    });

    equalsButton.addEventListener('click', () => {
        removeActiveOperators();
        calculator.compute();
        calculator.updateDisplay();
    });

    clearButton.addEventListener('click', () => {
        removeActiveOperators();
        calculator.clear();
        calculator.updateDisplay();
    });

    signButton.addEventListener('click', () => {
        calculator.toggleSign();
        calculator.updateDisplay();
    });

    percentButton.addEventListener('click', () => {
        calculator.calculatePercentage();
        calculator.updateDisplay();
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key >= 0 && e.key <= 9 || e.key === '.') {
            removeActiveOperators();
            calculator.appendNumber(e.key);
            calculator.updateDisplay();
        }
        if (e.key === '=' || e.key === 'Enter') {
            e.preventDefault();
            removeActiveOperators();
            calculator.compute();
            calculator.updateDisplay();
        }
        if (e.key === 'Backspace') {
            calculator.delete();
            calculator.updateDisplay();
        }
        if (e.key === 'Escape') {
            removeActiveOperators();
            calculator.clear();
            calculator.updateDisplay();
        }
        if (e.key === '+' || e.key === '-') {
            removeActiveOperators();
            calculator.chooseOperation(e.key);
            calculator.updateDisplay();
            
            // visually highlight operator
            const btn = document.querySelector(`.operator[data-action="${e.key}"]`);
            if (btn) btn.classList.add('active');
        }
        if (e.key === '*' || e.key === 'x') {
            removeActiveOperators();
            calculator.chooseOperation('×');
            calculator.updateDisplay();
            const btn = document.querySelector(`.operator[data-action="×"]`);
            if (btn) btn.classList.add('active');
        }
        if (e.key === '/') {
            e.preventDefault();
            removeActiveOperators();
            calculator.chooseOperation('÷');
            calculator.updateDisplay();
            const btn = document.querySelector(`.operator[data-action="÷"]`);
            if (btn) btn.classList.add('active');
        }
        if (e.key === '%') {
            calculator.calculatePercentage();
            calculator.updateDisplay();
        }
    });
});
