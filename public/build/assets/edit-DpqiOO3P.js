import{K as v,m as E,r as c,j as s}from"./app-BC0I_x-8.js";import{I as n}from"./input-error-DjrE15Nc.js";import{B as C}from"./button-CPNoa6pn.js";import{D as N,b as D,c as y,d as q,e as F}from"./dialog-xExO4vfu.js";import{I as m}from"./input-BqvsmbS9.js";import{L as l}from"./label-DKlWSbcV.js";import{t as x}from"./index-9eh68DQj.js";import{L}from"./loader-circle-COg0BfpX.js";import"./utils-Dxu7ruf7.js";import"./index-DYqKuolF.js";import"./index-Ct77MprN.js";import"./index-fxEFBNQF.js";function A({contractor:e,isDialogOpen:f,setIsDialogOpen:p}){const{flash:w}=v().props,{data:r,setData:a,put:g,processing:d,errors:u}=E({id:(e==null?void 0:e.id)||"",ruc:(e==null?void 0:e.ruc)||"",nombre:(e==null?void 0:e.nombre)||"",descripcion:(e==null?void 0:e.descripcion)||"",email:(e==null?void 0:e.email)||""});c.useEffect(()=>{e&&a({id:e.id,ruc:e.ruc,nombre:e.nombre,descripcion:e.descripcion,email:e.email})},[e,a]),c.useEffect(()=>{a("email",`${r.ruc}@code.com.pe`)},[r.ruc]);const b=i=>{i.preventDefault(),e&&g(route("admin.contractor.update",{contrata:e.id}),{onSuccess:h=>{const o=h.props,j=o.flash.success,t=o.flash.error;j&&(p(!1),x.success(j)),t&&x.error(t)},onError:h=>{p(!0),x.error("Ocurrió un error al intentar actualizar la empresa.")}})};return s.jsx("div",{children:s.jsx(N,{open:f,onOpenChange:p,children:s.jsxs(D,{className:"sm:max-w-[425px]",children:[s.jsxs(y,{children:[s.jsx(q,{children:"Editar Empresa"}),s.jsx(F,{children:"Complete los campos para editar la  empresa."})]}),s.jsxs("form",{onSubmit:b,className:"space-y-3",method:"post",action:route("admin.contractor.update",{contrata:e==null?void 0:e.id}),children:[s.jsxs("div",{className:"grid gap-2",children:[s.jsx(l,{htmlFor:"ruc",children:"RUC"}),s.jsx(m,{id:"ruc",type:"text",required:!0,value:r.ruc||"",onChange:i=>a("ruc",i.target.value),disabled:d,placeholder:"RUC"}),s.jsx(n,{message:u.ruc})]}),s.jsxs("div",{className:"grid gap-2",children:[s.jsx(l,{htmlFor:"nombre",children:"Nombre"}),s.jsx(m,{id:"nombre",type:"text",required:!0,value:r.nombre||"",onChange:i=>a("nombre",i.target.value),disabled:d,placeholder:"Nombre"}),s.jsx(n,{message:u.nombre})]}),s.jsxs("div",{className:"grid gap-2",children:[s.jsx(l,{htmlFor:"descripcion",children:"Descripción"}),s.jsx(m,{id:"descripcion",type:"text",required:!0,value:r.descripcion||"",onChange:i=>a("descripcion",i.target.value),disabled:d,placeholder:"Descripción"}),s.jsx(n,{message:u.descripcion})]}),s.jsxs("div",{className:"grid gap-2",children:[s.jsx(l,{htmlFor:"email",children:"Email"}),s.jsx(m,{id:"email",type:"text",required:!0,value:`${r.ruc}@code.com.pe`,disabled:!0,placeholder:"Email"})]}),s.jsxs(C,{type:"submit",className:"mt-2 w-auto",disabled:d,children:[d&&s.jsx(L,{className:"h-4 w-4 animate-spin"}),"Guardar"]})]})]})})})}export{A as default};
