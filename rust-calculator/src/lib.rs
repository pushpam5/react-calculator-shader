use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn calculate(expression: &str) -> f64 {
    let tokens: Vec<char> = expression.chars().filter(|c| !c.is_whitespace()).collect();
    parse_expression(&tokens, &mut 0)
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

    number.parse().unwrap_or(f64::NAN)
}