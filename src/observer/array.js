const ArrayMethods = Object.create(Array.prototype);

["push", "pop", "shift", "unshift", "sort", "splice", "reverse"].forEach(
  (method) => {
    ArrayMethods[method] = function (...args) {
      const result = Array.prototype[method].call(this, ...args);
      let inserted = [];
      const ob = this.__ob__;
      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;
        case "splice":
          inserted = args.slice(2);
      }
      if (inserted.length) {
        ob.observeArray(inserted);
      }

      ob.dep.notify();
      return result;
    };
  }
);
export { ArrayMethods };
