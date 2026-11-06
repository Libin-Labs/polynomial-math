import test from 'node:test';
import assert from 'node:assert/strict';
import * as lib from '../dist/esm/index.js';
function random(seed = 123456789) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
test('Horner evaluation and ascending coefficients', () => {
  const p = new lib.Polynomial([2, 3, 4]);
  assert.equal(p.degree, 2);
  assert.equal(p.evaluate(2), 24);
});
test('add subtract and convolution', () => {
  const p = new lib.Polynomial([1, 2]),
    q = new lib.Polynomial([3, 4]);
  assert.deepEqual(p.add(q).coefficients, [4, 6]);
  assert.deepEqual(p.subtract(q).coefficients, [-2, -2]);
  assert.deepEqual(p.multiply(q).coefficients, [3, 10, 8]);
});
test('derivative and integration constant', () => {
  const p = new lib.Polynomial([4, 3, 2]);
  assert.deepEqual(p.derivative().coefficients, [3, 4]);
  assert.deepEqual(p.integral(7).coefficients, [7, 4, 1.5, 2 / 3]);
  assert.deepEqual(p.integral().derivative().coefficients, p.coefficients);
});
test('explicit epsilon trims only trailing terms', () => {
  assert.deepEqual(new lib.Polynomial([1, 0.0001, 0.0002], { epsilon: 0.001 }).coefficients, [1]);
  assert.deepEqual(
    new lib.Polynomial([1, 0.0001, 1], { epsilon: 0.001 }).coefficients,
    [1, 0.0001, 1],
  );
  assert.deepEqual(new lib.Polynomial([]).coefficients, [0]);
  assert.deepEqual(new lib.Polynomial([1, 0]).coefficients, [1]);
});
test('ownership, finite arithmetic and degree bounds', () => {
  const a = [1, 2],
    p = new lib.Polynomial(a);
  a[0] = 99;
  assert.equal(p.coefficients[0], 1);
  assert.ok(Object.isFrozen(p.coefficients));
  assert.throws(() => new lib.Polynomial([Infinity]), RangeError);
  assert.throws(
    () => new lib.Polynomial([Number.MAX_VALUE]).add(new lib.Polynomial([Number.MAX_VALUE])),
    RangeError,
  );
  assert.throws(() => new lib.Polynomial([1, 2]).evaluate(Number.MAX_VALUE), RangeError);
  assert.throws(() => new lib.Polynomial(Array(1026).fill(1)), RangeError);
  assert.throws(() => new lib.Polynomial(Array(1025).fill(1)).integral(), RangeError);
});
test('seeded independent power-sum and product oracle', () => {
  const rng = random();
  for (let t = 0; t < 150; t++) {
    const a = Array.from({ length: 5 }, () => Math.floor(rng() * 9) - 4),
      b = Array.from({ length: 4 }, () => Math.floor(rng() * 9) - 4),
      p = new lib.Polynomial(a),
      q = new lib.Polynomial(b);
    for (let x = -3; x <= 3; x++) {
      const direct = (v) => v.reduce((sum, c, i) => sum + c * x ** i, 0);
      assert.equal(p.evaluate(x), direct(a));
      assert.equal(p.multiply(q).evaluate(x), direct(a) * direct(b) || 0);
      assert.equal(p.add(q).evaluate(x), direct(a) + direct(b));
    }
    assert.deepEqual(p.integral().derivative().coefficients, p.coefficients);
  }
});
