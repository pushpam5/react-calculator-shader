import React, { useState, useRef, useEffect } from 'react';

const TextToShader = () => {
  const [prompt, setPrompt] = useState('');
  const [shaderCode, setShaderCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const API_URL = process.env.API_ENDPOINT || 'http://localhost:4000';

  const vertexShaderSource = `#version 300 es
    in vec4 aVertexPosition;
    void main() {
      gl_Position = aVertexPosition;
    }
  `;

  // Initialize WebGL context
  const initGL = () => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL not supported');
      return false;
    }

    glRef.current = gl;
    return true;
  };

  // Compile shader
  const compileShader = (gl, source, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  // Create shader program
  const createShaderProgram = (gl, vertexShaderSource, fragmentShaderSource) => {
    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  };

  // Set up geometry (a simple quad covering the entire canvas)
  const setupGeometry = (gl) => {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Create a quad that covers the entire clip space
    const positions = [
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    return positionBuffer;
  };

  // Render the shader
  const renderShader = () => {
    const gl = glRef.current;
    if (!gl || !programRef.current) return;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(programRef.current);

    // Set up position attribute
    const positionBuffer = setupGeometry(gl);
    const positionAttributeLocation = gl.getAttribLocation(programRef.current, 'aVertexPosition');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Set uniform values if needed
    const timeUniformLocation = gl.getUniformLocation(programRef.current, 'uTime');
    if (timeUniformLocation) {
      const currentTime = (Date.now() - startTimeRef.current) / 1000.0;
      gl.uniform1f(timeUniformLocation, currentTime);
    }

    const resolutionUniformLocation = gl.getUniformLocation(programRef.current, 'uResolution');
    if (resolutionUniformLocation) {
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    }

    // Draw the quad
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Request next frame
    animationRef.current = requestAnimationFrame(renderShader);
  };

  // Initialize or update shader when shaderCode changes
  useEffect(() => {
    if (!shaderCode) return;

    // Initialize WebGL if not already done
    if (!glRef.current && !initGL()) return;

    const gl = glRef.current;

    // Clean up previous program if it exists
    if (programRef.current) {
      gl.deleteProgram(programRef.current);
    }

    // Create new shader program
    programRef.current = createShaderProgram(gl, vertexShaderSource, shaderCode);
    
    if (programRef.current) {
      // Reset animation time
      startTimeRef.current = Date.now();
      
      // Start rendering
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      renderShader();
    }

    // Cleanup on unmount or when shader changes
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  },);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (programRef.current && glRef.current) {
        glRef.current.deleteProgram(programRef.current);
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Set loading state to true
    setLoading(true);
    // Fetch shader from API
    fetch(`${API_URL}/api/shader`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt
      }),
    })
      .then(response => {
        console.log(response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setShaderCode(data.shader);
        setLoading(false); // Set loading to false on success
      })
      .catch(error => {
        console.error('Error fetching shader:', error);
        setLoading(false); // Set loading to false on error
        // Handle error - maybe set an error state to display to user
      });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(shaderCode)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy code: ', err);
      });
  };

  return (
    <div className="shader-tab">
      <h2>Text-to-Shader</h2>
      
      <div>
        <div>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)} 
              placeholder="Describe the shader you wish to render e.g. A rotating cube with a gradient background" 
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Shader'}
            </button>
          </form>

          {shaderCode && (
            <div className="shader-output-container">
              <div className="output-section preview-section">
                <h3>Shader Preview:</h3>
                <canvas 
                  ref={canvasRef} 
                  width="300" 
                  height="300"
                ></canvas>
              </div>

              <div className="output-section code-section">
                <h3>Shader Code Snippet:</h3>
                <div className="code-container">
                  <button 
                    className="copy-button" 
                    onClick={handleCopyCode}
                    title="Copy to clipboard"
                  >
                    {copySuccess ? '✓' : 'Copy'}
                  </button>
                  <pre>
                    {shaderCode}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextToShader;