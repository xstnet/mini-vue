import { mergeOptions } from "../utils/options.js";

export function initMixin(Vue) {
  Vue.options = {};
  Vue.mixin = function (mixin) {
    Vue.options = mergeOptions(Vue.options, mixin);
  };
}
