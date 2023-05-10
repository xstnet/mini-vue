export function createElementVNode(vm, tag, props = {}, ...children) {
  props = props || {};
  const { key = undefined } = props;
  delete props["key"];
  return vnode(vm, tag, key, props, children, undefined);
}

export function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text);
}

function vnode(vm, tag, key, data, children, text) {
  return {
    vm,
    tag,
    key,
    data,
    children,
    text,
  };
}
