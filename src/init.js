import { initState } from "./state";
import { callHooks } from "./lifecycle";
import { mergeOptions } from "./utils/options.js";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = mergeOptions(vm.constructor.options, options);
    callHooks(vm, "beforeCreate");
    initState(vm);
    callHooks(vm, "created");

    initRender(vm);
  };
}

function initRender(vm) {
  if (vm.$options.el) {
    vm.$mount(vm.$options.el);
  }
}
