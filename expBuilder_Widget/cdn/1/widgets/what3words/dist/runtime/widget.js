System.register(["jimu-core","jimu-arcgis","jimu-ui"], function(__WEBPACK_DYNAMIC_EXPORT__, __system_context__) {
	var __WEBPACK_EXTERNAL_MODULE_jimu_core__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_arcgis__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_ui__ = {};
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_core__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_arcgis__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_ui__, "__esModule", { value: true });
	return {
		setters: [
			function(module) {
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_core__[key] = module[key];
				});
			},
			function(module) {
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_arcgis__[key] = module[key];
				});
			},
			function(module) {
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_ui__[key] = module[key];
				});
			}
		],
		execute: function() {
			__WEBPACK_DYNAMIC_EXPORT__(
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./jimu-ui/lib/icons/duplicate.svg":
/*!*****************************************!*\
  !*** ./jimu-ui/lib/icons/duplicate.svg ***!
  \*****************************************/
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 12 12\"><path fill=\"#000\" fill-rule=\"nonzero\" d=\"M.5 9a.5.5 0 0 1-.5-.5V1a1 1 0 0 1 1-1h6.5a.5.5 0 0 1 0 1H1v7.5a.5.5 0 0 1-.5.5M3 3v8h8V3zm0-1h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1\"></path></svg>"

/***/ }),

/***/ "./jimu-ui/lib/icons/zoom-out-fixed.svg":
/*!**********************************************!*\
  !*** ./jimu-ui/lib/icons/zoom-out-fixed.svg ***!
  \**********************************************/
/***/ ((module) => {

module.exports = "<svg xmlns=\"http://www.w3.org/2000/svg\" xml:space=\"preserve\" viewBox=\"0 0 16 16\"><path d=\"M0 0h6v1.5H2.542L6 4.861v1.055L5.916 6H4.857L1.5 2.545V6H0zm10 0v1.5h3.457L10 4.861v1.055l.084.084h1.059L14.5 2.545V6H16V0zm4.5 13.455L11.143 10h-1.059l-.084.084v1.055l3.457 3.361H10V16h6v-6h-1.5zM4.857 10 1.5 13.455V10H0v6h6v-1.5H2.542L6 11.139v-1.055L5.916 10z\"></path></svg>"

/***/ }),

/***/ "./your-extensions/widgets/what3words/src/runtime/lib/style.ts":
/*!*********************************************************************!*\
  !*** ./your-extensions/widgets/what3words/src/runtime/lib/style.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getW3WStyle: () => (/* binding */ getW3WStyle)
/* harmony export */ });
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jimu-core */ "jimu-core");

function getW3WStyle(theme) {
    return (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.css) `
  
      .w3wBlock {
        display:block;
        white-space:nowrap;
        overflow:hidden;
      }
      .w3wRed {
        color:#E11F26;
      }
      .w3wCoords {
        background:#0A3049;
        width:100%;
        color:#fff;
        padding: 5px;
      }
      .w3wCoordsProp {
        display:inline-block;
        margin-right:20px;
        margin-left: 5px;
      }
      .w3wCoordsFirstCol {
        display:inline-block;
        margin-right:5px;
        font-weight: 700;
      }
      .float-right {
        float:right;
      }
      .actionButton {
        margin: 2px 2px 0px 2px;
      }
      .actionButton {
        color: #E11F26;
      }
      .actionButton:disabled{
        cursor: default;
      }
    `;
}


/***/ }),

/***/ "./your-extensions/widgets/what3words/src/runtime/locator-utils.ts":
/*!*************************************************************************!*\
  !*** ./your-extensions/widgets/what3words/src/runtime/locator-utils.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPoint: () => (/* binding */ createPoint),
/* harmony export */   getCurrentAddress: () => (/* binding */ getCurrentAddress),
/* harmony export */   getMapLabelGraphic: () => (/* binding */ getMapLabelGraphic),
/* harmony export */   getMarkerGraphic: () => (/* binding */ getMarkerGraphic)
/* harmony export */ });
/* harmony import */ var jimu_arcgis__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jimu-arcgis */ "jimu-arcgis");

const w3wIcon = __webpack_require__(/*! ../assets/w3wMarker.png */ "./your-extensions/widgets/what3words/src/assets/w3wMarker.png");
const getCurrentAddress = (geocodeURL, mapClick) => {
    if (!mapClick)
        return Promise.resolve(null);
    return (0,jimu_arcgis__WEBPACK_IMPORTED_MODULE_0__.loadArcGISJSAPIModules)(['esri/rest/locator']).then(modules => {
        const [locator] = modules;
        return createPoint(mapClick).then(point => {
            return locator.locationToAddress(geocodeURL, {
                location: point
            }, {
                query: {}
            }).then(response => {
                return Promise.resolve(response.address);
            }, err => {
                console.error(err.message);
                return err.message + ' - Check your Locator URL';
            });
        });
    });
};
const createPoint = (mapClick) => {
    if (!mapClick) {
        return Promise.resolve(null);
    }
    return (0,jimu_arcgis__WEBPACK_IMPORTED_MODULE_0__.loadArcGISJSAPIModules)(['esri/geometry/Point']).then(modules => {
        const [Point] = modules;
        return new Point({
            longitude: mapClick.longitude,
            latitude: mapClick.latitude,
            spatialReference: {
                wkid: 4326
            }
        });
    });
};
const getMarkerGraphic = (point) => {
    if (!point)
        return Promise.resolve(null);
    return (0,jimu_arcgis__WEBPACK_IMPORTED_MODULE_0__.loadArcGISJSAPIModules)(['esri/Graphic', 'esri/symbols/PictureMarkerSymbol']).then(modules => {
        let Graphic = null;
        let PictureMarkerSymbol;
        [Graphic, PictureMarkerSymbol] = modules;
        const symbol = new PictureMarkerSymbol({
            width: 25,
            height: 25,
            xoffset: 0,
            yoffset: 11,
            url: w3wIcon
        });
        return new Graphic({
            geometry: point,
            symbol: symbol
        });
    });
};
const getMapLabelGraphic = (point, what3words) => {
    if (!point)
        return Promise.resolve(null);
    return (0,jimu_arcgis__WEBPACK_IMPORTED_MODULE_0__.loadArcGISJSAPIModules)(['esri/Graphic']).then(modules => {
        let Graphic = null;
        [Graphic] = modules;
        const textSym = {
            type: 'text',
            text: '///' + what3words,
            font: { size: 12, weight: 'bold' },
            horizontalAlignment: 'left',
            kerning: true,
            rotated: false,
            color: [225, 31, 38, 1],
            haloColor: '#0A3049',
            haloSize: '1px',
            xoffset: 12,
            yoffset: 5
        };
        return new Graphic({
            geometry: point,
            symbol: textSym
        });
    });
};


/***/ }),

/***/ "./your-extensions/widgets/what3words/src/runtime/translations/default.ts":
/*!********************************************************************************!*\
  !*** ./your-extensions/widgets/what3words/src/runtime/translations/default.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    _widgetLabel: 'what3words',
    x: 'Longitude',
    y: 'Latitude',
    copy: 'Copy',
    copySuccessMessage: 'Copy Successful',
    zoomTo: 'Zoom To'
});


/***/ }),

/***/ "./your-extensions/widgets/what3words/src/assets/w3wMarker.png":
/*!*********************************************************************!*\
  !*** ./your-extensions/widgets/what3words/src/assets/w3wMarker.png ***!
  \*********************************************************************/
/***/ ((module) => {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAACxLAAAsSwGlPZapAAAFGmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDQtMDdUMTA6NDY6NTQrMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTA0LTA3VDEwOjUzOjUyKzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTA0LTA3VDEwOjUzOjUyKzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJmMWMxNGFiLTU4NDktNDVmYi05ODBjLWFjYTc5OTc3ZThiYyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDoyZjFjMTRhYi01ODQ5LTQ1ZmItOTgwYy1hY2E3OTk3N2U4YmMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyZjFjMTRhYi01ODQ5LTQ1ZmItOTgwYy1hY2E3OTk3N2U4YmMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjJmMWMxNGFiLTU4NDktNDVmYi05ODBjLWFjYTc5OTc3ZThiYyIgc3RFdnQ6d2hlbj0iMjAyMC0wNC0wN1QxMDo0Njo1NCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+G6jKbAAAB6dJREFUeJztm2tsVMcZhp+ZOXuxMfFtfUnMpeQmoCBw3bh2EzA0MRRoAjiJqNKkatVKVav+qpQ//K0qtZV6U9WLKqSqlaq0BDuhrSxupgRsDE2oKVRJqtAUAyYYe9c3vJeze2b64xwMSe2lkfdwWnXf1dFq95ud837veefb2TmzwhjDbFjQuPUysHDW4P8WpqYHuhfPFbTyfHCRD2SCQHm+oMwTmywwkaCQN498AvxfoChA0ASCRlGAoAkEjaIAQRMIGkUBgiYQNIoCBE0gaBQFCJpA0PBdACEEQgqSV4dJXhtBSIkQwo0pieNokpeukoyPIa1bv86FUqQzNskr75GcTr4vVkj4LoAWgunEBG2b22jd0EJy8gbaiznZHJlMhu2ffZLVaz9KZnzSFUwIcqkUllJs2r6J+roY9vS0L/x8FyA1PMpHli3m2K+/z8mXfsyihjpSiXGEEKQvXmFH+2O8+pNv8seffwtHQDKVRgOZwSFe/NIuDu75Dj/a/XXs63G0nn31aj7wVQAhBIwmeH7HZgAydhbb0SAlWe364MvPbgPgemIc7CxKSTKpNNTG+OpzT818jpyDN3IKCl8FSNtZqK6ko/0xAH7zhx6G//om0fKF2BNTVK58iCdamwD4ZddB9EicaCSMHonT0tJIQ20MgF90doOlZmpHIeGrAE58jOVNq2hc8SAArxzpBSGwpISRONvWNxMJhzDGsP9YP1RV4BhgOsXOxx8FYPDqML39A4iaal84+ieAEDA+wc6NnwQgMTHFkf4zUBvDdhywLJ5uXw/An06fZej83wlVVpBOp+G+Op7Z5MY6D52AoWtES6K+0PRNgIxtQ3Ulu7ZsAGB/Tx/pfwwSLSt17b/iQT697hEAOg8dh+kkYUthhuO0tjRy/+J7Aeg6ehKiEeQcy/fzhW8COKMJVjatZs3yBwDYd+gESIklBIzE2bLuEaKRMAC/f+00VFVgAFIpOjz7Xxy6Rl//GURdDH/S90sAIWBiih0bWwGIj0/Sc/INqIthaw2WRccT6wDX/lfOvUWoyrN/Qz1Pe/bfd/A4XPHP/uCTAK79q3h2cxsArx7pJfPuJaILXPtXLH+AbW2fAGDvgWMz9tfDcVqb17JsUT0AXT19UBr1tVL70rczOsaKplWs9ap/V08fKOXZP8HWdc1EI2Gv+p+C6qpZ7d9/+iyiNsZct+8KgcILIASMT7Fzg2v/xMQkPX1vQG3MnfxYio52z/6nBnjv/NuEqspJp1z7d2xyY10+V/+bKLgAGTsLsUqeuWn/nj4y714murCUzKRr/63rmwHYd+g4JNOu/UcStDSv5f5FbvXvPNoHpSW+z9UL3r8zmmBF0yoaV3r2P9wHSmIJCSMJtqxrpiQaAWD/a6chVokxQDJFx6fcOcPg1WFOnhpA1Fb7an8osADGGEil+cKT7QBMTE179q/GzmYRZQt4/jOPA3Ck/y9cPfsmocpy0jeSLHx4Gbu2bASg63Cv79X/JgovgJR8fNXDAHQdPkH6wkWiZQuw7SzinjLamtcA8KtXDkImQ1gpdCpFTV0NS+6rBWBv91FY4L/9If/+gA8NKSVWVQW7f7CHbW0t7NnXjVVXgxKCkmiE7I0kX9z9XVYsW8LLB44RXroIYwyRygouXxriG9/+GaGQ4tSZvxFpqPfd/gAizw6RCeCeD9uhDFncuB6H8UmIVVFWVY7O5ryVIcmNoWuQSqMa6ikpjaJzDkJKjNYkB4dAayJLGwhZFlrrO5/wzpicHuiec5NEwdeZdDZHaWU5VJbPvAZ3eBjHobS+5lbbnOPGvERLlzbcihUm+TuiuCgaNIGgURQgaAJBoyhA0ASCRlGAoAkEjaIAQRMIGkUBgiYQNIoC5ImF7xoLf5E3j3wC+L8edXeQN4986wHNgCosl5sQ4NvNrn+Dky+YT4DXC8nCIBHe5hiBA4jb3jMYz4wGgbh74hR+ReiDcBMzWNg4CEAg0BjUaqAGGBGY8xoHgcFCkMOaaec3fPwWcJNVZAmTIkwK0GjkZoPVaxDnwPQYxDmDOmmQm8GZaavIzvThJ3wRwDW1gyKFIg04OEgEcjvIAwYevb29gVZQBwRqew4FGBQ2ChuDQft4nXwZAhYWrgwSB4k73nWVQXdKtLtyHB+H66NQG6OsugKyOQyhTgdiAj1uvCGgsBFIHBR4w6mQ8EHamxXeHdF4AoB8wSAUgD02yZIlDXztxa+weEkD9tjMP9sUyM+DRCAAhfCS9qsw+uAAg0NulvdFowByjoM9NsHvXv4pLWtX8sJT7bS2fw5KIlhK4aCaZvv2dQX4L90naD7wmKNVFtzajqV4+5+XAdxnqbwrDgLs2c8hZo5CFsZ8d4b+805mLDtX8gKD3qXRv5VC4tg2WQMfW/kQA29dwDIGFQmhjUCSe06iXzJzJCm8OYPGynO+92N6oHvO2LwdIBC3CSBnPbw2eyVi0BiDikYxxvD6iT+jtUaVRDFGINGDAr3XTUzPcRjA8eYI83fCvGqAwaBQWFh5rO9CIIwN7Zpcr3Sc2mgkDPe6d4ON46CR1xVOe4isM9fVv9WXJockh5p3cbyrP4cNvCOQawTmh2AuABPABYH5nsBZY+Cdu8kH4F8uRvBg2ETTaQAAAABJRU5ErkJggg=="

/***/ }),

