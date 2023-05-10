export function codegen(ast) {
  const children = genChildren(ast.children);
  let code = `_c('${ast.tag}', ${genProps(ast.attrs)}${
    ast.children?.length ? `, ${children}` : ""
  })`;

  return code;
}

function genTextNode(node) {
  const regExpress = /\{\{((?:.|\r?\n)+?)}}/g;
  // 不是表达式
  if (!regExpress.test(node.text)) {
    return `_v(${JSON.stringify(node.text)})`;
  }

  // const regExpress = /\{\{((?:.|\r?\n)+?)}}/g; 这一行代码占用了一次匹配次数，需要归零
  regExpress.lastIndex = 0;

  let match,
    tokens = [],
    lastIndex = 0;
  while ((match = regExpress.exec(node.text))) {
    if (match["index"] > lastIndex) {
      tokens.push(JSON.stringify(node.text.slice(lastIndex, match["index"])));
    }
    tokens.push(`_s(${match[1].trim()})`);
    lastIndex = match["index"] + match[0].length;
  }
  if (node.text.length > lastIndex) {
    tokens.push(JSON.stringify(node.text.substring(lastIndex)));
  }
  return `_v(${tokens.join("+")})`;
}

function genChildren(children) {
  if (children && children.length) {
    return children
      .map((child) => {
        if (child.type === HTMLElement.ELEMENT_NODE) {
          return codegen(child);
        } else {
          return genTextNode(child);
        }
      })
      .join(",");
  }
  return "";
}

function genProps(attrs) {
  if (attrs) {
    return JSON.stringify(attrs);
  }
  return null;
}

`
{{

`;
