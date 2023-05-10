export function patch(oldElm, vnode) {
  const isRealElement = oldElm.nodeType;
  if (isRealElement) {
    /**@var HTMLElement oldElm*/
    const newElm = createElm(vnode);
    oldElm.parentNode.insertBefore(newElm, oldElm.nextSibling);
    oldElm.remove();
    return newElm;
  } else {
    alert("newnn");
  }
}

function createElm(vnode) {
  let el;
  if (typeof vnode.tag === "string") {
    el = document.createElement(vnode.tag);
    if (vnode.data) {
      patchProps(el, vnode.data);
    }
    if (vnode.children) {
      vnode.children.forEach((child) => {
        el.appendChild(createElm(child));
      });
    }
  } else {
    el = document.createTextNode(vnode.text);
  }
  vnode.el = el;
  return el;
}

function patchProps(el, props) {
  Object.keys(props).forEach((key) => {
    if (key === "style") {
      Object.keys(props[key]).forEach((styleName) => {
        el.style[styleName] = props[key][styleName];
      });
    } else {
      el.setAttribute(key, props[key]);
    }
  });
}
