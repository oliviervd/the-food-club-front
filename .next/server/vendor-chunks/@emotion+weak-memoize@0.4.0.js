"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@emotion+weak-memoize@0.4.0";
exports.ids = ["vendor-chunks/@emotion+weak-memoize@0.4.0"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/@emotion+weak-memoize@0.4.0/node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js":
/*!****************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@emotion+weak-memoize@0.4.0/node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js ***!
  \****************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ weakMemoize)\n/* harmony export */ });\nvar weakMemoize = function weakMemoize(func) {\n  var cache = new WeakMap();\n  return function (arg) {\n    if (cache.has(arg)) {\n      // Use non-null assertion because we just checked that the cache `has` it\n      // This allows us to remove `undefined` from the return value\n      return cache.get(arg);\n    }\n\n    var ret = func(arg);\n    cache.set(arg, ret);\n    return ret;\n  };\n};\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vQGVtb3Rpb24rd2Vhay1tZW1vaXplQDAuNC4wL25vZGVfbW9kdWxlcy9AZW1vdGlvbi93ZWFrLW1lbW9pemUvZGlzdC9lbW90aW9uLXdlYWstbWVtb2l6ZS5lc20uanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFa0MiLCJzb3VyY2VzIjpbIi9Vc2Vycy9vbGl2aWVydmFuZGh1eW5zbGFnZXIvV2Vic3Rvcm1Qcm9qZWN0cy9USEVfRk9PRF9DTFVCL25vZGVfbW9kdWxlcy8ucG5wbS9AZW1vdGlvbit3ZWFrLW1lbW9pemVAMC40LjAvbm9kZV9tb2R1bGVzL0BlbW90aW9uL3dlYWstbWVtb2l6ZS9kaXN0L2Vtb3Rpb24td2Vhay1tZW1vaXplLmVzbS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgd2Vha01lbW9pemUgPSBmdW5jdGlvbiB3ZWFrTWVtb2l6ZShmdW5jKSB7XG4gIHZhciBjYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG4gIHJldHVybiBmdW5jdGlvbiAoYXJnKSB7XG4gICAgaWYgKGNhY2hlLmhhcyhhcmcpKSB7XG4gICAgICAvLyBVc2Ugbm9uLW51bGwgYXNzZXJ0aW9uIGJlY2F1c2Ugd2UganVzdCBjaGVja2VkIHRoYXQgdGhlIGNhY2hlIGBoYXNgIGl0XG4gICAgICAvLyBUaGlzIGFsbG93cyB1cyB0byByZW1vdmUgYHVuZGVmaW5lZGAgZnJvbSB0aGUgcmV0dXJuIHZhbHVlXG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGFyZyk7XG4gICAgfVxuXG4gICAgdmFyIHJldCA9IGZ1bmMoYXJnKTtcbiAgICBjYWNoZS5zZXQoYXJnLCByZXQpO1xuICAgIHJldHVybiByZXQ7XG4gIH07XG59O1xuXG5leHBvcnQgeyB3ZWFrTWVtb2l6ZSBhcyBkZWZhdWx0IH07XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/@emotion+weak-memoize@0.4.0/node_modules/@emotion/weak-memoize/dist/emotion-weak-memoize.esm.js\n");

/***/ })

};
;