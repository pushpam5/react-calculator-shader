import React, { useState, useEffect } from 'react';
import RustCalculator from './components/RustCalculator';
import TextToShader from './components/TextToShader';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('calculator');

  useEffect(() => {
    document.title = activeTab === 'calculator' ? 'Calculator' : 'Shader Studio';
  }, [activeTab]);

  return (
    <div className="App">
      <header>
        <h1>Calculator & Shader Generator</h1>
      </header>
      
      <div className="tabs">
        <button
          className={activeTab === 'calculator' ? 'active' : ''}
          onClick={() => setActiveTab('calculator')}
        >
          <span className="icon">🧮</span>
          Calculator
        </button>
        <button
          className={activeTab === 'shader' ? 'active' : ''}
          onClick={() => setActiveTab('shader')}
        >
          <span className="icon">🎨</span>
          Text to Shader
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'calculator' ? (
          <RustCalculator />
        ) : (
          <TextToShader />
        )}
      </div>
      
      <footer>
        <p>✨ View the source code on <a href="https://github.com/pushpam5/react-calculator-shader" target="_blank" rel="noopener noreferrer">GitHub</a></p>
      </footer>
    </div>
  );
}

export default App;