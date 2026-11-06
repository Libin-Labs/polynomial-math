import { Polynomial, type PolynomialOptions } from '@lp-labs/polynomial-math';
export type PublicTypes = [PolynomialOptions];
void Polynomial;
const polynomial: Polynomial = new Polynomial([1, 2], { epsilon: 0 });
const coefficients: readonly number[] = polynomial.derivative().coefficients;
void coefficients;
// @ts-expect-error coefficients are finite-number typed
new Polynomial(['1']);
