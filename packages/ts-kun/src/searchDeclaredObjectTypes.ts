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
            console.log(`TEST ${member.name}`);
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
          types.push({ name, type });
        }
      });
    }
  });

  return types;
}
