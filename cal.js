// Basic calculator logic wired to the DOM in index.html

(function () {
  const previousOperandTextElement = document.getElementById('previous-operand');
  const currentOperandTextElement = document.getElementById('current-operand');

  const numberButtons = document.querySelectorAll('.buttons .number');
  const operationButtons = document.querySelectorAll('.buttons .operator');
  const equalsButton = document.querySelector('.buttons .equals');
  const deleteButton = document.querySelector('.buttons .delete');
  const allClearButton = document.querySelector('.buttons .clear');
  const percentButton = document.querySelector('.buttons .percent');

  let currentOperand = '0';
  let previousOperand = '';
  let operation = undefined;

  function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
  }

  function deleteLast() {
    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
      currentOperand = '0';
    } else {
      currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
  }

  function appendNumber(numChar) {
    if (numChar === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && numChar !== '.') {
      currentOperand = String(numChar);
    } else {
      currentOperand = currentOperand + String(numChar);
    }
    updateDisplay();
  }

  function chooseOperation(opChar) {
    if (currentOperand === '' || currentOperand === '.') return;
    if (operation != null && previousOperand !== '') {
      compute();
    }
    operation = opChar;
    previousOperand = currentOperand;
    currentOperand = '0';
    updateDisplay();
  }

  function compute() {
    const prev = parseFloat(previousOperand);
    const curr = parseFloat(currentOperand);
    if (Number.isNaN(prev) || Number.isNaN(curr)) return;

    let result;
    switch (operation) {
      case '+':
        result = prev + curr;
        break;
      case '-':
        result = prev - curr;
        break;
      case '×':
      case '*':
        result = prev * curr;
        break;
      case '÷':
      case '/':
        if (curr === 0) {
          result = 'Error';
        } else {
          result = prev / curr;
        }
        break;
      default:
        return;
    }

    currentOperand = String(result);
    operation = undefined;
    previousOperand = '';
    updateDisplay();
  }

  function formatNumberForDisplay(numberString) {
    if (numberString === 'Error') return 'Error';
    const [integerPart, decimalPart] = String(numberString).split('.');
    const integerDisplay = Number.isNaN(parseFloat(integerPart))
      ? ''
      : parseInt(integerPart, 10).toLocaleString('en', { maximumFractionDigits: 0 });
    return decimalPart != null ? `${integerDisplay}.${decimalPart}` : integerDisplay;
  }

  function updateDisplay() {
    currentOperandTextElement.textContent = formatNumberForDisplay(currentOperand);
    if (operation != null && previousOperand !== '') {
      previousOperandTextElement.textContent = `${formatNumberForDisplay(previousOperand)} ${operation}`;
    } else {
      previousOperandTextElement.textContent = '';
    }
  }

  function applyPercent() {
    const curr = parseFloat(currentOperand);
    if (Number.isNaN(curr)) return;

    if (previousOperand !== '' && operation != null) {
      const prev = parseFloat(previousOperand);
      if (operation === '+' || operation === '-') {
        currentOperand = String((prev * curr) / 100);
      } else if (operation === '×' || operation === '*' || operation === '÷' || operation === '/') {
        currentOperand = String(curr / 100);
      } else {
        currentOperand = String(curr / 100);
      }
    } else {
      currentOperand = String(curr / 100);
    }
    updateDisplay();
  }

  // Wire up events
  numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
      appendNumber(button.textContent.trim());
    });
  });

  operationButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const raw = button.textContent.trim();
      const mapped = raw === '÷' ? '÷' : raw === '×' ? '×' : raw;
      chooseOperation(mapped);
    });
  });

  if (equalsButton) {
    equalsButton.addEventListener('click', () => compute());
  }

  if (allClearButton) {
    allClearButton.addEventListener('click', () => clearAll());
  }

  if (deleteButton) {
    deleteButton.addEventListener('click', () => deleteLast());
  }

  if (percentButton) {
    percentButton.addEventListener('click', () => applyPercent());
  }

  // Initialize display
  updateDisplay();
})();


