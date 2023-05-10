import { observe } from "./observer/observer";
import { Watcher } from "./watcher";
import { Dep } from "./dep.js";
import { compileToFunction } from "./compiler/index.js";
import { mountComponent } from "./lifecycle.js";

export function initState(vm) {
  const opts = vm.$options;
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }

  if (opts.methods) {
    initMethods(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}

function initMethods(vm) {
  const methods = vm.$options.methods;
  for (let method in methods) {
    vm[method] = methods[method].bind(vm);
  }
}

function initWatch(vm) {
  const watch = vm.$options.watch;
  for (let key in watch) {
    if (Array.isArray(watch[key])) {
      watch[key].forEach((item) => createWatcher(vm, key, item));
    } else {
      createWatcher(vm, key, watch[key]);
    }
  }
}

function createWatcher(vm, key, handler) {
  let options = {};
  if (typeof handler === "string") {
    // 取methods
    handler = vm[handler];
  }
  if (typeof handler === "object") {
    options = handler;
    handler = options.handler;
  }
  vm.$watch(key, handler, options);
}

function initData(vm) {
  const opts = vm.$options;
  const data = typeof opts.data === "function" ? opts.data.call(vm) : opts.data;
  vm._data = data;
  observe(data);
  Object.keys(data).forEach((key) => {
    proxy(vm, key, data);
  });
}

function proxy(vm, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm._data[key];
    },
    set(newValue) {
      vm._data[key] = newValue;
    },
  });
}

function initComputed(vm) {
  const computed = vm.$options.computed;

  const watchers = (vm._computedWatchers = {});
  for (let key in computed) {
    const userDef = computed[key];
    const getter = typeof userDef === "function" ? userDef : userDef.get;
    const setter =
      typeof userDef === "function" ? () => {} : userDef.set || (() => {});

    watchers[key] = new Watcher(vm, getter, { lazy: true });
    Object.defineProperty(vm, key, {
      get: makeComputedGetter(vm._computedWatchers[key]),
      set: setter,
    });
  }
}

function makeComputedGetter(watcher) {
  return function () {
    if (watcher.dirty) {
      watcher.evaluate();
    }
    if (Dep.target) {
      watcher.depend();
    }
    return watcher.value;
  };
}

export function initStateMixin(Vue) {
  Vue.prototype.$mount = function (el) {
    if (typeof el === "string") {
      el = document.querySelector(el);
    }
    const vm = this;
    let template = "";
    if (vm.template) {
      template = vm.template;
    } else if (el) {
      template = el.outerHTML;
    }
    if (template) {
      const render = compileToFunction(template);
      vm.$options.render = render;
    }

    mountComponent(vm, el);
  };

  Vue.prototype.$watch = function (expOrFn, cb, options) {
    options = options || {};
    options.user = true;
    new Watcher(this, expOrFn, options, cb);
  };
}
