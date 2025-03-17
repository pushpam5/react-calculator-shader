import React, { useState, useEffect } from 'react';
import init, { calculate } from "rust-calculator";

function RustCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [wasmLoaded, setWasmLoaded] = useState(false);

  useEffect(() => {
    init().then(() => {
      setWasmLoaded(true);
    });
  }, []);

  const handleCalculate = async (event) => {
    event.preventDefault();
    if (wasmLoaded) {
      const calculationResult = calculate(expression);
      if (Number.isNaN(calculationResult)) {
        setResult("Invalid expression");
      }else{
        setResult(calculationResult);
      }
    }
  };

  return (
    <div className="calculator-tab">
      <h2>Evaluate Expressions</h2>
      <form onSubmit={handleCalculate}>
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="Enter expression (e.g., 2+2)"
        />
        <button type="submit" disabled={!expression || !wasmLoaded}>Calculate</button>
      </form>
      {(result !== '' || result === 0) && <div className="result">Result: {result}</div>}
    </div>
  );
}

export default RustCalculator; 