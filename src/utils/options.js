const strats = {};
const _lifeCycleHooks = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeDestroy",
  "destroyed",
];

_lifeCycleHooks.forEach((hook) => {
  strats[hook] = mergeHooks;
});

function mergeHooks(p, c) {
  if (!p) {
    if (c) {
      return [c];
    }
  }
  if (c) {
    return p.concat(c);
  }

  return p;
}

export function mergeOptions(parent = {}, child = {}) {
  const options = {};

  for (let key in parent) {
    mergeField(key);
  }
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }

  function mergeField(key) {
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key]);
    } else {
      options[key] = parent[key] || child[key];
    }
  }

  return options;
}
