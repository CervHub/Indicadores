import{r as l,j as e,L as V,$ as W}from"./app-CTL5S9iY.js";import{C as A,a as w,b as S,c as Y,d as _,e as X,L as q,f as Z,X as J,j as Q,g as ee,i as P,k as te,l as oe}from"./chart-BqVViuTQ.js";import{S as re,a as ae,b as ne,c as se,f as h}from"./select-DqDnb1_4.js";import{a as O,u as I,S as ce,B as R}from"./button-CXUJ0U03.js";import{u as ie,c as le,a as x,P as D}from"./index-D0mu6X-q.js";import{c as k,d as de,e as ue,A as E,g as pe,h as fe,j as he,i as me,F as xe,k as ve,l as ge,m as Ce}from"./index-BCT-lbNC.js";import{P as M}from"./index-BnBYLySk.js";import{c as je}from"./utils-2YzkRP5P.js";import{A as Pe}from"./app-layout-CAzHklqt.js";import"./index-D1sDU56J.js";import"./app-logo-icon-CzSnhrzU.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ye=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],be=O("ArrowRight",ye);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ne=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],Re=O("Info",Ne),Ae=()=>{const t=[];for(let r=2020;r<=2025;r++)for(let o=1;o<=12;o++)t.push({date:`${r}-${String(o).padStart(2,"0")}-01`,line1:Math.floor(Math.random()*500),line2:Math.floor(Math.random()*500),line3:Math.floor(Math.random()*500)});return t},we=Ae(),Se={line1:{label:"Line 1",color:"hsl(var(--chart-1))"},line2:{label:"Line 2",color:"hsl(var(--chart-2))"},line3:{label:"Line 3",color:"hsl(var(--chart-3))"}},_e=()=>{const[t,r]=l.useState("2025"),o=we.filter(a=>new Date(a.date).getFullYear().toString()===t);return e.jsxs(A,{children:[e.jsxs(w,{className:"flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row",children:[e.jsxs("div",{className:"grid flex-1 gap-1 text-center sm:text-left",children:[e.jsx(S,{children:"Line Chart - Interactive"}),e.jsx(Y,{children:"Showing total visitors for the selected year"})]}),e.jsxs(re,{value:t,onValueChange:r,children:[e.jsx(ae,{className:"w-[160px] rounded-lg sm:ml-auto","aria-label":"Select a year",children:e.jsx(ne,{placeholder:"Select a year"})}),e.jsxs(se,{className:"rounded-xl",children:[e.jsx(h,{value:"2025",className:"rounded-lg",children:"2025"}),e.jsx(h,{value:"2024",className:"rounded-lg",children:"2024"}),e.jsx(h,{value:"2023",className:"rounded-lg",children:"2023"}),e.jsx(h,{value:"2022",className:"rounded-lg",children:"2022"}),e.jsx(h,{value:"2021",className:"rounded-lg",children:"2021"}),e.jsx(h,{value:"2020",className:"rounded-lg",children:"2020"})]})]})]}),e.jsx(_,{className:"px-2 pt-4 sm:px-6 sm:pt-6",children:e.jsx(X,{config:Se,className:"aspect-auto h-[320px] w-full",children:e.jsxs(q,{data:o,children:[e.jsx(Z,{vertical:!1}),e.jsx(J,{dataKey:"date",tickLine:!1,axisLine:!1,tickMargin:8,minTickGap:32,tickFormatter:a=>new Date(a).toLocaleDateString("en-US",{month:"short",year:"numeric"})}),e.jsx(Q,{cursor:!1,content:e.jsx(ee,{labelFormatter:a=>new Date(a).toLocaleDateString("en-US",{month:"short",year:"numeric"}),indicator:"dot"})}),e.jsx(P,{dataKey:"line1",type:"monotone",stroke:"var(--color-line1)",strokeWidth:2,dot:!1}),e.jsx(P,{dataKey:"line2",type:"monotone",stroke:"var(--color-line2)",strokeWidth:2,dot:!1}),e.jsx(P,{dataKey:"line3",type:"monotone",stroke:"var(--color-line3)",strokeWidth:2,dot:!1}),e.jsx(te,{content:e.jsx(oe,{})})]})})})]})};var b="Popover",[F,nt]=le(b,[k]),v=k(),[Oe,p]=F(b),L=t=>{const{__scopePopover:r,children:o,open:a,defaultOpen:n,onOpenChange:s,modal:c=!1}=t,i=v(r),d=l.useRef(null),[u,g]=l.useState(!1),[C=!1,f]=ie({prop:a,defaultProp:n,onChange:s});return e.jsx(de,{...i,children:e.jsx(Oe,{scope:r,contentId:ue(),triggerRef:d,open:C,onOpenChange:f,onOpenToggle:l.useCallback(()=>f(j=>!j),[f]),hasCustomAnchor:u,onCustomAnchorAdd:l.useCallback(()=>g(!0),[]),onCustomAnchorRemove:l.useCallback(()=>g(!1),[]),modal:c,children:o})})};L.displayName=b;var T="PopoverAnchor",Ie=l.forwardRef((t,r)=>{const{__scopePopover:o,...a}=t,n=p(T,o),s=v(o),{onCustomAnchorAdd:c,onCustomAnchorRemove:i}=n;return l.useEffect(()=>(c(),()=>i()),[c,i]),e.jsx(E,{...s,...a,ref:r})});Ie.displayName=T;var $="PopoverTrigger",B=l.forwardRef((t,r)=>{const{__scopePopover:o,...a}=t,n=p($,o),s=v(o),c=I(r,n.triggerRef),i=e.jsx(M.button,{type:"button","aria-haspopup":"dialog","aria-expanded":n.open,"aria-controls":n.contentId,"data-state":H(n.open),...a,ref:c,onClick:x(t.onClick,n.onOpenToggle)});return n.hasCustomAnchor?i:e.jsx(E,{asChild:!0,...s,children:i})});B.displayName=$;var N="PopoverPortal",[De,ke]=F(N,{forceMount:void 0}),G=t=>{const{__scopePopover:r,forceMount:o,children:a,container:n}=t,s=p(N,r);return e.jsx(De,{scope:r,forceMount:o,children:e.jsx(D,{present:o||s.open,children:e.jsx(pe,{asChild:!0,container:n,children:a})})})};G.displayName=N;var m="PopoverContent",K=l.forwardRef((t,r)=>{const o=ke(m,t.__scopePopover),{forceMount:a=o.forceMount,...n}=t,s=p(m,t.__scopePopover);return e.jsx(D,{present:a||s.open,children:s.modal?e.jsx(Ee,{...n,ref:r}):e.jsx(Me,{...n,ref:r})})});K.displayName=m;var Ee=l.forwardRef((t,r)=>{const o=p(m,t.__scopePopover),a=l.useRef(null),n=I(r,a),s=l.useRef(!1);return l.useEffect(()=>{const c=a.current;if(c)return fe(c)},[]),e.jsx(he,{as:ce,allowPinchZoom:!0,children:e.jsx(U,{...t,ref:n,trapFocus:o.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:x(t.onCloseAutoFocus,c=>{var i;c.preventDefault(),s.current||(i=o.triggerRef.current)==null||i.focus()}),onPointerDownOutside:x(t.onPointerDownOutside,c=>{const i=c.detail.originalEvent,d=i.button===0&&i.ctrlKey===!0,u=i.button===2||d;s.current=u},{checkForDefaultPrevented:!1}),onFocusOutside:x(t.onFocusOutside,c=>c.preventDefault(),{checkForDefaultPrevented:!1})})})}),Me=l.forwardRef((t,r)=>{const o=p(m,t.__scopePopover),a=l.useRef(!1),n=l.useRef(!1);return e.jsx(U,{...t,ref:r,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:s=>{var c,i;(c=t.onCloseAutoFocus)==null||c.call(t,s),s.defaultPrevented||(a.current||(i=o.triggerRef.current)==null||i.focus(),s.preventDefault()),a.current=!1,n.current=!1},onInteractOutside:s=>{var d,u;(d=t.onInteractOutside)==null||d.call(t,s),s.defaultPrevented||(a.current=!0,s.detail.originalEvent.type==="pointerdown"&&(n.current=!0));const c=s.target;((u=o.triggerRef.current)==null?void 0:u.contains(c))&&s.preventDefault(),s.detail.originalEvent.type==="focusin"&&n.current&&s.preventDefault()}})}),U=l.forwardRef((t,r)=>{const{__scopePopover:o,trapFocus:a,onOpenAutoFocus:n,onCloseAutoFocus:s,disableOutsidePointerEvents:c,onEscapeKeyDown:i,onPointerDownOutside:d,onFocusOutside:u,onInteractOutside:g,...C}=t,f=p(m,o),j=v(o);return me(),e.jsx(xe,{asChild:!0,loop:!0,trapped:a,onMountAutoFocus:n,onUnmountAutoFocus:s,children:e.jsx(ve,{asChild:!0,disableOutsidePointerEvents:c,onInteractOutside:g,onEscapeKeyDown:i,onPointerDownOutside:d,onFocusOutside:u,onDismiss:()=>f.onOpenChange(!1),children:e.jsx(ge,{"data-state":H(f.open),role:"dialog",id:f.contentId,...j,...C,ref:r,style:{...C.style,"--radix-popover-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-popover-content-available-width":"var(--radix-popper-available-width)","--radix-popover-content-available-height":"var(--radix-popper-available-height)","--radix-popover-trigger-width":"var(--radix-popper-anchor-width)","--radix-popover-trigger-height":"var(--radix-popper-anchor-height)"}})})})}),z="PopoverClose",Fe=l.forwardRef((t,r)=>{const{__scopePopover:o,...a}=t,n=p(z,o);return e.jsx(M.button,{type:"button",...a,ref:r,onClick:x(t.onClick,()=>n.onOpenChange(!1))})});Fe.displayName=z;var Le="PopoverArrow",Te=l.forwardRef((t,r)=>{const{__scopePopover:o,...a}=t,n=v(o);return e.jsx(Ce,{...n,...a,ref:r})});Te.displayName=Le;function H(t){return t?"open":"closed"}var $e=L,Be=B,Ge=G,Ke=K;function Ue({...t}){return e.jsx($e,{"data-slot":"popover",...t})}function ze({...t}){return e.jsx(Be,{"data-slot":"popover-trigger",...t})}function He({className:t,align:r="center",sideOffset:o=4,...a}){return e.jsx(Ge,{children:e.jsx(Ke,{"data-slot":"popover-content",align:r,sideOffset:o,className:je("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md outline-hidden",t),...a})})}const Ve=[{title:"Dashboard",href:"/dashboard"}],We=route("dashboard");console.log(We);const y=({title:t,buttons:r,info:o})=>e.jsxs(A,{className:"relative w-full",children:[e.jsxs(w,{className:"flex items-center justify-between",children:[e.jsx(S,{children:t}),e.jsxs(Ue,{children:[e.jsx(ze,{asChild:!0,children:e.jsx(R,{variant:"ghost",size:"icon",className:"absolute top-2 right-2",children:e.jsx(Re,{className:"h-5 w-5"})})}),e.jsx(He,{className:"w-80",children:e.jsx("div",{className:"grid gap-4 p-4",children:e.jsx("p",{className:"text-muted-foreground text-sm",children:o})})})]})]}),e.jsx(_,{children:r.map(({text:a,url:n},s)=>e.jsx(W,{href:n,method:"get",className:"mb-2 flex w-full items-center justify-between gap-2",children:e.jsxs(R,{variant:"outline",className:"flex w-full items-center justify-between gap-2",children:[a,e.jsx(be,{className:"h-5 w-5"})]})},s))})]});function st(){const t=[{text:"Actos y condiciones subestándares e incidentes",url:"/company/analysis/category"},{text:"Actos Subestándares",url:"/company/analysis/category/detail?category_name=Actos%20Subestándares"},{text:"Condiciones Subestándares",url:"/company/analysis/category/detail?category_name=Condiciones%20Subestándares"},{text:"Incidentes",url:"/company/analysis/category/detail?category_name=Incidentes"}],r=[{text:"Actos y condiciones subestándares e incidentes",url:"/company/analysis/category/year"},{text:"Observaciones detectadas por Gerencia",url:"/company/analysis/inspeccion/year"}],o=[{text:"Planeada, no planeada, comite y otros",url:route("company.analysis.inspeccion")},{text:"Detalles de inspección",url:route("company.analysis.inspeccion.detail")}];return e.jsxs(Pe,{breadcrumbs:Ve,children:[e.jsx(V,{title:"Dashboard"}),e.jsxs("div",{className:"flex h-full flex-1 flex-col gap-4 rounded-xl p-4",children:[e.jsx(_e,{}),e.jsxs("div",{className:"grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3",children:[e.jsx(y,{title:"DISTRIBUCIÓN POR TIPO",buttons:t,info:"Información detallada sobre la distribución por tipo."}),e.jsx(y,{title:"CURVA DE TENDENCIA",buttons:r,info:"Información detallada sobre la curva de tendencia."}),e.jsx(y,{title:"DISTRIBUCIÓN INSPECCIÓN",buttons:o,info:"Información detallada sobre la distribución de inspección."})]})]})]})}export{st as default};