/***/ "jimu-arcgis":
/*!******************************!*\
  !*** external "jimu-arcgis" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_arcgis__;

/***/ }),

/***/ "jimu-core":
/*!****************************!*\
  !*** external "jimu-core" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_core__;

/***/ }),

/***/ "jimu-ui":
/*!**************************!*\
  !*** external "jimu-ui" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_ui__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!******************************************!*\
  !*** ./jimu-core/lib/set-public-path.ts ***!
  \******************************************/
/**
 * Webpack will replace __webpack_public_path__ with __webpack_require__.p to set the public path dynamically.
 * The reason why we can't set the publicPath in webpack config is: we change the publicPath when download.
 * */
// eslint-disable-next-line
// @ts-ignore
__webpack_require__.p = window.jimuConfig.baseUrl;

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*******************************************************************!*\
  !*** ./your-extensions/widgets/what3words/src/runtime/widget.tsx ***!
  \*******************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __set_webpack_public_path__: () => (/* binding */ __set_webpack_public_path__),
/* harmony export */   "default": () => (/* binding */ Widget)
/* harmony export */ });
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jimu-core */ "jimu-core");
/* harmony import */ var jimu_arcgis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jimu-arcgis */ "jimu-arcgis");
/* harmony import */ var _locator_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./locator-utils */ "./your-extensions/widgets/what3words/src/runtime/locator-utils.ts");
/* harmony import */ var _lib_style__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/style */ "./your-extensions/widgets/what3words/src/runtime/lib/style.ts");
/* harmony import */ var _translations_default__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./translations/default */ "./your-extensions/widgets/what3words/src/runtime/translations/default.ts");
/* harmony import */ var jimu_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! jimu-ui */ "jimu-ui");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/** @jsx jsx */






const iconCopy = __webpack_require__(/*! jimu-ui/lib/icons/duplicate.svg */ "./jimu-ui/lib/icons/duplicate.svg");
const iconZoom = __webpack_require__(/*! jimu-ui/lib/icons/zoom-out-fixed.svg */ "./jimu-ui/lib/icons/zoom-out-fixed.svg");
class Widget extends jimu_core__WEBPACK_IMPORTED_MODULE_0__.React.PureComponent {
    constructor(props) {
        var _a, _b, _c;
        super(props);
        this.zoomScale = 5000;
        this.nls = (id) => {
            return this.props.intl.formatMessage({ id: id, defaultMessage: _translations_default__WEBPACK_IMPORTED_MODULE_4__["default"][id] });
        };
        this.onZoomClick = () => {
            if (this.mapView.graphics.length > 0) {
                const selectedLocationGraphic = this.mapView.graphics.getItemAt(0);
                this.mapView.goTo({
                    center: selectedLocationGraphic.geometry,
                    scale: this.zoomScale
                });
            }
        };
        this.onCopyClick = () => {
            //clear prev selection
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            }
            //copy input
            navigator.clipboard.writeText(this.state.what3words);
            this.setState({
                isCopyMessageOpen: true
            });
            setTimeout(() => {
                //Remove the existing selection
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                }
                this.setState({
                    isCopyMessageOpen: false
                });
            }, 500);
        };
        this.onActiveViewChange = (jmv) => {
            if (!jmv)
                return;
            this.mapView = jmv.view;
            this.setState({
                jimuMapView: jmv
            });
            this.setState({
                w3wLocator: this.state.w3wLocator
            });
            this.mapView.on('click', (mapClick) => __awaiter(this, void 0, void 0, function* () {
                this.mapView.graphics.removeAll();
                this.mapView.popup.autoOpenEnabled = false;
                const graphic = yield (0,_locator_utils__WEBPACK_IMPORTED_MODULE_2__.getMarkerGraphic)(mapClick.mapPoint);
                this.setState({
                    latitude: mapClick.mapPoint.latitude.toFixed(4),
                    longitude: mapClick.mapPoint.longitude.toFixed(4)
                });
                // eslint-disable-next-line no-lone-blocks
                {
                    this.props.config.displayPopupMessage &&
                        this.mapView.popup.open({
                            title: 'Reverse geocode for ' + `${this.state.latitude}, ${this.state.longitude}`,
                            location: mapClick.mapPoint
                        });
                }
                (0,_locator_utils__WEBPACK_IMPORTED_MODULE_2__.getCurrentAddress)(this.state.w3wLocator, mapClick.mapPoint).then((response) => __awaiter(this, void 0, void 0, function* () {
                    this.setState({
                        what3words: response
                    });
                    const mapLabel = yield (0,_locator_utils__WEBPACK_IMPORTED_MODULE_2__.getMapLabelGraphic)(mapClick.mapPoint, response);
                    this.mapView.popup.content = 'what3words address: ' + `///${response}`;
                    this.mapView.graphics.add(graphic);
                    this.mapView.graphics.add(mapLabel);
                    this.mapView.set({ center: mapClick.mapPoint }); // center to the point
                })).catch((error) => {
                    console.log('error: ' + error);
                    this.mapView.popup.content = 'No address was found for this location';
                    this.mapView.graphics.removeAll();
                });
            }));
        };
        this.componentWillUnmount = () => {
            console.log('Component will unmount');
            this._isMounted = false;
            this.mapView.graphics.removeAll();
        };
        let geocodeServiceURL = '';
        if ((_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.addressSettings) === null || _b === void 0 ? void 0 : _b.geocodeServiceUrl) {
            geocodeServiceURL = this.props.config.addressSettings.geocodeServiceUrl;
        }
        else if (this.props.portalSelf && this.props.portalSelf.helperServices && this.props.portalSelf.helperServices.geocode &&
            this.props.portalSelf.helperServices.geocode.length > 0 && this.props.portalSelf.helperServices.geocode[0].url) { // Use org's first geocode service if available
            geocodeServiceURL = this.props.portalSelf.helperServices.geocode[0].url;
        }
        this._isMounted = false;
        this.isRTL = false;
        const appState = (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.getAppStore)().getState();
        this.isRTL = (_c = appState === null || appState === void 0 ? void 0 : appState.appContext) === null || _c === void 0 ? void 0 : _c.isRTL;
        this.state = {
            w3wLocator: geocodeServiceURL,
            JimuMapView: null,
            latitude: '',
            longitude: '',
            what3words: null,
            isCopyMessageOpen: false
        };
    }
    componentDidMount() {
        console.log('Component did mount');
        this._isMounted = true;
    }
    componentDidUpdate(prevProps) {
        var _a, _b;
        console.log('Component did update');
        //check for the updated geocode service url in config
        if (((_a = prevProps.config.addressSettings) === null || _a === void 0 ? void 0 : _a.geocodeServiceUrl) !== ((_b = this.props.config.addressSettings) === null || _b === void 0 ? void 0 : _b.geocodeServiceUrl)) {
            this.setState({
                w3wLocator: this.props.config.addressSettings.geocodeServiceUrl
            });
        }
    }
    render() {
        var _a;
        return (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { css: (0,_lib_style__WEBPACK_IMPORTED_MODULE_3__.getW3WStyle)(this.props.theme), className: "widget-starter jimu-widget" },
            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("h5", null, "Reverse Geocode with your what3words locator"),
            {}.hasOwnProperty.call(this.props, 'useMapWidgetIds') &&
                this.props.useMapWidgetIds &&
                this.props.useMapWidgetIds.length === 1 && ((0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_arcgis__WEBPACK_IMPORTED_MODULE_1__.JimuMapViewComponent, { useMapWidgetId: (_a = this.props.useMapWidgetIds) === null || _a === void 0 ? void 0 : _a[0], onActiveViewChange: this.onActiveViewChange })),
            this.props.config.displayCopyButton &&
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_5__.Button, { type: 'tertiary', "aria-label": this.nls('copy'), "aria-disabled": !this.state.what3words, title: this.nls('copy'), className: 'float-right actionButton', icon: true, size: 'sm', active: this.state.isCopyMessageOpen, disabled: !this.state.what3words, id: 'refCopy' + this.props.id, onClick: this.onCopyClick.bind(this) },
                    (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_5__.Icon, { icon: iconCopy, size: '17' })),
            this.props.config.displayZoomButton &&
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_5__.Button, { type: 'tertiary', "aria-label": this.nls('zoomTo'), "aria-disabled": !this.state.what3words, title: this.nls('zoomTo'), className: 'float-right actionButton', icon: true, size: 'sm', onClick: this.onZoomClick.bind(this), disabled: !this.state.what3words },
                    (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_5__.Icon, { icon: iconZoom, size: '17' })),
            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: "w3wBlock" },
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: 'w3wRed' }, "///"),
                this.state.what3words),
            this.props.config.displayCoordinates &&
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w3wCoords" },
                    (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w3wCoordsProp" },
                        (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: 'w3wRed w3wCoordsFirstCol' },
                            _translations_default__WEBPACK_IMPORTED_MODULE_4__["default"].y,
                            ":"),
                        (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", null, this.state.latitude)),
                    (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: "w3wCoordsProp" },
                        (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", { className: 'w3wRed w3wCoordsFirstCol' },
                            _translations_default__WEBPACK_IMPORTED_MODULE_4__["default"].x,
                            ":"),
                        (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", null, this.state.longitude))),
            this.state.isCopyMessageOpen &&
                (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_5__.Popper, { open: this.state.isCopyMessageOpen, version: 0, placement: 'bottom', showArrow: true, reference: 'refCopy' + this.props.id, offset: [0, 0] },
                    (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: 'p-2' }, this.nls('copySuccessMessage'))));
    }
}
function __set_webpack_public_path__(url) { __webpack_require__.p = url; }

})();

