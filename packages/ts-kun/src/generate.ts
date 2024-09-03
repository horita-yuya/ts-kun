import * as fs from "node:fs";
import * as ts from "typescript";

type Entity = {
  name: string;
  members: Member[];
};

type Member = {
  name: string;
  kind: "number" | "string";
};

export function generate(filePath: string) {
  const program = ts.createProgram([filePath], {
    allowJs: true,
    declaration: true,
    emitDeclarationOnly: true,
  });

  const source = program.getSourceFile(filePath);

  const entities: Entity[] = [];

  if (source) {
    ts.forEachChild(source, (node) => {
      if (ts.isTypeAliasDeclaration(node)) {
        const entity: Entity = {
          name: node.name.text,
          members: [],
        };

        ts.forEachChild(node.type, (member) => {
          if (ts.isPropertySignature(member)) {
            if (ts.isIdentifier(member.name)) {
              switch (member.type?.kind) {
                case ts.SyntaxKind.NumberKeyword:
                  entity.members.push({
                    name: member.name.text,
                    kind: "number",
                  });
                  break;

                case ts.SyntaxKind.StringKeyword:
                  entity.members.push({
                    name: member.name.text,
                    kind: "string",
                  });
                  break;

                default:
                  break;
              }
            }
          }
        });

        entities.push(entity);
      }
    });
  }

  console.log(JSON.stringify(entities, null, 2));
  // const host = ts.createCompilerHost({
  // 	allowJs: true,
  // 	declaration: true,
  // 	emitDeclarationOnly: true,
  // });
  //
  // host.writeFile = (fileName, contents) => {
  // 	console.log(fileName);
  // 	console.log(contents);
  // };
  const resultFile = ts.createSourceFile(
    "",
    "",
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.JS,
  );
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const result = printer.printNode(
    ts.EmitHint.Unspecified,
    makeValidationFunction(entities),
    resultFile,
  );

  fs.writeFileSync(filePath.replace(".ts", ".js"), result);
}

function makeValidationFunction(entities: Entity[]) {
  const functionDeclarations = entities.map((entity) => {
    const functionName = `validate${entity.name}`;
    return ts.factory.createFunctionDeclaration(
      undefined,
      undefined,
      functionName,
      undefined,
      [ts.factory.createParameterDeclaration(undefined, undefined, "input")],
      undefined,
      ts.factory.createBlock([
        ts.factory.createVariableStatement(
          undefined,
          ts.factory.createVariableDeclarationList([
            ts.factory.createVariableDeclaration(
              "hoge",
              undefined,
              undefined,
              ts.factory.createNumericLiteral(1),
            ),
          ]),
        ),
        ts.factory.createReturnStatement(ts.factory.createTrue()),
      ]),
    );
  });

  const exportAssignments = entities.map((entity) => {
    return ts.factory.createExpressionStatement(
      ts.factory.createBinaryExpression(
        ts.factory.createPropertyAccessExpression(
          ts.factory.createIdentifier("exports"),
          `validate${entity.name}`,
        ),
        ts.SyntaxKind.EqualsToken,
        ts.factory.createIdentifier(`validate${entity.name}`),
      ),
    );
  });

  return ts.factory.createSourceFile(
    [...functionDeclarations, ...exportAssignments],
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None,
  );
}
