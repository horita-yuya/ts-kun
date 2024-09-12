import * as ts from "typescript";
import type { DeclaredObjectType } from "./declaredType";

export function searchDeclaredObjectTypes(
  source: ts.SourceFile,
): DeclaredObjectType[] {
  const types: DeclaredObjectType[] = [];

  source.forEachChild((declaration) => {
    if (ts.isTypeAliasDeclaration(declaration)) {
      let name = "";

      declaration.forEachChild((node) => {
        if (ts.isIdentifier(node)) {
          name = node.text;

          // A TypeLiteral is the declaration node for an anonymous symbol.
          // https://github.com/microsoft/TypeScript/blob/main/src/compiler/types.ts#L2260
        } else if (ts.isTypeLiteralNode(node)) {
          const type: { [key: string]: string[] } = {};

          for (const member of node.members) {
            if (ts.isPropertySignature(member)) {
              let key = "";
              if (ts.isIdentifier(member.name)) {
                key = member.name.text;
              }

              if (member.type && ts.isTypeNode(member.type)) {
                if (
                  member.type.kind === ts.SyntaxKind.StringKeyword ||
                  member.type.kind === ts.SyntaxKind.NumberKeyword
                ) {
                  type[key] = [member.type.getText(source)];
                }

                if (ts.isUnionTypeNode(member.type)) {
                  const unions: string[] = [];
                  for (const union of member.type.types) {
                    if (ts.isLiteralTypeNode(union)) {
                      if (ts.isStringLiteralLike(union.literal)) {
                        unions.push(union.literal.text);
                      }
                    }
                  }
                  type[key] = unions;
                }
              }
            }
          }
          types.push({ name, properties: type });
        }
      });
    }
  });

  return types;
}
