import{j as e,K as v,r as l,L as b}from"./app-CV6a6mm1.js";import{B as k}from"./badge-C4XCHK6e.js";import{c as g,B as a}from"./button-DjbRsOcY.js";import{A as n}from"./arrow-up-down-t4vAdFXg.js";import{T as w}from"./trash-2-CfxTek0G.js";import{D as y}from"./data-table-CDM4PvL8.js";import{u as C}from"./useFlashMessages-DliR_CEE.js";import{A as N}from"./app-layout-BMHD1ZUe.js";import D from"./activate-DHQKZ4mq.js";import A from"./create-CQ8_rwZb.js";import S from"./delete-DzeDQ5Vy.js";import O from"./edit-C20az9vM.js";import"./utils-BR1kMNAO.js";import"./table-4uOR0tQp.js";import"./index-Csf1EbhG.js";import"./index-B4q_2C1R.js";import"./index-C4rkPnUf.js";import"./index-CBVOTD8x.js";import"./index-CxV0Uy5l.js";import"./index-BA9CQx66.js";import"./index-BrYhDW_H.js";import"./chevrons-up-down-B7ova4nW.js";import"./app-logo-icon-BNWCFoeh.js";import"./dialog-CgE3g3ZL.js";import"./loader-circle-CjytvGvM.js";import"./input-error-nj8MuEad.js";import"./input-Dub2Tjo1.js";import"./label-DJ9dd0QB.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],P=g("CircleCheckBig",I);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]],K=g("SquarePen",E),B=t=>[{accessorKey:"id",header:({column:s})=>e.jsxs(a,{variant:"ghost",onClick:()=>s.toggleSorting(s.getIsSorted()==="asc"),children:["ID",e.jsx(n,{className:"ml-2 h-4 w-4"})]}),cell:({row:s})=>s.original.id},{accessorKey:"nombres",header:({column:s})=>e.jsxs(a,{variant:"ghost",onClick:()=>s.toggleSorting(s.getIsSorted()==="asc"),children:["Nombres",e.jsx(n,{className:"ml-2 h-4 w-4"})]})},{accessorKey:"apellidos",header:({column:s})=>e.jsxs(a,{variant:"ghost",onClick:()=>s.toggleSorting(s.getIsSorted()==="asc"),children:["Apellidos",e.jsx(n,{className:"ml-2 h-4 w-4"})]})},{accessorKey:"email",header:"Email"},{accessorKey:"telefono",header:"Teléfono"},{accessorKey:"cargo",header:"Cargo"},{accessorKey:"estado",header:"Estado",cell:({row:s})=>{const r=s.original.estado;return e.jsx(k,{variant:r==="1"?"default":"destructive",children:r==="1"?"Activo":"No Activo"})}},{id:"acciones",header:"Acciones",cell:({row:s})=>{const r=s.original.id,o=s.original.estado;return e.jsxs("div",{className:"flex flex-wrap space-x-2",children:[e.jsxs(a,{"aria-label":"Editar",className:"h-7 bg-yellow-700 p-2 text-xs text-white hover:bg-yellow-900 dark:bg-yellow-600 dark:hover:bg-yellow-800",onClick:()=>t("editar",r),children:[e.jsx(K,{className:"h-3 w-3"})," "]}),o!=="1"&&e.jsxs(a,{"aria-label":"Activar",className:"h-7 bg-green-700 p-2 text-xs text-white hover:bg-green-900 dark:bg-green-600 dark:hover:bg-green-800",onClick:()=>t("activar",r),children:[e.jsx(P,{className:"h-3 w-3"})," "]}),o==="1"&&e.jsxs(a,{"aria-label":"Eliminar",className:"h-7 bg-red-700 p-2 text-xs text-white hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-800",onClick:()=>t("eliminar",r),children:[e.jsx(w,{className:"h-3 w-3"})," "]})]})}}],L=[{title:"Personal",href:"/contrata/personal"}];function de(){const{people:t}=v().props;C();const[s,r]=l.useState(null),[o,c]=l.useState(!1),[h,d]=l.useState(!1),[x,m]=l.useState(!1),f=(i,p)=>{console.log(`Action: ${i}, ID: ${p}`);const u=t.find(j=>j.id===p);r(u||null),i==="editar"?c(!0):i==="eliminar"?d(!0):i==="activar"&&m(!0)};return e.jsxs(N,{breadcrumbs:L,children:[e.jsx(b,{title:"Personal"}),e.jsxs("div",{className:"flex h-full flex-1 flex-col gap-4 rounded-xl p-4",children:[e.jsx(A,{}),e.jsx("div",{className:"w-full max-w-full overflow-x-auto",children:e.jsx(y,{columns:B(f),data:t})})]}),s&&e.jsxs(e.Fragment,{children:[e.jsx(O,{isOpen:o,onOpenChange:c,person:s}),e.jsx(S,{isOpen:h,onOpenChange:d,selectedItem:s}),e.jsx(D,{isOpen:x,onOpenChange:m,selectedItem:s})]})]})}export{de as default};
