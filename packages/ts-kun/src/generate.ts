import * as ts from "typescript";
import { createValidationSourceCode } from "./createValidationSourceCode";
import type { DeclaredObjectType } from "./declaredType";
import { searchDeclaredObjectTypes } from "./searchDeclaredObjectTypes";

export function generate({
  fileNames,
  outFile,
}: { fileNames: string[]; outFile: string }) {
  const host = ts.createCompilerHost({
    declaration: true,
  });

  const program = ts.createProgram(
    fileNames,
    {
      declaration: true,
    },
    host,
  );

  const allDeclarationTypes: DeclaredObjectType[] = [];

  for (const fileName of fileNames) {
    const source = program.getSourceFile(fileName);
    if (!source) {
      console.error(`No source file: ${fileName}`);
      continue;
    }

    allDeclarationTypes.concat(searchDeclaredObjectTypes(source));
  }

  host.writeFile(
    outFile,
    createValidationSourceCode(allDeclarationTypes),
    false,
  );
}
