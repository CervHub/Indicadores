import{m as j,r as i,j as e}from"./app-CRatwQnn.js";import{B as D}from"./button-IYTQ6fqB.js";import{D as h,b as E,c as y,d as b,e as N}from"./dialog-xGS_-RRy.js";import{L as S}from"./loader-circle-BDfpH8lA.js";import"./index-CGsOreyc.js";import"./utils-Dxu7ruf7.js";import"./index-rrL4l45B.js";import"./index-AI2GBkp9.js";function H({isOpen:d=!1,onOpenChange:r,selectedItem:s}){const{data:a,setData:c,delete:l,processing:n,reset:m}=j({id:s.id}),[u,o]=i.useState(d),[f,p]=i.useState(!1);i.useEffect(()=>{p(a.id!=="0")},[a]),i.useEffect(()=>{o(d)},[d]),i.useEffect(()=>{c("id",s.id)},[s,c]);const x=t=>{t.preventDefault(),l(route("security-engineer.destroy",{id:a.id}),{onSuccess:g=>{m(),o(!1),r&&r(!1)},onError:g=>{o(!0)}})};return e.jsx("div",{children:e.jsx(h,{open:u,onOpenChange:t=>{o(t),r&&r(t)},children:e.jsxs(E,{className:"sm:max-w-[425px]",children:[e.jsxs(y,{children:[e.jsx(b,{children:"Eliminar Acceso de Ingeniero de Seguridad"}),e.jsxs(N,{children:["¿Está seguro de que desea eliminar el acceso de ",s.nombres," ",s.apellidos," como ingeniero de seguridad? Esta acción no se puede deshacer."]})]}),e.jsx("form",{onSubmit:x,className:"space-y-3",method:"delete",action:route("security-engineer.destroy",{id:a.id}),children:e.jsx("div",{className:"flex justify-end space-x-2",children:e.jsxs(D,{type:"submit",className:"mt-2",disabled:n||!f,children:[n&&e.jsx(S,{className:"h-4 w-4 animate-spin"}),"Aceptar"]})})})]})})})}export{H as default};
