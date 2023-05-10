import { ArrayMethods } from "./array";
import { Dep } from "../dep";

export function observe(data) {
  if (typeof data !== "object" || data === null) {
    return;
  }
  if (data.__ob__ && data.__ob__ instanceof Observer) {
    console.log("instance of Observer");

    return data.__ob__;
  }
  return new Observer(data);
}

class Observer {
  constructor(data) {
    this.dep = new Dep();
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false,
    });
    if (Array.isArray(data)) {
      data.__proto__ = ArrayMethods;
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }
  observeArray(data) {
    data.forEach((item) => observe(item));
  }

  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
}

function dependArray(arr) {
  arr.forEach((v) => {
    v.__ob__ && v.__ob__.dep.depend();
    if (Array.isArray(v)) {
      dependArray(v);
    }
  });
}

function defineReactive(data, key, value) {
  const dep = new Dep();

  let childOb = observe(value);

  Object.defineProperty(data, key, {
    get() {
      // console.log("Get, key=", key);
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          console.log("childOb", key);
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set(newValue) {
      console.log("Set, key=", key, "val=", newValue);

      if (newValue === value) return;
      value = newValue;
      observe(value);
      console.log("dep", dep);
      dep.notify();
    },
  });
}
