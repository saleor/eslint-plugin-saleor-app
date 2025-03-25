# Saleor App — ESLint plugin

ESLint plugin with rules for Saleor Apps

[![NPM version](https://img.shields.io/npm/v/@saleor/eslint-plugin-saleor-app.svg?style=for-the-badge&labelColor=000000)](https://www.npmjs.com/package/@saleor/eslint-plugin-saleor-app)

## Get started

Saleor App ESLint plugin requires TypeScript ESLint Parser to be installed and configured in your app.

If you're using Next.js it's already included in the default [`eslint-config-next` config](https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/index.js#L111)

### 1. Install

Add the plugin to your dependencies

```
pnpm i -D @saleor/eslint-plugin-saleor-app
```

or

```
npm i --save-dev @saleor/eslint-plugin-saleor-app
```

> **Note**
> If you're not already using [`typescript-eslint`](https://typescript-eslint.io/) remember to install it as additional package:
>
> ```
> pnpm i -D @typescript-eslint/parser
> ```
>
> or
>
> ```
> npm i --save-dev @typescript-eslint/parser
> ```

### 2. Configure ESLint

You can either use recommended configuration or configure each rule manually.

#### Flat config

##### Recommended configuration

```ts
import saleorPlugin from "@saleor/eslint-plugin-saleor-app";

export default [saleorPlugin.configs["flat/recommended"]];
```

##### Manual configuration

```ts
import saleorPlugin from "@saleor/eslint-plugin-saleor-app";

export default [
  {
    plugins: { "@saleor/saleor-app": saleorPlugin },
    rules: { "@saleor/saleor-app/logger-leak": "error" },
  },
];
```

#### Legacy config

##### Recommended configuration

```json
{
  "extends": ["plugin:@saleor/saleor-app/recommended"]
}
```

##### Manual configuration

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

#### ❌ Not allowed

```ts
const myData = { apiKey: "super-secret-key" };
logger.info({ myData }, "Some log message");
// Error: Potential PII leak: object shorthand property
// used with object value inside logger arguments.
// Pass only specific fields from the object to the logger.
```

```ts
const apiKeys = ["super-secret-key"];
logger.info({ apiKeys }, "Some log message");
// Error: Potential PII leak: object shorthand property
// used with array value inside logger arguments.
// Please use `redactLogArray` method.
```

> **Info**
> If you need an example of `redactLogArray` method take a look at an implementation in [saleor-app-payment-template](https://github.com/saleor/saleor-app-payment-template/blob/canary/src/lib/logger.ts#L90).

```ts
const myData = "some data" as any;
logger.info({ myData }, "Some log message");
// Error: Potential PII leak: object shorthand property
// used with unknown value inside logger arguments.
// Please use only known values.
```

#### ✅ Allowed

```ts
const myData = { apiKey: "super-secret-key", userName: "John" };
const { userName } = myData;
// Note that `userName` is a primitive value (string), so it will be allowed
logger.info({ userName }, "Some log message");
```

or

```ts
import { obfuscateObject } from "./utils";
// This function will take each value from an object and obfuscate sensitive data

const myData = { apiKey: "super-secret-key" };
logger.info({ myData: obfuscateObject(myData) }, "Some log message");
// This is allowed, because the value is not a shorthand property
```

> **Warning**
> The rule checks only for shorthand properties, so this too will be allowed:
>
> ```ts
> const myData = { apiKey: "super-secret-key" };
> const { apiKey } = myData;
> logger.info({ apiKey }, "Some log message"); // oh no!
> ```
>
> You must check what values you pass to the logger function, the rule cannot dectect if a value is a secret or not

#### Options

This rule accepts an array of logger names used in your application.

For example, you are importing a logger from some file, the logger name is `myLogger`:

```ts
import { myLogger } from "./logger";
```

By default, the rule checks for logger object that's named `logger`.
The rule doesn't check if the logger was imported from specified file, just the name.

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

## FAQ

### Misconfigured TypeScript parser

I get a following error:

```
You have used a rule which requires parserServices to be generated.
You must therefore provide a value for the "parserOptions.project" property for @typescript-eslint/parser.
```

#### 🏁 Fix

In your ESLint config add a configuration to point ESLint parser where your `tsconfig.json` is located

```json
{
  "parserOptions": {
    "project": "tsconfig.json"
  }
}
```

If you're using a monorepo, and you're linting a package / app inside that monorepo remember that you also need to specify `tsconfigRootDir`
so that the `tsconfig.json` is relative to your package / app (not relative to root of monorepo).

```js
parserOptions: {
  project: "tsconfig.json",
  tsconfigRootDir: __dirname,
},
```

> **Note**
> You must use a JS file for ESLint config for it work (extension ending with `.js`, `.mjs`, `.cjs`)
