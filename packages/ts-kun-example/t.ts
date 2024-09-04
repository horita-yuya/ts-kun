import * as path from "node:path";
import * as ts from "typescript";

function t() {
  const file = path.resolve(__dirname, "t-sample.ts");
  const program = ts.createProgram([file], {
    declaration: true,
    emitDeclarationOnly: true,
  });

  const source = program.getSourceFile(file);
  if (!source) {
    throw new Error(`No source file: ${file}`);
  }

  showSyntaxTree(source, "", source);
}

function showSyntaxTree(node: ts.Node, indent: string, source: ts.SourceFile) {
  console.log(`${indent}${showNodeDetail(node, source)}`);
  ts.forEachChild(node, (child) => {
    showSyntaxTree(child, indent + "  ", source);
  });
}

function showNodeDetail(node: ts.Node, source: ts.SourceFile): string {
  const kind = ts.SyntaxKind[node.kind];

  if (ts.isIdentifier(node)) {
    return `${kind}, ${node.text}`;
  } else if (ts.isTypeLiteralNode(node)) {
    return `${kind}`;
  } else if (ts.isPropertySignature(node)) {
    return `${kind}`;
  } else if (ts.isTemplateLiteralTypeNode(node)) {
    return `${kind}`;
  }

  return kind;
}

t();