/******/ 	return __webpack_exports__;
/******/ })()

			);
		}
	};
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0cy93aGF0M3dvcmRzL2Rpc3QvcnVudGltZS93aWRnZXQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7Ozs7Ozs7OztBQ0FpRTtBQUMxRCxTQUFTLFdBQVcsQ0FBRSxLQUFxQjtJQUNoRCxPQUFPLDhDQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQXNDUDtBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeENtRDtBQUNwRCxNQUFNLE9BQU8sR0FBRyxtQkFBTyxDQUFDLDhGQUF5QixDQUFDO0FBRTNDLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxVQUFrQixFQUFFLFFBQWUsRUFBRSxFQUFFO0lBQ3ZFLElBQUksQ0FBQyxRQUFRO1FBQUUsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUMzQyxPQUFPLG1FQUFzQixDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUNsRSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTztRQUN6QixPQUFPLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDeEMsT0FBTyxPQUFPLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFO2dCQUMzQyxRQUFRLEVBQUUsS0FBSzthQUNoQixFQUFFO2dCQUNELEtBQUssRUFBRSxFQUFFO2FBQ1YsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDakIsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7WUFDMUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNQLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztnQkFDMUIsT0FBTyxHQUFHLENBQUMsT0FBTyxHQUFHLDJCQUEyQjtZQUNsRCxDQUFDLENBQUM7UUFDSixDQUFDLENBQUM7SUFDSixDQUFDLENBQUM7QUFDSixDQUFDO0FBRU0sTUFBTSxXQUFXLEdBQUcsQ0FBQyxRQUFhLEVBQWtCLEVBQUU7SUFDM0QsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2QsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztJQUM5QixDQUFDO0lBQ0QsT0FBTyxtRUFBc0IsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDcEUsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU87UUFDdkIsT0FBTyxJQUFJLEtBQUssQ0FBQztZQUNmLFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUztZQUM3QixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVE7WUFDM0IsZ0JBQWdCLEVBQUU7Z0JBQ2hCLElBQUksRUFBRSxJQUFJO2FBQ1g7U0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVNLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxLQUFZLEVBQUUsRUFBRTtJQUMvQyxJQUFJLENBQUMsS0FBSztRQUFFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDeEMsT0FBTyxtRUFBc0IsQ0FBQyxDQUFDLGNBQWMsRUFBRSxrQ0FBa0MsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ2pHLElBQUksT0FBTyxHQUE4QixJQUFJO1FBQzdDLElBQUksbUJBQXNEO1FBQzFELENBQUMsT0FBTyxFQUFFLG1CQUFtQixDQUFDLEdBQUcsT0FBTztRQUN4QyxNQUFNLE1BQU0sR0FBRyxJQUFJLG1CQUFtQixDQUFDO1lBQ3JDLEtBQUssRUFBRSxFQUFFO1lBQ1QsTUFBTSxFQUFFLEVBQUU7WUFDVixPQUFPLEVBQUUsQ0FBQztZQUNWLE9BQU8sRUFBRSxFQUFFO1lBQ1gsR0FBRyxFQUFFLE9BQU87U0FDYixDQUFDO1FBQ0YsT0FBTyxJQUFJLE9BQU8sQ0FBQztZQUNqQixRQUFRLEVBQUUsS0FBSztZQUNmLE1BQU0sRUFBRSxNQUFNO1NBQ2YsQ0FBQztJQUNKLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFTSxNQUFNLGtCQUFrQixHQUFHLENBQUMsS0FBWSxFQUFFLFVBQWtCLEVBQUUsRUFBRTtJQUNyRSxJQUFJLENBQUMsS0FBSztRQUFFLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDeEMsT0FBTyxtRUFBc0IsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQzdELElBQUksT0FBTyxHQUE4QixJQUFJLENBQUM7UUFDOUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPO1FBQ25CLE1BQU0sT0FBTyxHQUFHO1lBQ2QsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsS0FBSyxHQUFHLFVBQVU7WUFDeEIsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO1lBQ2xDLG1CQUFtQixFQUFFLE1BQU07WUFDM0IsT0FBTyxFQUFFLElBQUk7WUFDYixPQUFPLEVBQUUsS0FBSztZQUNkLEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN2QixTQUFTLEVBQUUsU0FBUztZQUNwQixRQUFRLEVBQUUsS0FBSztZQUNmLE9BQU8sRUFBRSxFQUFFO1lBQ1gsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELE9BQU8sSUFBSSxPQUFPLENBQUM7WUFDakIsUUFBUSxFQUFFLEtBQUs7WUFDZixNQUFNLEVBQUUsT0FBTztTQUNoQixDQUFDO0lBQ0osQ0FBQyxDQUFDO0FBQ0osQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ2xGRCxpRUFBZTtJQUNiLFlBQVksRUFBRSxZQUFZO0lBQzFCLENBQUMsRUFBRSxXQUFXO0lBQ2QsQ0FBQyxFQUFFLFVBQVU7SUFDYixJQUFJLEVBQUUsTUFBTTtJQUNaLGtCQUFrQixFQUFFLGlCQUFpQjtJQUNyQyxNQUFNLEVBQUUsU0FBUztDQUNsQjs7Ozs7Ozs7Ozs7QUNQRCxpQ0FBaUM7Ozs7Ozs7Ozs7O0FDQWpDOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7Ozs7Ozs7OztBQ0FBOzs7S0FHSztBQUNMLDJCQUEyQjtBQUMzQixhQUFhO0FBQ2IscUJBQXVCLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNObkQsZUFBZTtBQUNvRDtBQUNKO0FBQzBCO0FBQ2hEO0FBQ1c7QUFDTjtBQUU5QyxNQUFNLFFBQVEsR0FBRyxtQkFBTyxDQUFDLDBFQUFpQyxDQUFDO0FBQzNELE1BQU0sUUFBUSxHQUFHLG1CQUFPLENBQUMsb0ZBQXNDLENBQUM7QUFFakQsTUFBTSxNQUFPLFNBQVEsNENBQUssQ0FBQyxhQUF1QztJQU8vRSxZQUFhLEtBQUs7O1FBQ2hCLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFKZCxjQUFTLEdBQUcsSUFBSTtRQThCaEIsUUFBRyxHQUFHLENBQUMsRUFBVSxFQUFFLEVBQUU7WUFDbkIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLGNBQWMsRUFBRSw2REFBZSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDdkYsQ0FBQztRQU9ELGdCQUFXLEdBQUcsR0FBRyxFQUFFO1lBQ2pCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUNyQyxNQUFNLHVCQUF1QixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO29CQUNoQixNQUFNLEVBQUUsdUJBQXVCLENBQUMsUUFBUTtvQkFDeEMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTO2lCQUN0QixDQUFDO1lBQ0osQ0FBQztRQUNILENBQUM7UUFFRCxnQkFBVyxHQUFHLEdBQUcsRUFBRTtZQUNqQixzQkFBc0I7WUFDdEIsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUU7WUFDekMsQ0FBQztZQUVELFlBQVk7WUFDWixTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztZQUNwRCxJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNaLGlCQUFpQixFQUFFLElBQUk7YUFDeEIsQ0FBQztZQUVGLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsK0JBQStCO2dCQUMvQixJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDeEIsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLGVBQWUsRUFBRTtnQkFDekMsQ0FBQztnQkFDRCxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUNaLGlCQUFpQixFQUFFLEtBQUs7aUJBQ3pCLENBQUM7WUFDSixDQUFDLEVBQUUsR0FBRyxDQUFDO1FBQ1QsQ0FBQztRQUVELHVCQUFrQixHQUFHLENBQUMsR0FBZ0IsRUFBRSxFQUFFO1lBQ3hDLElBQUksQ0FBQyxHQUFHO2dCQUFFLE9BQU07WUFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSTtZQUV2QixJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNaLFdBQVcsRUFBRSxHQUFHO2FBQ2pCLENBQUM7WUFDRixJQUFJLENBQUMsUUFBUSxDQUFDO2dCQUNaLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVU7YUFDbEMsQ0FBQztZQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFPLFFBQWEsRUFBRSxFQUFFO2dCQUMvQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7Z0JBQ2pDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxLQUFLO2dCQUMxQyxNQUFNLE9BQU8sR0FBRyxNQUFNLGdFQUFnQixDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7Z0JBQ3pELElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ1osUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQy9DLFNBQVMsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2lCQUNsRCxDQUFDO2dCQUNGLDBDQUEwQztnQkFDMUMsQ0FBQztvQkFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUI7d0JBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQzs0QkFDdEIsS0FBSyxFQUFFLHNCQUFzQixHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7NEJBQ2pGLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUTt5QkFDNUIsQ0FBQztnQkFDRixDQUFDO2dCQUNELGlFQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBTSxRQUFRLEVBQUMsRUFBRTtvQkFDaEYsSUFBSSxDQUFDLFFBQVEsQ0FBQzt3QkFDWixVQUFVLEVBQUUsUUFBUTtxQkFDckIsQ0FBQztvQkFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLGtFQUFrQixDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDO29CQUN0RSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsc0JBQXNCLEdBQUcsTUFBTSxRQUFRLEVBQUU7b0JBQ3RFLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7b0JBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7b0JBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFDLHNCQUFzQjtnQkFDeEUsQ0FBQyxFQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztvQkFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLHdDQUF3QztvQkFDckUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFO2dCQUNuQyxDQUFDLENBQUM7WUFDSixDQUFDLEVBQUM7UUFDSixDQUFDO1FBWUQseUJBQW9CLEdBQUcsR0FBRyxFQUFFO1lBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUM7WUFDckMsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLO1lBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNuQyxDQUFDO1FBM0hDLElBQUksaUJBQWlCLEdBQUcsRUFBRTtRQUUxQixJQUFJLGdCQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sMENBQUUsZUFBZSwwQ0FBRSxpQkFBaUIsRUFBRSxDQUFDO1lBQzFELGlCQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUI7UUFDekUsQ0FBQzthQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxPQUFPO1lBQ3RILElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsK0NBQStDO1lBQ2pLLGlCQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRztRQUN6RSxDQUFDO1FBRUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSztRQUVsQixNQUFNLFFBQVEsR0FBRyxzREFBVyxFQUFFLENBQUMsUUFBUSxFQUFFO1FBQ3pDLElBQUksQ0FBQyxLQUFLLEdBQUcsY0FBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLFVBQVUsMENBQUUsS0FBSztRQUV4QyxJQUFJLENBQUMsS0FBSyxHQUFHO1lBQ1gsVUFBVSxFQUFFLGlCQUFpQjtZQUM3QixXQUFXLEVBQUUsSUFBSTtZQUNqQixRQUFRLEVBQUUsRUFBRTtZQUNaLFNBQVMsRUFBRSxFQUFFO1lBQ2IsVUFBVSxFQUFFLElBQUk7WUFDaEIsaUJBQWlCLEVBQUUsS0FBSztTQUN6QjtJQUNILENBQUM7SUFNRCxpQkFBaUI7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDO1FBQ2xDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSTtJQUN4QixDQUFDO0lBNkVELGtCQUFrQixDQUFFLFNBQVM7O1FBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUM7UUFDbkMscURBQXFEO1FBQ3JELElBQUksZ0JBQVMsQ0FBQyxNQUFNLENBQUMsZUFBZSwwQ0FBRSxpQkFBaUIsT0FBSyxVQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLDBDQUFFLGlCQUFpQixHQUFFLENBQUM7WUFDakgsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDWixVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLGlCQUFpQjthQUNoRSxDQUFDO1FBQ0osQ0FBQztJQUNILENBQUM7SUFRRCxNQUFNOztRQUNKLE9BQU8sd0RBQUssR0FBRyxFQUFFLHVEQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUMsNEJBQTRCO1lBQ3BGLDBHQUFxRDtZQUNwRCxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDO2dCQUNwRCxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWU7Z0JBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FDekMsK0NBQUMsNkRBQW9CLElBQ25CLGNBQWMsRUFBRSxVQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsMENBQUcsQ0FBQyxDQUFDLEVBQy9DLGtCQUFrQixFQUFFLElBQUksQ0FBQyxrQkFBa0IsR0FDckIsQ0FDM0I7WUFDQSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUI7Z0JBQ3BDLCtDQUFDLDJDQUFNLElBQUMsSUFBSSxFQUFDLFVBQVUsZ0JBQWEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsbUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsU0FBUyxFQUFDLDBCQUEwQixFQUFDLElBQUksUUFBQyxJQUFJLEVBQUUsSUFBSSxFQUN4SyxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQzNJLCtDQUFDLHlDQUFJLElBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxHQUFTLENBQ2xDO1lBRVIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsaUJBQWlCO2dCQUNwQywrQ0FBQywyQ0FBTSxJQUFDLElBQUksRUFBQyxVQUFVLGdCQUFhLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLG1CQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFNBQVMsRUFBQywwQkFBMEIsRUFBQyxJQUFJLFFBQUMsSUFBSSxFQUFFLElBQUksRUFDN0ssT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVTtvQkFDckUsK0NBQUMseUNBQUksSUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEdBQVMsQ0FDakM7WUFFVix1REFBSSxTQUFTLEVBQUMsVUFBVTtnQkFDcEIseURBQU0sU0FBUyxFQUFDLFFBQVEsVUFBVztnQkFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FDeEQ7WUFDSixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0I7Z0JBQ3JDLHdEQUFLLFNBQVMsRUFBQyxXQUFXO29CQUN4Qix3REFBSyxTQUFTLEVBQUMsZUFBZTt3QkFBQyx5REFBTSxTQUFTLEVBQUMsMEJBQTBCOzRCQUFFLDZEQUFlLENBQUMsQ0FBQztnQ0FBUzt3QkFBQSw2REFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBUSxDQUFNO29CQUM3SSx3REFBSyxTQUFTLEVBQUMsZUFBZTt3QkFBQyx5REFBTSxTQUFTLEVBQUMsMEJBQTBCOzRCQUFFLDZEQUFlLENBQUMsQ0FBQztnQ0FBUzt3QkFBQSw2REFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBUSxDQUFNLENBQzFJO1lBR0wsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUI7Z0JBQzNCLCtDQUFDLDJDQUFNLElBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQ2xDLE9BQU8sRUFBRSxDQUFDLEVBQ1YsU0FBUyxFQUFFLFFBQVEsRUFDbkIsU0FBUyxFQUFFLElBQUksRUFDZixTQUFTLEVBQUUsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUNwQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNkLHdEQUFLLFNBQVMsRUFBRSxLQUFLLElBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFPLENBQ3RELENBRVA7SUFDUixDQUFDO0NBQ0Y7QUFFTyxTQUFTLDJCQUEyQixDQUFDLEdBQUcsSUFBSSxxQkFBdUIsR0FBRyxHQUFHLEVBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2V4Yi1jbGllbnQvLi9qaW11LXVpL2xpYi9pY29ucy9kdXBsaWNhdGUuc3ZnIiwid2VicGFjazovL2V4Yi1jbGllbnQvLi9qaW11LXVpL2xpYi9pY29ucy96b29tLW91dC1maXhlZC5zdmciLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC8uL3lvdXItZXh0ZW5zaW9ucy93aWRnZXRzL3doYXQzd29yZHMvc3JjL3J1bnRpbWUvbGliL3N0eWxlLnRzIiwid2VicGFjazovL2V4Yi1jbGllbnQvLi95b3VyLWV4dGVuc2lvbnMvd2lkZ2V0cy93aGF0M3dvcmRzL3NyYy9ydW50aW1lL2xvY2F0b3ItdXRpbHMudHMiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC8uL3lvdXItZXh0ZW5zaW9ucy93aWRnZXRzL3doYXQzd29yZHMvc3JjL3J1bnRpbWUvdHJhbnNsYXRpb25zL2RlZmF1bHQudHMiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC8uL3lvdXItZXh0ZW5zaW9ucy93aWRnZXRzL3doYXQzd29yZHMvc3JjL2Fzc2V0cy93M3dNYXJrZXIucG5nIiwid2VicGFjazovL2V4Yi1jbGllbnQvZXh0ZXJuYWwgc3lzdGVtIFwiamltdS1hcmNnaXNcIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtY29yZVwiIiwid2VicGFjazovL2V4Yi1jbGllbnQvZXh0ZXJuYWwgc3lzdGVtIFwiamltdS11aVwiIiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svcnVudGltZS9wdWJsaWNQYXRoIiwid2VicGFjazovL2V4Yi1jbGllbnQvLi9qaW11LWNvcmUvbGliL3NldC1wdWJsaWMtcGF0aC50cyIsIndlYnBhY2s6Ly9leGItY2xpZW50Ly4veW91ci1leHRlbnNpb25zL3dpZGdldHMvd2hhdDN3b3Jkcy9zcmMvcnVudGltZS93aWRnZXQudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgdmlld0JveD1cXFwiMCAwIDEyIDEyXFxcIj48cGF0aCBmaWxsPVxcXCIjMDAwXFxcIiBmaWxsLXJ1bGU9XFxcIm5vbnplcm9cXFwiIGQ9XFxcIk0uNSA5YS41LjUgMCAwIDEtLjUtLjVWMWExIDEgMCAwIDEgMS0xaDYuNWEuNS41IDAgMCAxIDAgMUgxdjcuNWEuNS41IDAgMCAxLS41LjVNMyAzdjhoOFYzem0wLTFoOGExIDEgMCAwIDEgMSAxdjhhMSAxIDAgMCAxLTEgMUgzYTEgMSAwIDAgMS0xLTFWM2ExIDEgMCAwIDEgMS0xXFxcIj48L3BhdGg+PC9zdmc+XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHhtbDpzcGFjZT1cXFwicHJlc2VydmVcXFwiIHZpZXdCb3g9XFxcIjAgMCAxNiAxNlxcXCI+PHBhdGggZD1cXFwiTTAgMGg2djEuNUgyLjU0Mkw2IDQuODYxdjEuMDU1TDUuOTE2IDZINC44NTdMMS41IDIuNTQ1VjZIMHptMTAgMHYxLjVoMy40NTdMMTAgNC44NjF2MS4wNTVsLjA4NC4wODRoMS4wNTlMMTQuNSAyLjU0NVY2SDE2VjB6bTQuNSAxMy40NTVMMTEuMTQzIDEwaC0xLjA1OWwtLjA4NC4wODR2MS4wNTVsMy40NTcgMy4zNjFIMTBWMTZoNnYtNmgtMS41ek00Ljg1NyAxMCAxLjUgMTMuNDU1VjEwSDB2Nmg2di0xLjVIMi41NDJMNiAxMS4xMzl2LTEuMDU1TDUuOTE2IDEwelxcXCI+PC9wYXRoPjwvc3ZnPlwiIiwiaW1wb3J0IHsgVGhlbWVWYXJpYWJsZXMsIGNzcywgU2VyaWFsaXplZFN0eWxlcyB9IGZyb20gJ2ppbXUtY29yZSdcbmV4cG9ydCBmdW5jdGlvbiBnZXRXM1dTdHlsZSAodGhlbWU6IFRoZW1lVmFyaWFibGVzKTogU2VyaWFsaXplZFN0eWxlcyB7XG4gIHJldHVybiBjc3NgXG4gIFxuICAgICAgLnczd0Jsb2NrIHtcbiAgICAgICAgZGlzcGxheTpibG9jaztcbiAgICAgICAgd2hpdGUtc3BhY2U6bm93cmFwO1xuICAgICAgICBvdmVyZmxvdzpoaWRkZW47XG4gICAgICB9XG4gICAgICAudzN3UmVkIHtcbiAgICAgICAgY29sb3I6I0UxMUYyNjtcbiAgICAgIH1cbiAgICAgIC53M3dDb29yZHMge1xuICAgICAgICBiYWNrZ3JvdW5kOiMwQTMwNDk7XG4gICAgICAgIHdpZHRoOjEwMCU7XG4gICAgICAgIGNvbG9yOiNmZmY7XG4gICAgICAgIHBhZGRpbmc6IDVweDtcbiAgICAgIH1cbiAgICAgIC53M3dDb29yZHNQcm9wIHtcbiAgICAgICAgZGlzcGxheTppbmxpbmUtYmxvY2s7XG4gICAgICAgIG1hcmdpbi1yaWdodDoyMHB4O1xuICAgICAgICBtYXJnaW4tbGVmdDogNXB4O1xuICAgICAgfVxuICAgICAgLnczd0Nvb3Jkc0ZpcnN0Q29sIHtcbiAgICAgICAgZGlzcGxheTppbmxpbmUtYmxvY2s7XG4gICAgICAgIG1hcmdpbi1yaWdodDo1cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgICB9XG4gICAgICAuZmxvYXQtcmlnaHQge1xuICAgICAgICBmbG9hdDpyaWdodDtcbiAgICAgIH1cbiAgICAgIC5hY3Rpb25CdXR0b24ge1xuICAgICAgICBtYXJnaW46IDJweCAycHggMHB4IDJweDtcbiAgICAgIH1cbiAgICAgIC5hY3Rpb25CdXR0b24ge1xuICAgICAgICBjb2xvcjogI0UxMUYyNjtcbiAgICAgIH1cbiAgICAgIC5hY3Rpb25CdXR0b246ZGlzYWJsZWR7XG4gICAgICAgIGN1cnNvcjogZGVmYXVsdDtcbiAgICAgIH1cbiAgICBgXG59XG4iLCJpbXBvcnQgUG9pbnQgZnJvbSAnZXNyaS9nZW9tZXRyeS9Qb2ludCdcbmltcG9ydCB7IGxvYWRBcmNHSVNKU0FQSU1vZHVsZXMgfSBmcm9tICdqaW11LWFyY2dpcydcbmNvbnN0IHczd0ljb24gPSByZXF1aXJlKCcuLi9hc3NldHMvdzN3TWFya2VyLnBuZycpXG5cbmV4cG9ydCBjb25zdCBnZXRDdXJyZW50QWRkcmVzcyA9IChnZW9jb2RlVVJMOiBzdHJpbmcsIG1hcENsaWNrOiBQb2ludCkgPT4ge1xuICBpZiAoIW1hcENsaWNrKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpXG4gIHJldHVybiBsb2FkQXJjR0lTSlNBUElNb2R1bGVzKFsnZXNyaS9yZXN0L2xvY2F0b3InXSkudGhlbihtb2R1bGVzID0+IHtcbiAgICBjb25zdCBbbG9jYXRvcl0gPSBtb2R1bGVzXG4gICAgcmV0dXJuIGNyZWF0ZVBvaW50KG1hcENsaWNrKS50aGVuKHBvaW50ID0+IHtcbiAgICAgIHJldHVybiBsb2NhdG9yLmxvY2F0aW9uVG9BZGRyZXNzKGdlb2NvZGVVUkwsIHtcbiAgICAgICAgbG9jYXRpb246IHBvaW50XG4gICAgICB9LCB7XG4gICAgICAgIHF1ZXJ5OiB7fVxuICAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVzcG9uc2UuYWRkcmVzcylcbiAgICAgIH0sIGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLm1lc3NhZ2UpXG4gICAgICAgIHJldHVybiBlcnIubWVzc2FnZSArICcgLSBDaGVjayB5b3VyIExvY2F0b3IgVVJMJ1xuICAgICAgfSlcbiAgICB9KVxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgY3JlYXRlUG9pbnQgPSAobWFwQ2xpY2s6IGFueSk6IFByb21pc2U8UG9pbnQ+ID0+IHtcbiAgaWYgKCFtYXBDbGljaykge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbClcbiAgfVxuICByZXR1cm4gbG9hZEFyY0dJU0pTQVBJTW9kdWxlcyhbJ2VzcmkvZ2VvbWV0cnkvUG9pbnQnXSkudGhlbihtb2R1bGVzID0+IHtcbiAgICBjb25zdCBbUG9pbnRdID0gbW9kdWxlc1xuICAgIHJldHVybiBuZXcgUG9pbnQoe1xuICAgICAgbG9uZ2l0dWRlOiBtYXBDbGljay5sb25naXR1ZGUsXG4gICAgICBsYXRpdHVkZTogbWFwQ2xpY2subGF0aXR1ZGUsXG4gICAgICBzcGF0aWFsUmVmZXJlbmNlOiB7XG4gICAgICAgIHdraWQ6IDQzMjZcbiAgICAgIH1cbiAgICB9KVxuICB9KVxufVxuXG5leHBvcnQgY29uc3QgZ2V0TWFya2VyR3JhcGhpYyA9IChwb2ludDogUG9pbnQpID0+IHtcbiAgaWYgKCFwb2ludCkgcmV0dXJuIFByb21pc2UucmVzb2x2ZShudWxsKVxuICByZXR1cm4gbG9hZEFyY0dJU0pTQVBJTW9kdWxlcyhbJ2VzcmkvR3JhcGhpYycsICdlc3JpL3N5bWJvbHMvUGljdHVyZU1hcmtlclN5bWJvbCddKS50aGVuKG1vZHVsZXMgPT4ge1xuICAgIGxldCBHcmFwaGljOiBfX2VzcmkuR3JhcGhpY0NvbnN0cnVjdG9yID0gbnVsbFxuICAgIGxldCBQaWN0dXJlTWFya2VyU3ltYm9sOiB0eXBlb2YgX19lc3JpLlBpY3R1cmVNYXJrZXJTeW1ib2xcbiAgICBbR3JhcGhpYywgUGljdHVyZU1hcmtlclN5bWJvbF0gPSBtb2R1bGVzXG4gICAgY29uc3Qgc3ltYm9sID0gbmV3IFBpY3R1cmVNYXJrZXJTeW1ib2woe1xuICAgICAgd2lkdGg6IDI1LFxuICAgICAgaGVpZ2h0OiAyNSxcbiAgICAgIHhvZmZzZXQ6IDAsXG4gICAgICB5b2Zmc2V0OiAxMSxcbiAgICAgIHVybDogdzN3SWNvblxuICAgIH0pXG4gICAgcmV0dXJuIG5ldyBHcmFwaGljKHtcbiAgICAgIGdlb21ldHJ5OiBwb2ludCxcbiAgICAgIHN5bWJvbDogc3ltYm9sXG4gICAgfSlcbiAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IGdldE1hcExhYmVsR3JhcGhpYyA9IChwb2ludDogUG9pbnQsIHdoYXQzd29yZHM6IHN0cmluZykgPT4ge1xuICBpZiAoIXBvaW50KSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG51bGwpXG4gIHJldHVybiBsb2FkQXJjR0lTSlNBUElNb2R1bGVzKFsnZXNyaS9HcmFwaGljJ10pLnRoZW4obW9kdWxlcyA9PiB7XG4gICAgbGV0IEdyYXBoaWM6IF9fZXNyaS5HcmFwaGljQ29uc3RydWN0b3IgPSBudWxsO1xuICAgIFtHcmFwaGljXSA9IG1vZHVsZXNcbiAgICBjb25zdCB0ZXh0U3ltID0ge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgdGV4dDogJy8vLycgKyB3aGF0M3dvcmRzLFxuICAgICAgZm9udDogeyBzaXplOiAxMiwgd2VpZ2h0OiAnYm9sZCcgfSxcbiAgICAgIGhvcml6b250YWxBbGlnbm1lbnQ6ICdsZWZ0JyxcbiAgICAgIGtlcm5pbmc6IHRydWUsXG4gICAgICByb3RhdGVkOiBmYWxzZSxcbiAgICAgIGNvbG9yOiBbMjI1LCAzMSwgMzgsIDFdLFxuICAgICAgaGFsb0NvbG9yOiAnIzBBMzA0OScsXG4gICAgICBoYWxvU2l6ZTogJzFweCcsXG4gICAgICB4b2Zmc2V0OiAxMixcbiAgICAgIHlvZmZzZXQ6IDVcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBHcmFwaGljKHtcbiAgICAgIGdlb21ldHJ5OiBwb2ludCxcbiAgICAgIHN5bWJvbDogdGV4dFN5bVxuICAgIH0pXG4gIH0pXG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIF93aWRnZXRMYWJlbDogJ3doYXQzd29yZHMnLFxuICB4OiAnTG9uZ2l0dWRlJyxcbiAgeTogJ0xhdGl0dWRlJyxcbiAgY29weTogJ0NvcHknLFxuICBjb3B5U3VjY2Vzc01lc3NhZ2U6ICdDb3B5IFN1Y2Nlc3NmdWwnLFxuICB6b29tVG86ICdab29tIFRvJ1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBRUFBQUFCQUNBWUFBQUNxYVhIZUFBQUFDWEJJV1hNQUFDeExBQUFzU3dHbFBaYXBBQUFGR21sVVdIUllUVXc2WTI5dExtRmtiMkpsTG5odGNBQUFBQUFBUEQ5NGNHRmphMlYwSUdKbFoybHVQU0x2dTc4aUlHbGtQU0pYTlUwd1RYQkRaV2hwU0hweVpWTjZUbFJqZW10ak9XUWlQejRnUEhnNmVHMXdiV1YwWVNCNGJXeHVjenA0UFNKaFpHOWlaVHB1Y3pwdFpYUmhMeUlnZURwNGJYQjBhejBpUVdSdlltVWdXRTFRSUVOdmNtVWdOaTR3TFdNd01ESWdOemt1TVRZME16VXlMQ0F5TURJd0x6QXhMek13TFRFMU9qVXdPak00SUNBZ0lDQWdJQ0FpUGlBOGNtUm1PbEpFUmlCNGJXeHVjenB5WkdZOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2TURJdk1qSXRjbVJtTFhONWJuUmhlQzF1Y3lNaVBpQThjbVJtT2tSbGMyTnlhWEIwYVc5dUlISmtaanBoWW05MWREMGlJaUI0Yld4dWN6cDRiWEE5SW1oMGRIQTZMeTl1Y3k1aFpHOWlaUzVqYjIwdmVHRndMekV1TUM4aUlIaHRiRzV6T21SalBTSm9kSFJ3T2k4dmNIVnliQzV2Y21jdlpHTXZaV3hsYldWdWRITXZNUzR4THlJZ2VHMXNibk02Y0dodmRHOXphRzl3UFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzQm9iM1J2YzJodmNDOHhMakF2SWlCNGJXeHVjenA0YlhCTlRUMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMMjF0THlJZ2VHMXNibk02YzNSRmRuUTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzl6Vkhsd1pTOVNaWE52ZFhKalpVVjJaVzUwSXlJZ2VHMXdPa055WldGMGIzSlViMjlzUFNKQlpHOWlaU0JRYUc5MGIzTm9iM0FnTWpFdU1TQW9UV0ZqYVc1MGIzTm9LU0lnZUcxd09rTnlaV0YwWlVSaGRHVTlJakl3TWpBdE1EUXRNRGRVTVRBNk5EWTZOVFFyTURFNk1EQWlJSGh0Y0RwTmIyUnBabmxFWVhSbFBTSXlNREl3TFRBMExUQTNWREV3T2pVek9qVXlLekF4T2pBd0lpQjRiWEE2VFdWMFlXUmhkR0ZFWVhSbFBTSXlNREl3TFRBMExUQTNWREV3T2pVek9qVXlLekF4T2pBd0lpQmtZenBtYjNKdFlYUTlJbWx0WVdkbEwzQnVaeUlnY0dodmRHOXphRzl3T2tOdmJHOXlUVzlrWlQwaU15SWdjR2h2ZEc5emFHOXdPa2xEUTFCeWIyWnBiR1U5SW5OU1IwSWdTVVZETmpFNU5qWXRNaTR4SWlCNGJYQk5UVHBKYm5OMFlXNWpaVWxFUFNKNGJYQXVhV2xrT2pKbU1XTXhOR0ZpTFRVNE5Ea3RORFZtWWkwNU9EQmpMV0ZqWVRjNU9UYzNaVGhpWXlJZ2VHMXdUVTA2Ukc5amRXMWxiblJKUkQwaWVHMXdMbVJwWkRveVpqRmpNVFJoWWkwMU9EUTVMVFExWm1JdE9UZ3dZeTFoWTJFM09UazNOMlU0WW1NaUlIaHRjRTFOT2s5eWFXZHBibUZzUkc5amRXMWxiblJKUkQwaWVHMXdMbVJwWkRveVpqRmpNVFJoWWkwMU9EUTVMVFExWm1JdE9UZ3dZeTFoWTJFM09UazNOMlU0WW1NaVBpQThlRzF3VFUwNlNHbHpkRzl5ZVQ0Z1BISmtaanBUWlhFK0lEeHlaR1k2YkdrZ2MzUkZkblE2WVdOMGFXOXVQU0pqY21WaGRHVmtJaUJ6ZEVWMmREcHBibk4wWVc1alpVbEVQU0o0YlhBdWFXbGtPakptTVdNeE5HRmlMVFU0TkRrdE5EVm1ZaTA1T0RCakxXRmpZVGM1T1RjM1pUaGlZeUlnYzNSRmRuUTZkMmhsYmowaU1qQXlNQzB3TkMwd04xUXhNRG8wTmpvMU5Dc3dNVG93TUNJZ2MzUkZkblE2YzI5bWRIZGhjbVZCWjJWdWREMGlRV1J2WW1VZ1VHaHZkRzl6YUc5d0lESXhMakVnS0UxaFkybHVkRzl6YUNraUx6NGdQQzl5WkdZNlUyVnhQaUE4TDNodGNFMU5Pa2hwYzNSdmNuaytJRHd2Y21SbU9rUmxjMk55YVhCMGFXOXVQaUE4TDNKa1pqcFNSRVkrSUR3dmVEcDRiWEJ0WlhSaFBpQThQM2h3WVdOclpYUWdaVzVrUFNKeUlqOCtHNmpLYkFBQUI2ZEpSRUZVZUp6dG0ydHNWTWNaaHArWk9YdXhNZkZ0ZlVuTXBlUW1vQ0J3M2JoMkV6QTBNUlJvQWppSnFOS2thdFZLVmF2K3FwUS8vSzBxdFpWNlU5V0xLcVNxbGFxMEJEdWhyU3h1cGdSc0RFMm9LVlJKcXRBVUF5WVllOWMzdkplemUyYjY0eHdNU2UybGtmZHdXblhmMWRGcTk1dWQ4Mzd2ZWVmYjJUbXp3aGpEYkZqUXVQVXlzSERXNFA4V3BxWUh1aGZQRmJUeWZIQ1JEMlNDUUhtK29Nd1RteXd3a2FDUU40OThBdnhmb0NoQTBBU0NSbEdBb0FrRWphSUFRUk1JR2tVQmdpWVFOSW9DQkUwZ2FCUUZDSnBBMFBCZEFDRUVRZ3FTVjRkSlhodEJTSWtRd28wcGllTm9rcGV1a295UElhMWJ2ODZGVXFRek5za3I3NUdjVHI0dlZrajRMb0FXZ3VuRUJHMmIyMmpkMEVKeThnYmFpem5aSEpsTWh1MmZmWkxWYXo5S1puelNGVXdJY3FrVWxsSnMycjZKK3JvWTl2UzBML3g4RnlBMVBNcEhsaTNtMksrL3o4bVhmc3lpaGpwU2lYR0VFS1F2WG1GSCsyTzgrcE52OHNlZmZ3dEhRREtWUmdPWndTRmUvTkl1RHU3NURqL2EvWFhzNjNHMG5uMzFhajd3VlFBaEJJd21lSDdIWmdBeWRoYmIwU0FsV2UzNjRNdlBiZ1BnZW1JYzdDeEtTVEtwTk5URytPcHpUODE4anB5RE4zSUtDbDhGU050WnFLNmtvLzB4QUg3emh4NkcvL29tMGZLRjJCTlRWSzU4aUNkYW13RDRaZGRCOUVpY2FDU01Ib25UMHRKSVEyME1nRjkwZG9PbFptcEhJZUdyQUU1OGpPVk5xMmhjOFNBQXJ4enBCU0d3cElTUk9OdldOeE1KaHpER3NQOVlQMVJWNEJoZ09zWE94eDhGWVBEcU1MMzlBNGlhYWw4NCtpZUFFREErd2M2Tm53UWdNVEhGa2Y0elVCdkRkaHl3TEo1dVh3L0FuMDZmWmVqODN3bFZWcEJPcCtHK09wN1o1TVk2RDUyQW9XdEVTNksrMFBSTmdJeHRRM1VsdTdac0FHQi9UeC9wZnd3U0xTdDE3Yi9pUVQ2OTdoRUFPZzhkaCtra1lVdGhodU8wdGpSeS8rSjdBZWc2ZWhLaUVlUWN5L2Z6aFc4Q09LTUpWamF0WnMzeUJ3RFlkK2dFU0lrbEJJekUyYkx1RWFLUk1BQy9mKzAwVkZWZ0FGSXBPano3WHh5NlJsLy9HVVJkREgvUzkwc0FJV0JpaWgwYld3R0lqMC9TYy9JTnFJdGhhdzJXUmNjVDZ3RFgvbGZPdlVXb3lyTi9RejFQZS9iZmQvQTRYUEhQL3VDVEFLNzlxM2gyY3hzQXJ4N3BKZlB1SmFJTFhQdFhMSCtBYlcyZkFHRHZnV016OXRmRGNWcWIxN0pzVVQwQVhUMTlVQnIxdFZMNzByY3pPc2FLcGxXczlhcC9WMDhmS09YWlA4SFdkYzFFSTJHditwK0M2cXBaN2Q5LytpeWlOc1pjdCs4S2djSUxJQVNNVDdGemcydi94TVFrUFgxdlFHM01uZnhZaW81MnovNm5Cbmp2L051RXFzcEpwMXo3ZDJ4eVkxMCtWLytiS0xnQUdUc0xzVXFldVduL25qNHk3MTRtdXJDVXpLUnIvNjNybXdIWWQrZzRKTk91L1VjU3REU3Y1ZjVGYnZYdlBOb0hwU1crejlVTDNyOHptbUJGMHlvYVYzcjJQOXdIU21JSkNTTUp0cXhycGlRYUFXRC9hNmNoVm9reFFESkZ4NmZjT2NQZzFXRk9uaHBBMUZiN2FuOG9zQURHR0VpbCtjS1Q3UUJNVEUxNzlxL0d6bVlSWlF0NC9qT1BBM0NrL3k5Y1Bmc21vY3B5MGplU0xIeDRHYnUyYkFTZzYzQ3Y3OVgvSmdvdmdKUjhmTlhEQUhRZFBrSDZ3a1dpWlF1dzdTemluakxhbXRjQThLdFhEa0ltUTFncGRDcEZUVjBOUys2ckJXQnY5MUZZNEwvOUlmLytnQThOS1NWV1ZRVzdmN0NIYlcwdDdOblhqVlZYZ3hLQ2ttaUU3STBrWDl6OVhWWXNXOExMQjQ0Ulhyb0lZd3lSeWdvdVh4cmlHOS8rR2FHUTR0U1p2eEZwcVBmZC9nQWl6dzZSQ2VDZUQ5dWhERm5jdUI2SDhVbUlWVkZXVlk3TzVyeVZJY21Ob1d1UVNxTWE2aWtwamFKekRrSktqTllrQjRkQWF5SkxHd2haRmxyck81L3d6cGljSHVpZWM1TkV3ZGVaZERaSGFXVTVWSmJQdkFaM2VCakhvYlMrNWxiYm5PUEd2RVJMbHpiY2loVW0rVHVpdUNnYU5JR2dVUlFnYUFKQm95aEEwQVNDUmxHQW9Ba0VqYUlBUVJNSUdrVUJnaVlRTklvQzVJbUY3eG9MZjVFM2ozd0MrTDhlZFhlUU40OTg2d0hOZ0Nvc2w1c1E0TnZOcm4rRGt5K1lUNERYQzhuQ0lCSGU1aGlCQTRqYjNqTVl6NHdHZ2JoNzRoUitSZWlEY0JNeldOZzRDRUFnMEJqVWFxQUdHQkdZOHhvSGdjRkNrTU9hYWVjM2ZQd1djSk5WWkFtVElrd0swR2prWm9QVmF4RG53UFFZeERtRE9tbVFtOEdaYWF2SXp2VGhKM3dSd0RXMWd5S0ZJZzA0T0VnRWNqdklBd1lldmIyOWdWWlFCd1JxZXc0RkdCUTJDaHVEUWZ0NG5Yd1pBaFlXcmd3U0I0azczbldWUVhkS3RMdHlIQitINjZOUUc2T3N1Z0t5T1F5aFRnZGlBajF1dkNHZ3NCRklIQlI0dzZtUThFSGFteFhlSGRGNEFvQjh3U0FVZ0QwMnlaSWxEWHp0eGErd2VFa0Q5dGpNUDlzVXlNK0RSQ0FBaGZDUzlxc3crdUFBZzBOdWx2ZEZvd0J5am9NOU5zSHZYdjRwTFd0WDhzSlQ3YlMyZnc1S0lsaEs0YUNhWnZ2MmRRWDRMOTBuYUQ3d21LTlZGdHphanFWNCs1K1hBZHhucWJ3ckRnTHMyYzhoWm81Q0ZzWjhkNGIrODA1bUxEdFg4Z0tEM3FYUnY1VkM0dGcyV1FNZlcva1FBMjlkd0RJR0ZRbWhqVUNTZTA2aVh6SnpKQ204T1lQR3luTys5Mk42b0h2TzJMd2RJQkMzQ1NCblBidzJleVZpMEJpRGlrWXh4dkQ2aVQranRVYVZSREZHSU5HREFyM1hUVXpQY1JqQThlWUk4M2ZDdkdxQXdhQlFXRmg1ck85Q0lJd043WnBjcjNTYzJtZ2tEUGU2ZDRPTjQ2Q1IxeFZPZTRpc005ZlZ2OVdYSm9ja2g1cDNjYnlyUDRjTnZDT1Fhd1RtaDJBdUFCUEFCWUg1bnNCWlkrQ2R1OGtINEY4dVJ2QmcyRVRUYVFBQUFBQkpSVTVFcmtKZ2dnPT1cIiIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9qaW11X2FyY2dpc19fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9qaW11X2NvcmVfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfamltdV91aV9fOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjsiLCIvKipcclxuICogV2VicGFjayB3aWxsIHJlcGxhY2UgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gd2l0aCBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgdG8gc2V0IHRoZSBwdWJsaWMgcGF0aCBkeW5hbWljYWxseS5cclxuICogVGhlIHJlYXNvbiB3aHkgd2UgY2FuJ3Qgc2V0IHRoZSBwdWJsaWNQYXRoIGluIHdlYnBhY2sgY29uZmlnIGlzOiB3ZSBjaGFuZ2UgdGhlIHB1YmxpY1BhdGggd2hlbiBkb3dubG9hZC5cclxuICogKi9cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXHJcbi8vIEB0cy1pZ25vcmVcclxuX193ZWJwYWNrX3B1YmxpY19wYXRoX18gPSB3aW5kb3cuamltdUNvbmZpZy5iYXNlVXJsXHJcbiIsIi8qKiBAanN4IGpzeCAqL1xyXG5pbXBvcnQgeyBSZWFjdCwgQWxsV2lkZ2V0UHJvcHMsIGpzeCwgZ2V0QXBwU3RvcmUgfSBmcm9tICdqaW11LWNvcmUnXHJcbmltcG9ydCB7IEppbXVNYXBWaWV3Q29tcG9uZW50LCBKaW11TWFwVmlldyB9IGZyb20gJ2ppbXUtYXJjZ2lzJ1xyXG5pbXBvcnQgeyBnZXRDdXJyZW50QWRkcmVzcywgZ2V0TWFya2VyR3JhcGhpYywgZ2V0TWFwTGFiZWxHcmFwaGljIH0gZnJvbSAnLi9sb2NhdG9yLXV0aWxzJ1xyXG5pbXBvcnQgeyBnZXRXM1dTdHlsZSB9IGZyb20gJy4vbGliL3N0eWxlJ1xyXG5pbXBvcnQgZGVmYXVsdE1lc3NhZ2VzIGZyb20gJy4vdHJhbnNsYXRpb25zL2RlZmF1bHQnXHJcbmltcG9ydCB7IEJ1dHRvbiwgSWNvbiwgUG9wcGVyIH0gZnJvbSAnamltdS11aSdcclxuXHJcbmNvbnN0IGljb25Db3B5ID0gcmVxdWlyZSgnamltdS11aS9saWIvaWNvbnMvZHVwbGljYXRlLnN2ZycpXHJcbmNvbnN0IGljb25ab29tID0gcmVxdWlyZSgnamltdS11aS9saWIvaWNvbnMvem9vbS1vdXQtZml4ZWQuc3ZnJylcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdpZGdldCBleHRlbmRzIFJlYWN0LlB1cmVDb21wb25lbnQ8QWxsV2lkZ2V0UHJvcHM8YW55PiwgYW55PiB7XHJcbiAgbWFwVmlldzogYW55XHJcbiAgcHJpdmF0ZSBfaXNNb3VudGVkOiBib29sZWFuXHJcbiAgcHJpdmF0ZSByZWFkb25seSBpc1JUTDogYm9vbGVhblxyXG4gIHpvb21TY2FsZSA9IDUwMDBcclxuICB3aGF0M3dvcmRzOiBzdHJpbmdcclxuXHJcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcylcclxuICAgIGxldCBnZW9jb2RlU2VydmljZVVSTCA9ICcnXHJcblxyXG4gICAgaWYgKHRoaXMucHJvcHMuY29uZmlnPy5hZGRyZXNzU2V0dGluZ3M/Lmdlb2NvZGVTZXJ2aWNlVXJsKSB7XHJcbiAgICAgIGdlb2NvZGVTZXJ2aWNlVVJMID0gdGhpcy5wcm9wcy5jb25maWcuYWRkcmVzc1NldHRpbmdzLmdlb2NvZGVTZXJ2aWNlVXJsXHJcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMucG9ydGFsU2VsZiAmJiB0aGlzLnByb3BzLnBvcnRhbFNlbGYuaGVscGVyU2VydmljZXMgJiYgdGhpcy5wcm9wcy5wb3J0YWxTZWxmLmhlbHBlclNlcnZpY2VzLmdlb2NvZGUgJiZcclxuICAgICAgdGhpcy5wcm9wcy5wb3J0YWxTZWxmLmhlbHBlclNlcnZpY2VzLmdlb2NvZGUubGVuZ3RoID4gMCAmJiB0aGlzLnByb3BzLnBvcnRhbFNlbGYuaGVscGVyU2VydmljZXMuZ2VvY29kZVswXS51cmwpIHsgLy8gVXNlIG9yZydzIGZpcnN0IGdlb2NvZGUgc2VydmljZSBpZiBhdmFpbGFibGVcclxuICAgICAgZ2VvY29kZVNlcnZpY2VVUkwgPSB0aGlzLnByb3BzLnBvcnRhbFNlbGYuaGVscGVyU2VydmljZXMuZ2VvY29kZVswXS51cmxcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9pc01vdW50ZWQgPSBmYWxzZVxyXG4gICAgdGhpcy5pc1JUTCA9IGZhbHNlXHJcblxyXG4gICAgY29uc3QgYXBwU3RhdGUgPSBnZXRBcHBTdG9yZSgpLmdldFN0YXRlKClcclxuICAgIHRoaXMuaXNSVEwgPSBhcHBTdGF0ZT8uYXBwQ29udGV4dD8uaXNSVExcclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICB3M3dMb2NhdG9yOiBnZW9jb2RlU2VydmljZVVSTCxcclxuICAgICAgSmltdU1hcFZpZXc6IG51bGwsXHJcbiAgICAgIGxhdGl0dWRlOiAnJyxcclxuICAgICAgbG9uZ2l0dWRlOiAnJyxcclxuICAgICAgd2hhdDN3b3JkczogbnVsbCxcclxuICAgICAgaXNDb3B5TWVzc2FnZU9wZW46IGZhbHNlXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBubHMgPSAoaWQ6IHN0cmluZykgPT4ge1xyXG4gICAgcmV0dXJuIHRoaXMucHJvcHMuaW50bC5mb3JtYXRNZXNzYWdlKHsgaWQ6IGlkLCBkZWZhdWx0TWVzc2FnZTogZGVmYXVsdE1lc3NhZ2VzW2lkXSB9KVxyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xyXG4gICAgY29uc29sZS5sb2coJ0NvbXBvbmVudCBkaWQgbW91bnQnKVxyXG4gICAgdGhpcy5faXNNb3VudGVkID0gdHJ1ZVxyXG4gIH1cclxuXHJcbiAgb25ab29tQ2xpY2sgPSAoKSA9PiB7XHJcbiAgICBpZiAodGhpcy5tYXBWaWV3LmdyYXBoaWNzLmxlbmd0aCA+IDApIHtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRMb2NhdGlvbkdyYXBoaWMgPSB0aGlzLm1hcFZpZXcuZ3JhcGhpY3MuZ2V0SXRlbUF0KDApXHJcbiAgICAgIHRoaXMubWFwVmlldy5nb1RvKHtcclxuICAgICAgICBjZW50ZXI6IHNlbGVjdGVkTG9jYXRpb25HcmFwaGljLmdlb21ldHJ5LFxyXG4gICAgICAgIHNjYWxlOiB0aGlzLnpvb21TY2FsZVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25Db3B5Q2xpY2sgPSAoKSA9PiB7XHJcbiAgICAvL2NsZWFyIHByZXYgc2VsZWN0aW9uXHJcbiAgICBpZiAod2luZG93LmdldFNlbGVjdGlvbikge1xyXG4gICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKClcclxuICAgIH1cclxuXHJcbiAgICAvL2NvcHkgaW5wdXRcclxuICAgIG5hdmlnYXRvci5jbGlwYm9hcmQud3JpdGVUZXh0KHRoaXMuc3RhdGUud2hhdDN3b3JkcylcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBpc0NvcHlNZXNzYWdlT3BlbjogdHJ1ZVxyXG4gICAgfSlcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgLy9SZW1vdmUgdGhlIGV4aXN0aW5nIHNlbGVjdGlvblxyXG4gICAgICBpZiAod2luZG93LmdldFNlbGVjdGlvbikge1xyXG4gICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGlzQ29weU1lc3NhZ2VPcGVuOiBmYWxzZVxyXG4gICAgICB9KVxyXG4gICAgfSwgNTAwKVxyXG4gIH1cclxuXHJcbiAgb25BY3RpdmVWaWV3Q2hhbmdlID0gKGptdjogSmltdU1hcFZpZXcpID0+IHtcclxuICAgIGlmICgham12KSByZXR1cm5cclxuICAgIHRoaXMubWFwVmlldyA9IGptdi52aWV3XHJcblxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGppbXVNYXBWaWV3OiBqbXZcclxuICAgIH0pXHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdzN3TG9jYXRvcjogdGhpcy5zdGF0ZS53M3dMb2NhdG9yXHJcbiAgICB9KVxyXG4gICAgdGhpcy5tYXBWaWV3Lm9uKCdjbGljaycsIGFzeW5jIChtYXBDbGljazogYW55KSA9PiB7XHJcbiAgICAgIHRoaXMubWFwVmlldy5ncmFwaGljcy5yZW1vdmVBbGwoKVxyXG4gICAgICB0aGlzLm1hcFZpZXcucG9wdXAuYXV0b09wZW5FbmFibGVkID0gZmFsc2VcclxuICAgICAgY29uc3QgZ3JhcGhpYyA9IGF3YWl0IGdldE1hcmtlckdyYXBoaWMobWFwQ2xpY2subWFwUG9pbnQpXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGxhdGl0dWRlOiBtYXBDbGljay5tYXBQb2ludC5sYXRpdHVkZS50b0ZpeGVkKDQpLFxyXG4gICAgICAgIGxvbmdpdHVkZTogbWFwQ2xpY2subWFwUG9pbnQubG9uZ2l0dWRlLnRvRml4ZWQoNClcclxuICAgICAgfSlcclxuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWxvbmUtYmxvY2tzXHJcbiAgICAgIHsgdGhpcy5wcm9wcy5jb25maWcuZGlzcGxheVBvcHVwTWVzc2FnZSAmJlxyXG4gICAgICB0aGlzLm1hcFZpZXcucG9wdXAub3Blbih7XHJcbiAgICAgICAgdGl0bGU6ICdSZXZlcnNlIGdlb2NvZGUgZm9yICcgKyBgJHt0aGlzLnN0YXRlLmxhdGl0dWRlfSwgJHt0aGlzLnN0YXRlLmxvbmdpdHVkZX1gLFxyXG4gICAgICAgIGxvY2F0aW9uOiBtYXBDbGljay5tYXBQb2ludFxyXG4gICAgICB9KVxyXG4gICAgICB9XHJcbiAgICAgIGdldEN1cnJlbnRBZGRyZXNzKHRoaXMuc3RhdGUudzN3TG9jYXRvciwgbWFwQ2xpY2subWFwUG9pbnQpLnRoZW4oYXN5bmMgcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgd2hhdDN3b3JkczogcmVzcG9uc2VcclxuICAgICAgICB9KVxyXG4gICAgICAgIGNvbnN0IG1hcExhYmVsID0gYXdhaXQgZ2V0TWFwTGFiZWxHcmFwaGljKG1hcENsaWNrLm1hcFBvaW50LCByZXNwb25zZSlcclxuICAgICAgICB0aGlzLm1hcFZpZXcucG9wdXAuY29udGVudCA9ICd3aGF0M3dvcmRzIGFkZHJlc3M6ICcgKyBgLy8vJHtyZXNwb25zZX1gXHJcbiAgICAgICAgdGhpcy5tYXBWaWV3LmdyYXBoaWNzLmFkZChncmFwaGljKVxyXG4gICAgICAgIHRoaXMubWFwVmlldy5ncmFwaGljcy5hZGQobWFwTGFiZWwpXHJcbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldCh7IGNlbnRlcjogbWFwQ2xpY2subWFwUG9pbnQgfSkgLy8gY2VudGVyIHRvIHRoZSBwb2ludFxyXG4gICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6ICcgKyBlcnJvcilcclxuICAgICAgICB0aGlzLm1hcFZpZXcucG9wdXAuY29udGVudCA9ICdObyBhZGRyZXNzIHdhcyBmb3VuZCBmb3IgdGhpcyBsb2NhdGlvbidcclxuICAgICAgICB0aGlzLm1hcFZpZXcuZ3JhcGhpY3MucmVtb3ZlQWxsKClcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBjb21wb25lbnREaWRVcGRhdGUgKHByZXZQcm9wcykge1xyXG4gICAgY29uc29sZS5sb2coJ0NvbXBvbmVudCBkaWQgdXBkYXRlJylcclxuICAgIC8vY2hlY2sgZm9yIHRoZSB1cGRhdGVkIGdlb2NvZGUgc2VydmljZSB1cmwgaW4gY29uZmlnXHJcbiAgICBpZiAocHJldlByb3BzLmNvbmZpZy5hZGRyZXNzU2V0dGluZ3M/Lmdlb2NvZGVTZXJ2aWNlVXJsICE9PSB0aGlzLnByb3BzLmNvbmZpZy5hZGRyZXNzU2V0dGluZ3M/Lmdlb2NvZGVTZXJ2aWNlVXJsKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHczd0xvY2F0b3I6IHRoaXMucHJvcHMuY29uZmlnLmFkZHJlc3NTZXR0aW5ncy5nZW9jb2RlU2VydmljZVVybFxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50V2lsbFVubW91bnQgPSAoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnQ29tcG9uZW50IHdpbGwgdW5tb3VudCcpXHJcbiAgICB0aGlzLl9pc01vdW50ZWQgPSBmYWxzZVxyXG4gICAgdGhpcy5tYXBWaWV3LmdyYXBoaWNzLnJlbW92ZUFsbCgpXHJcbiAgfVxyXG5cclxuICByZW5kZXIgKCkge1xyXG4gICAgcmV0dXJuIDxkaXYgY3NzPXtnZXRXM1dTdHlsZSh0aGlzLnByb3BzLnRoZW1lKX0gY2xhc3NOYW1lPVwid2lkZ2V0LXN0YXJ0ZXIgamltdS13aWRnZXRcIj5cclxuICAgICAgPGg1PlJldmVyc2UgR2VvY29kZSB3aXRoIHlvdXIgd2hhdDN3b3JkcyBsb2NhdG9yPC9oNT5cclxuICAgICAge3t9Lmhhc093blByb3BlcnR5LmNhbGwodGhpcy5wcm9wcywgJ3VzZU1hcFdpZGdldElkcycpICYmXHJcbiAgICAgICAgdGhpcy5wcm9wcy51c2VNYXBXaWRnZXRJZHMgJiZcclxuICAgICAgICB0aGlzLnByb3BzLnVzZU1hcFdpZGdldElkcy5sZW5ndGggPT09IDEgJiYgKFxyXG4gICAgICAgICAgPEppbXVNYXBWaWV3Q29tcG9uZW50XHJcbiAgICAgICAgICAgIHVzZU1hcFdpZGdldElkPXt0aGlzLnByb3BzLnVzZU1hcFdpZGdldElkcz8uWzBdfVxyXG4gICAgICAgICAgICBvbkFjdGl2ZVZpZXdDaGFuZ2U9e3RoaXMub25BY3RpdmVWaWV3Q2hhbmdlfVxyXG4gICAgICAgICAgPjwvSmltdU1hcFZpZXdDb21wb25lbnQ+XHJcbiAgICAgICl9XHJcbiAgICAgIHt0aGlzLnByb3BzLmNvbmZpZy5kaXNwbGF5Q29weUJ1dHRvbiAmJlxyXG4gICAgICA8QnV0dG9uIHR5cGU9J3RlcnRpYXJ5JyBhcmlhLWxhYmVsPXt0aGlzLm5scygnY29weScpfSBhcmlhLWRpc2FibGVkPXshdGhpcy5zdGF0ZS53aGF0M3dvcmRzfSB0aXRsZT17dGhpcy5ubHMoJ2NvcHknKX0gY2xhc3NOYW1lPSdmbG9hdC1yaWdodCBhY3Rpb25CdXR0b24nIGljb24gc2l6ZT17J3NtJ31cclxuICAgICAgICBhY3RpdmU9e3RoaXMuc3RhdGUuaXNDb3B5TWVzc2FnZU9wZW59IGRpc2FibGVkPXshdGhpcy5zdGF0ZS53aGF0M3dvcmRzfSBpZD17J3JlZkNvcHknICsgdGhpcy5wcm9wcy5pZH0gb25DbGljaz17dGhpcy5vbkNvcHlDbGljay5iaW5kKHRoaXMpfT5cclxuICAgICAgICA8SWNvbiBpY29uPXtpY29uQ29weX0gc2l6ZT17JzE3J30+PC9JY29uPlxyXG4gICAgICA8L0J1dHRvbj5cclxuICAgICAgfVxyXG4gICAgICB7dGhpcy5wcm9wcy5jb25maWcuZGlzcGxheVpvb21CdXR0b24gJiZcclxuICAgICAgPEJ1dHRvbiB0eXBlPSd0ZXJ0aWFyeScgYXJpYS1sYWJlbD17dGhpcy5ubHMoJ3pvb21UbycpfSBhcmlhLWRpc2FibGVkPXshdGhpcy5zdGF0ZS53aGF0M3dvcmRzfSB0aXRsZT17dGhpcy5ubHMoJ3pvb21UbycpfSBjbGFzc05hbWU9J2Zsb2F0LXJpZ2h0IGFjdGlvbkJ1dHRvbicgaWNvbiBzaXplPXsnc20nfVxyXG4gICAgICAgb25DbGljaz17dGhpcy5vblpvb21DbGljay5iaW5kKHRoaXMpfSBkaXNhYmxlZD17IXRoaXMuc3RhdGUud2hhdDN3b3Jkc30+XHJcbiAgICAgICAgPEljb24gaWNvbj17aWNvblpvb219IHNpemU9eycxNyd9PjwvSWNvbj5cclxuICAgICAgIDwvQnV0dG9uPlxyXG4gICAgICB9XHJcbiAgICAgIDxoMyBjbGFzc05hbWU9XCJ3M3dCbG9ja1wiPlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd3M3dSZWQnPi8vLzwvc3Bhbj57dGhpcy5zdGF0ZS53aGF0M3dvcmRzfVxyXG4gICAgICA8L2gzPlxyXG4gICAgICB7dGhpcy5wcm9wcy5jb25maWcuZGlzcGxheUNvb3JkaW5hdGVzICYmXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidzN3Q29vcmRzXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3M3dDb29yZHNQcm9wXCI+PHNwYW4gY2xhc3NOYW1lPSd3M3dSZWQgdzN3Q29vcmRzRmlyc3RDb2wnPntkZWZhdWx0TWVzc2FnZXMueX06PC9zcGFuPjxzcGFuPnt0aGlzLnN0YXRlLmxhdGl0dWRlfTwvc3Bhbj48L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInczd0Nvb3Jkc1Byb3BcIj48c3BhbiBjbGFzc05hbWU9J3czd1JlZCB3M3dDb29yZHNGaXJzdENvbCc+e2RlZmF1bHRNZXNzYWdlcy54fTo8L3NwYW4+PHNwYW4+e3RoaXMuc3RhdGUubG9uZ2l0dWRlfTwvc3Bhbj48L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIH1cclxuICAgICAgey8qIENvcHkgbWVzc2FnZSB0b2FzdCBwb3BwZXIgKi99XHJcbiAgICAgIHt0aGlzLnN0YXRlLmlzQ29weU1lc3NhZ2VPcGVuICYmXHJcbiAgICAgICAgPFBvcHBlclxyXG4gICAgICAgICAgb3Blbj17dGhpcy5zdGF0ZS5pc0NvcHlNZXNzYWdlT3Blbn1cclxuICAgICAgICAgIHZlcnNpb249ezB9XHJcbiAgICAgICAgICBwbGFjZW1lbnQ9eydib3R0b20nfVxyXG4gICAgICAgICAgc2hvd0Fycm93PXt0cnVlfVxyXG4gICAgICAgICAgcmVmZXJlbmNlPXsncmVmQ29weScgKyB0aGlzLnByb3BzLmlkfVxyXG4gICAgICAgICAgb2Zmc2V0PXtbMCwgMF19PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9eydwLTInfT57dGhpcy5ubHMoJ2NvcHlTdWNjZXNzTWVzc2FnZScpfTwvZGl2PlxyXG4gICAgICAgIDwvUG9wcGVyPlxyXG4gICAgICB9XHJcbiAgICA8L2Rpdj5cclxuICB9XHJcbn1cclxuXG4gZXhwb3J0IGZ1bmN0aW9uIF9fc2V0X3dlYnBhY2tfcHVibGljX3BhdGhfXyh1cmwpIHsgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gPSB1cmwgfSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==