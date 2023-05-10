import { createElementVNode, createTextVNode } from "./vnode/index";
import { patch } from "./patch";
import { Watcher } from "./watcher";

export function initLifeCycle(Vue) {
  Vue.prototype._render = function () {
    return this.$options.render.call(this);
  };
  Vue.prototype._update = function (vnode) {
    const vm = this;
    const el = vm.$el;
    const newElm = patch(el, vnode);
    vm.$el = newElm;
  };

  Vue.prototype._c = function (...args) {
    return createElementVNode(this, ...args);
  };
  Vue.prototype._v = function (...args) {
    return createTextVNode(this, ...args);
  };
  Vue.prototype._s = function (value) {
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return value;
  };
}

export function mountComponent(vm, el) {
  vm.$el = el;
  const updateComponent = function updateComponent() {
    const vnode = vm._render();
    vm._update(vnode);
  };
  const watcher = new Watcher(vm, updateComponent);
  console.log(watcher);
}

export function callHooks(vm, hook) {
  if (vm.$options[hook]) {
    vm.$options[hook].forEach((hook) => {
      hook.call(vm);
    });
  }
}
