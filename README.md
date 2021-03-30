# Result

A zero dependencies library for bringing Rust's `Option<T>` and `Result<T, E>` to TypeScript.

## Installation

    npm install @kherge/result

## Example

```ts
import { Option, Result, err, none, ok, some } from '@kherge/result';

// Using Option<T>.
let option: Option<string>;

option = some('My string.');
console.log(option.unwrap()); // My string.

option = none();
console.log(option.unwrap()); // throws error

// Using Result<T, E>.
let result: Result<string, number>;

result = ok('My string.');
console.log(result.unwrap()); // My string.

result = err(123);
console.log(result.unwrap()); // throws error
```

## Documentation

Please see the [GitHub Pages][] site for documentation.

[github pages]: https://kherge.github.io/js.result/

## Development

Created using [TSDX](https://tsdx.io/).

### Requirements

- NPM

Development can be started after installing the development dependencies.

    npm install

### Building

    npm run build

Builds to the `dist/` folder.

    npm run build:docs

Builds the documentation to the `docs/` folder.

### Linting

    npm run lint

Runs ESLint with Prettier.

> There are some version compatibility issues with TSDX and TypeScript 4. For the moment, I have
> opted to disable linting in GitHub Action builds but will enable it in the future once the issue
> has been sorted out. See: formium/tsdx#810

### Unit Testing

    npm test

> You can also run `npm run test:watch` to use interactive watch mode.
