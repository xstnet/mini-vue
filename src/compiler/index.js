import { parseHtml } from "./parse";
import { codegen } from "./codegen";

export function compileToFunction(template = "") {
  const ast = parseHtml(template);
  const code = `with(this){return ${codegen(ast)}}`;
  const render = new Function(code);
  return render;
}
