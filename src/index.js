import { initMixin } from "./init";
import { initLifeCycle } from "./lifecycle";
import { nextTick } from "./watcher";
import { initGlobalApi } from "./global-api/index.js";
import { initStateMixin } from "./state.js";

function Vue(options) {
  this._init(options);
  Vue.prototype.$nextTick = nextTick.bind(this);
}

initGlobalApi(Vue);
initMixin(Vue);
initStateMixin(Vue);
initLifeCycle(Vue);

export default Vue;
