import * as ts from "typescript";
import { createValidationSourceCode } from "./createValidationSourceCode";
import type { DeclaredObjectType } from "./declaredType";
import { searchDeclaredObjectTypes } from "./searchDeclaredObjectTypes";

export function generateValidation({
  inputFilePaths,
  outFilePath,
}: { inputFilePaths: string[]; outFilePath: string }) {
  const host = ts.createCompilerHost({
    declaration: true,
  });

  const program = ts.createProgram(
    inputFilePaths,
    {
      declaration: true,
    },
    host,
  );

  const allDeclarationTypes: DeclaredObjectType[] = [];
  const typeAliasDeclarations: ts.TypeAliasDeclaration[] = [];

  for (const fileName of inputFilePaths) {
    const source = program.getSourceFile(fileName);
    if (!source) {
      console.error(`No source file: ${fileName}`);
      continue;
    }

    source.forEachChild((child) => {
      if (ts.isTypeAliasDeclaration(child)) {
        typeAliasDeclarations.push(child);
      }
    });

    allDeclarationTypes.push(...searchDeclaredObjectTypes(source));
  }

  host.writeFile(
    outFilePath,
    createValidationSourceCode(allDeclarationTypes, typeAliasDeclarations),
    false,
  );
}
