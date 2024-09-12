import { type BinaryExpression, type Expression, factory } from "typescript";

export function createLogicalOrAll(
  expressions: Expression[],
): BinaryExpression {
  const [first, second, ...remains] = expressions;
  let currentExpression = factory.createLogicalOr(first, second);

  for (const expression of remains) {
    currentExpression = factory.createLogicalOr(currentExpression, expression);
  }

  return currentExpression;
}
