import{j as e,$ as N,r as x,K as w,L as _}from"./app-CRatwQnn.js";import{B as h}from"./badge-DJ1dailt.js";import{B as c}from"./button-IYTQ6fqB.js";import{T as g,a as u,b as j,c as f,F as T,A as S}from"./app-layout-CzvNsfN9.js";import{m as A,f as M}from"./utils-Dxu7ruf7.js";import{A as b}from"./arrow-up-down-C13J7jx8.js";import{c as R}from"./index-CGsOreyc.js";import{D}from"./download-DhdssBzb.js";import{u as k,T as F,a as P,b as p,c as I,f as v,d as K,e as y,g as U,h as z,i as B,j as $}from"./table-CWTtfAGG.js";import{I as L}from"./input-B9fa9TCI.js";import E from"./create-Bz5Swc2b.js";import H from"./reload-MOcs1Gd5.js";import"./index-wOLGeJc3.js";import"./index-AI2GBkp9.js";import"./index-rrL4l45B.js";import"./index-dmgCRM0O.js";import"./index-C4bzZOVA.js";import"./chevrons-up-down-BBmYUf9N.js";import"./truck-BNucXk_X.js";import"./chevron-right-LmOWfo-t.js";import"./input-error-Mp3PxWJc.js";import"./dialog-xGS_-RRy.js";import"./label-Dkdb8OHP.js";import"./select-Bm6wB5_B.js";import"./check-C2Lxxfoh.js";import"./download-B4MtV5vf.js";import"./chevron-left-DeKCXq90.js";import"./loader-circle-BDfpH8lA.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]],G=R("ArrowUp",V),C=o=>o===0?"destructive":o===100?"default":"secondary",O=(o,d,m)=>[{accessorKey:"contractor_company_type_id",header:"T. Cliente",cell:({row:n})=>{const t=o.find(r=>r.id===Number(n.original.contractor_company_type_id));return t?t.name:"Unknown"}},{accessorKey:"uea_id",header:"UEA",cell:({row:n})=>{const t=d.find(r=>r.id===Number(n.original.uea_id));return t?t.name:"Unknown"}},{accessorKey:"month",header:({column:n})=>e.jsxs(c,{variant:"ghost",onClick:()=>n.toggleSorting(n.getIsSorted()==="asc"),children:["Mes",e.jsx(b,{className:"ml-2 h-4 w-4"})]}),cell:({row:n})=>{const t=A.find(r=>Number(r.value)===Number(n.original.month));return t?t.label:"Unknown"}},{accessorKey:"year",header:({column:n})=>e.jsxs(c,{variant:"ghost",onClick:()=>n.toggleSorting(n.getIsSorted()==="asc"),children:["Year",e.jsx(b,{className:"ml-2 h-4 w-4"})]})},{accessorKey:"annexes",header:"Anexos",cell:({row:n})=>{const t=[n.original.annex24,n.original.annex25,n.original.annex26,n.original.annex27,n.original.annex28],a=(t.filter(s=>s==="true"||s==="1").length/t.length*100).toFixed(0),i=C(Number(a));return e.jsx(g,{children:e.jsxs(u,{children:[e.jsx(j,{children:e.jsx(h,{variant:i,children:`${a}%`})}),e.jsxs(f,{children:[e.jsxs("p",{children:["Anexo 24: ",n.original.annex24]}),e.jsxs("p",{children:["Anexo 25: ",n.original.annex25]}),e.jsxs("p",{children:["Anexo 26: ",n.original.annex26]}),e.jsxs("p",{children:["Anexo 27: ",n.original.annex27]}),e.jsxs("p",{children:["Anexo 28: ",n.original.annex28]}),e.jsxs("p",{children:["Anexo 30: ",n.original.annex30]})]})]})})}},{accessorKey:"minem_templates",header:"Minems",cell:({row:n})=>{const t=[n.original.minem_template_1,n.original.minem_template_2],a=(t.filter(s=>s==="true"||s==="1").length/t.length*100).toFixed(0),i=C(Number(a));return e.jsx(g,{children:e.jsxs(u,{children:[e.jsx(j,{children:e.jsx(h,{variant:i,children:`${a}%`})}),e.jsxs(f,{children:[e.jsxs("p",{children:["Plantilla Minem 1: ",n.original.minem_template_1]}),e.jsxs("p",{children:["Plantilla Minem 2: ",n.original.minem_template_2]})]})]})})}},{accessorKey:"F. Creación",header:"F. Creación",cell:({row:n})=>{const t=new Date(n.original.created_at);return M(t)}},{id:"actions",header:"Acciones",cell:({row:n})=>{const t=n.original,r=i=>{},a=`${window.location.origin}/${t.file}`;return e.jsxs("div",{className:"flex flex-row gap-2 space-y-2",children:[e.jsxs(c,{variant:"secondary",size:"sm",onClick:()=>m(t),children:[e.jsx(G,{className:"h-4 w-4"})," ","Actualizar"]}),e.jsx(N,{href:route("annexes.show",{annex:t.id}),children:e.jsxs(c,{variant:"default",size:"sm",children:[e.jsx(T,{className:"h-4 w-4"}),"Detalle"]})}),e.jsx("a",{href:a,download:!0,onClick:()=>r(t.file),children:e.jsxs(c,{variant:"destructive",size:"sm",children:[e.jsx(D,{className:"h-4 w-4"}),"Descargar"]})})]})}}];function q({columns:o,data:d}){var i;const[m,n]=x.useState([]),[t,r]=x.useState(""),a=k({data:d,columns:o,getCoreRowModel:$(),getPaginationRowModel:B(),onSortingChange:n,getSortedRowModel:z(),onGlobalFilterChange:r,getFilteredRowModel:U(),state:{sorting:m,globalFilter:t}});return e.jsxs("div",{children:[e.jsx("div",{className:"flex items-center py-4",children:e.jsx(L,{placeholder:"Filter by any column...",value:t,onChange:s=>r(s.target.value),className:"max-w-sm"})}),e.jsx("div",{className:"grid grid-cols-1 rounded-md border",children:e.jsxs(F,{className:"text-xs",children:[e.jsx(P,{children:a.getHeaderGroups().map(s=>e.jsx(p,{children:s.headers.map(l=>e.jsx(I,{children:l.isPlaceholder?null:v(l.column.columnDef.header,l.getContext())},l.id))},s.id))}),e.jsx(K,{children:(i=a.getRowModel().rows)!=null&&i.length?a.getRowModel().rows.map(s=>e.jsx(p,{"data-state":s.getIsSelected()&&"selected",children:s.getVisibleCells().map(l=>e.jsx(y,{children:v(l.column.columnDef.cell,l.getContext())},l.id))},s.id)):e.jsx(p,{children:e.jsx(y,{colSpan:o.length,className:"h-24 text-center",children:"No results."})})})]})}),e.jsxs("div",{className:"flex items-center justify-end space-x-2 py-4",children:[e.jsx(c,{variant:"outline",size:"sm",onClick:()=>a.previousPage(),disabled:!a.getCanPreviousPage(),children:"Previous"}),e.jsx(c,{variant:"outline",size:"sm",onClick:()=>a.nextPage(),disabled:!a.getCanNextPage(),children:"Next"})]})]})}const Y=[{title:"Indicadores",href:"/annexe"}];function Ne(){const{fileStatuses:o,contractorCompanyTypes:d,ueas:m,rules:n}=w().props,[t,r]=x.useState(null),[a,i]=x.useState(!1),s=l=>{r(l),i(!0)};return e.jsxs(S,{breadcrumbs:Y,children:[e.jsx(_,{title:"Contratistas"}),e.jsxs("div",{className:"flex h-full flex-1 flex-col gap-4 rounded-xl p-4",children:[e.jsx(E,{rules:n}),e.jsx("div",{className:"w-full max-w-full overflow-x-auto",children:e.jsx(q,{columns:O(d,m,s),data:o})})]}),t&&e.jsx(H,{rules:n,selectedItem:t,isDialogOpen:a,setIsDialogOpen:i})]})}export{Ne as default};
