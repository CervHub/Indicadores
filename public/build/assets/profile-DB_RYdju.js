import{r as v,m as j,j as e,K as y,L as N,$ as b}from"./app-Ds4ZkRno.js";import{I as p}from"./input-error-BcoPDrXT.js";import{B as d}from"./button-ea-hcMko.js";import{I as h}from"./input-DWzbFbrx.js";import{L as x}from"./label-sZ38Iebd.js";import{H as g,S as w}from"./layout-C0mDUBw2.js";import{D,a as C,b as k,d as S,e as P,f as E,g as F}from"./dialog-l-bMBve4.js";import{A as L}from"./app-layout-ABtHJ7cF.js";import{z as I}from"./transition-Bodr2WqT.js";import"./utils-2YzkRP5P.js";import"./index-B9JGh-vd.js";import"./index-D6vIr2wZ.js";import"./index-CnDPcsdQ.js";import"./app-logo-icon-DaYa7nRA.js";function A(){const a=v.useRef(null),{data:c,setData:r,delete:t,processing:o,reset:i,errors:l,clearErrors:m}=j({password:""}),u=s=>{s.preventDefault(),t(route("profile.destroy"),{preserveScroll:!0,onSuccess:()=>n(),onError:()=>{var f;return(f=a.current)==null?void 0:f.focus()},onFinish:()=>i()})},n=()=>{m(),i()};return e.jsxs("div",{className:"space-y-6",children:[e.jsx(g,{title:"Delete account",description:"Delete your account and all of its resources"}),e.jsxs("div",{className:"space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10",children:[e.jsxs("div",{className:"relative space-y-0.5 text-red-600 dark:text-red-100",children:[e.jsx("p",{className:"font-medium",children:"Warning"}),e.jsx("p",{className:"text-sm",children:"Please proceed with caution, this cannot be undone."})]}),e.jsxs(D,{children:[e.jsx(C,{asChild:!0,children:e.jsx(d,{variant:"destructive",children:"Delete account"})}),e.jsxs(k,{children:[e.jsx(S,{children:"Are you sure you want to delete your account?"}),e.jsx(P,{children:"Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you would like to permanently delete your account."}),e.jsxs("form",{className:"space-y-6",onSubmit:u,children:[e.jsxs("div",{className:"grid gap-2",children:[e.jsx(x,{htmlFor:"password",className:"sr-only",children:"Password"}),e.jsx(h,{id:"password",type:"password",name:"password",ref:a,value:c.password,onChange:s=>r("password",s.target.value),placeholder:"Password",autoComplete:"current-password"}),e.jsx(p,{message:l.password})]}),e.jsxs(E,{className:"gap-2",children:[e.jsx(F,{asChild:!0,children:e.jsx(d,{variant:"secondary",onClick:n,children:"Cancel"})}),e.jsx(d,{variant:"destructive",disabled:o,asChild:!0,children:e.jsx("button",{type:"submit",children:"Delete account"})})]})]})]})]})]})]})}const T=[{title:"Profile settings",href:"/settings/profile"}];function J({mustVerifyEmail:a,status:c}){const{auth:r}=y().props,{data:t,setData:o,patch:i,errors:l,processing:m,recentlySuccessful:u}=j({name:r.user.name,email:r.user.email}),n=s=>{s.preventDefault(),i(route("profile.update"),{preserveScroll:!0})};return e.jsxs(L,{breadcrumbs:T,children:[e.jsx(N,{title:"Profile settings"}),e.jsxs(w,{children:[e.jsxs("div",{className:"space-y-6",children:[e.jsx(g,{title:"Profile information",description:"Update your name and email address"}),e.jsxs("form",{onSubmit:n,className:"space-y-6",children:[e.jsxs("div",{className:"grid gap-2",children:[e.jsx(x,{htmlFor:"name",children:"Name"}),e.jsx(h,{id:"name",className:"mt-1 block w-full",value:t.name,onChange:s=>o("name",s.target.value),required:!0,autoComplete:"name",placeholder:"Full name"}),e.jsx(p,{className:"mt-2",message:l.name})]}),e.jsxs("div",{className:"grid gap-2",children:[e.jsx(x,{htmlFor:"email",children:"Email address"}),e.jsx(h,{id:"email",type:"email",className:"mt-1 block w-full",value:t.email,onChange:s=>o("email",s.target.value),required:!0,autoComplete:"username",placeholder:"Email address"}),e.jsx(p,{className:"mt-2",message:l.email})]}),a&&r.user.email_verified_at===null&&e.jsxs("div",{children:[e.jsxs("p",{className:"text-muted-foreground -mt-4 text-sm",children:["Your email address is unverified."," ",e.jsx(b,{href:route("verification.send"),method:"post",as:"button",className:"text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500",children:"Click here to resend the verification email."})]}),c==="verification-link-sent"&&e.jsx("div",{className:"mt-2 text-sm font-medium text-green-600",children:"A new verification link has been sent to your email address."})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(d,{disabled:m,children:"Save"}),e.jsx(I,{show:u,enter:"transition ease-in-out",enterFrom:"opacity-0",leave:"transition ease-in-out",leaveTo:"opacity-0",children:e.jsx("p",{className:"text-sm text-neutral-600",children:"Saved"})})]})]})]}),e.jsx(A,{})]})]})}export{J as default};
