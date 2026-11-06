# @lp-labs/polynomial-math

Finite real polynomial arithmetic with explicit trailing-coefficient tolerance. Zero runtime and peer dependencies. MIT. Node.js 18+; ES2022-compatible browser runtimes with BigInt where used. No browser globals accessed at import.

## Install

```sh
npm install @lp-labs/polynomial-math
```

## Quick start

```js
import { Polynomial } from '@lp-labs/polynomial-math';
const p = new Polynomial([1, 2, 1]); // 1 + 2x + x²
console.log(p.evaluate(3), p.derivative().coefficients); // 16, [2,2]
```

ES modules use named imports above. CommonJS uses `const { Polynomial } = require('@lp-labs/polynomial-math');`. Both formats ship declarations.

## Public API and customization

- `PolynomialOptions`: `epsilon?`, nonnegative finite trailing-coefficient trimming threshold, default 0 (exact zero only).
- `Polynomial(coefficients,options?)`: ascending power order, defensive frozen copy; empty/zero polynomials canonicalized to [0], degree 0.
- Read-only `coefficients: readonly number[]`, `epsilon`, `degree`.
- `evaluate(x): number` via Horner; `add(other)`, `subtract(other)`, `multiply(other)`, `derivative()`, `integral(constant = 0)` return new Polynomial.
- Receiver epsilon applies to all output normalization. Only trailing coefficients are trimmed; interior small coefficients retained. No roots, fitting or symbolic algebra API.

All runtime exports and public declaration types are listed above. Options are per call/instance; no global configuration.

## Errors, ownership and limits

RangeError for invalid/nonfinite values, epsilon, coefficient length over 1025, output degree over 1024 or any encountered nonfinite arithmetic. TypeError for non-Polynomial arithmetic operands. Overflow of intermediate multiplication is rejected even if later cancellation could yield a finite value. Double rounding and underflow remain possible; epsilon is an explicit approximation policy. Horner/add/subtract/calculus O(n); multiplication O(nm), storage O(n+m). No input mutation.

Algorithms are synchronous and CPU/memory bounded by the stated limits, not cancellable or real-time. Validation does not sandbox hostile getters, proxies, callbacks or infinite iterables. TypeScript signatures are the supported input contract. No I/O, network, persistence or cryptographic guarantees.

## Development

```sh
npm ci --offline
npm run build
npm run typecheck
npm test
npm run format:check
```

Strict TypeScript, ESM/CommonJS, bare installed-package consumers with negative type assertions, and deterministic reference-oracle tests are included. Only TypeScript and Prettier are development dependencies.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
