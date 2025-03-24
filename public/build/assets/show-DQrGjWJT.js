import{j as a,K as P,L,U as k}from"./app-Cn-5C3ys.js";import{D as x}from"./data-table-DLQtLyZo.js";import{B as I}from"./badge-C90vGRcx.js";import{B as b}from"./button-BfsQPnlH.js";import{m as M,a as O,b as p,f as $,d as f}from"./utils-U4jazdRL.js";import{A as N}from"./arrow-up-down-CYqKookl.js";import{D as R}from"./download-D9euqkS7.js";import{T as y,a as j,b as g,c as V,A as S}from"./app-layout-CfQxCGck.js";import{T as U,a as G,b as E,c as F,D as K}from"./tabs-epAKgfIS.js";import{C as D,a as T,b as A,c as v,d as w}from"./card-CQxccbzX.js";import{I as h}from"./input-Lnzueksd.js";import{L as u}from"./label-BzIOxSAd.js";import B from"./chart-BVvCCdTB.js";import"./table-CyReciiW.js";import"./index-D8D9BEB_.js";import"./index-Brub5Wp-.js";import"./index-DPkw7taS.js";import"./index-D9Yd4Kyp.js";import"./index-DRpHiFIR.js";import"./index-j-wEJqs7.js";import"./index-B6_ETsjh.js";import"./chevrons-up-down-fC_fTfbR.js";import"./app-logo-icon-D4U2Ozxf.js";import"./chart-CvC53SMy.js";import"./index-CE-KOi-L.js";import"./LineChart-DsyUXu54.js";const z=(e,o)=>[{accessorKey:"contractor_company_type_id",header:"T. Cliente",cell:({row:s})=>{const i=e.find(t=>t.id===Number(s.original.contractor_company_type_id));return i?i.name:"Unknown"}},{accessorKey:"uea_id",header:"UEA",cell:({row:s})=>{const i=o.find(t=>t.id===Number(s.original.uea_id));return i?i.name:"Unknown"}},{accessorKey:"month",header:({column:s})=>a.jsxs(b,{variant:"ghost",onClick:()=>s.toggleSorting(s.getIsSorted()==="asc"),children:["Mes",a.jsx(N,{className:"ml-2 h-4 w-4"})]}),cell:({row:s})=>{const i=M.find(t=>Number(t.value)===Number(s.original.month));return i?i.label:"Unknown"}},{accessorKey:"year",header:({column:s})=>a.jsxs(b,{variant:"ghost",onClick:()=>s.toggleSorting(s.getIsSorted()==="asc"),children:["Año",a.jsx(N,{className:"ml-2 h-4 w-4"})]})},{accessorKey:"is_old",header:"Ultima Versión",cell:({row:s})=>a.jsx(I,{variant:s.original.is_old==1?"warning":"success",children:s.original.is_old==1?"No":"Si"})},{accessorKey:"F. Creación",header:"F. Creación",cell:({row:s})=>{const i=new Date(s.original.created_at);return O(i)}},{id:"actions",header:"Acciones",cell:({row:s})=>{const i=s.original,t=H=>{console.log(`Downloading file from: ${window.location.origin}/${H}`)},n=`${window.location.origin}/${i.file}`;return a.jsx("div",{children:a.jsx("a",{href:n,download:!0,onClick:()=>t(i.file),children:a.jsxs(b,{variant:"destructive",size:"sm",className:"ml-2",children:[a.jsx(R,{className:"mr-2 h-4 w-4"}),"Descargar"]})})})}}],l=(e,o)=>a.jsx(y,{children:a.jsxs(j,{children:[a.jsx(g,{children:a.jsx("span",{children:o})}),a.jsx(V,{children:a.jsxs("p",{children:[e,": ",o]})})]})}),_=()=>[{accessorKey:"empl",header:"Empl"},{accessorKey:"obr",header:"Obr"},{accessorKey:"day1",header:"D. 1",cell:e=>l("D. 1",e.getValue())},{accessorKey:"day2",header:"D. 2",cell:e=>l("D. 2",e.getValue())},{accessorKey:"day3",header:"D. 3",cell:e=>l("D. 3",e.getValue())},{accessorKey:"day4",header:"D. 4",cell:e=>l("D. 4",e.getValue())},{accessorKey:"day5",header:"D. 5",cell:e=>l("D. 5",e.getValue())},{accessorKey:"day6",header:"D. 6",cell:e=>l("D. 6",e.getValue())},{accessorKey:"day7",header:"D. 7",cell:e=>l("D. 7",e.getValue())},{accessorKey:"day8",header:"D. 8",cell:e=>l("D. 8",e.getValue())},{accessorKey:"day9",header:"D. 9",cell:e=>l("D. 9",e.getValue())},{accessorKey:"day10",header:"D. 10",cell:e=>l("D. 10",e.getValue())},{accessorKey:"day11",header:"D. 11",cell:e=>l("D. 11",e.getValue())},{accessorKey:"day12",header:"D. 12",cell:e=>l("D. 12",e.getValue())},{accessorKey:"day13",header:"D. 13",cell:e=>l("D. 13",e.getValue())},{accessorKey:"day14",header:"D. 14",cell:e=>l("D. 14",e.getValue())},{accessorKey:"day15",header:"D. 15",cell:e=>l("D. 15",e.getValue())},{accessorKey:"day16",header:"D. 16",cell:e=>l("D. 16",e.getValue())},{accessorKey:"day17",header:"D. 17",cell:e=>l("D. 17",e.getValue())},{accessorKey:"day18",header:"D. 18",cell:e=>l("D. 18",e.getValue())},{accessorKey:"day19",header:"D. 19",cell:e=>l("D. 19",e.getValue())},{accessorKey:"day20",header:"D. 20",cell:e=>l("D. 20",e.getValue())},{accessorKey:"day21",header:"D. 21",cell:e=>l("D. 21",e.getValue())},{accessorKey:"day22",header:"D. 22",cell:e=>l("D. 22",e.getValue())}],d=(e,o)=>a.jsx(y,{children:a.jsxs(j,{children:[a.jsx(g,{children:a.jsx("span",{children:o})}),a.jsx(V,{children:a.jsx("p",{children:e})})]})}),q=()=>[{accessorKey:"situation",header:()=>d("Situación","Situación"),cell:e=>d(e.getValue(),e.getValue())},{accessorKey:"employees",header:()=>d("Empleados","Empleados"),cell:e=>a.jsx("span",{children:e.getValue()}),size:200},{accessorKey:"workers",header:()=>d("Obreros","Obreros"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"incidents",header:()=>d("Incidentes","Incidentes"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"dangerous_incidents",header:()=>d("Incidentes peligrosos","Inc. peligrosos"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"minor_accidents",header:()=>d("Accidentes menores","Acc. menores"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"disability",header:()=>d("Incapacidad","Incapacidad"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"mortality",header:()=>d("Mortal","Mortal"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"lost_days",header:()=>d("Días perdidos","Días perdidos"),cell:e=>a.jsx("span",{children:p(e.getValue())})},{accessorKey:"man_hours_worked",header:()=>d("Horas hombre trabajadas","H.H.T."),cell:e=>a.jsx("span",{children:p(e.getValue())})},{accessorKey:"frequency_index",header:()=>d("Índice de frecuencia","Índ. frecuencia"),cell:e=>a.jsx("span",{children:p(e.getValue())})},{accessorKey:"severity_index",header:()=>d("Índice de severidad","Índ. severidad"),cell:e=>a.jsx("span",{children:p(e.getValue())})},{accessorKey:"accident_rate",header:()=>d("Tasa de accidentes","Tasa de acc."),cell:e=>a.jsx("span",{children:p(e.getValue())})}],r=(e,o)=>a.jsx(y,{children:a.jsxs(j,{children:[a.jsx(g,{children:a.jsx("span",{children:o})}),a.jsx(V,{children:a.jsx("p",{children:e})})]})}),J=()=>[{accessorKey:"accident_type",header:()=>r("Tipo De Accidente (Tabla 10 De Anexo N° 31)","T.A."),cell:e=>r(e.getValue(),e.getValue())},{accessorKey:"injury_nature",header:()=>r("Naturaleza De La Lesión (Tabla 11 De Anexo N° 31)","N.L."),cell:e=>r(e.getValue(),e.getValue())},{accessorKey:"age",header:()=>r("Edad","Edad"),cell:e=>r(e.getValue(),e.getValue())},{accessorKey:"marital_status",header:()=>r("Estado Civil","E.C."),cell:e=>r(e.getValue(),e.getValue())},{accessorKey:"education_level",header:()=>r("Nivel De Educación","N.E."),cell:e=>r(e.getValue(),e.getValue())},{accessorKey:"years_experience",header:()=>r("Años De Experiencia","A.E."),cell:e=>r(e.getValue(),e.getValue())},{accessorKey:"time",header:()=>r("Tiempo","T."),cell:e=>r(e.getValue(),e.getValue())},{accessorKey:"day",header:()=>r("Día","Día"),cell:e=>r(e.getValue(),e.getValue())},{accessorKey:"month_name",header:()=>r("Mes","Mes"),cell:e=>r(e.getValue(),e.getValue())},{accessorKey:"partial_temporary",header:()=>r("Parcial Temporal","P.T."),cell:e=>r(e.getValue(),e.getValue())},{accessorKey:"permanent_temporary",header:()=>r("Permanente Temporal","P.T."),cell:e=>r(e.getValue(),e.getValue())},{accessorKey:"partial_permanent",header:()=>r("Parcial Permanente","P.P."),cell:e=>r(e.getValue(),e.getValue())},{accessorKey:"total_permanent",header:()=>r("Total Permanente","T.P."),cell:e=>r(e.getValue(),e.getValue())},{accessorKey:"disability",header:()=>r("Incapacidad","I."),cell:e=>r(e.getValue(),e.getValue())},{accessorKey:"occupation",header:()=>r("Ocupación","O."),cell:e=>r(e.getValue(),e.getValue())},{accessorKey:"remuneration",header:()=>r("Remuneración","R."),cell:e=>a.jsx("span",{children:e.getValue()})}],c=(e,o)=>a.jsx(y,{children:a.jsxs(j,{children:[a.jsx(g,{children:a.jsx("span",{children:o})}),a.jsx(V,{children:a.jsx("p",{children:e})})]})}),Q=()=>[{accessorKey:"concession_code",header:()=>c("Codigo de la Concesion","Concesión"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"local_male_workers",header:()=>c("Obrero Hombre Trabajador Local","O.H.T.L"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"regional_male_workers",header:()=>c("Obrero Hombre Trabajador Regional","O.H.T.R"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"national_male_workers",header:()=>c("Obrero Hombre Trabajador Nacional","O.H.T.N"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"foreign_male_workers",header:()=>c("Obrero Hombre Trabajador Extranjero","O.H.T.E"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"local_female_workers",header:()=>c("Obrero Mujer Trabajadora Local","O.M.T.L"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"regional_female_workers",header:()=>c("Obrero Mujer Trabajadora Regional","O.M.T.R"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"national_female_workers",header:()=>c("Obrero Mujer Trabajadora Nacional","O.M.T.N"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"foreign_female_workers",header:()=>c("Obrero Mujer Trabajadora Extranjera","O.M.T.E"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"local_male_employees",header:()=>c("Empleado Hombre Trabajador Local","E.H.T.L"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"regional_male_employees",header:()=>c("Empleado Hombre Trabajador Regional","E.H.T.R"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"national_male_employees",header:()=>c("Empleado Hombre Trabajador Nacional","E.H.T.N"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"foreign_male_employees",header:()=>c("Empleado Hombre Trabajador Extranjero","E.H.T.E"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"local_female_employees",header:()=>c("Empleado Mujer Trabajadora Local","E.M.T.L"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"regional_female_employees",header:()=>c("Empleado Mujer Trabajadora Regional","E.M.T.R"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"national_female_employees",header:()=>c("Empleado Mujer Trabajadora Nacional","E.M.T.N"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"foreign_female_employees",header:()=>c("Empleado Mujer Trabajadora Extranjera","E.M.T.E"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"total_employees",header:()=>c("Total de Trabajadores","Trabajadores"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"total_hours_employees",header:()=>c("Total de Horas de Trabajo","Horas de Trabajo"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"mining_activities",header:()=>c("Actividades Mineras","Actividades Mineras"),cell:e=>a.jsx("span",{children:e.getValue()})}],m=(e,o)=>a.jsx(y,{children:a.jsxs(j,{children:[a.jsx(g,{children:a.jsx("span",{children:o})}),a.jsx(V,{children:a.jsx("p",{children:e})})]})}),W=()=>[{accessorKey:"concession_code",header:()=>m("Codigo de la Concesion","Código de la Concesión"),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"male_managers",header:()=>m("Gerentes Hombres","Gerentes H."),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"male_administrative",header:()=>m("Administrativos Hombres","Administrativos H."),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"male_general_operations",header:()=>m("Operaciones Generales Hombres","Operaciones Generales H."),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"male_plant_staff",header:()=>m("Personal de Planta Hombres","Personal de Planta H."),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"female_managers",header:()=>m("Gerentes Mujeres","Gerentes M."),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"female_administrative",header:()=>m("Administrativos Mujeres","Administrativos M."),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"female_plant_staff",header:()=>m("Personal de Planta Mujeres","Personal de Planta M."),cell:e=>a.jsx("span",{children:e.getValue()})},{accessorKey:"female_general_operations",header:()=>m("Operaciones Generales Mujeres","Operaciones Generales M."),cell:e=>a.jsx("span",{children:e.getValue()})}],X=[{title:"Anexos",href:"/annexes"},{title:"Detalle",href:"/annexe/1"}],C=[{value:"anexo24",title:"Anexo 24",description:"Detalles del Anexo 24.",abbreviation:"A24"},{value:"anexo25",title:"Anexo 25",description:"Detalles del Anexo 25.",abbreviation:"A25"},{value:"anexo26",title:"Anexo 26",description:"Detalles del Anexo 26.",abbreviation:"A26"},{value:"anexo27",title:"Anexo 27",description:"Detalles del Anexo 27.",abbreviation:"A27"},{value:"anexo28",title:"Anexo 28",description:"Detalles del Anexo 28.",abbreviation:"A28"},{value:"anexo30",title:"Anexo 30",description:"Detalles del Anexo 30.",abbreviation:"A30"},{value:"minem1",title:"Minem 1",description:"Detalles del Minem 1.",abbreviation:"M1"},{value:"minem2",title:"Minem 2",description:"Detalles del Minem 2.",abbreviation:"M2"}];function Y({data:e}){return a.jsxs(D,{className:"h-full w-full",children:[a.jsxs(T,{children:[a.jsx(A,{children:"Información del Cliente"}),a.jsx(v,{children:"Detalles del cliente."})]}),a.jsx(w,{children:a.jsxs("div",{className:"grid w-full grid-cols-1 items-center gap-4 md:grid-cols-2",children:[a.jsxs("div",{className:"col-span-2 flex flex-col space-y-1.5",children:[a.jsx(u,{children:"UEA:"}),a.jsx(h,{value:e.uea||"N/A",readOnly:!0})]}),a.jsxs("div",{className:"span flex flex-col space-y-1.5",children:[a.jsx(u,{children:"TIPO DE CLIENTE:"}),a.jsx(h,{value:e.contractorCompanyType||"N/A",readOnly:!0})]}),a.jsxs("div",{className:"flex flex-col space-y-1.5",children:[a.jsx(u,{children:"FECHA DE CREACION:"}),a.jsx(h,{value:e.creationDate||"N/A",readOnly:!0})]}),a.jsxs("div",{className:"flex flex-col space-y-1.5",children:[a.jsx(u,{children:"MES:"}),a.jsx(h,{value:e.month||"N/A",readOnly:!0})]}),a.jsxs("div",{className:"flex flex-col space-y-1.5",children:[a.jsx(u,{children:"AÑO:"}),a.jsx(h,{value:e.year||"N/A",readOnly:!0})]})]})})]})}function Ae(){const{fileStatus:e,contractorCompanyTypes:o,ueas:s,fileStatuses:i}=P().props,t={contractorCompanyType:f(o,"id",e.contractor_company_type_id,"name",n=>Number(n))||"N/A",uea:f(s,"id",e.uea_id,"name",n=>Number(n))||"N/A",creationDate:O(e.created_at),month:$(M,"value",e.month,"label")||"N/A",year:e.year||"N/A",status:null};return a.jsxs(S,{breadcrumbs:X,children:[a.jsx(L,{title:"Contratistas"}),a.jsxs("div",{className:"flex h-full flex-1 flex-col gap-4 rounded-xl p-4",children:[a.jsxs("div",{className:"grid grid-cols-12 gap-4",children:[a.jsx("div",{className:"col-span-12 md:col-span-12 lg:col-span-4",children:a.jsx(Y,{data:t})}),a.jsx("div",{className:"col-span-12 md:col-span-12 lg:col-span-8",children:a.jsx(B,{data:e})})]}),a.jsxs(U,{defaultValue:"anexo24",className:"w-full",children:[a.jsx(G,{className:"grid w-full grid-cols-8",children:C.map(n=>a.jsxs(k.Fragment,{children:[a.jsx(E,{value:n.value,className:"sm:hidden",children:n.abbreviation}),a.jsx(E,{value:n.value,className:"hidden sm:block",children:n.title})]},n.value))}),C.map(n=>a.jsx(F,{value:n.value,children:a.jsxs(D,{children:[a.jsxs(T,{children:[a.jsx(A,{children:n.title}),a.jsx(v,{children:n.description})]}),a.jsx(w,{className:"space-y-2",children:(()=>{switch(n.value){case"anexo24":return a.jsx(K,{columns:_(),data:Array.isArray(e.annex24)?e.annex24:[]});case"anexo25":return a.jsx(K,{columns:_(),data:Array.isArray(e.annex25)?e.annex25:[]});case"anexo26":return a.jsx(K,{columns:_(),data:Array.isArray(e.annex26)?e.annex26:[]});case"anexo27":return a.jsx(K,{columns:_(),data:Array.isArray(e.annex27)?e.annex27:[]});case"anexo28":return a.jsx(x,{columns:q(),data:Array.isArray(e.annex28)?e.annex28:[]});case"anexo30":return a.jsx(x,{columns:J(),data:Array.isArray(e.annex30)?e.annex30:[]});case"minem1":return a.jsx(x,{columns:Q(),data:Array.isArray(e.minem_template1)?e.minem_template1:[]});case"minem2":return a.jsx(x,{columns:W(),data:Array.isArray(e.minem_template2)?e.minem_template2:[]});default:return a.jsxs("div",{className:"space-y-1",children:[a.jsx(u,{htmlFor:`${n.value}-name`,children:"Nombre"}),a.jsx(h,{id:`${n.value}-name`})]})}})()})]})},n.value))]}),a.jsx(D,{children:a.jsxs(T,{children:[a.jsx(A,{children:"Historial de Archivos"}),a.jsx(v,{children:"Listado de todos los archivos procesados."})]})}),a.jsx(x,{columns:z(o,s),data:i})]})]})}export{Ae as default};
