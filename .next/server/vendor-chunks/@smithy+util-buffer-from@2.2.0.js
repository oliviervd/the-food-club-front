"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@smithy+util-buffer-from@2.2.0";
exports.ids = ["vendor-chunks/@smithy+util-buffer-from@2.2.0"];
exports.modules = {

/***/ "(rsc)/./node_modules/.pnpm/@smithy+util-buffer-from@2.2.0/node_modules/@smithy/util-buffer-from/dist-es/index.js":
/*!******************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@smithy+util-buffer-from@2.2.0/node_modules/@smithy/util-buffer-from/dist-es/index.js ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   fromArrayBuffer: () => (/* binding */ fromArrayBuffer),\n/* harmony export */   fromString: () => (/* binding */ fromString)\n/* harmony export */ });\n/* harmony import */ var _smithy_is_array_buffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @smithy/is-array-buffer */ \"(rsc)/./node_modules/.pnpm/@smithy+is-array-buffer@2.2.0/node_modules/@smithy/is-array-buffer/dist-es/index.js\");\n/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! buffer */ \"buffer\");\n/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(buffer__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst fromArrayBuffer = (input, offset = 0, length = input.byteLength - offset) => {\n    if (!(0,_smithy_is_array_buffer__WEBPACK_IMPORTED_MODULE_0__.isArrayBuffer)(input)) {\n        throw new TypeError(`The \"input\" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);\n    }\n    return buffer__WEBPACK_IMPORTED_MODULE_1__.Buffer.from(input, offset, length);\n};\nconst fromString = (input, encoding) => {\n    if (typeof input !== \"string\") {\n        throw new TypeError(`The \"input\" argument must be of type string. Received type ${typeof input} (${input})`);\n    }\n    return encoding ? buffer__WEBPACK_IMPORTED_MODULE_1__.Buffer.from(input, encoding) : buffer__WEBPACK_IMPORTED_MODULE_1__.Buffer.from(input);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vQHNtaXRoeSt1dGlsLWJ1ZmZlci1mcm9tQDIuMi4wL25vZGVfbW9kdWxlcy9Ac21pdGh5L3V0aWwtYnVmZmVyLWZyb20vZGlzdC1lcy9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUF3RDtBQUN4QjtBQUN6QjtBQUNQLFNBQVMsc0VBQWE7QUFDdEIsdUZBQXVGLGNBQWMsR0FBRyxNQUFNO0FBQzlHO0FBQ0EsV0FBVywwQ0FBTTtBQUNqQjtBQUNPO0FBQ1A7QUFDQSwwRkFBMEYsY0FBYyxHQUFHLE1BQU07QUFDakg7QUFDQSxzQkFBc0IsMENBQU0seUJBQXlCLDBDQUFNO0FBQzNEIiwic291cmNlcyI6WyIvVXNlcnMvb2xpdmllcnZhbmRodXluc2xhZ2VyL1dlYnN0b3JtUHJvamVjdHMvVEhFX0ZPT0RfQ0xVQi9ub2RlX21vZHVsZXMvLnBucG0vQHNtaXRoeSt1dGlsLWJ1ZmZlci1mcm9tQDIuMi4wL25vZGVfbW9kdWxlcy9Ac21pdGh5L3V0aWwtYnVmZmVyLWZyb20vZGlzdC1lcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc0FycmF5QnVmZmVyIH0gZnJvbSBcIkBzbWl0aHkvaXMtYXJyYXktYnVmZmVyXCI7XG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyXCI7XG5leHBvcnQgY29uc3QgZnJvbUFycmF5QnVmZmVyID0gKGlucHV0LCBvZmZzZXQgPSAwLCBsZW5ndGggPSBpbnB1dC5ieXRlTGVuZ3RoIC0gb2Zmc2V0KSA9PiB7XG4gICAgaWYgKCFpc0FycmF5QnVmZmVyKGlucHV0KSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBUaGUgXCJpbnB1dFwiIGFyZ3VtZW50IG11c3QgYmUgQXJyYXlCdWZmZXIuIFJlY2VpdmVkIHR5cGUgJHt0eXBlb2YgaW5wdXR9ICgke2lucHV0fSlgKTtcbiAgICB9XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGlucHV0LCBvZmZzZXQsIGxlbmd0aCk7XG59O1xuZXhwb3J0IGNvbnN0IGZyb21TdHJpbmcgPSAoaW5wdXQsIGVuY29kaW5nKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBUaGUgXCJpbnB1dFwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuIFJlY2VpdmVkIHR5cGUgJHt0eXBlb2YgaW5wdXR9ICgke2lucHV0fSlgKTtcbiAgICB9XG4gICAgcmV0dXJuIGVuY29kaW5nID8gQnVmZmVyLmZyb20oaW5wdXQsIGVuY29kaW5nKSA6IEJ1ZmZlci5mcm9tKGlucHV0KTtcbn07XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/@smithy+util-buffer-from@2.2.0/node_modules/@smithy/util-buffer-from/dist-es/index.js\n");

/***/ })

};
;