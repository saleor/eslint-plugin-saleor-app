# Saleor App — ESLint plugin

ESLint plugin with rules for Saleor Apps

## Get started

### 1. Install

Add the plugin to your dependencies:

```
pnpm i -D @saleor/eslint-plugin-saleor-app
```

or

```
npm i --save-dev @saleor/eslint-plugin-saleor-app
```

### 2. Configure ESLint

You can either use recommended configuration or configure each rule manually

#### Recommended configuration

```json
{
  "extends": ["plugin:@saleor/saleor-app/recommended"]
}
```

#### Manual configuration

Add the plugin to your ESLint config:

```json
{
  "plugins": ["@saleor/saleor-app"]
}
```

Then configure the rules:

```json
{
  "rules": {
    "@saleor/saleor-app/logger-leak": "error"
  }
}
```

## Rules

> **Warning**
> Remember to prefix the rules with `@saleor/saleor-app/<rule_name>`

- `logger-leak`: Checks if `logger.` usage accidentaly leaks potentially PII by passing a shorthand value, which is an object or an array
