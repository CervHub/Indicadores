import{m as f,r as j,j as r}from"./app-C-0mBqI0.js";import{I as b}from"./input-error-DxrFso6n.js";import{B as n}from"./button-BtF-l9ZE.js";import{D as C,a as D,b as N,c as v,d as y,e as E}from"./dialog-WzvJDR1f.js";import{I}from"./input-BjB26rwQ.js";import{L}from"./label-DAu2Cmyg.js";import{t as o}from"./index-1CUtvwKp.js";import{L as O}from"./loader-circle-qOZy4Gtn.js";import"./utils-Dxu7ruf7.js";import"./index-ChmDiNj5.js";import"./index-C8tjKgCl.js";function A(){const{data:l,setData:c,post:m,processing:a,errors:p,reset:d}=f({nombre:""}),[u,s]=j.useState(!1),x=e=>{const{success:t,error:i}=e.props.flash;t&&(s(!1),d(),o.success(t)),i&&(s(!0),o.error(i))},g=()=>{s(!0),o.error("Ocurrió un error al intentar crear la categoría.")},h=e=>{e.preventDefault(),m(route("admin.category.store"),{onSuccess:x,onError:g})};return r.jsx("div",{children:r.jsxs(C,{open:u,onOpenChange:s,children:[r.jsx("div",{className:"flex justify-start",children:r.jsx(D,{asChild:!0,children:r.jsx(n,{className:"inline-block px-4 py-2",children:"Crear Categoría"})})}),r.jsxs(N,{className:"sm:max-w-[425px]",children:[r.jsxs(v,{children:[r.jsx(y,{children:"Crear Categoría"}),r.jsx(E,{children:"Complete los campos para crear una nueva categoría."})]}),r.jsxs("form",{onSubmit:h,className:"space-y-3",children:[r.jsxs("div",{className:"grid gap-2",children:[r.jsx(L,{htmlFor:"nombre",children:"Nombre"}),r.jsx(I,{id:"nombre",type:"text",required:!0,value:l.nombre,onChange:e=>c("nombre",e.target.value),disabled:a,placeholder:"Nombre"}),r.jsx(b,{message:p.nombre})]}),r.jsxs(n,{type:"submit",className:"mt-2 w-auto",disabled:a,children:[a&&r.jsx(O,{className:"h-4 w-4 animate-spin"}),"Guardar"]})]})]})]})})}export{A as default};
