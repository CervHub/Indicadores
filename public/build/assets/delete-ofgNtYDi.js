import{K as h,m as j,j as e}from"./app-CRatwQnn.js";import{B as b}from"./button-IYTQ6fqB.js";import{D as n,b as D,c as g,d as v,e as C}from"./dialog-xGS_-RRy.js";import{t as d}from"./index-wOLGeJc3.js";import{L as N}from"./loader-circle-BDfpH8lA.js";import"./index-CGsOreyc.js";import"./utils-Dxu7ruf7.js";import"./index-rrL4l45B.js";import"./index-AI2GBkp9.js";function T({contractor:s,isDialogOpen:a,setIsDialogOpen:i}){const{flash:w}=h().props,{post:u,processing:l,reset:x}=j({id:(s==null?void 0:s.id)||"",ruc:(s==null?void 0:s.ruc)||"",nombre:(s==null?void 0:s.nombre)||"",descripcion:(s==null?void 0:s.descripcion)||"",email:(s==null?void 0:s.email)||"",password:""}),f=r=>{r.preventDefault(),s&&u(route("admin.contractor.destroy",{contrata:s.id}),{onSuccess:p=>{const m=p.props.flash;m.success&&(i(!1),x(),d.success(m.success)),m.error&&(i(!0),d.error(m.error))},onError:p=>{i(!0),d.error("Ocurrió un error al intentar desactivar la empresa.")}})};return e.jsx("div",{children:e.jsx(n,{open:a,onOpenChange:i,children:e.jsxs(D,{className:"sm:max-w-[425px]",children:[e.jsxs(g,{children:[e.jsx(v,{children:"Desactivar Empresa"}),e.jsxs(C,{children:["¿Está seguro de que desea desactivar esta empresa?",e.jsx("br",{}),e.jsx("strong",{children:"Nombre:"})," ",s==null?void 0:s.nombre,e.jsx("br",{}),e.jsx("strong",{children:"RUC:"})," ",s==null?void 0:s.ruc]})]}),e.jsx("form",{onSubmit:f,className:"space-y-3",method:"post",action:route("admin.contractor.destroy",{contrata:s==null?void 0:s.id}),children:e.jsxs(b,{type:"submit",className:"mt-2 w-auto",disabled:l,children:[l&&e.jsx(N,{className:"h-4 w-4 animate-spin"}),"Confirmar Desactivación"]})})]})})})}export{T as default};
