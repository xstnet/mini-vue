type dataType = Record<string, any>;

interface Vm {
  $options: dataType;
  _data: dataType;
  $mount: () => void;
}

interface OptConfig {
  el: string;
  data: dataType | ((vm: Vm) => dataType);
}

type Vue = (options: OptConfig) => Vm;
