"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7472],{37472:(e,t,s)=>{s.d(t,{WalletConnectModal:()=>o});var r=s(85930);class o{constructor(e){this.openModal=r.D8.open,this.closeModal=r.D8.close,this.subscribeModal=r.D8.subscribe,this.setTheme=r.lH.setThemeConfig,r.lH.setThemeConfig(e),r.mb.setConfig(e),this.initUi()}async initUi(){if("undefined"!=typeof window){await s.e(9142).then(s.bind(s,39142));let e=document.createElement("wcm-modal");document.body.insertAdjacentElement("beforeend",e),r.IN.setIsUiLoaded(!0)}}}},85930:(e,t,s)=>{s.d(t,{mb:()=>O,Ao:()=>y,vZ:()=>w,pV:()=>K,D8:()=>B,IN:()=>C,jL:()=>b,lH:()=>Y,dC:()=>et}),Symbol();let r=Symbol(),o=Object.getPrototypeOf,a=new WeakMap,l=e=>e&&(a.has(e)?a.get(e):o(e)===Object.prototype||o(e)===Array.prototype),n=e=>l(e)&&e[r]||null,i=(e,t=!0)=>{a.set(e,t)},c=e=>"object"==typeof e&&null!==e,d=new WeakMap,p=new WeakSet,[u]=((e=Object.is,t=(e,t)=>new Proxy(e,t),s=e=>c(e)&&!p.has(e)&&(Array.isArray(e)||!(Symbol.iterator in e))&&!(e instanceof WeakMap)&&!(e instanceof WeakSet)&&!(e instanceof Error)&&!(e instanceof Number)&&!(e instanceof Date)&&!(e instanceof String)&&!(e instanceof RegExp)&&!(e instanceof ArrayBuffer),r=e=>{switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:throw e}},o=new WeakMap,a=(e,t,s=r)=>{let l=o.get(e);if((null==l?void 0:l[0])===t)return l[1];let n=Array.isArray(e)?[]:Object.create(Object.getPrototypeOf(e));return i(n,!0),o.set(e,[t,n]),Reflect.ownKeys(e).forEach(t=>{if(Object.getOwnPropertyDescriptor(n,t))return;let r=Reflect.get(e,t),o={value:r,enumerable:!0,configurable:!0};if(p.has(r))i(r,!1);else if(r instanceof Promise)delete o.value,o.get=()=>s(r);else if(d.has(r)){let[e,t]=d.get(r);o.value=a(e,t(),s)}Object.defineProperty(n,t,o)}),Object.preventExtensions(n)},l=new WeakMap,u=[1,1],f=r=>{if(!c(r))throw Error("object required");let o=l.get(r);if(o)return o;let i=u[0],h=new Set,g=(e,t=++u[0])=>{i!==t&&(i=t,h.forEach(s=>s(e,t)))},m=u[1],b=(e=++u[1])=>(m===e||h.size||(m=e,v.forEach(([t])=>{let s=t[1](e);s>i&&(i=s)})),i),y=e=>(t,s)=>{let r=[...t];r[1]=[e,...r[1]],g(r,s)},v=new Map,w=(e,t)=>{if(v.has(e))throw Error("prop listener already exists");if(h.size){let s=t[3](y(e));v.set(e,[t,s])}else v.set(e,[t])},I=e=>{var t;let s=v.get(e);s&&(v.delete(e),null==(t=s[1])||t.call(s))},C=e=>{h.add(e),1===h.size&&v.forEach(([e,t],s)=>{if(t)throw Error("remove already exists");let r=e[3](y(s));v.set(s,[e,r])});let t=()=>{h.delete(e),0===h.size&&v.forEach(([e,t],s)=>{t&&(t(),v.set(s,[e]))})};return t},W=Array.isArray(r)?[]:Object.create(Object.getPrototypeOf(r)),O={deleteProperty(e,t){let s=Reflect.get(e,t);I(t);let r=Reflect.deleteProperty(e,t);return r&&g(["delete",[t],s]),r},set(t,r,o,a){let i=Reflect.has(t,r),u=Reflect.get(t,r,a);if(i&&(e(u,o)||l.has(o)&&e(u,l.get(o))))return!0;I(r),c(o)&&(o=n(o)||o);let h=o;if(o instanceof Promise)o.then(e=>{o.status="fulfilled",o.value=e,g(["resolve",[r],e])}).catch(e=>{o.status="rejected",o.reason=e,g(["reject",[r],e])});else{!d.has(o)&&s(o)&&(h=f(o));let e=!p.has(h)&&d.get(h);e&&w(r,e)}return Reflect.set(t,r,h,a),g(["set",[r],o,u]),!0}},E=t(W,O);l.set(r,E);let L=[W,b,a,C];return d.set(E,L),Reflect.ownKeys(r).forEach(e=>{let t=Object.getOwnPropertyDescriptor(r,e);"value"in t&&(E[e]=r[e],delete t.value,delete t.writable),Object.defineProperty(W,e,t)}),E})=>[f,d,p,e,t,s,r,o,a,l,u])();function f(e={}){return u(e)}function h(e,t,s){let r;let o=d.get(e);o||console.warn("Please use proxy object");let a=[],l=o[3],n=!1,i=l(e=>{if(a.push(e),s){t(a.splice(0));return}r||(r=Promise.resolve().then(()=>{r=void 0,n&&t(a.splice(0))}))});return n=!0,()=>{n=!1,i()}}var g=s(44134).Buffer;let m=f({history:["ConnectWallet"],view:"ConnectWallet",data:void 0}),b={state:m,subscribe:e=>h(m,()=>e(m)),push(e,t){e!==m.view&&(m.view=e,t&&(m.data=t),m.history.push(e))},reset(e){m.view=e,m.history=[e]},replace(e){m.history.length>1&&(m.history[m.history.length-1]=e,m.view=e)},goBack(){if(m.history.length>1){m.history.pop();let[e]=m.history.slice(-1);m.view=e}},setData(e){m.data=e}},y={WALLETCONNECT_DEEPLINK_CHOICE:"WALLETCONNECT_DEEPLINK_CHOICE",WCM_VERSION:"WCM_VERSION",RECOMMENDED_WALLET_AMOUNT:9,isMobile:()=>"undefined"!=typeof window&&!!(window.matchMedia("(pointer:coarse)").matches||/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)),isAndroid:()=>y.isMobile()&&navigator.userAgent.toLowerCase().includes("android"),isIos(){let e=navigator.userAgent.toLowerCase();return y.isMobile()&&(e.includes("iphone")||e.includes("ipad"))},isHttpUrl:e=>e.startsWith("http://")||e.startsWith("https://"),isArray:e=>Array.isArray(e)&&e.length>0,isTelegram:()=>"undefined"!=typeof window&&(!!window.TelegramWebviewProxy||!!window.Telegram||!!window.TelegramWebviewProxyProto),formatNativeUrl(e,t,s){if(y.isHttpUrl(e))return this.formatUniversalUrl(e,t,s);let r=e;r.includes("://")||(r=e.replaceAll("/","").replaceAll(":",""),r=`${r}://`),r.endsWith("/")||(r=`${r}/`),this.setWalletConnectDeepLink(r,s);let o=encodeURIComponent(t);return`${r}wc?uri=${o}`},formatUniversalUrl(e,t,s){if(!y.isHttpUrl(e))return this.formatNativeUrl(e,t,s);let r=e;if(r.startsWith("https://t.me")){let e=g.from(t).toString("base64").replace(/[=]/g,"");r.endsWith("/")&&(r=r.slice(0,-1)),this.setWalletConnectDeepLink(r,s);let o=new URL(r);return o.searchParams.set("startapp",e),o.toString()}r.endsWith("/")||(r=`${r}/`),this.setWalletConnectDeepLink(r,s);let o=encodeURIComponent(t);return`${r}wc?uri=${o}`},wait:async e=>new Promise(t=>{setTimeout(t,e)}),openHref(e,t){let s=this.isTelegram()?"_blank":t;window.open(e,s,"noreferrer noopener")},setWalletConnectDeepLink(e,t){try{localStorage.setItem(y.WALLETCONNECT_DEEPLINK_CHOICE,JSON.stringify({href:e,name:t}))}catch(e){console.info("Unable to set WalletConnect deep link")}},setWalletConnectAndroidDeepLink(e){try{let[t]=e.split("?");localStorage.setItem(y.WALLETCONNECT_DEEPLINK_CHOICE,JSON.stringify({href:t,name:"Android"}))}catch(e){console.info("Unable to set WalletConnect android deep link")}},removeWalletConnectDeepLink(){try{localStorage.removeItem(y.WALLETCONNECT_DEEPLINK_CHOICE)}catch(e){console.info("Unable to remove WalletConnect deep link")}},setModalVersionInStorage(){try{"undefined"!=typeof localStorage&&localStorage.setItem(y.WCM_VERSION,"2.7.0")}catch(e){console.info("Unable to set Web3Modal version in storage")}},getWalletRouterData(){var e;let t=null==(e=b.state.data)?void 0:e.Wallet;if(!t)throw Error('Missing "Wallet" view data');return t}},v=f({enabled:"undefined"!=typeof location&&(location.hostname.includes("localhost")||location.protocol.includes("https")),userSessionId:"",events:[],connectedWalletId:void 0}),w={state:v,subscribe:e=>h(v.events,()=>e(function(e,t){let s=d.get(e);s||console.warn("Please use proxy object");let[r,o,a]=s;return a(r,o(),void 0)}(v.events[v.events.length-1]))),initialize(){v.enabled&&void 0!==(null==crypto?void 0:crypto.randomUUID)&&(v.userSessionId=crypto.randomUUID())},setConnectedWalletId(e){v.connectedWalletId=e},click(e){if(v.enabled){let t={type:"CLICK",name:e.name,userSessionId:v.userSessionId,timestamp:Date.now(),data:e};v.events.push(t)}},track(e){if(v.enabled){let t={type:"TRACK",name:e.name,userSessionId:v.userSessionId,timestamp:Date.now(),data:e};v.events.push(t)}},view(e){if(v.enabled){let t={type:"VIEW",name:e.name,userSessionId:v.userSessionId,timestamp:Date.now(),data:e};v.events.push(t)}}},I=f({chains:void 0,walletConnectUri:void 0,isAuth:!1,isCustomDesktop:!1,isCustomMobile:!1,isDataLoaded:!1,isUiLoaded:!1}),C={state:I,subscribe:e=>h(I,()=>e(I)),setChains(e){I.chains=e},setWalletConnectUri(e){I.walletConnectUri=e},setIsCustomDesktop(e){I.isCustomDesktop=e},setIsCustomMobile(e){I.isCustomMobile=e},setIsDataLoaded(e){I.isDataLoaded=e},setIsUiLoaded(e){I.isUiLoaded=e},setIsAuth(e){I.isAuth=e}},W=f({projectId:"",mobileWallets:void 0,desktopWallets:void 0,walletImages:void 0,chains:void 0,enableAuthMode:!1,enableExplorer:!0,explorerExcludedWalletIds:void 0,explorerRecommendedWalletIds:void 0,termsOfServiceUrl:void 0,privacyPolicyUrl:void 0}),O={state:W,subscribe:e=>h(W,()=>e(W)),setConfig(e){var t,s;w.initialize(),C.setChains(e.chains),C.setIsAuth(!!e.enableAuthMode),C.setIsCustomMobile(!!(null==(t=e.mobileWallets)?void 0:t.length)),C.setIsCustomDesktop(!!(null==(s=e.desktopWallets)?void 0:s.length)),y.setModalVersionInStorage(),Object.assign(W,e)}};var E=Object.defineProperty,L=Object.getOwnPropertySymbols,j=Object.prototype.hasOwnProperty,A=Object.prototype.propertyIsEnumerable,k=(e,t,s)=>t in e?E(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,M=(e,t)=>{for(var s in t||(t={}))j.call(t,s)&&k(e,s,t[s]);if(L)for(var s of L(t))A.call(t,s)&&k(e,s,t[s]);return e};let D="https://explorer-api.walletconnect.com",U="js-2.7.0";async function P(e,t){let s=M({sdkType:"wcm",sdkVersion:U},t),r=new URL(e,D);return r.searchParams.append("projectId",O.state.projectId),Object.entries(s).forEach(([e,t])=>{t&&r.searchParams.append(e,String(t))}),(await fetch(r)).json()}let S={getDesktopListings:async e=>P("/w3m/v1/getDesktopListings",e),getMobileListings:async e=>P("/w3m/v1/getMobileListings",e),getAllListings:async e=>P("/w3m/v1/getAllListings",e),getWalletImageUrl:e=>`${D}/w3m/v1/getWalletImage/${e}?projectId=${O.state.projectId}&sdkType=wcm&sdkVersion=${U}`,getAssetImageUrl:e=>`${D}/w3m/v1/getAssetImage/${e}?projectId=${O.state.projectId}&sdkType=wcm&sdkVersion=${U}`};var N=Object.defineProperty,T=Object.getOwnPropertySymbols,_=Object.prototype.hasOwnProperty,R=Object.prototype.propertyIsEnumerable,x=(e,t,s)=>t in e?N(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,$=(e,t)=>{for(var s in t||(t={}))_.call(t,s)&&x(e,s,t[s]);if(T)for(var s of T(t))R.call(t,s)&&x(e,s,t[s]);return e};let H=y.isMobile(),V=f({wallets:{listings:[],total:0,page:1},search:{listings:[],total:0,page:1},recomendedWallets:[]}),K={state:V,async getRecomendedWallets(){let{explorerRecommendedWalletIds:e,explorerExcludedWalletIds:t}=O.state;if("NONE"===e||"ALL"===t&&!e)return V.recomendedWallets;if(y.isArray(e)){let t=e.join(","),{listings:s}=await S.getAllListings({recommendedIds:t}),r=Object.values(s);r.sort((t,s)=>e.indexOf(t.id)-e.indexOf(s.id)),V.recomendedWallets=r}else{let{chains:e,isAuth:s}=C.state,r=null==e?void 0:e.join(","),o=y.isArray(t),a={page:1,sdks:s?"auth_v1":void 0,entries:y.RECOMMENDED_WALLET_AMOUNT,chains:r,version:2,excludedIds:o?t.join(","):void 0},{listings:l}=H?await S.getMobileListings(a):await S.getDesktopListings(a);V.recomendedWallets=Object.values(l)}return V.recomendedWallets},async getWallets(e){let t=$({},e),{explorerRecommendedWalletIds:s,explorerExcludedWalletIds:r}=O.state,{recomendedWallets:o}=V;if("ALL"===r)return V.wallets;o.length?t.excludedIds=o.map(e=>e.id).join(","):y.isArray(s)&&(t.excludedIds=s.join(",")),y.isArray(r)&&(t.excludedIds=[t.excludedIds,r].filter(Boolean).join(",")),C.state.isAuth&&(t.sdks="auth_v1");let{page:a,search:l}=e,{listings:n,total:i}=H?await S.getMobileListings(t):await S.getDesktopListings(t),c=Object.values(n),d=l?"search":"wallets";return V[d]={listings:[...V[d].listings,...c],total:i,page:null!=a?a:1},{listings:c,total:i}},getWalletImageUrl:e=>S.getWalletImageUrl(e),getAssetImageUrl:e=>S.getAssetImageUrl(e),resetSearch(){V.search={listings:[],total:0,page:1}}},z=f({open:!1}),B={state:z,subscribe:e=>h(z,()=>e(z)),open:async e=>new Promise(t=>{let{isUiLoaded:s,isDataLoaded:r}=C.state;if(y.removeWalletConnectDeepLink(),C.setWalletConnectUri(null==e?void 0:e.uri),C.setChains(null==e?void 0:e.chains),b.reset("ConnectWallet"),s&&r)z.open=!0,t();else{let e=setInterval(()=>{let s=C.state;s.isUiLoaded&&s.isDataLoaded&&(clearInterval(e),z.open=!0,t())},200)}}),close(){z.open=!1}};var J=Object.defineProperty,q=Object.getOwnPropertySymbols,Z=Object.prototype.hasOwnProperty,F=Object.prototype.propertyIsEnumerable,G=(e,t,s)=>t in e?J(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,Q=(e,t)=>{for(var s in t||(t={}))Z.call(t,s)&&G(e,s,t[s]);if(q)for(var s of q(t))F.call(t,s)&&G(e,s,t[s]);return e};let X=f({themeMode:"undefined"!=typeof matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}),Y={state:X,subscribe:e=>h(X,()=>e(X)),setThemeConfig(e){let{themeMode:t,themeVariables:s}=e;t&&(X.themeMode=t),s&&(X.themeVariables=Q({},s))}},ee=f({open:!1,message:"",variant:"success"}),et={state:ee,subscribe:e=>h(ee,()=>e(ee)),openToast(e,t){ee.open=!0,ee.message=e,ee.variant=t},closeToast(){ee.open=!1}}}}]);