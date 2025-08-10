let FunctionUtils = {};

FunctionUtils.getParameterNames = function(fn) {
    const fnStr = fn.toString()
    .replace(/[/][/].*$/mg, '')  // strip single-line comments
    .replace(/\s+/g, '')         // strip whitespace
    .replace(/[/][*][^/*]*[*][/]/g, ''); // strip multi-line comments

  const result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
  return result === null ? [] : result.map(param => param.split('=')[0]); // Remove default values
}

export {FunctionUtils};