import { Watcher } from "./watcher";

let uid = 0;
export class Dep {
  /** @var Watcher target */
  static target = null;
  constructor() {
    this.subs = [];
    this.id = uid++;
  }
  depend() {
    Dep.target.addDep(this);
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach((watcher) => {
      watcher.update();
    });
  }
}

const targetStack = [];
export function pushTarget(target) {
  targetStack.push(target);
  Dep.target = target;
}

export function popTarget() {
  targetStack.pop();
  // Dep.target = targetStack.length ? targetStack[targetStack.length - 1] : null;
  Dep.target = targetStack[targetStack.length - 1];
}
