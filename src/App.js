import React, { useState, useEffect } from 'react';
import RustCalculator from './components/RustCalculator';
import TextToShader from './components/TextToShader';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('calculator');

  useEffect(() => {
    document.title = activeTab === 'calculator' ? 'Calculator' : 'Shader';
  }, [activeTab]);

  return (
    <div className="App">
      <div className="tabs">
        <button 
          className={activeTab === 'calculator' ? 'active' : ''} 
          onClick={() => setActiveTab('calculator')}
        >
          Calculator
        </button>
        <button 
          className={activeTab === 'shader' ? 'active' : ''} 
          onClick={() => setActiveTab('shader')}
        >
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
    </div>
  );
}

export default App;
