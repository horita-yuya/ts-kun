import * as path from "node:path";
import * as ts from "typescript";

function t() {
  const file = path.resolve(__dirname, "t_sample.ts");
  const program = ts.createProgram([file], {
    declaration: true,
    emitDeclarationOnly: true,
  });

  const source = program.getSourceFile(file);
  if (!source) {
    throw new Error(`No source file: ${file}`);
  }

  showSyntaxTree(source, "");

  const result = program.emit();
  console.log(result);
}

function showSyntaxTree(node: ts.Node, indent: string) {
  console.log(`${indent}${showNodeDetail(node)}`);
  ts.forEachChild(node, (child) => {
    showSyntaxTree(child, indent + "  ");
  });
}

function showNodeDetail(node: ts.Node): string {
  const kind = ts.SyntaxKind[node.kind];

  if (ts.isIdentifier(node)) {
    return `${kind}, ${node.text}`;
  } else if (ts.isTypeLiteralNode(node)) {
    return `${kind}`;
  } else if (ts.isPropertySignature(node)) {
    return `${kind}`;
  }

  return kind;
}

t();
