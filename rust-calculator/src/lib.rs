use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn calculate(expression: &str) -> f64 {
    let tokens: Vec<char> = expression.chars().filter(|c| !c.is_whitespace()).collect();
    
    // Check for invalid characters first
    for c in &tokens {
        if !c.is_digit(10) && !['+', '-', '*', '/', '%', '^', '.', '(', ')'].contains(c) {
            return f64::NAN;
        }
    }
    
    let mut pos = 0;
    let result = parse_expression(&tokens, &mut pos);
    
    // Check if we've consumed all tokens - if not, the expression is invalid
    if pos < tokens.len() {
        return f64::NAN;
    }
    
    // Round to 5 decimal places
    (result * 100000.0).round() / 100000.0
}

fn parse_expression(tokens: &[char], pos: &mut usize) -> f64 {
    let mut result = parse_term(tokens, pos);

    while *pos < tokens.len() {
        match tokens[*pos] {
            '+' => {
                *pos += 1;
                result += parse_term(tokens, pos);
            }
            '-' => {
                *pos += 1;
                result -= parse_term(tokens, pos);
            }
            _ => break,
        }
    }
    result
}

fn parse_term(tokens: &[char], pos: &mut usize) -> f64 {
    let mut result = parse_factor(tokens, pos);

    while *pos < tokens.len() {
        match tokens[*pos] {
            '*' => {
                *pos += 1;
                result *= parse_factor(tokens, pos);
            }
            '/' => {
                *pos += 1;
                let divisor = parse_factor(tokens, pos);
                if divisor == 0.0 {
                    return f64::NAN;
                }
                result /= divisor;
            }
            '%' => {
                *pos += 1;
                let modulus = parse_factor(tokens, pos);
                if modulus == 0.0 {
                    return f64::NAN;
                }
                result %= modulus;
            }
            _ => break,
        }
    }
    result
}

fn parse_factor(tokens: &[char], pos: &mut usize) -> f64 {
    if *pos >= tokens.len() {
        return f64::NAN;
    }

    if tokens[*pos] == '(' {
        *pos += 1;
        let result = parse_expression(tokens, pos);
        if *pos < tokens.len() && tokens[*pos] == ')' {
            *pos += 1;
            return result;
        }
        return f64::NAN;
    }

    let mut number = String::new();
    while *pos < tokens.len() && (tokens[*pos].is_digit(10) || tokens[*pos] == '.') {
        number.push(tokens[*pos]);
        *pos += 1;
    }

    let base = number.parse().unwrap_or(f64::NAN);
    
    // Check for power operation
    if *pos < tokens.len() && tokens[*pos] == '^' {
        *pos += 1;
        let exponent = parse_factor(tokens, pos);
        return base.powf(exponent);
    }
    
    base
}