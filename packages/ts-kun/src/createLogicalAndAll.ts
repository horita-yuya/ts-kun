import { type BinaryExpression, type Expression, factory } from "typescript";

export function createLogicalAndAll(
  expressions: Expression[],
): BinaryExpression {
  const [first, second, ...remains] = expressions;
  let currentExpression = factory.createLogicalAnd(first, second);

  for (const expression of remains) {
    currentExpression = factory.createLogicalAnd(currentExpression, expression);
  }

  return currentExpression;
}
