const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*((?:=))\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const ncname = "[a-zA-Z_][\\w\\-\\.]*";
const qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
// 开始标签 <div
// /^<((?:[a-zA-Z_][\w\-\.]*\:)?[a-zA-Z_][\w\-\.]*)/
const startTagOpen = new RegExp("^<" + qnameCapture);
// 开始标签结束 >
const startTagClose = /^\s*(\/?)>/;
// 结束标签  </div>  或 自闭和标签 />
// /^<\/((?:[a-zA-Z_][\w\-\.]*\:)?[a-zA-Z_][\w\-\.]*)[^>]*>/
const endTag = new RegExp("^<\\/" + qnameCapture + "[^>]*>");

export function parseHtml(html) {
  const astStack = [];
  let currentNode;
  let root;
  function createAstElement(tag, attrs = []) {
    return {
      type: HTMLElement.ELEMENT_NODE,
      tag,
      attrs,
      children: [],
      parent: currentNode || null,
    };
  }

  function start(tag, attrs) {
    const node = createAstElement(tag, attrs);
    if (!root) {
      root = node;
    }
    if (currentNode) {
      currentNode.children.push(node);
      node.parent = currentNode;
    }
    currentNode = node;
    astStack.push(node);
  }
  function end(tag) {
    const lastNode = astStack.pop();
    if (lastNode.tag !== tag) {
      throw Error("解析标签失败");
    }
    currentNode = astStack[astStack.length - 1];
  }
  function text(text) {
    const textNode = {
      type: HTMLElement.TEXT_NODE,
      text,
      parent: currentNode,
    };
    text && currentNode.children.push(textNode);
  }
  function advance(n) {
    html = html.substring(n);
  }

  function parseStartTag() {
    const match = html.match(startTagOpen);
    if (!match) {
      throw Error("模板错误");
    }
    const node = {
      tag: match[1],
      attrs: {},
    };
    advance(match[0].length);
    let attribute;
    while ((attribute = parseAttribute())) {
      node.attrs[attribute[0]] = attribute[1];
    }

    start(node.tag, node.attrs);

    parseStartTagClose();
    // 一元标签
    if (["input", "br", "hr", "img", "em", "..."].includes(node.tag)) {
      end(node.tag);
    }
  }

  function parseStartTagClose() {
    const match = html.match(startTagClose);
    if (match) {
      advance(match[0].length);
    }
  }

  function parseAttribute() {
    const match = html.match(attribute);
    if (match) {
      advance(match[0].length);
      const attr = match[1];
      let value = match[3] || match[4] || match[5] || true;
      if (attr === "style") {
        value = processStyle(value);
      }
      return [attr, value];
    }
    return false;
  }

  function processStyle(styleValue) {
    const style = {};
    styleValue.split(";").forEach((item) => {
      const [key, value] = item.split(":");
      style[key.trim()] = value.trim();
    });

    return style;
  }

  function parseText(textEnd) {
    const textStr = html.substring(0, textEnd).trimLeft();
    advance(textEnd);
    text(textStr);
  }

  function parseEndTag() {
    const match = html.match(endTag);
    if (match) {
      advance(match[0].length);
      end(match[1]);
    }
  }

  while (html) {
    let textEnd = html.indexOf("<");
    if (textEnd === 0) {
      // 注释处理
      if (/^<!--/.test(html)) {
        const commentEnd = html.indexOf("-->");
        if (commentEnd >= 0) {
          advance(commentEnd + 3);
          continue;
        }
      }
      //  todo: <! if [IE  IE处理
      //  todo: <!DOCTYPE html>  doctype处理

      parseStartTag();
      continue;
    }
    if (textEnd > 0) {
      parseText(textEnd);
    }
    parseEndTag();
  }
  return root;
}
