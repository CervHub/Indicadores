import{m as c,j as e,L as u}from"./app-CRatwQnn.js";import{I as i}from"./input-error-Mp3PxWJc.js";import{T as x}from"./text-link-CpxLb6vy.js";import{B as h}from"./button-IYTQ6fqB.js";import{I as d}from"./input-B9fa9TCI.js";import{L as m}from"./label-Dkdb8OHP.js";import{A as g}from"./auth-layout-M-Z5-BsT.js";import{L as w}from"./loader-circle-BDfpH8lA.js";import"./utils-Dxu7ruf7.js";import"./index-CGsOreyc.js";import"./index-AI2GBkp9.js";function q(){const{data:r,setData:t,post:n,processing:s,errors:o,reset:l}=c({name:"",email:"",password:"",password_confirmation:""}),p=a=>{a.preventDefault(),n(route("register"),{onFinish:()=>l("password","password_confirmation")})};return e.jsxs(g,{title:"Create an account",description:"Enter your details below to create your account",children:[e.jsx(u,{title:"Register"}),e.jsxs("form",{className:"flex flex-col gap-6",onSubmit:p,children:[e.jsxs("div",{className:"grid gap-6",children:[e.jsxs("div",{className:"grid gap-2",children:[e.jsx(m,{htmlFor:"name",children:"Name"}),e.jsx(d,{id:"name",type:"text",required:!0,autoFocus:!0,tabIndex:1,autoComplete:"name",value:r.name,onChange:a=>t("name",a.target.value),disabled:s,placeholder:"Full name"}),e.jsx(i,{message:o.name,className:"mt-2"})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsx(m,{htmlFor:"email",children:"Email address"}),e.jsx(d,{id:"email",type:"email",required:!0,tabIndex:2,autoComplete:"email",value:r.email,onChange:a=>t("email",a.target.value),disabled:s,placeholder:"email@example.com"}),e.jsx(i,{message:o.email})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsx(m,{htmlFor:"password",children:"Password"}),e.jsx(d,{id:"password",type:"password",required:!0,tabIndex:3,autoComplete:"new-password",value:r.password,onChange:a=>t("password",a.target.value),disabled:s,placeholder:"Password"}),e.jsx(i,{message:o.password})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsx(m,{htmlFor:"password_confirmation",children:"Confirm password"}),e.jsx(d,{id:"password_confirmation",type:"password",required:!0,tabIndex:4,autoComplete:"new-password",value:r.password_confirmation,onChange:a=>t("password_confirmation",a.target.value),disabled:s,placeholder:"Confirm password"}),e.jsx(i,{message:o.password_confirmation})]}),e.jsxs(h,{type:"submit",className:"mt-2 w-full",tabIndex:5,disabled:s,children:[s&&e.jsx(w,{className:"h-4 w-4 animate-spin"}),"Create account"]})]}),e.jsxs("div",{className:"text-muted-foreground text-center text-sm",children:["Already have an account?"," ",e.jsx(x,{href:route("login"),tabIndex:6,children:"Log in"})]})]})]})}export{q as default};
