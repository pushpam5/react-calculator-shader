# Rust-WASM Calculator and WebGL Shader Generator

A React application that combines WebGL shader generation and Rust-powered calculator.

## Features

### Text to Shader Generator
- Transform text descriptions into WebGL shaders
- Real-time shader preview in the browser
- Copy generated shader code with a single click

### Rust-Powered Calculator
- Fast mathematical expression evaluation using WebAssembly
- Supports operations: addition, subtraction, multiplication, division, modulo, and exponentiation
- Handles parenthesized expressions for complex calculations
- Precise results rounded to 5 decimal places

## Technologies Used

- **Frontend**: React
- **WebGL**: WebGL 2.0 for shader rendering
- **WebAssembly**: Rust compiled to WASM for calculations
- **Backend API**: REST API written in Elixir which makes LLM calls with given prompt

## Getting Started

### Prerequisites
- Node.js
- Rust and wasm-pack (for development of the calculator module)

### Installation

1. Clone the repository
   ```
   git clone git@github.com:pushpam5/react-calculator-shader.git
   cd react-calculator-shader
   ```

2. Build the WebAssembly module
   ```
   npm run build:wasm
   ```

3. Install dependencies
   ```
   npm install
   ```

4. Start the development server
   ```
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser

## Developing the Rust Calculator

If you want to modify the Rust calculator component:

1. Navigate to the `rust-calculator` directory
2. Make your changes to the Rust code
3. Build the WASM module:
   ```
   npm run build:wasm
   ```
4. The compiled WASM will be available for the React app to use

## API Server Setup

The Text to Shader feature requires a backend API that generates GLSL shader code from text descriptions. To set this up:

1. See the backend repository at [Elixir Shader]([https://github.com/pushpam5/elixir-shader)
2. Follow the installation instructions there
3. Make sure the API is running on the URL http://localhost:4000

## Usage

### Calculator Tab
1. Enter a mathematical expression in the input field (e.g., `2+2`, `(3+4)*2`, `2^3`)
2. Click "Calculate" to see the result

### Text to Shader Tab
1. Enter a description of the desired visual effect in the input field
2. Click "Generate Shader" and wait for the AI to create your shader
3. View the live preview and copy the shader code if desired

## Live Demo

You can try out the live demo at [https://react-calculator-shader.vercel.app/](https://react-calculator-shader.vercel.app/)

The live demo includes:
- A WebAssembly-powered calculator for evaluating mathematical expressions
- An AI-powered shader generator that converts text descriptions into GLSL code
- Real-time preview of generated shaders
- Copy functionality to use the shaders in your own projects