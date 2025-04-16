import{r as i,j as h}from"./app-CRatwQnn.js";import"./index-AI2GBkp9.js";import{d as U}from"./utils-Dxu7ruf7.js";import{C as W}from"./check-C2Lxxfoh.js";function E(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function A(...e){return t=>{let n=!1;const o=e.map(r=>{const s=E(r,t);return!n&&typeof s=="function"&&(n=!0),s});if(n)return()=>{for(let r=0;r<o.length;r++){const s=o[r];typeof s=="function"?s():E(e[r],null)}}}}function O(...e){return i.useCallback(A(...e),e)}function $(e,t=[]){let n=[];function o(s,u){const c=i.createContext(u),d=n.length;n=[...n,u];const a=l=>{var x;const{scope:f,children:m,...b}=l,v=((x=f==null?void 0:f[e])==null?void 0:x[d])||c,g=i.useMemo(()=>b,Object.values(b));return h.jsx(v.Provider,{value:g,children:m})};a.displayName=s+"Provider";function p(l,f){var v;const m=((v=f==null?void 0:f[e])==null?void 0:v[d])||c,b=i.useContext(m);if(b)return b;if(u!==void 0)return u;throw new Error(`\`${l}\` must be used within \`${s}\``)}return[a,p]}const r=()=>{const s=n.map(u=>i.createContext(u));return function(c){const d=(c==null?void 0:c[e])||s;return i.useMemo(()=>({[`__scope${e}`]:{...c,[e]:d}}),[c,d])}};return r.scopeName=e,[o,B(r,...t)]}function B(...e){const t=e[0];if(e.length===1)return t;const n=()=>{const o=e.map(r=>({useScope:r(),scopeName:r.scopeName}));return function(s){const u=o.reduce((c,{useScope:d,scopeName:a})=>{const l=d(s)[`__scope${a}`];return{...c,...l}},{});return i.useMemo(()=>({[`__scope${t.scopeName}`]:u}),[u])}};return n.scopeName=t.scopeName,n}function w(e,t,{checkForDefaultPrevented:n=!0}={}){return function(r){if(e==null||e(r),n===!1||!r.defaultPrevented)return t==null?void 0:t(r)}}function M(e){const t=i.useRef(e);return i.useEffect(()=>{t.current=e}),i.useMemo(()=>(...n)=>{var o;return(o=t.current)==null?void 0:o.call(t,...n)},[])}function F({prop:e,defaultProp:t,onChange:n=()=>{}}){const[o,r]=V({defaultProp:t,onChange:n}),s=e!==void 0,u=s?e:o,c=M(n),d=i.useCallback(a=>{if(s){const l=typeof a=="function"?a(e):a;l!==e&&c(l)}else r(a)},[s,e,r,c]);return[u,d]}function V({defaultProp:e,onChange:t}){const n=i.useState(e),[o]=n,r=i.useRef(o),s=M(t);return i.useEffect(()=>{r.current!==o&&(s(o),r.current=o)},[o,r,s]),n}function K(e){const t=i.useRef({value:e,previous:e});return i.useMemo(()=>(t.current.value!==e&&(t.current.previous=t.current.value,t.current.value=e),t.current.previous),[e])}var P=globalThis!=null&&globalThis.document?i.useLayoutEffect:()=>{};function q(e){const[t,n]=i.useState(void 0);return P(()=>{if(e){n({width:e.offsetWidth,height:e.offsetHeight});const o=new ResizeObserver(r=>{if(!Array.isArray(r)||!r.length)return;const s=r[0];let u,c;if("borderBoxSize"in s){const d=s.borderBoxSize,a=Array.isArray(d)?d[0]:d;u=a.inlineSize,c=a.blockSize}else u=e.offsetWidth,c=e.offsetHeight;n({width:u,height:c})});return o.observe(e,{box:"border-box"}),()=>o.unobserve(e)}else n(void 0)},[e]),t}function X(e,t){return i.useReducer((n,o)=>t[n][o]??n,e)}var I=e=>{const{present:t,children:n}=e,o=Z(t),r=typeof n=="function"?n({present:o.isPresent}):i.Children.only(n),s=O(o.ref,G(r));return typeof n=="function"||o.isPresent?i.cloneElement(r,{ref:s}):null};I.displayName="Presence";function Z(e){const[t,n]=i.useState(),o=i.useRef({}),r=i.useRef(e),s=i.useRef("none"),u=e?"mounted":"unmounted",[c,d]=X(u,{mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}});return i.useEffect(()=>{const a=k(o.current);s.current=c==="mounted"?a:"none"},[c]),P(()=>{const a=o.current,p=r.current;if(p!==e){const f=s.current,m=k(a);e?d("MOUNT"):m==="none"||(a==null?void 0:a.display)==="none"?d("UNMOUNT"):d(p&&f!==m?"ANIMATION_OUT":"UNMOUNT"),r.current=e}},[e,d]),P(()=>{if(t){let a;const p=t.ownerDocument.defaultView??window,l=m=>{const v=k(o.current).includes(m.animationName);if(m.target===t&&v&&(d("ANIMATION_END"),!r.current)){const g=t.style.animationFillMode;t.style.animationFillMode="forwards",a=p.setTimeout(()=>{t.style.animationFillMode==="forwards"&&(t.style.animationFillMode=g)})}},f=m=>{m.target===t&&(s.current=k(o.current))};return t.addEventListener("animationstart",f),t.addEventListener("animationcancel",l),t.addEventListener("animationend",l),()=>{p.clearTimeout(a),t.removeEventListener("animationstart",f),t.removeEventListener("animationcancel",l),t.removeEventListener("animationend",l)}}else d("ANIMATION_END")},[t,d]),{isPresent:["mounted","unmountSuspended"].includes(c),ref:i.useCallback(a=>{a&&(o.current=getComputedStyle(a)),n(a)},[])}}function k(e){return(e==null?void 0:e.animationName)||"none"}function G(e){var o,r;let t=(o=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:o.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(t=(r=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:r.get,n=t&&"isReactWarning"in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}function H(e){const t=J(e),n=i.forwardRef((o,r)=>{const{children:s,...u}=o,c=i.Children.toArray(s),d=c.find(Y);if(d){const a=d.props.children,p=c.map(l=>l===d?i.Children.count(a)>1?i.Children.only(null):i.isValidElement(a)?a.props.children:null:l);return h.jsx(t,{...u,ref:r,children:i.isValidElement(a)?i.cloneElement(a,void 0,p):null})}return h.jsx(t,{...u,ref:r,children:s})});return n.displayName=`${e}.Slot`,n}function J(e){const t=i.forwardRef((n,o)=>{const{children:r,...s}=n;if(i.isValidElement(r)){const u=te(r),c=ee(s,r.props);return r.type!==i.Fragment&&(c.ref=o?A(o,u):u),i.cloneElement(r,c)}return i.Children.count(r)>1?i.Children.only(null):null});return t.displayName=`${e}.SlotClone`,t}var Q=Symbol("radix.slottable");function Y(e){return i.isValidElement(e)&&typeof e.type=="function"&&"__radixId"in e.type&&e.type.__radixId===Q}function ee(e,t){const n={...t};for(const o in t){const r=e[o],s=t[o];/^on[A-Z]/.test(o)?r&&s?n[o]=(...c)=>{s(...c),r(...c)}:r&&(n[o]=r):o==="style"?n[o]={...r,...s}:o==="className"&&(n[o]=[r,s].filter(Boolean).join(" "))}return{...e,...n}}function te(e){var o,r;let t=(o=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:o.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(t=(r=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:r.get,n=t&&"isReactWarning"in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}var ne=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","span","svg","ul"],j=ne.reduce((e,t)=>{const n=H(`Primitive.${t}`),o=i.forwardRef((r,s)=>{const{asChild:u,...c}=r,d=u?n:t;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),h.jsx(d,{...c,ref:s})});return o.displayName=`Primitive.${t}`,{...e,[t]:o}},{}),R="Checkbox",[re,pe]=$(R),[oe,se]=re(R),_=i.forwardRef((e,t)=>{const{__scopeCheckbox:n,name:o,checked:r,defaultChecked:s,required:u,disabled:c,value:d="on",onCheckedChange:a,form:p,...l}=e,[f,m]=i.useState(null),b=O(t,C=>m(C)),v=i.useRef(!1),g=f?p||!!f.closest("form"):!0,[x=!1,N]=F({prop:r,defaultProp:s,onChange:a}),L=i.useRef(x);return i.useEffect(()=>{const C=f==null?void 0:f.form;if(C){const S=()=>N(L.current);return C.addEventListener("reset",S),()=>C.removeEventListener("reset",S)}},[f,N]),h.jsxs(oe,{scope:n,state:x,disabled:c,children:[h.jsx(j.button,{type:"button",role:"checkbox","aria-checked":y(x)?"mixed":x,"aria-required":u,"data-state":z(x),"data-disabled":c?"":void 0,disabled:c,value:d,...l,ref:b,onKeyDown:w(e.onKeyDown,C=>{C.key==="Enter"&&C.preventDefault()}),onClick:w(e.onClick,C=>{N(S=>y(S)?!0:!S),g&&(v.current=C.isPropagationStopped(),v.current||C.stopPropagation())})}),g&&h.jsx(ie,{control:f,bubbles:!v.current,name:o,value:d,checked:x,required:u,disabled:c,form:p,style:{transform:"translateX(-100%)"},defaultChecked:y(s)?!1:s})]})});_.displayName=R;var T="CheckboxIndicator",D=i.forwardRef((e,t)=>{const{__scopeCheckbox:n,forceMount:o,...r}=e,s=se(T,n);return h.jsx(I,{present:o||y(s.state)||s.state===!0,children:h.jsx(j.span,{"data-state":z(s.state),"data-disabled":s.disabled?"":void 0,...r,ref:t,style:{pointerEvents:"none",...e.style}})})});D.displayName=T;var ie=e=>{const{control:t,checked:n,bubbles:o=!0,defaultChecked:r,...s}=e,u=i.useRef(null),c=K(n),d=q(t);i.useEffect(()=>{const p=u.current,l=window.HTMLInputElement.prototype,m=Object.getOwnPropertyDescriptor(l,"checked").set;if(c!==n&&m){const b=new Event("click",{bubbles:o});p.indeterminate=y(n),m.call(p,y(n)?!1:n),p.dispatchEvent(b)}},[c,n,o]);const a=i.useRef(y(n)?!1:n);return h.jsx("input",{type:"checkbox","aria-hidden":!0,defaultChecked:r??a.current,...s,tabIndex:-1,ref:u,style:{...e.style,...d,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})};function y(e){return e==="indeterminate"}function z(e){return y(e)?"indeterminate":e?"checked":"unchecked"}var ce=_,ae=D;function me({className:e,...t}){return h.jsx(ce,{"data-slot":"checkbox",className:U("peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",e),...t,children:h.jsx(ae,{"data-slot":"checkbox-indicator",className:"flex items-center justify-center text-current transition-none",children:h.jsx(W,{className:"size-3.5"})})})}export{me as C};
