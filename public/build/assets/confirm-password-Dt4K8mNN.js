import{m as n,j as s,L as d}from"./app-lwyxAAc0.js";import{I as l}from"./input-error-CUMyERF4.js";import{B as c}from"./button-DgKsjods.js";import{I as u}from"./input-Bpn1m0Sn.js";import{L as f}from"./label-DYvEWREL.js";import{A as w}from"./auth-layout-C0_MLGUH.js";import{L as h}from"./loader-circle-CwH8NjIm.js";import"./utils-Dxu7ruf7.js";import"./index-wbLpGGuJ.js";function I(){const{data:a,setData:e,post:t,processing:o,errors:i,reset:p}=n({password:""}),m=r=>{r.preventDefault(),t(route("password.confirm"),{onFinish:()=>p("password")})};return s.jsxs(w,{title:"Confirm your password",description:"This is a secure area of the application. Please confirm your password before continuing.",children:[s.jsx(d,{title:"Confirm password"}),s.jsx("form",{onSubmit:m,children:s.jsxs("div",{className:"space-y-6",children:[s.jsxs("div",{className:"grid gap-2",children:[s.jsx(f,{htmlFor:"password",children:"Password"}),s.jsx(u,{id:"password",type:"password",name:"password",placeholder:"Password",autoComplete:"current-password",value:a.password,autoFocus:!0,onChange:r=>e("password",r.target.value)}),s.jsx(l,{message:i.password})]}),s.jsx("div",{className:"flex items-center",children:s.jsxs(c,{className:"w-full",disabled:o,children:[o&&s.jsx(h,{className:"h-4 w-4 animate-spin"}),"Confirm password"]})})]})})]})}export{I as default};
