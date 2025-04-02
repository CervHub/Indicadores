import{r as s,j as m}from"./app-lwyxAAc0.js";import{e as E,d as N}from"./utils-Dxu7ruf7.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),w=(...t)=>t.filter((n,e,r)=>!!n&&n.trim()!==""&&r.indexOf(n)===e).join(" ").trim();/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var A={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=s.forwardRef(({color:t="currentColor",size:n=24,strokeWidth:e=2,absoluteStrokeWidth:r,className:o="",children:i,iconNode:l,...u},d)=>s.createElement("svg",{ref:d,...A,width:n,height:n,stroke:t,strokeWidth:r?Number(e)*24/Number(n):e,className:w("lucide",o),...u},[...l.map(([a,c])=>s.createElement(a,c)),...Array.isArray(i)?i:[i]]));/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=(t,n)=>{const e=s.forwardRef(({className:r,...o},i)=>s.createElement(O,{ref:i,iconNode:n,className:w(`lucide-${R(t)}`,r),...o}));return e.displayName=`${t}`,e};function h(t,n){if(typeof t=="function")return t(n);t!=null&&(t.current=n)}function C(...t){return n=>{let e=!1;const r=t.map(o=>{const i=h(o,n);return!e&&typeof i=="function"&&(e=!0),i});if(e)return()=>{for(let o=0;o<r.length;o++){const i=r[o];typeof i=="function"?i():h(t[o],null)}}}}function F(...t){return s.useCallback(C(...t),t)}var k=s.forwardRef((t,n)=>{const{children:e,...r}=t,o=s.Children.toArray(e),i=o.find(P);if(i){const l=i.props.children,u=o.map(d=>d===i?s.Children.count(l)>1?s.Children.only(null):s.isValidElement(l)?l.props.children:null:d);return m.jsx(p,{...r,ref:n,children:s.isValidElement(l)?s.cloneElement(l,void 0,u):null})}return m.jsx(p,{...r,ref:n,children:e})});k.displayName="Slot";var p=s.forwardRef((t,n)=>{const{children:e,...r}=t;if(s.isValidElement(e)){const o=B(e),i=W(r,e.props);return e.type!==s.Fragment&&(i.ref=n?C(n,o):o),s.cloneElement(e,i)}return s.Children.count(e)>1?s.Children.only(null):null});p.displayName="SlotClone";var S=({children:t})=>m.jsx(m.Fragment,{children:t});function P(t){return s.isValidElement(t)&&t.type===S}function W(t,n){const e={...n};for(const r in n){const o=t[r],i=n[r];/^on[A-Z]/.test(r)?o&&i?e[r]=(...u)=>{i(...u),o(...u)}:o&&(e[r]=o):r==="style"?e[r]={...o,...i}:r==="className"&&(e[r]=[o,i].filter(Boolean).join(" "))}return{...t,...e}}function B(t){var r,o;let n=(r=Object.getOwnPropertyDescriptor(t.props,"ref"))==null?void 0:r.get,e=n&&"isReactWarning"in n&&n.isReactWarning;return e?t.ref:(n=(o=Object.getOwnPropertyDescriptor(t,"ref"))==null?void 0:o.get,e=n&&"isReactWarning"in n&&n.isReactWarning,e?t.props.ref:t.props.ref||t.ref)}const y=t=>typeof t=="boolean"?`${t}`:t===0?"0":t,x=E,_=(t,n)=>e=>{var r;if((n==null?void 0:n.variants)==null)return x(t,e==null?void 0:e.class,e==null?void 0:e.className);const{variants:o,defaultVariants:i}=n,l=Object.keys(o).map(a=>{const c=e==null?void 0:e[a],v=i==null?void 0:i[a];if(c===null)return null;const f=y(c)||y(v);return o[a][f]}),u=e&&Object.entries(e).reduce((a,c)=>{let[v,f]=c;return f===void 0||(a[v]=f),a},{}),d=n==null||(r=n.compoundVariants)===null||r===void 0?void 0:r.reduce((a,c)=>{let{class:v,className:f,...j}=c;return Object.entries(j).every(V=>{let[b,g]=V;return Array.isArray(g)?g.includes({...i,...u}[b]):{...i,...u}[b]===g})?[...a,v,f]:a},[]);return x(t,l,d,e==null?void 0:e.class,e==null?void 0:e.className)},$=_("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",{variants:{variant:{default:"bg-lime-500 text-primary-foreground shadow-xs hover:bg-lime-600/90",destructive:"bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",secondary:"bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",link:"text-primary underline-offset-4 hover:underline",warning:"bg-amber-400 text-primary-foreground shadow-xs hover:bg-amber-600/90"},size:{default:"h-9 px-4 py-2 has-[>svg]:px-3",sm:"h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",lg:"h-10 rounded-md px-6 has-[>svg]:px-4",icon:"size-9"}},defaultVariants:{variant:"default",size:"default"}});function H({className:t,variant:n,size:e,asChild:r=!1,...o}){const i=r?k:"button";return m.jsx(i,{"data-slot":"button",className:N($({variant:n,size:e,className:t})),...o})}export{H as B,k as S,S as a,_ as b,D as c,C as d,$ as e,F as u};
