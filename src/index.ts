export interface PolynomialOptions {
  epsilon?: number;
}
function finite(value: number): number {
  if (!Number.isFinite(value)) throw new RangeError('Nonfinite coefficient or arithmetic overflow');
  return value;
}
export class Polynomial {
  readonly coefficients: readonly number[];
  readonly epsilon: number;
  constructor(coefficients: readonly number[], options: PolynomialOptions = {}) {
    this.epsilon = options.epsilon ?? 0;
    if (!Number.isFinite(this.epsilon) || this.epsilon < 0) throw new RangeError('Invalid epsilon');
    if (!Array.isArray(coefficients) || coefficients.length > 1025)
      throw new RangeError('Maximum degree is 1024');
    const values = Array.from(coefficients, finite);
    while (values.length > 1 && Math.abs(values[values.length - 1]!) <= this.epsilon) values.pop();
    if (values.length === 0 || (values.length === 1 && Math.abs(values[0]!) <= this.epsilon)) {
      values.length = 0;
      values.push(0);
    }
    this.coefficients = Object.freeze(values);
    Object.freeze(this);
  }
  get degree(): number {
    return this.coefficients.length - 1;
  }
  evaluate(x: number): number {
    finite(x);
    let value = 0;
    for (let i = this.degree; i >= 0; i--)
      value = finite(finite(value * x) + this.coefficients[i]!);
    return value;
  }
  private combine(other: Polynomial, sign: number): Polynomial {
    if (!(other instanceof Polynomial)) throw new TypeError('Expected Polynomial');
    return new Polynomial(
      Array.from(
        { length: Math.max(this.coefficients.length, other.coefficients.length) },
        (_, i) => finite((this.coefficients[i] ?? 0) + sign * (other.coefficients[i] ?? 0)),
      ),
      { epsilon: this.epsilon },
    );
  }
  add(other: Polynomial): Polynomial {
    return this.combine(other, 1);
  }
  subtract(other: Polynomial): Polynomial {
    return this.combine(other, -1);
  }
  multiply(other: Polynomial): Polynomial {
    if (!(other instanceof Polynomial)) throw new TypeError('Expected Polynomial');
    if (this.degree + other.degree > 1024) throw new RangeError('Product degree exceeds 1024');
    const result = Array<number>(this.degree + other.degree + 1).fill(0);
    for (let i = 0; i <= this.degree; i++)
      for (let j = 0; j <= other.degree; j++)
        result[i + j] = finite(
          result[i + j]! + finite(this.coefficients[i]! * other.coefficients[j]!),
        );
    return new Polynomial(result, { epsilon: this.epsilon });
  }
  derivative(): Polynomial {
    return new Polynomial(
      this.coefficients.slice(1).map((value, index) => finite(value * (index + 1))),
      { epsilon: this.epsilon },
    );
  }
  integral(constant = 0): Polynomial {
    finite(constant);
    if (this.degree === 1024) throw new RangeError('Integral degree exceeds 1024');
    return new Polynomial(
      [constant, ...this.coefficients.map((value, index) => finite(value / (index + 1)))],
      { epsilon: this.epsilon },
    );
  }
}
