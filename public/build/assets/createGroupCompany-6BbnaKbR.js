import{m as N,r as c,j as r}from"./app-CRatwQnn.js";import{I as v}from"./input-error-Mp3PxWJc.js";import{B as D}from"./button-IYTQ6fqB.js";import{D as E,b as y,c as L,d as S,e as w}from"./dialog-xGS_-RRy.js";import{I as B}from"./input-B9fa9TCI.js";import{L as G}from"./label-Dkdb8OHP.js";import{t}from"./index-wOLGeJc3.js";import{L as q}from"./loader-circle-BDfpH8lA.js";import"./utils-Dxu7ruf7.js";import"./index-CGsOreyc.js";import"./index-rrL4l45B.js";import"./index-AI2GBkp9.js";function P({categoryId:a,title:l,isDialogOpen:p,setIsDialogOpen:s}){const{data:u,setData:d,post:x,processing:o,errors:f,reset:n}=N({name:""}),[h,j]=c.useState(a);c.useEffect(()=>{j(a),n()},[a]);const g=e=>{const{success:i,error:m}=e.props.flash;i&&(s(!1),n(),t.success(i)),m&&(s(!0),t.error(m))},b=()=>{s(!0),t.error("Ocurrió un error al intentar crear el grupo.")},C=e=>{e.preventDefault(),x(route("group.store",{category_id:h||0}),{onSuccess:g,onError:b})};return r.jsx("div",{children:r.jsx(E,{open:p,onOpenChange:s,children:r.jsxs(y,{className:"sm:max-w-[425px]",children:[r.jsxs(L,{children:[r.jsx(S,{children:l}),r.jsx(w,{children:"Complete los campos para crear un nuevo grupo."})]}),r.jsxs("form",{onSubmit:C,className:"space-y-3",children:[r.jsxs("div",{className:"grid gap-2",children:[r.jsx(G,{htmlFor:"name",children:"Nombre"}),r.jsx(B,{id:"name",type:"text",required:!0,value:u.name,onChange:e=>d("name",e.target.value),disabled:o,placeholder:"Nombre del grupo"}),r.jsx(v,{message:f.name})]}),r.jsxs(D,{type:"submit",className:"mt-2 w-auto",disabled:o,children:[o&&r.jsx(q,{className:"h-4 w-4 animate-spin"}),"Guardar"]})]})]})})})}export{P as default};
