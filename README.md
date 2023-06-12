# eslint-plugin-saleor-app

ESLint plugin with rules for Saleor Apps

## Rules

- `logger-leak`: Checks if `logger.` usage accidentaly leaks potentially PII by passing a shorthand value, which is an object or an array
