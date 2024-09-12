import * as path from "node:path";
import * as ts from "typescript";

type TypeDeclaration = {
  name: string;
  type: { [key: string]: string[] };
};

function t() {
  const file1 = path.resolve(__dirname, "t-sample.ts");
  const file2 = path.resolve(__dirname, "generated-t-sample.ts");

  const host = ts.createCompilerHost({
    declaration: true,
  });

  const program = ts.createProgram(
    [file1, file2],
    {
      declaration: true,
    },
    host,
  );

  const source = program.getSourceFile(file1);
  if (!source) {
    throw new Error(`No source file: ${file1}`);
  }

  const types: TypeDeclaration[] = [];

  source.forEachChild((node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      let name = "";
      node.forEachChild((child) => {
        if (ts.isIdentifier(child)) {
          name = child.text;
        } else if (ts.isTypeLiteralNode(child)) {
          const type: { [key: string]: string[] } = {};
          child.forEachChild((member) => {
            if (ts.isPropertySignature(member)) {
              let key = "";
              const value: string[] = [];
              member.forEachChild((memberChild) => {
                if (ts.isIdentifier(memberChild)) {
                  key = memberChild.text;
                } else if (memberChild.kind === ts.SyntaxKind.StringKeyword) {
                  value.push(memberChild.getText(source));
                } else if (ts.isUnionTypeNode(memberChild)) {
                  const unions: string[] = [];
                  memberChild.forEachChild((union) => {
                    if (ts.isLiteralTypeNode(union)) {
                      if (ts.isStringLiteralLike(union.literal)) {
                        unions.push(union.literal.text);
                      }
                    }
                  });
                  value.push(...unions);
                }
              });
              type[key] = value;
            }
          });
          types.push({ name, type });
        }
      });
    }
  });

  host.writeFile(file2, createFunctionDeclaration(), false);

  // ts.createSourceFile(file2, "Hello", ts.ScriptTarget.ESNext);

  // if (!source2) {
  //   throw new Error(`No source file: ${file2}`);
  // }

  // console.log(source2);
}

function createFunctionDeclaration(): string {
  const tmpSource = ts.createSourceFile("", "", ts.ScriptTarget.ESNext);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const parameterType = "type";
  const parameterValue = "value";
  const typeMapper = "Mapper";

  const typeDecralation = ts.factory.createTypeAliasDeclaration(
    undefined,
    typeMapper,
    undefined,
    ts.factory.createTypeLiteralNode([
      ts.factory.createPropertySignature(
        undefined,
        "User",
        undefined,
        ts.factory.createTypeReferenceNode("User"),
      ),
      ts.factory.createPropertySignature(
        undefined,
        "PremiumUser",
        undefined,
        ts.factory.createTypeReferenceNode("PremiumUser"),
      ),
    ]),
  );

  return printer.printNode(
    ts.EmitHint.Unspecified,
    ts.factory.createSourceFile(
      [
        typeDecralation,
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
                ts.factory.createTypeReferenceNode(typeMapper),
              ),
            ),
          ],
          [
            ts.factory.createParameterDeclaration(
              undefined,
              undefined,
              parameterType,
              undefined,
              ts.factory.createTypeReferenceNode("T"),
            ),
            ts.factory.createParameterDeclaration(
              undefined,
              undefined,
              parameterValue,
              undefined,
              ts.factory.createTypeReferenceNode("unknown"),
            ),
          ],
          ts.factory.createTypePredicateNode(
            undefined,
            ts.factory.createIdentifier(parameterValue),
            ts.factory.createIndexedAccessTypeNode(
              ts.factory.createTypeReferenceNode(typeMapper),
              ts.factory.createTypeReferenceNode("T"),
            ),
          ),
          ts.factory.createBlock([
            ts.factory.createSwitchStatement(
              ts.factory.createIdentifier("type"),
              ts.factory.createCaseBlock([
                ts.factory.createCaseClause(
                  ts.factory.createStringLiteral("User"),
                  [
                    ts.factory.createReturnStatement(
                      ts.factory.createLogicalAnd(
                        ts.factory.createStrictEquality(
                          ts.factory.createTypeOfExpression(
                            ts.factory.createIdentifier(parameterValue),
                          ),
                          ts.factory.createStringLiteral("object"),
                        ),
                        ts.factory.createStrictInequality(
                          ts.factory.createIdentifier(parameterValue),
                          ts.factory.createNull(),
                        ),
                      ),
                    ),
                  ],
                ),
                ts.factory.createCaseClause(
                  ts.factory.createStringLiteral("PremiumUser"),
                  [
                    ts.factory.createReturnStatement(
                      ts.factory.createLogicalAnd(
                        ts.factory.createStrictEquality(
                          ts.factory.createTypeOfExpression(
                            ts.factory.createIdentifier(parameterValue),
                          ),
                          ts.factory.createStringLiteral("object"),
                        ),
                        ts.factory.createStrictInequality(
                          ts.factory.createIdentifier(parameterValue),
                          ts.factory.createNull(),
                        ),
                      ),
                    ),
                  ],
                ),
              ]),
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

t();
