import{U as a}from"./app-C4NoR-vI.js";import{$ as Vt}from"./index-B1LNil2j.js";function Ut(r){if(typeof document>"u")return;let o=document.head||document.getElementsByTagName("head")[0],e=document.createElement("style");e.type="text/css",o.appendChild(e),e.styleSheet?e.styleSheet.cssText=r:e.appendChild(document.createTextNode(r))}const Xt=r=>{switch(r){case"success":return qt;case"info":return Qt;case"warning":return Gt;case"error":return Jt;default:return null}},Wt=Array(12).fill(0),Kt=({visible:r,className:o})=>a.createElement("div",{className:["sonner-loading-wrapper",o].filter(Boolean).join(" "),"data-visible":r},a.createElement("div",{className:"sonner-spinner"},Wt.map((e,s)=>a.createElement("div",{className:"sonner-loading-bar",key:`spinner-bar-${s}`})))),qt=a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},a.createElement("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",clipRule:"evenodd"})),Gt=a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",height:"20",width:"20"},a.createElement("path",{fillRule:"evenodd",d:"M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",clipRule:"evenodd"})),Qt=a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},a.createElement("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",clipRule:"evenodd"})),Jt=a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor",height:"20",width:"20"},a.createElement("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",clipRule:"evenodd"})),Zt=a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"},a.createElement("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),a.createElement("line",{x1:"6",y1:"6",x2:"18",y2:"18"})),te=()=>{const[r,o]=a.useState(document.hidden);return a.useEffect(()=>{const e=()=>{o(document.hidden)};return document.addEventListener("visibilitychange",e),()=>window.removeEventListener("visibilitychange",e)},[]),r};let yt=1;class ee{constructor(){this.subscribe=o=>(this.subscribers.push(o),()=>{const e=this.subscribers.indexOf(o);this.subscribers.splice(e,1)}),this.publish=o=>{this.subscribers.forEach(e=>e(o))},this.addToast=o=>{this.publish(o),this.toasts=[...this.toasts,o]},this.create=o=>{var e;const{message:s,...B}=o,c=typeof(o==null?void 0:o.id)=="number"||((e=o.id)==null?void 0:e.length)>0?o.id:yt++,h=this.toasts.find(b=>b.id===c),T=o.dismissible===void 0?!0:o.dismissible;return this.dismissedToasts.has(c)&&this.dismissedToasts.delete(c),h?this.toasts=this.toasts.map(b=>b.id===c?(this.publish({...b,...o,id:c,title:s}),{...b,...o,id:c,dismissible:T,title:s}):b):this.addToast({title:s,...B,dismissible:T,id:c}),c},this.dismiss=o=>(this.dismissedToasts.add(o),o||this.toasts.forEach(e=>{this.subscribers.forEach(s=>s({id:e.id,dismiss:!0}))}),requestAnimationFrame(()=>this.subscribers.forEach(e=>e({id:o,dismiss:!0}))),o),this.message=(o,e)=>this.create({...e,message:o}),this.error=(o,e)=>this.create({...e,message:o,type:"error"}),this.success=(o,e)=>this.create({...e,type:"success",message:o}),this.info=(o,e)=>this.create({...e,type:"info",message:o}),this.warning=(o,e)=>this.create({...e,type:"warning",message:o}),this.loading=(o,e)=>this.create({...e,type:"loading",message:o}),this.promise=(o,e)=>{if(!e)return;let s;e.loading!==void 0&&(s=this.create({...e,promise:o,type:"loading",message:e.loading,description:typeof e.description!="function"?e.description:void 0}));const B=Promise.resolve(o instanceof Function?o():o);let c=s!==void 0,h;const T=B.then(async i=>{if(h=["resolve",i],a.isValidElement(i))c=!1,this.create({id:s,type:"default",message:i});else if(oe(i)&&!i.ok){c=!1;const t=typeof e.error=="function"?await e.error(`HTTP error! status: ${i.status}`):e.error,D=typeof e.description=="function"?await e.description(`HTTP error! status: ${i.status}`):e.description,C=typeof t=="object"?t:{message:t};this.create({id:s,type:"error",description:D,...C})}else if(i instanceof Error){c=!1;const t=typeof e.error=="function"?await e.error(i):e.error,D=typeof e.description=="function"?await e.description(i):e.description,C=typeof t=="object"?t:{message:t};this.create({id:s,type:"error",description:D,...C})}else if(e.success!==void 0){c=!1;const t=typeof e.success=="function"?await e.success(i):e.success,D=typeof e.description=="function"?await e.description(i):e.description,C=typeof t=="object"?t:{message:t};this.create({id:s,type:"success",description:D,...C})}}).catch(async i=>{if(h=["reject",i],e.error!==void 0){c=!1;const x=typeof e.error=="function"?await e.error(i):e.error,t=typeof e.description=="function"?await e.description(i):e.description,D=typeof x=="object"?x:{message:x};this.create({id:s,type:"error",description:t,...D})}}).finally(()=>{c&&(this.dismiss(s),s=void 0),e.finally==null||e.finally.call(e)}),b=()=>new Promise((i,x)=>T.then(()=>h[0]==="reject"?x(h[1]):i(h[1])).catch(x));return typeof s!="string"&&typeof s!="number"?{unwrap:b}:Object.assign(s,{unwrap:b})},this.custom=(o,e)=>{const s=(e==null?void 0:e.id)||yt++;return this.create({jsx:o(s),id:s,...e}),s},this.getActiveToasts=()=>this.toasts.filter(o=>!this.dismissedToasts.has(o.id)),this.subscribers=[],this.toasts=[],this.dismissedToasts=new Set}}const w=new ee,ae=(r,o)=>{const e=(o==null?void 0:o.id)||yt++;return w.addToast({title:r,...o,id:e}),e},oe=r=>r&&typeof r=="object"&&"ok"in r&&typeof r.ok=="boolean"&&"status"in r&&typeof r.status=="number",se=ae,ne=()=>w.toasts,re=()=>w.getActiveToasts(),we=Object.assign(se,{success:w.success,info:w.info,warning:w.warning,error:w.error,custom:w.custom,message:w.message,promise:w.promise,dismiss:w.dismiss,loading:w.loading},{getHistory:ne,getToasts:re});Ut("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}[data-sonner-toaster][data-lifted=true]{transform:translateY(-8px)}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");function ut(r){return r.label!==void 0}const ie=3,le="24px",de="16px",Mt=4e3,ce=356,ue=14,fe=45,me=200;function H(...r){return r.filter(Boolean).join(" ")}function pe(r){const[o,e]=r.split("-"),s=[];return o&&s.push(o),e&&s.push(e),s}const ge=r=>{var o,e,s,B,c,h,T,b,i;const{invert:x,toast:t,unstyled:D,interacting:C,setHeights:O,visibleToasts:ft,heights:u,index:z,toasts:st,expanded:Q,removeToast:nt,defaultRichColors:S,closeButton:U,style:mt,cancelButtonStyle:rt,actionButtonStyle:pt,className:it="",descriptionClassName:P="",duration:X,position:J,gap:gt,expandByDefault:A,classNames:l,icons:L,closeButtonAriaLabel:j="Close toast"}=r,[M,Z]=a.useState(null),[d,m]=a.useState(null),[f,N]=a.useState(!1),[F,p]=a.useState(!1),[tt,W]=a.useState(!1),[et,at]=a.useState(!1),[Rt,wt]=a.useState(!1),[Ct,ht]=a.useState(0),[At,xt]=a.useState(0),ot=a.useRef(t.duration||X||Mt),Et=a.useRef(null),Y=a.useRef(null),Ht=z===0,Ot=z+1<=ft,k=t.type,K=t.dismissible!==!1,zt=t.className||"",Pt=t.descriptionClassName||"",lt=a.useMemo(()=>u.findIndex(n=>n.toastId===t.id)||0,[u,t.id]),Lt=a.useMemo(()=>{var n;return(n=t.closeButton)!=null?n:U},[t.closeButton,U]),Tt=a.useMemo(()=>t.duration||X||Mt,[t.duration,X]),bt=a.useRef(0),q=a.useRef(0),St=a.useRef(0),G=a.useRef(null),[jt,Yt]=J.split("-"),Nt=a.useMemo(()=>u.reduce((n,g,y)=>y>=lt?n:n+g.height,0),[u,lt]),kt=te(),$t=t.invert||x,vt=k==="loading";q.current=a.useMemo(()=>lt*gt+Nt,[lt,Nt]),a.useEffect(()=>{ot.current=Tt},[Tt]),a.useEffect(()=>{N(!0)},[]),a.useEffect(()=>{const n=Y.current;if(n){const g=n.getBoundingClientRect().height;return xt(g),O(y=>[{toastId:t.id,height:g,position:t.position},...y]),()=>O(y=>y.filter(E=>E.toastId!==t.id))}},[O,t.id]),a.useLayoutEffect(()=>{if(!f)return;const n=Y.current,g=n.style.height;n.style.height="auto";const y=n.getBoundingClientRect().height;n.style.height=g,xt(y),O(E=>E.find(v=>v.toastId===t.id)?E.map(v=>v.toastId===t.id?{...v,height:y}:v):[{toastId:t.id,height:y,position:t.position},...E])},[f,t.title,t.description,O,t.id]);const $=a.useCallback(()=>{p(!0),ht(q.current),O(n=>n.filter(g=>g.toastId!==t.id)),setTimeout(()=>{nt(t)},me)},[t,nt,O,q]);a.useEffect(()=>{if(t.promise&&k==="loading"||t.duration===1/0||t.type==="loading")return;let n;return Q||C||kt?(()=>{if(St.current<bt.current){const E=new Date().getTime()-bt.current;ot.current=ot.current-E}St.current=new Date().getTime()})():(()=>{ot.current!==1/0&&(bt.current=new Date().getTime(),n=setTimeout(()=>{t.onAutoClose==null||t.onAutoClose.call(t,t),$()},ot.current))})(),()=>clearTimeout(n)},[Q,C,t,k,kt,$]),a.useEffect(()=>{t.delete&&$()},[$,t.delete]);function Ft(){var n;if(L!=null&&L.loading){var g;return a.createElement("div",{className:H(l==null?void 0:l.loader,t==null||(g=t.classNames)==null?void 0:g.loader,"sonner-loader"),"data-visible":k==="loading"},L.loading)}return a.createElement(Kt,{className:H(l==null?void 0:l.loader,t==null||(n=t.classNames)==null?void 0:n.loader),visible:k==="loading"})}var _t,Bt;return a.createElement("li",{tabIndex:0,ref:Y,className:H(it,zt,l==null?void 0:l.toast,t==null||(o=t.classNames)==null?void 0:o.toast,l==null?void 0:l.default,l==null?void 0:l[k],t==null||(e=t.classNames)==null?void 0:e[k]),"data-sonner-toast":"","data-rich-colors":(_t=t.richColors)!=null?_t:S,"data-styled":!(t.jsx||t.unstyled||D),"data-mounted":f,"data-promise":!!t.promise,"data-swiped":Rt,"data-removed":F,"data-visible":Ot,"data-y-position":jt,"data-x-position":Yt,"data-index":z,"data-front":Ht,"data-swiping":tt,"data-dismissible":K,"data-type":k,"data-invert":$t,"data-swipe-out":et,"data-swipe-direction":d,"data-expanded":!!(Q||A&&f),style:{"--index":z,"--toasts-before":z,"--z-index":st.length-z,"--offset":`${F?Ct:q.current}px`,"--initial-height":A?"auto":`${At}px`,...mt,...t.style},onDragEnd:()=>{W(!1),Z(null),G.current=null},onPointerDown:n=>{vt||!K||(Et.current=new Date,ht(q.current),n.target.setPointerCapture(n.pointerId),n.target.tagName!=="BUTTON"&&(W(!0),G.current={x:n.clientX,y:n.clientY}))},onPointerUp:()=>{var n,g,y;if(et||!K)return;G.current=null;const E=Number(((n=Y.current)==null?void 0:n.style.getPropertyValue("--swipe-amount-x").replace("px",""))||0),dt=Number(((g=Y.current)==null?void 0:g.style.getPropertyValue("--swipe-amount-y").replace("px",""))||0),v=new Date().getTime()-((y=Et.current)==null?void 0:y.getTime()),_=M==="x"?E:dt,ct=Math.abs(_)/v;if(Math.abs(_)>=fe||ct>.11){ht(q.current),t.onDismiss==null||t.onDismiss.call(t,t),m(M==="x"?E>0?"right":"left":dt>0?"down":"up"),$(),at(!0);return}else{var I,R;(I=Y.current)==null||I.style.setProperty("--swipe-amount-x","0px"),(R=Y.current)==null||R.style.setProperty("--swipe-amount-y","0px")}wt(!1),W(!1),Z(null)},onPointerMove:n=>{var g,y,E;if(!G.current||!K||((g=window.getSelection())==null?void 0:g.toString().length)>0)return;const v=n.clientY-G.current.y,_=n.clientX-G.current.x;var ct;const I=(ct=r.swipeDirections)!=null?ct:pe(J);!M&&(Math.abs(_)>1||Math.abs(v)>1)&&Z(Math.abs(_)>Math.abs(v)?"x":"y");let R={x:0,y:0};const Dt=V=>1/(1.5+Math.abs(V)/20);if(M==="y"){if(I.includes("top")||I.includes("bottom"))if(I.includes("top")&&v<0||I.includes("bottom")&&v>0)R.y=v;else{const V=v*Dt(v);R.y=Math.abs(V)<Math.abs(v)?V:v}}else if(M==="x"&&(I.includes("left")||I.includes("right")))if(I.includes("left")&&_<0||I.includes("right")&&_>0)R.x=_;else{const V=_*Dt(_);R.x=Math.abs(V)<Math.abs(_)?V:_}(Math.abs(R.x)>0||Math.abs(R.y)>0)&&wt(!0),(y=Y.current)==null||y.style.setProperty("--swipe-amount-x",`${R.x}px`),(E=Y.current)==null||E.style.setProperty("--swipe-amount-y",`${R.y}px`)}},Lt&&!t.jsx&&k!=="loading"?a.createElement("button",{"aria-label":j,"data-disabled":vt,"data-close-button":!0,onClick:vt||!K?()=>{}:()=>{$(),t.onDismiss==null||t.onDismiss.call(t,t)},className:H(l==null?void 0:l.closeButton,t==null||(s=t.classNames)==null?void 0:s.closeButton)},(Bt=L==null?void 0:L.close)!=null?Bt:Zt):null,k||t.icon||t.promise?a.createElement("div",{"data-icon":"",className:H(l==null?void 0:l.icon,t==null||(B=t.classNames)==null?void 0:B.icon)},t.promise||t.type==="loading"&&!t.icon?t.icon||Ft():null,t.type!=="loading"?t.icon||(L==null?void 0:L[k])||Xt(k):null):null,a.createElement("div",{"data-content":"",className:H(l==null?void 0:l.content,t==null||(c=t.classNames)==null?void 0:c.content)},a.createElement("div",{"data-title":"",className:H(l==null?void 0:l.title,t==null||(h=t.classNames)==null?void 0:h.title)},t.jsx?t.jsx:typeof t.title=="function"?t.title():t.title),t.description?a.createElement("div",{"data-description":"",className:H(P,Pt,l==null?void 0:l.description,t==null||(T=t.classNames)==null?void 0:T.description)},typeof t.description=="function"?t.description():t.description):null),a.isValidElement(t.cancel)?t.cancel:t.cancel&&ut(t.cancel)?a.createElement("button",{"data-button":!0,"data-cancel":!0,style:t.cancelButtonStyle||rt,onClick:n=>{ut(t.cancel)&&K&&(t.cancel.onClick==null||t.cancel.onClick.call(t.cancel,n),$())},className:H(l==null?void 0:l.cancelButton,t==null||(b=t.classNames)==null?void 0:b.cancelButton)},t.cancel.label):null,a.isValidElement(t.action)?t.action:t.action&&ut(t.action)?a.createElement("button",{"data-button":!0,"data-action":!0,style:t.actionButtonStyle||pt,onClick:n=>{ut(t.action)&&(t.action.onClick==null||t.action.onClick.call(t.action,n),!n.defaultPrevented&&$())},className:H(l==null?void 0:l.actionButton,t==null||(i=t.classNames)==null?void 0:i.actionButton)},t.action.label):null)};function It(){if(typeof window>"u"||typeof document>"u")return"ltr";const r=document.documentElement.getAttribute("dir");return r==="auto"||!r?window.getComputedStyle(document.documentElement).direction:r}function he(r,o){const e={};return[r,o].forEach((s,B)=>{const c=B===1,h=c?"--mobile-offset":"--offset",T=c?de:le;function b(i){["top","right","bottom","left"].forEach(x=>{e[`${h}-${x}`]=typeof i=="number"?`${i}px`:i})}typeof s=="number"||typeof s=="string"?b(s):typeof s=="object"?["top","right","bottom","left"].forEach(i=>{s[i]===void 0?e[`${h}-${i}`]=T:e[`${h}-${i}`]=typeof s[i]=="number"?`${s[i]}px`:s[i]}):b(T)}),e}const xe=a.forwardRef(function(o,e){const{invert:s,position:B="bottom-right",hotkey:c=["altKey","KeyT"],expand:h,closeButton:T,className:b,offset:i,mobileOffset:x,theme:t="light",richColors:D,duration:C,style:O,visibleToasts:ft=ie,toastOptions:u,dir:z=It(),gap:st=ue,icons:Q,containerAriaLabel:nt="Notifications"}=o,[S,U]=a.useState([]),mt=a.useMemo(()=>Array.from(new Set([B].concat(S.filter(d=>d.position).map(d=>d.position)))),[S,B]),[rt,pt]=a.useState([]),[it,P]=a.useState(!1),[X,J]=a.useState(!1),[gt,A]=a.useState(t!=="system"?t:typeof window<"u"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),l=a.useRef(null),L=c.join("+").replace(/Key/g,"").replace(/Digit/g,""),j=a.useRef(null),M=a.useRef(!1),Z=a.useCallback(d=>{U(m=>{var f;return(f=m.find(N=>N.id===d.id))!=null&&f.delete||w.dismiss(d.id),m.filter(({id:N})=>N!==d.id)})},[]);return a.useEffect(()=>w.subscribe(d=>{if(d.dismiss){const m=S.map(f=>f.id===d.id?{...f,delete:!0}:f);requestAnimationFrame(()=>{U(m)});return}setTimeout(()=>{Vt.flushSync(()=>{U(m=>{const f=m.findIndex(N=>N.id===d.id);return f!==-1?[...m.slice(0,f),{...m[f],...d},...m.slice(f+1)]:[d,...m]})})})}),[S]),a.useEffect(()=>{if(t!=="system"){A(t);return}if(t==="system"&&(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?A("dark"):A("light")),typeof window>"u")return;const d=window.matchMedia("(prefers-color-scheme: dark)");try{d.addEventListener("change",({matches:m})=>{A(m?"dark":"light")})}catch{d.addListener(({matches:f})=>{try{A(f?"dark":"light")}catch(N){console.error(N)}})}},[t]),a.useEffect(()=>{S.length<=1&&P(!1)},[S]),a.useEffect(()=>{const d=m=>{var f;if(c.every(p=>m[p]||m.code===p)){var F;P(!0),(F=l.current)==null||F.focus()}m.code==="Escape"&&(document.activeElement===l.current||(f=l.current)!=null&&f.contains(document.activeElement))&&P(!1)};return document.addEventListener("keydown",d),()=>document.removeEventListener("keydown",d)},[c]),a.useEffect(()=>{if(l.current)return()=>{j.current&&(j.current.focus({preventScroll:!0}),j.current=null,M.current=!1)}},[l.current]),a.createElement("section",{ref:e,"aria-label":`${nt} ${L}`,tabIndex:-1,"aria-live":"polite","aria-relevant":"additions text","aria-atomic":"false",suppressHydrationWarning:!0},mt.map((d,m)=>{var f;const[N,F]=d.split("-");return S.length?a.createElement("ol",{key:d,dir:z==="auto"?It():z,tabIndex:-1,ref:l,className:b,"data-sonner-toaster":!0,"data-sonner-theme":gt,"data-y-position":N,"data-lifted":it&&S.length>1&&!h,"data-x-position":F,style:{"--front-toast-height":`${((f=rt[0])==null?void 0:f.height)||0}px`,"--width":`${ce}px`,"--gap":`${st}px`,...O,...he(i,x)},onBlur:p=>{M.current&&!p.currentTarget.contains(p.relatedTarget)&&(M.current=!1,j.current&&(j.current.focus({preventScroll:!0}),j.current=null))},onFocus:p=>{p.target instanceof HTMLElement&&p.target.dataset.dismissible==="false"||M.current||(M.current=!0,j.current=p.relatedTarget)},onMouseEnter:()=>P(!0),onMouseMove:()=>P(!0),onMouseLeave:()=>{X||P(!1)},onDragEnd:()=>P(!1),onPointerDown:p=>{p.target instanceof HTMLElement&&p.target.dataset.dismissible==="false"||J(!0)},onPointerUp:()=>J(!1)},S.filter(p=>!p.position&&m===0||p.position===d).map((p,tt)=>{var W,et;return a.createElement(ge,{key:p.id,icons:Q,index:tt,toast:p,defaultRichColors:D,duration:(W=u==null?void 0:u.duration)!=null?W:C,className:u==null?void 0:u.className,descriptionClassName:u==null?void 0:u.descriptionClassName,invert:s,visibleToasts:ft,closeButton:(et=u==null?void 0:u.closeButton)!=null?et:T,interacting:X,position:d,style:u==null?void 0:u.style,unstyled:u==null?void 0:u.unstyled,classNames:u==null?void 0:u.classNames,cancelButtonStyle:u==null?void 0:u.cancelButtonStyle,actionButtonStyle:u==null?void 0:u.actionButtonStyle,closeButtonAriaLabel:u==null?void 0:u.closeButtonAriaLabel,removeToast:Z,toasts:S.filter(at=>at.position==p.position),heights:rt.filter(at=>at.position==p.position),setHeights:pt,expandByDefault:h,gap:st,expanded:it,swipeDirections:o.swipeDirections})})):null}))});export{xe as T,we as t};
