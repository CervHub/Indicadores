import{r as s,j as f}from"./app-Dq37iqdI.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),y=(...e)=>e.filter((t,r,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===r).join(" ").trim();/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var h={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=s.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:o,className:n="",children:l,iconNode:a,...i},c)=>s.createElement("svg",{ref:c,...h,width:t,height:t,stroke:e,strokeWidth:o?Number(r)*24/Number(t):r,className:y("lucide",n),...i},[...a.map(([u,p])=>s.createElement(u,p)),...Array.isArray(l)?l:[l]]));/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=(e,t)=>{const r=s.forwardRef(({className:o,...n},l)=>s.createElement(E,{ref:l,iconNode:t,className:y(`lucide-${b(e)}`,o),...n}));return r.displayName=`${e}`,r};function m(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function g(...e){return t=>{let r=!1;const o=e.map(n=>{const l=m(n,t);return!r&&typeof l=="function"&&(r=!0),l});if(r)return()=>{for(let n=0;n<o.length;n++){const l=o[n];typeof l=="function"?l():m(e[n],null)}}}}function I(...e){return s.useCallback(g(...e),e)}function S(e){const t=x(e),r=s.forwardRef((o,n)=>{const{children:l,...a}=o,i=s.Children.toArray(l),c=i.find(w);if(c){const u=c.props.children,p=i.map(d=>d===c?s.Children.count(u)>1?s.Children.only(null):s.isValidElement(u)?u.props.children:null:d);return f.jsx(t,{...a,ref:n,children:s.isValidElement(u)?s.cloneElement(u,void 0,p):null})}return f.jsx(t,{...a,ref:n,children:l})});return r.displayName=`${e}.Slot`,r}var N=S("Slot");function x(e){const t=s.forwardRef((r,o)=>{const{children:n,...l}=r;if(s.isValidElement(n)){const a=j(n),i=R(l,n.props);return n.type!==s.Fragment&&(i.ref=o?g(o,a):a),s.cloneElement(n,i)}return s.Children.count(n)>1?s.Children.only(null):null});return t.displayName=`${e}.SlotClone`,t}var C=Symbol("radix.slottable");function _(e){const t=({children:r})=>f.jsx(f.Fragment,{children:r});return t.displayName=`${e}.Slottable`,t.__radixId=C,t}function w(e){return s.isValidElement(e)&&typeof e.type=="function"&&"__radixId"in e.type&&e.type.__radixId===C}function R(e,t){const r={...t};for(const o in t){const n=e[o],l=t[o];/^on[A-Z]/.test(o)?n&&l?r[o]=(...i)=>{const c=l(...i);return n(...i),c}:n&&(r[o]=n):o==="style"?r[o]={...n,...l}:o==="className"&&(r[o]=[n,l].filter(Boolean).join(" "))}return{...e,...r}}function j(e){var o,n;let t=(o=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:o.get,r=t&&"isReactWarning"in t&&t.isReactWarning;return r?e.ref:(t=(n=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:n.get,r=t&&"isReactWarning"in t&&t.isReactWarning,r?e.props.ref:e.props.ref||e.ref)}export{N as S,S as a,g as b,A as c,_ as d,I as u};
