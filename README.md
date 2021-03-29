# result

Bringing Rust's `Option<T>` and `Result<T, E>` to TypeScript.

This library ports the `std::option::Option` and `std::result::Result` Rust types to Typescript.
While TypeScript does not natively support algebraic types at the time this library was written,
best effort has been made to bring the behavior of `Option` and `Result` to what we would expect
in Rust.

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

There are two types supported by the library.

- [`Option`](src/option/Option.ts)
- [`Result`](src/option/Result.ts)

### `Option`

To use `Option`, two functions are exported to create objects of that type.

- `none<T>(): Option<T>` &mdash;
  Creates a properly typed object that represents the absence of a value.
- `some<T>(value: T): Option<T>` &mdash;
  Creates a properly typed object that represents the presence of a value.

#### Example

```ts
const getValue = (doIt: boolean): Option<number> => {
  if (doIt) {
    return some(5);
  }

  return none();
};

const result: number;

result = getValue(true)
  .map(v => v * 2)
  .map(v => v * 10)
  .or(0)
  .unwrap(); // returns 100

result = getValue(true)
  .map(v => v * 2)
  .map(v => v * 10)
  .or(0)
  .unwrap(); // returns 0
```

### `Result`

To use `Result`, two functions are exported to create objects of that type.

- `err<T, E>(value: E): Result<T, E>` &mdash;
  Creates a properly typed object that represents a "failure" value.
- `ok<T, E>(value: T): Result<T, E>` &mdash;
  Creates a property typed object that represents a "success" value.

#### Example

```ts
const doNetworkRequest = (success: boolean): Result<string, string> => {
  if (success) {
    return ok({
      user: 'myUsername',
    });
  }

  return err('Could not retrieve username.');
};

let result: Result<string, string>;

result = doNetworkRequest(true)
  .map(json => json.user)
  .or('guest')
  .unwrap(); // returns "myUsername"

result = doNetworkRequest(false)
  .map(json => json.user)
  .or('guest')
  .unwrap(); // returns "guest"
```

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
