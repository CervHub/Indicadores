import{r as l,j as u}from"./app-9SkBCnxB.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),d=(...e)=>e.filter((r,t,n)=>!!r&&r.trim()!==""&&n.indexOf(r)===t).join(" ").trim();/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var C={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=l.forwardRef(({color:e="currentColor",size:r=24,strokeWidth:t=2,absoluteStrokeWidth:n,className:o="",children:s,iconNode:i,...a},c)=>l.createElement("svg",{ref:c,...C,width:r,height:r,stroke:e,strokeWidth:n?Number(t)*24/Number(r):t,className:d("lucide",o),...a},[...i.map(([g,h])=>l.createElement(g,h)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=(e,r)=>{const t=l.forwardRef(({className:n,...o},s)=>l.createElement(w,{ref:s,iconNode:r,className:d(`lucide-${y(e)}`,n),...o}));return t.displayName=`${e}`,t};function p(e,r){if(typeof e=="function")return e(r);e!=null&&(e.current=r)}function m(...e){return r=>{let t=!1;const n=e.map(o=>{const s=p(o,r);return!t&&typeof s=="function"&&(t=!0),s});if(t)return()=>{for(let o=0;o<n.length;o++){const s=n[o];typeof s=="function"?s():p(e[o],null)}}}}function S(...e){return l.useCallback(m(...e),e)}var E=l.forwardRef((e,r)=>{const{children:t,...n}=e,o=l.Children.toArray(t),s=o.find(R);if(s){const i=s.props.children,a=o.map(c=>c===s?l.Children.count(i)>1?l.Children.only(null):l.isValidElement(i)?i.props.children:null:c);return u.jsx(f,{...n,ref:r,children:l.isValidElement(i)?l.cloneElement(i,void 0,a):null})}return u.jsx(f,{...n,ref:r,children:t})});E.displayName="Slot";var f=l.forwardRef((e,r)=>{const{children:t,...n}=e;if(l.isValidElement(t)){const o=x(t),s=j(n,t.props);return t.type!==l.Fragment&&(s.ref=r?m(r,o):o),l.cloneElement(t,s)}return l.Children.count(t)>1?l.Children.only(null):null});f.displayName="SlotClone";var b=({children:e})=>u.jsx(u.Fragment,{children:e});function R(e){return l.isValidElement(e)&&e.type===b}function j(e,r){const t={...r};for(const n in r){const o=e[n],s=r[n];/^on[A-Z]/.test(n)?o&&s?t[n]=(...a)=>{s(...a),o(...a)}:o&&(t[n]=o):n==="style"?t[n]={...o,...s}:n==="className"&&(t[n]=[o,s].filter(Boolean).join(" "))}return{...e,...t}}function x(e){var n,o;let r=(n=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:n.get,t=r&&"isReactWarning"in r&&r.isReactWarning;return t?e.ref:(r=(o=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:o.get,t=r&&"isReactWarning"in r&&r.isReactWarning,t?e.props.ref:e.props.ref||e.ref)}export{E as S,m as a,b,A as c,S as u};
