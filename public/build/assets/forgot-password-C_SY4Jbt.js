import{m as n,j as e,L as c}from"./app-lwyxAAc0.js";import{I as d}from"./input-error-CUMyERF4.js";import{T as p}from"./text-link-CUOK8AmY.js";import{B as x}from"./button-DgKsjods.js";import{I as u}from"./input-Bpn1m0Sn.js";import{L as f}from"./label-DYvEWREL.js";import{A as j}from"./auth-layout-C0_MLGUH.js";import{L as h}from"./loader-circle-CwH8NjIm.js";import"./utils-Dxu7ruf7.js";import"./index-wbLpGGuJ.js";function F({status:s}){const{data:t,setData:i,post:o,processing:a,errors:m}=n({email:""}),l=r=>{r.preventDefault(),o(route("password.email"))};return e.jsxs(j,{title:"Olvidé mi contraseña",description:"Ingresa tu correo electrónico para recibir un enlace de restablecimiento de contraseña",children:[e.jsx(c,{title:"Olvidé mi contraseña"}),s&&e.jsx("div",{className:"mb-4 text-center text-sm font-medium text-green-600",children:s}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("form",{onSubmit:l,children:[e.jsxs("div",{className:"grid gap-2",children:[e.jsx(f,{htmlFor:"email",children:"Correo electrónico"}),e.jsx(u,{id:"email",type:"email",name:"email",autoComplete:"off",value:t.email,autoFocus:!0,onChange:r=>i("email",r.target.value),placeholder:"correo@ejemplo.com"}),e.jsx(d,{message:m.email})]}),e.jsx("div",{className:"my-6 flex items-center justify-start",children:e.jsxs(x,{className:"w-full",disabled:a,children:[a&&e.jsx(h,{className:"h-4 w-4 animate-spin"}),"Enviar enlace de restablecimiento de contraseña"]})})]}),e.jsxs("div",{className:"text-muted-foreground space-x-1 text-center text-sm",children:[e.jsx("span",{children:"O, regresa a"}),e.jsx(p,{href:route("login"),children:"iniciar sesión"})]})]})]})}export{F as default};
