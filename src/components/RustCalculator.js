import React, { useState, useEffect } from 'react';
import init, { calculate } from "rust-calculator";

function RustCalculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [wasmLoaded, setWasmLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    init()
      .then(() => {
        setWasmLoaded(true);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load calculator module');
        setLoading(false);
      });
  }, []);

  const handleCalculate = async (event) => {
    event.preventDefault();
    
    if (!expression.trim()) {
      setError('Please enter an expression');
      return;
    }

    setError('');
    
    if (wasmLoaded) {
      try {
        const calculationResult = calculate(expression);
        
        if (Number.isNaN(calculationResult)) {
          setError("Invalid expression");
          return;
        }
        
        setResult(calculationResult);
        
      } catch (err) {
        setError("Calculation error: " + err.message);
      }
    } else {
      setError("Calculator not ready yet");
    }
  };

  const handleClearAll = () => {
    setExpression('');
    setResult('');
    setError('');
  };

  return (
    <div className="calculator-tab">
      <h2>Expression Calculator</h2>
      <p className="description">
        Enter mathematical expressions and calculate results
      </p>
      
      {loading ? (
        <div className="loading-message">
          <span className="loading-spinner">⟳</span>
          Loading calculator module...
        </div>
      ) : (
        <div className="calculator-container">
          <form onSubmit={handleCalculate}>
            <div className="input-wrapper">
              <input
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="Enter expression (e.g., 2+2)"
                className="calculator-input"
              />
              <div className="button-group">
                <button 
                  type="submit" 
                  disabled={!expression || !wasmLoaded}
                  className="primary-button"
                >
                  Calculate
                </button>
                <button 
                  type="button"
                  onClick={handleClearAll}
                  className="secondary-button"
                  disabled={!expression && !result}
                >
                  Clear
                </button>
              </div>
            </div>
          </form>

          {error && <div className="error-message">{error}</div>}

          {(result !== '' || result === 0) && (
            <div className="result-container">
              <div className="result">
                <span className="result-label">Result:</span>
                <span className="result-value">{result}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RustCalculator;