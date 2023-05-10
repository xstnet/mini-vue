import { Dep, popTarget, pushTarget } from "./dep";

let uid = 0;
export class Watcher {
  constructor(vm, expOrFn, options = {}, cb = undefined) {
    this.id = uid++;
    this.deps = [];
    this.depIds = new Set();
    if (typeof expOrFn === "function") {
      this.getter = expOrFn;
    } else {
      // 如果是字符串，代表用户自定义watcher
      this.getter = function watchGetter() {
        console.log("expOrFn", expOrFn);
        return vm[expOrFn];
      };
    }
    this.lazy = !!options.lazy;
    this.user = !!options.user;
    this.dirty = this.lazy;
    this.vm = vm;
    this.cb = cb;
    if (!this.lazy) {
      // 自定义标识
      if (!this.user) {
        this.renderWatcher = true;
      }
      this.value = this.get();
    } else {
      this.value = undefined;
      // 自定义标识
      this.computedWatcher = true;
    }
    if (this.user) {
      // 自定义标识
      this.userWatcher = true;
    }
  }
  get() {
    pushTarget(this);
    this.value = this.getter.call(this.vm);
    // 清空， 保证只在模板中取值时触发
    popTarget();
    return this.value;
  }
  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }
  addDep(dep) {
    if (!this.depIds.has(dep.id)) {
      this.depIds.add(dep.id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }
  update() {
    if (this.lazy) {
      this.dirty = true;
    } else {
      queueWatcher(this);
    }
  }
  run() {
    console.log("run");
    const oldValue = this.value;
    this.get();
    if (this.user) {
      this.cb.call(this.vm, oldValue, this.value);
    }
  }
  depend() {
    let i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  }
}

let queue = [];
let pending = false;
let has = new Set();
function queueWatcher(watcher) {
  if (!has.has(watcher.id)) {
    has.add(watcher.id);
    queue.push(watcher);
  }
  if (!pending) {
    pending = true;
    // setTimeout(() => {
    // flushQueue();
    nextTick(flushQueue);
    // }, 0);
  }
}

function flushQueue() {
  const copyQueue = queue.slice(0);
  pending = false;
  has.clear();
  pending = false;
  queue = [];
  copyQueue.forEach((watcher) => {
    watcher.run();
  });
}

let callbacks = [];
let waiting = false;

function flushCallbacks() {
  const callbackCopy = callbacks.slice(0);
  callbacks = [];
  waiting = false;
  callbackCopy.forEach((cb) => cb());
}

let timeFunc;
if (typeof Promise === "function") {
  timeFunc = (cb) => {
    Promise.resolve().then(cb());
  };
} else if (typeof MutationObserver === "function") {
  timeFunc = (cb) => {
    const textNode = document.createTextNode("1");
    const observer = new MutationObserver(cb);
    observer.observe(textNode, {
      characterData: true,
    });
    textNode.textContent = "2";
  };
} else if (typeof setImmediate === "function") {
  timeFunc = (cb) => setImmediate(cb);
} else {
  timeFunc = (cb) => {
    setTimeout(cb, 0);
  };
}

export function nextTick(callback) {
  callbacks.push(callback);
  if (!waiting) {
    waiting = true;
    timeFunc(flushCallbacks);
  }
}
