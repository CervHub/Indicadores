import{m as a,j as e,L as n}from"./app-CRatwQnn.js";import{T as m}from"./text-link-CpxLb6vy.js";import{B as l}from"./button-IYTQ6fqB.js";import{A as c}from"./auth-layout-M-Z5-BsT.js";import{L as d}from"./loader-circle-BDfpH8lA.js";import"./utils-Dxu7ruf7.js";import"./index-CGsOreyc.js";function y({status:i}){const{post:s,processing:t}=a({}),o=r=>{r.preventDefault(),s(route("verification.send"))};return e.jsxs(c,{title:"Verify email",description:"Please verify your email address by clicking on the link we just emailed to you.",children:[e.jsx(n,{title:"Email verification"}),i==="verification-link-sent"&&e.jsx("div",{className:"mb-4 text-center text-sm font-medium text-green-600",children:"A new verification link has been sent to the email address you provided during registration."}),e.jsxs("form",{onSubmit:o,className:"space-y-6 text-center",children:[e.jsxs(l,{disabled:t,variant:"secondary",children:[t&&e.jsx(d,{className:"h-4 w-4 animate-spin"}),"Resend verification email"]}),e.jsx(m,{href:route("logout"),method:"post",className:"mx-auto block text-sm",children:"Log out"})]})]})}export{y as default};
