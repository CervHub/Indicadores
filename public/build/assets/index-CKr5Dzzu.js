import{m as x,j as e,L as p}from"./app-BM5UaoLz.js";import{B as f}from"./button-B4jGflLp.js";import{C as h,a as u,b as j,d as b}from"./card-DTneW_Fh.js";import{I as l}from"./input-TpMKGzio.js";import{L as i}from"./label-B_nWyyjo.js";import{A as v}from"./app-layout-DYFWWzgH.js";import{t}from"./index-CIInWgbm.js";import{L as C}from"./loader-circle-Bak669U4.js";import"./utils-Dxu7ruf7.js";import"./index-I9jujFTw.js";import"./index-DNhIbKYH.js";import"./index-CsW0YbbF.js";import"./index-18jJ_1tY.js";import"./index-BWLW1MRR.js";import"./chevrons-up-down-IEvf6zbC.js";import"./file-chart-pie-BBiiNmB0.js";import"./chevron-right-B93HO6UP.js";const N=[{title:"Decodificar Excel",href:"/decode"}];function q(){const{data:c,setData:s,post:m,processing:a,reset:n}=x({name:"",file:null}),d=r=>{r.preventDefault(),m(route("decode.store"),{onSuccess:()=>{t.success("Archivo procesado con éxito"),n()},onError:()=>{t.error("Ocurrió un error al procesar el archivo")}})};return e.jsxs(v,{breadcrumbs:N,children:[e.jsx(p,{title:"Decodificar Excel"}),e.jsx("div",{className:"flex h-full flex-1 flex-col gap-4 rounded-xl p-4",children:e.jsxs(h,{className:"w-full",children:[e.jsx(u,{children:e.jsx(j,{children:"Subir Archivo Excel"})}),e.jsx(b,{children:e.jsxs("form",{onSubmit:d,className:"space-y-4",children:[e.jsxs("div",{className:"flex flex-col space-y-2",children:[e.jsx(i,{htmlFor:"name",children:"Nombre"}),e.jsx(l,{id:"name",placeholder:"Ingresa tu nombre",value:c.name,onChange:r=>s("name",r.target.value)})]}),e.jsxs("div",{className:"flex flex-col space-y-2",children:[e.jsx(i,{htmlFor:"file",children:"Archivo Excel"}),e.jsx(l,{id:"file",type:"file",accept:".xlsx, .xls",onChange:r=>{var o;return s("file",((o=r.target.files)==null?void 0:o[0])||null)}})]}),e.jsx(f,{type:"submit",className:"w-auto",disabled:a,children:a?e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(C,{className:"h-4 w-4 animate-spin"}),e.jsx("span",{children:"Procesando..."})]}):"Procesar"})]})})]})})]})}export{q as default};
