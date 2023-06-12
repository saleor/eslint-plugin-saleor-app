# Saleor App — ESLint plugin

ESLint plugin with rules for Saleor Apps

[![NPM version](https://img.shields.io/npm/v/@saleor/eslint-plugin-saleor-app.svg?style=for-the-badge&labelColor=000000)](https://www.npmjs.com/package/@saleor/eslint-plugin-saleor-app)

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

### `logger-leak`

Checks if `logger.` usage accidentaly leaks potentially PII by passing a shorthand value, which is an object or an array

#### Options

This rule accepts an array of logger names used in your application.

For example, you are importing a logger from some file, the logger name is `myLogger`:

```ts
import { myLogger } from "./logger";
```

By default, the rule checks for logger object that's named `logger`.
The rule doesn't check imports, just the name.

To check for your custom logger provide it as options to the rule

```json
{
  "rules": {
    "@saleor/saleor-app/logger-leak": ["error", ["logger", "myLogger"]]
  }
}
```

> **Note**
> If you provide a config it will override the default configuration that checks for `logger`.
> If you use both `logger` and `myLogger` in your app, you need to specify both as shown in the example
