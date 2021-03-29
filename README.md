# Result

Bringing Rust's `Option<T>` and `Result<T, E>` to TypeScript.

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

[github pages]: https://github.io/kherge/js.result

## Installation

    npm install @kherge/result

## Requirements

- TypeScript

## Development

Created using [TSDX](https://tsdx.io/).

### Building

    npm run build

Builds to the `dist/` folder.

### Linting

    npm run lint

Runs ESLint with Prettier.

### Unit Testing

    npm test

> You can also run `npm run test:watch` to use interactive watch mode.
