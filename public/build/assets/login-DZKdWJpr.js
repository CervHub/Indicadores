import{r as c,j as e,m as H,L as M}from"./app-BM5UaoLz.js";import{I as N}from"./input-error-CtwUZST5.js";import{c as z,u as F,B as y}from"./button-B4jGflLp.js";import{C as O,d as B}from"./card-DTneW_Fh.js";import{u as U,c as K,a as R,P as G}from"./index-DNhIbKYH.js";import{u as V}from"./index-4SncEB2u.js";import{u as X}from"./index-18jJ_1tY.js";import{P as D}from"./index-I9jujFTw.js";import{d as S}from"./utils-Dxu7ruf7.js";import{C as W}from"./check-BaAknfnO.js";import{D as Z,a as $,b as J,c as Q,d as Y,e as ee}from"./dialog-CwBL4gBr.js";import{I as P}from"./input-TpMKGzio.js";import{L as w}from"./label-B_nWyyjo.js";import{A as se}from"./auth-layout-MfGjcqcR.js";import{D as te}from"./download-DEU2Ipvm.js";import{L as re}from"./loader-circle-Bak669U4.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]],oe=z("CircleHelp",ae);var I="Checkbox",[ie,Pe]=K(I),[ne,ce]=ie(I),L=c.forwardRef((s,a)=>{const{__scopeCheckbox:t,name:l,checked:d,defaultChecked:r,required:p,disabled:n,value:i="on",onCheckedChange:g,form:h,...j}=s,[m,b]=c.useState(null),v=F(a,o=>b(o)),C=c.useRef(!1),E=m?h||!!m.closest("form"):!0,[x=!1,k]=U({prop:d,defaultProp:r,onChange:g}),A=c.useRef(x);return c.useEffect(()=>{const o=m==null?void 0:m.form;if(o){const f=()=>k(A.current);return o.addEventListener("reset",f),()=>o.removeEventListener("reset",f)}},[m,k]),e.jsxs(ne,{scope:t,state:x,disabled:n,children:[e.jsx(D.button,{type:"button",role:"checkbox","aria-checked":u(x)?"mixed":x,"aria-required":p,"data-state":q(x),"data-disabled":n?"":void 0,disabled:n,value:i,...j,ref:v,onKeyDown:R(s.onKeyDown,o=>{o.key==="Enter"&&o.preventDefault()}),onClick:R(s.onClick,o=>{k(f=>u(f)?!0:!f),E&&(C.current=o.isPropagationStopped(),C.current||o.stopPropagation())})}),E&&e.jsx(le,{control:m,bubbles:!C.current,name:l,value:i,checked:x,required:p,disabled:n,form:h,style:{transform:"translateX(-100%)"},defaultChecked:u(r)?!1:r})]})});L.displayName=I;var T="CheckboxIndicator",_=c.forwardRef((s,a)=>{const{__scopeCheckbox:t,forceMount:l,...d}=s,r=ce(T,t);return e.jsx(G,{present:l||u(r.state)||r.state===!0,children:e.jsx(D.span,{"data-state":q(r.state),"data-disabled":r.disabled?"":void 0,...d,ref:a,style:{pointerEvents:"none",...s.style}})})});_.displayName=T;var le=s=>{const{control:a,checked:t,bubbles:l=!0,defaultChecked:d,...r}=s,p=c.useRef(null),n=V(t),i=X(a);c.useEffect(()=>{const h=p.current,j=window.HTMLInputElement.prototype,b=Object.getOwnPropertyDescriptor(j,"checked").set;if(n!==t&&b){const v=new Event("click",{bubbles:l});h.indeterminate=u(t),b.call(h,u(t)?!1:t),h.dispatchEvent(v)}},[n,t,l]);const g=c.useRef(u(t)?!1:t);return e.jsx("input",{type:"checkbox","aria-hidden":!0,defaultChecked:d??g.current,...r,tabIndex:-1,ref:p,style:{...s.style,...i,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})};function u(s){return s==="indeterminate"}function q(s){return u(s)?"indeterminate":s?"checked":"unchecked"}var de=L,me=_;function ue({className:s,...a}){return e.jsx(de,{"data-slot":"checkbox",className:S("peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",s),...a,children:e.jsx(me,{"data-slot":"checkbox-indicator",className:"flex items-center justify-center text-current transition-none",children:e.jsx(W,{className:"size-3.5"})})})}function De({status:s}){const{data:a,setData:t,post:l,processing:d,errors:r,reset:p}=H({email:"",password:"",remember:!1}),n=i=>{i.preventDefault(),l(route("login"),{onFinish:()=>p("password")})};return e.jsxs(se,{title:"Inicia sesión en tu cuenta",description:"Ingresa tu correo electrónico y contraseña a continuación para iniciar sesión",children:[e.jsx(M,{title:"Iniciar sesión"}),e.jsx("div",{className:S("flex flex-col gap-6"),children:e.jsx(O,{className:"rounded-5xl relative overflow-hidden p-0 shadow-sm md:shadow-md",children:e.jsxs(B,{className:"grid p-0 md:grid-cols-2",children:[e.jsx("div",{className:"relative m-4 hidden bg-white p-2 md:block",children:e.jsxs("div",{className:"h-full w-full overflow-hidden",children:[e.jsx("img",{src:"/auth/img-toq.png",alt:"Imagen",className:"object-initial absolute inset-0 h-full w-full"}),e.jsx("div",{className:"absolute bottom-4 left-4",children:e.jsx(y,{variant:"destructive",asChild:!0,className:"flex items-center space-x-2",children:e.jsxs("a",{href:"https://play.google.com/store/apps/details?id=com.CERV.GESTIONSSTV1",children:[e.jsx(te,{className:"h-5 w-5"}),e.jsx("span",{children:"Descargar APP"})]})})}),e.jsx("div",{className:"absolute right-10 bottom-4",children:e.jsxs(Z,{children:[e.jsx($,{asChild:!0,children:e.jsx(y,{className:"flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600",children:e.jsx(oe,{className:"size-7 h-7 w-7"})})}),e.jsxs(J,{className:"sm:max-w-md",children:[e.jsxs(Q,{children:[e.jsx(Y,{children:"Contacto de Soporte"}),e.jsx(ee,{children:"Si necesitas ayuda, puedes contactarnos a través de los siguientes medios:"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{children:"Correo: soporte@cerv.com.pe"}),e.jsx("p",{children:"WhatsApp y Teléfono: +51 948 202 038"})]})]})]})})]})}),e.jsx("form",{className:"p-6 md:p-8",onSubmit:n,children:e.jsxs("div",{className:"flex flex-col gap-6",children:[e.jsxs("div",{className:"flex items-center justify-between gap-4",children:[e.jsx("img",{src:"/auth/logo-SOUTHERN-PERU.png",alt:"Logo Grupo México",className:"h-4"}),e.jsx("img",{src:"/auth/CRUZ-minimal-toquepala.png",alt:"Logo Southern Peru",className:"h-10"})]}),e.jsx("div",{className:"mt-4 flex justify-center",children:e.jsx("img",{src:"/auth/logogrupomexico-mineria-02.png",alt:"Logo Cruz Toquepala",className:"h-12"})}),e.jsx("div",{className:"flex flex-col items-center text-center",children:e.jsx("p",{className:"text-muted-foreground text-sm text-balance",children:"Ingresa tu correo electrónico o RUC y tu contraseña para iniciar sesión en tu cuenta."})}),e.jsxs("div",{className:"grid gap-2",children:[e.jsx(w,{htmlFor:"email",children:"Correo electrónico/RUC"}),e.jsx(P,{id:"email",type:"text",required:!0,autoFocus:!0,tabIndex:1,autoComplete:"email",value:a.email,onChange:i=>t("email",i.target.value),placeholder:"correo@ejemplo.com"}),e.jsx(N,{message:r.email})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsx("div",{className:"flex items-center",children:e.jsx(w,{htmlFor:"password",children:"Contraseña"})}),e.jsx(P,{id:"password",type:"password",required:!0,tabIndex:2,autoComplete:"current-password",value:a.password,onChange:i=>t("password",i.target.value),placeholder:"Contraseña"}),e.jsx(N,{message:r.password}),e.jsx(N,{message:r.error})]}),e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx(ue,{id:"remember",name:"remember",checked:a.remember,onClick:()=>t("remember",!a.remember),tabIndex:3}),e.jsx(w,{htmlFor:"remember",children:"Recuérdame"})]}),e.jsx("div",{className:"flex w-full items-center justify-center",children:e.jsxs(y,{type:"submit",variant:"destructive",className:"w-auto",tabIndex:4,disabled:d,children:[d&&e.jsx(re,{className:"h-4 w-4 animate-spin"}),"Iniciar sesión"]})})]})})]})})}),s&&e.jsx("div",{className:"mb-4 text-center text-sm font-medium text-green-600",children:s})]})}export{De as default};
