import * as ts from "typescript";
import { createLogicalAndAll } from "./createLogicalAndAll";
import type { DeclaredObjectType } from "./declaredType";

const PARAM_TYPE = "type";
const PARAM_VALUE = "value";
const TYPE_MAPPER = "Mapper";

function createMapperTypeDeclaration(
  declaredObjectTypes: DeclaredObjectType[],
): ts.TypeAliasDeclaration {
  return ts.factory.createTypeAliasDeclaration(
    undefined,
    TYPE_MAPPER,
    undefined,
    ts.factory.createTypeLiteralNode(
      declaredObjectTypes.map((type) => {
        return ts.factory.createPropertySignature(
          undefined,
          type.name,
          undefined,
          ts.factory.createTypeReferenceNode(type.name),
        );
      }),
    ),
  );
}

export function createValidationSourceCode(
  declaredObjectTypes: DeclaredObjectType[],
): string {
  const tmpSource = ts.createSourceFile("", "", ts.ScriptTarget.ESNext);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  return printer.printNode(
    ts.EmitHint.Unspecified,
    ts.factory.createSourceFile(
      [
        createMapperTypeDeclaration(declaredObjectTypes),
        ts.factory.createFunctionDeclaration(
          [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
          undefined,
          "validate",
          [
            ts.factory.createTypeParameterDeclaration(
              undefined,
              "T",
              ts.factory.createTypeOperatorNode(
                ts.SyntaxKind.KeyOfKeyword,
                ts.factory.createTypeReferenceNode(TYPE_MAPPER),
              ),
            ),
          ],
          [
            ts.factory.createParameterDeclaration(
              undefined,
              undefined,
              PARAM_TYPE,
              undefined,
              ts.factory.createTypeReferenceNode("T"),
            ),
            ts.factory.createParameterDeclaration(
              undefined,
              undefined,
              PARAM_VALUE,
              undefined,
              ts.factory.createTypeReferenceNode("unknown"),
            ),
          ],
          ts.factory.createTypePredicateNode(
            undefined,
            ts.factory.createIdentifier(PARAM_VALUE),
            ts.factory.createIndexedAccessTypeNode(
              ts.factory.createTypeReferenceNode(TYPE_MAPPER),
              ts.factory.createTypeReferenceNode("T"),
            ),
          ),
          ts.factory.createBlock([
            ts.factory.createSwitchStatement(
              ts.factory.createIdentifier("type"),
              ts.factory.createCaseBlock(
                declaredObjectTypes.map((type) => {
                  return ts.factory.createCaseClause(
                    ts.factory.createStringLiteral(type.name),
                    [
                      ts.factory.createReturnStatement(
                        createLogicalAndAll([
                          ts.factory.createStrictEquality(
                            ts.factory.createTypeOfExpression(
                              ts.factory.createIdentifier(PARAM_VALUE),
                            ),
                            ts.factory.createStringLiteral("object"),
                          ),
                          ts.factory.createStrictInequality(
                            ts.factory.createIdentifier(PARAM_VALUE),
                            ts.factory.createNull(),
                          ),
                          ...Object.entries(type.type).map(([key, value]) => {
                            return ts.factory.createStrictEquality(
                              ts.factory.createTypeOfExpression(
                                ts.factory.createIdentifier(key),
                              ),
                              ts.factory.createStringLiteral(value[0]),
                            );
                          }),
                        ]),
                      ),
                    ],
                  );
                }),
              ),
            ),
            ts.factory.createReturnStatement(ts.factory.createFalse()),
          ]),
        ),
      ],
      ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
      ts.NodeFlags.None,
    ),
    tmpSource,
  );
}
