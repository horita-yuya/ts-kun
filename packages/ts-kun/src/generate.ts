import * as fs from "node:fs";
import * as path from "node:path";
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
  console.log(result);

  const functions = [];
  const exports = [];
  for (const entity of entities) {
    const isObject = `typeof input === "object" && input !== null`;
    const hasMembers = entity.members.map((member) => {
      return `input.${member.name} !== undefined`;
    });
    const condition = `${isObject} && ${hasMembers.join(" && ")}`;
    const functionExpression = `function validate${entity.name}(input) { return ${condition} }`;
    const exportExpression = `exports.validate${entity.name} = validate${entity.name};`;

    functions.push(functionExpression);
    exports.push(exportExpression);
  }

  const js = `
${functions.join("\n")}
${exports.join("\n")}
  `;

  fs.writeFileSync(filePath.replace(".ts", ".js"), js);
}

function makeValidationFunction(entities: Entity[]) {
  const functionDeclarations = entities.map((entity) => {
    const functionName = `validate${entity.name}`;

    const membersArray = ts.factory.createArrayLiteralExpression(
      entity.members.map((member) =>
        ts.factory.createObjectLiteralExpression([
          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier("name"),
            ts.factory.createStringLiteral(member.name),
          ),
          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier("kind"),
            ts.factory.createStringLiteral(member.kind),
          ),
        ]),
      ),
    );

    // Create the return statement
    const returnStatement = ts.factory.createReturnStatement(
      ts.factory.createObjectLiteralExpression([
        ts.factory.createPropertyAssignment(
          ts.factory.createIdentifier("name"),
          ts.factory.createStringLiteral(entity.name),
        ),
        ts.factory.createPropertyAssignment(
          ts.factory.createIdentifier("members"),
          membersArray,
        ),
      ]),
    );

    return ts.factory.createFunctionDeclaration(
      undefined,
      undefined,
      functionName,
      undefined,
      [ts.factory.createParameterDeclaration(undefined, undefined, "input")],
      undefined,
      ts.factory.createBlock([returnStatement]),
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
