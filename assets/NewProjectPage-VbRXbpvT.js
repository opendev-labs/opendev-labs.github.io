import{n as C,d as z,u as T,r as c,j as e,X as P,Y as W,$ as I,a0 as A,W as q,Z as $,f as V,m as f,K as M,s as Y,a1 as K,A as G,k as Z,a2 as U,a3 as J,R as X,g as N,O as Q}from"./index-Biktbhv5.js";import{m as ee,c as te}from"./VoidApp-BdNJDSl_.js";import{G as k}from"./github-COXW1YB2.js";import{F as se}from"./Indicators-BV6m8TpM.js";import ie from"./App-OR8vuNbr.js";import{L as ae}from"./lock-BoQYqxFI.js";import"./index-BjAxNs1s.js";const re=[["path",{d:"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",key:"1slcih"}]],ne=C("flame",re);const oe=[["path",{d:"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",key:"sc7q7i"}]],ce=C("funnel",oe);const le=[["path",{d:"M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8",key:"18ogeb"}]],de=C("infinity",le);const pe=[["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",key:"m3kijz"}],["path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",key:"1fmvmk"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",key:"1f8sc4"}],["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}]],_=C("rocket",pe),xe=({template:s,onClick:t})=>e.jsxs("button",{onClick:t,className:"group flex flex-col bg-zinc-950/50 border border-zinc-900 rounded-xl overflow-hidden hover:border-zinc-700 transition-all text-left",children:[e.jsx("div",{className:"h-32 w-full bg-black flex items-center justify-center p-6 bg-gradient-to-br from-zinc-900/20 to-black",children:e.jsx("img",{src:s.logoUrl,alt:s.name,className:"w-12 h-12 object-contain grayscale group-hover:grayscale-0 transition-grayscale duration-500"})}),e.jsxs("div",{className:"p-5 border-t border-zinc-900",children:[e.jsx("h4",{className:"text-sm font-bold text-white mb-1 group-hover:text-white transition-colors",children:s.name}),e.jsx("p",{className:"text-[11px] text-zinc-500 line-clamp-2 leading-relaxed",children:s.description})]})]}),me=({repo:s,onImport:t})=>e.jsxs("div",{className:"flex items-center justify-between p-4 group hover:bg-zinc-900/50 transition-colors",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-8 h-8 bg-black border border-zinc-800 flex items-center justify-center rounded-lg",children:e.jsx(q,{className:"w-4 h-4 text-zinc-600 group-hover:text-white transition-colors"})}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-bold text-white tracking-tight",children:s.name}),e.jsxs("div",{className:"flex items-center gap-2 mt-0.5",children:[e.jsx("span",{className:"text-[10px] text-zinc-600 font-medium",children:s.updatedAt}),e.jsx("span",{className:"w-1 h-1 rounded-full bg-zinc-800"}),e.jsx("span",{className:"text-[10px] text-zinc-600 font-medium",children:"main"})]})]})]}),e.jsx("button",{onClick:t,className:"h-8 px-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-zinc-200 transition-all opacity-0 group-hover:opacity-100",children:"Import"})]}),he=()=>{const s=z(),{loginWithGitHub:t,isGithubConnected:i,fetchRepositories:a,githubUser:r,user:n}=T(),[m,l]=c.useState(""),[u,x]=c.useState(""),[h,d]=c.useState([]),[g,b]=c.useState(!1);c.useEffect(()=>{i&&(async()=>{b(!0);try{const y=await a();d(y)}catch(y){console.error("Failed to load repos",y)}finally{b(!1)}})()},[i,a]);const o=c.useMemo(()=>h.filter(p=>p.name.toLowerCase().includes(m.toLowerCase())),[h,m]),v=p=>{s(`/void/new/import?repo=${p.name}`)},w=p=>{s(`/void/new/templates?id=${p.id}`)};return e.jsxs("div",{className:"max-w-[1400px] mx-auto pt-20 pb-40 px-6",children:[e.jsxs("div",{className:"flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsxs("button",{onClick:()=>s("/void/dashboard"),className:"text-[11px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors",children:[e.jsx(P,{size:14,className:"rotate-180"})," Back to Platform"]}),e.jsxs("h1",{className:"text-5xl md:text-6xl font-black tracking-tighter text-white",children:["Let's build something ",e.jsx("span",{className:"text-zinc-600 italic",children:"new."})]})]}),e.jsx("div",{className:"flex flex-col items-end gap-3",children:e.jsxs("div",{className:"flex items-center gap-3 p-1.5 bg-zinc-900/50 border border-zinc-800 rounded-full pl-4 pr-1.5",children:[e.jsx("span",{className:"text-[10px] font-bold text-zinc-400 uppercase tracking-widest",children:"Collaborate on a Pro Trial"}),e.jsx("button",{className:"h-8 px-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all",children:"Upgrade"})]})})]}),e.jsxs("div",{className:"relative group mb-24",children:[e.jsx("div",{className:"absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"}),e.jsxs("div",{className:"flex items-center bg-black border border-zinc-900 h-16 rounded-xl overflow-hidden focus-within:border-white transition-all shadow-2xl",children:[e.jsx("div",{className:"pl-6 pr-4 text-zinc-500",children:e.jsx(W,{size:18})}),e.jsx("input",{type:"text",placeholder:"Enter a Git repository URL to deploy...",value:u,onChange:p=>x(p.target.value),className:"flex-grow bg-transparent border-none text-sm text-white focus:outline-none placeholder:text-zinc-700"}),e.jsxs("button",{disabled:!u.trim(),className:"h-10 px-6 mr-3 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-all disabled:opacity-20 flex items-center gap-2",children:["Continue ",e.jsx(P,{size:14})]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-16",children:[e.jsxs("div",{className:"lg:col-span-5 space-y-10",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold tracking-tight text-white mb-2",children:"Import Git Repository"}),e.jsx("p",{className:"text-sm text-zinc-500 font-medium",children:"Select a repository from your connected fleet."})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx("div",{className:"relative group/provider flex-grow max-w-[200px]",children:e.jsxs("button",{className:"w-full h-12 bg-black border border-zinc-900 rounded-xl flex items-center justify-between px-4 text-xs font-bold text-white hover:border-zinc-700 transition-all",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(k,{size:16}),e.jsx("span",{children:"opendev-labs"})]}),e.jsx(I,{size:14,className:"text-zinc-600"})]})}),e.jsxs("div",{className:"relative flex-grow",children:[e.jsx(A,{className:"absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"}),e.jsx("input",{type:"text",placeholder:"Search...",value:m,onChange:p=>l(p.target.value),className:"w-full h-12 bg-black border border-zinc-900 rounded-xl pl-12 pr-4 text-sm text-white focus:outline-none focus:border-white transition-all placeholder:text-zinc-700"})]})]}),e.jsx("div",{className:"bg-black border border-zinc-900 rounded-xl overflow-hidden divide-y divide-zinc-900 max-h-[500px] overflow-y-auto scrollbar-hide",children:i?g?e.jsxs("div",{className:"p-20 flex flex-col items-center justify-center gap-4",children:[e.jsx("div",{className:"w-6 h-6 border-2 border-white/20 border-t-white animate-spin rounded-full"}),e.jsx("span",{className:"text-[10px] font-bold text-zinc-600 uppercase tracking-widest",children:"Scanning Registry..."})]}):o.length>0?o.map(p=>e.jsx(me,{repo:p,onImport:()=>v(p)},p.id)):e.jsx("div",{className:"p-12 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest",children:"No matching nodes detected."}):e.jsxs("div",{className:"p-12 text-center flex flex-col items-center",children:[e.jsx("div",{className:"w-16 h-16 bg-zinc-950 border border-zinc-800 flex items-center justify-center rounded-2xl mb-6",children:e.jsx(k,{size:24,className:"text-zinc-500"})}),e.jsx("h4",{className:"text-sm font-bold text-white uppercase tracking-widest mb-2",children:"Awaiting Handshake"}),e.jsx("p",{className:"text-[11px] text-zinc-600 uppercase tracking-widest mb-8",children:"Connect your source provider to view fleet nodes."}),e.jsx("button",{onClick:()=>t(),className:"h-10 px-8 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-all",children:"Connect GitHub"})]})})]}),e.jsx("div",{className:"pt-8 border-t border-zinc-900",children:e.jsxs("div",{className:"flex items-center gap-4 p-5 bg-zinc-950/50 border border-zinc-900 rounded-2xl",children:[e.jsx("div",{className:"w-10 h-10 bg-black border border-zinc-800 flex items-center justify-center rounded-xl overflow-hidden shrink-0",children:i&&r?.avatar_url?e.jsx("img",{src:r.avatar_url,alt:"Profile",className:"w-full h-full object-cover"}):e.jsx(ce,{size:18,className:"text-zinc-700"})}),e.jsxs("div",{className:"flex-grow",children:[e.jsx("h4",{className:"text-xs font-bold text-white",children:i?`@${r?.login}`:"Protocol Inactive"}),e.jsx("p",{className:"text-[9px] font-bold text-zinc-600 uppercase tracking-widest",children:i?"Identity Sync Active":"Bridge Handshake Pending"})]}),i&&e.jsx("button",{onClick:()=>s("/void/new/import"),className:"text-[9px] font-bold text-zinc-600 hover:text-white uppercase tracking-widest transition-colors",children:"Configure"})]})})]}),e.jsxs("div",{className:"lg:col-span-7 space-y-10",children:[e.jsxs("div",{className:"flex items-end justify-between",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold tracking-tight text-white mb-2",children:"Clone Template"}),e.jsx("p",{className:"text-sm text-zinc-500 font-medium",children:"Initialize from optimized production blueprints."})]}),e.jsxs("div",{className:"flex items-center gap-6",children:[e.jsxs("div",{className:"flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white transition-colors cursor-pointer",children:[e.jsx("span",{children:"Filter"}),e.jsx(I,{size:14})]}),e.jsxs("button",{onClick:()=>s("templates"),className:"text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2",children:["Browse All ",e.jsx(P,{size:14})]})]})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:ee.filter(p=>["tmpl_nextjs","tmpl_ai_chatbot","tmpl_react_vite","tmpl_express_on_vercel"].includes(p.id)).map(p=>e.jsx(xe,{template:p,onClick:()=>w(p)},p.id))}),e.jsxs("div",{className:"p-8 border border-zinc-900 bg-zinc-950/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 group",children:[e.jsxs("div",{className:"space-y-2 text-center md:text-left",children:[e.jsx("h4",{className:"text-sm font-bold text-white uppercase tracking-widest",children:"sub0 v2 // Neural Genesis"}),e.jsx("p",{className:"text-[11px] text-zinc-600 uppercase tracking-widest leading-relaxed",children:"Manifest entire architectures from pure thought using the upgraded sub0 orchestrator."})]}),e.jsxs("button",{onClick:()=>s("sub0"),className:"h-12 px-10 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-3 shrink-0",children:["Initiate sub0 ",e.jsx(ue,{size:14,className:"text-black"})]})]})]})]})]})},ue=({size:s,className:t})=>e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:t,children:[e.jsx("path",{d:"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"}),e.jsx("path",{d:"M5 3v4"}),e.jsx("path",{d:"M19 17v4"}),e.jsx("path",{d:"M3 5h4"}),e.jsx("path",{d:"M17 19h4"})]}),R=f.div,ge=({repos:s,onImport:t})=>{const[i,a]=c.useState(""),r=c.useMemo(()=>s.filter(n=>n.name.toLowerCase().includes(i.toLowerCase())),[s,i]);return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"relative",children:[e.jsx(A,{className:"absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"}),e.jsx("input",{type:"text",placeholder:"Search repositories...",value:i,onChange:n=>a(n.target.value),className:"w-full bg-zinc-950 border border-zinc-900 h-12 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-white transition-all placeholder:text-zinc-700"})]}),e.jsxs("div",{className:"border border-zinc-900 bg-zinc-950 divide-y divide-zinc-900",children:[r.map(n=>e.jsxs("div",{className:"flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors group",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-8 h-8 bg-black border border-zinc-900 flex items-center justify-center shrink-0",children:e.jsx(M,{className:"w-4 h-4 text-zinc-600 group-hover:text-white transition-colors"})}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-bold text-white tracking-tight",children:n.name}),e.jsxs("div",{className:"flex items-center gap-2 mt-0.5",children:[e.jsx("span",{className:"text-[10px] text-zinc-600 font-medium",children:n.updatedAt}),e.jsx("span",{className:"w-1 h-1 rounded-full bg-zinc-800"}),e.jsx("span",{className:"text-[10px] text-zinc-600 font-medium",children:"main"})]})]})]}),e.jsx("button",{onClick:()=>t(n,n.name),className:"h-9 px-6 bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all opacity-0 group-hover:opacity-100",children:"Import"})]},n.id)),r.length===0&&e.jsx("div",{className:"p-12 text-center",children:e.jsx("p",{className:"text-zinc-600 text-xs font-bold uppercase tracking-widest",children:"No matching repositories"})})]})]})},be=({onImportRepository:s})=>{const t=z(),{loginWithGitHub:i,linkWithGitHub:a,user:r,isGithubConnected:n,logout:m,githubUser:l}=T(),[u,x]=c.useState(!1),[h,d]=c.useState(null),[g,b]=c.useState(null),[o,v]=c.useState(""),[w,p]=c.useState("nextjs"),[y,D]=c.useState(!1),B=j=>{b(j),v(j.name)},E=async()=>{!g||!o.trim()||(D(!0),setTimeout(()=>{s(g,o),D(!1)},1500))},O=async()=>{x(!0),d(null);try{r?await a():await i()}catch(j){d(j.message||"Authentication failed.")}finally{x(!1)}};return e.jsxs("div",{className:"max-w-6xl mx-auto py-12 md:py-24 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700",children:[e.jsx("div",{className:"flex items-center justify-between mb-16",children:e.jsx("button",{onClick:()=>t("/void/new"),className:"text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors",children:"← Back to Selection"})}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-12 gap-16",children:[e.jsx("div",{className:"lg:col-span-5",children:e.jsxs("div",{className:"sticky top-24",children:[e.jsxs("div",{className:"inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-bold text-zinc-500 mb-8 uppercase tracking-[0.3em]",children:[e.jsx($,{size:12,className:"text-emerald-500"}),e.jsx("span",{children:"Vercel-Grade // Import Protocol"})]}),e.jsxs("h1",{className:"text-6xl font-bold tracking-tighter mb-6 lowercase leading-[0.9]",children:[g?"finalize":"import",e.jsx("br",{}),e.jsx("span",{className:"text-zinc-600",children:"project."})]}),e.jsx("p",{className:"text-zinc-500 text-lg leading-relaxed max-w-sm mb-12",children:g?"Configure your project settings before we manifest the infrastructure nodes.":"Connect your source provider to synchronize your existing repositories with the OpenDev Mesh."}),!n&&e.jsxs("div",{className:"space-y-4",children:[e.jsxs("button",{onClick:O,disabled:u,className:"h-14 w-full bg-white text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-3",children:[e.jsx(k,{size:18}),u?"Synchronizing...":"Continue with GitHub"]}),h&&e.jsx("p",{className:"text-[10px] text-red-500 font-bold uppercase tracking-widest text-center mt-4",children:h})]}),n&&!g&&e.jsxs("div",{className:"flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-900 mb-8",children:[e.jsx("div",{className:"w-10 h-10 bg-black border border-zinc-800 flex items-center justify-center overflow-hidden",children:e.jsx("img",{src:l?.avatar_url,alt:"Profile",className:"w-full h-full opacity-80"})}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("h4",{className:"text-sm font-bold text-white",children:["@",l?.login]}),e.jsx("p",{className:"text-[10px] text-zinc-600 font-bold uppercase tracking-widest",children:"GitHub Connected (Auth OK)"})]}),e.jsx("button",{onClick:m,className:"text-[9px] font-bold text-zinc-700 hover:text-white uppercase tracking-widest transition-colors",children:"Disconnect"})]})]})}),e.jsx("div",{className:"lg:col-span-7",children:e.jsx(V,{mode:"wait",children:n?g?e.jsx(R,{initial:{opacity:0,x:20},animate:{opacity:1,x:0},exit:{opacity:0,x:-20},className:"space-y-12",children:e.jsxs("div",{className:"p-8 border border-zinc-900 bg-zinc-950",children:[e.jsxs("div",{className:"flex items-center gap-4 mb-8",children:[e.jsx("div",{className:"w-12 h-12 bg-black border border-zinc-800 flex items-center justify-center",children:e.jsx(M,{className:"w-6 h-6 text-white"})}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-lg font-bold text-white tracking-tight",children:g.name}),e.jsx("p",{className:"text-xs text-zinc-600 uppercase tracking-widest font-bold",children:"Selected Repository"})]}),e.jsx("button",{onClick:()=>b(null),className:"ml-auto text-[10px] font-bold text-zinc-700 hover:text-white uppercase tracking-widest",children:"Switch"})]}),e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{className:"space-y-3",children:[e.jsx("label",{className:"text-[10px] font-bold text-zinc-500 uppercase tracking-widest block",children:"Project Name"}),e.jsx("input",{type:"text",value:o,onChange:j=>v(j.target.value),className:"w-full bg-black border border-zinc-900 h-12 px-4 text-sm text-white focus:outline-none focus:border-white transition-all"})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("label",{className:"text-[10px] font-bold text-zinc-500 uppercase tracking-widest block",children:"Framework Preset"}),e.jsxs("select",{value:w,onChange:j=>p(j.target.value),className:"w-full bg-black border border-zinc-900 h-12 px-4 text-sm text-white focus:outline-none focus:border-white transition-all appearance-none",children:[e.jsx("option",{value:"nextjs",children:"Next.js"}),e.jsx("option",{value:"vite",children:"Vite (React)"}),e.jsx("option",{value:"node",children:"Node.js"}),e.jsx("option",{value:"remix",children:"Remix"}),e.jsx("option",{value:"astro",children:"Astro"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"space-y-3 opacity-30 cursor-not-allowed",children:[e.jsx("label",{className:"text-[10px] font-bold text-zinc-500 uppercase tracking-widest block",children:"Build Command"}),e.jsx("div",{className:"bg-zinc-900/50 border border-zinc-900 h-12 px-4 flex items-center text-sm text-zinc-700",children:"npm run build"})]}),e.jsxs("div",{className:"space-y-3 opacity-30 cursor-not-allowed",children:[e.jsx("label",{className:"text-[10px] font-bold text-zinc-500 uppercase tracking-widest block",children:"Output Dir"}),e.jsx("div",{className:"bg-zinc-900/50 border border-zinc-900 h-12 px-4 flex items-center text-sm text-zinc-700",children:"dist / .next"})]})]}),e.jsx("button",{onClick:E,disabled:y||!o.trim(),className:"h-14 w-full bg-emerald-500 text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 mt-8 disabled:bg-zinc-900 disabled:text-zinc-600",children:y?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-4 h-4 border-2 border-black/20 border-t-black animate-spin"}),"Initializing Nodes..."]}):e.jsx(e.Fragment,{children:"Manifest Project"})})]})]})},"config"):e.jsx(R,{initial:{opacity:0,x:20},animate:{opacity:1,x:0},exit:{opacity:0,x:-20},children:e.jsx(fe,{onImport:B})},"repo-list"):e.jsxs(R,{initial:{opacity:0,x:20},animate:{opacity:1,x:0},exit:{opacity:0,x:-20},className:"p-12 border border-zinc-900 bg-zinc-950/50 flex flex-col items-center justify-center text-center",children:[e.jsx("div",{className:"w-16 h-16 border border-zinc-800 flex items-center justify-center mb-8 bg-black",children:e.jsx(k,{className:"text-zinc-700",size:32})}),e.jsx("h3",{className:"text-sm font-bold text-white uppercase tracking-widest mb-2",children:"Awaiting Authentication"}),e.jsx("p",{className:"text-zinc-600 text-[11px] leading-relaxed max-w-xs mb-8 uppercase tracking-widest opacity-60",children:"Please connect your git provider to access the neural project registry."})]},"guest")})})]})]})},fe=({onImport:s})=>{const{fetchRepositories:t,user:i}=T(),[a,r]=c.useState([]),[n,m]=c.useState(!0);return c.useEffect(()=>{let l=!0;return(async()=>{if(i?.uid){m(!0);try{const x=await t();l&&r(x)}catch(x){console.error("Repo fetch error",x)}finally{l&&m(!1)}}})(),()=>{l=!1}},[t,i?.uid]),n?e.jsxs("div",{className:"p-20 border border-zinc-900 bg-zinc-950/50 flex flex-col items-center justify-center",children:[e.jsx("div",{className:"w-10 h-10 border-2 border-white/20 border-t-white animate-spin mb-4"}),e.jsx("span",{className:"text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]",children:"Synchronizing Registry..."})]}):e.jsx(ge,{repos:a,onImport:l=>s(l)})},L=[{id:"github",name:"GitHub Pages",icon:k,description:"Free static hosting",recommended:!0,color:"text-white"},{id:"vercel",name:"Vercel",icon:_,description:"Edge network deployment",recommended:!1,color:"text-white"},{id:"firebase",name:"Firebase",icon:ne,description:"Google Cloud hosting",recommended:!1,color:"text-orange-500"},{id:"huggingface",name:"HuggingFace",icon:Y,description:"ML-powered hosting",recommended:!1,color:"text-yellow-500"},{id:"syncstack",name:"SyncStack",icon:_,description:"Native OpenDev Cloud",recommended:!0,color:"text-emerald-500"}],je=({templateName:s,onDeploy:t,onCancel:i})=>{const[a,r]=c.useState(s.toLowerCase().replace(/\s+/g,"-")),[n,m]=c.useState("github"),[l,u]=c.useState(!1),[x,h]=c.useState(!1),d=a.toLowerCase().replace(/[^a-z0-9-]/g,"-"),g=()=>{switch(n){case"github":return`${d}.github.io`;case"vercel":return`${d}.vercel.app`;case"firebase":return`${d}.web.app`;case"huggingface":return`${d}.hf.space`;case"syncstack":return`${d}.opendev.app`;default:return`${d}.opendev.app`}},b=o=>{o.preventDefault(),a.trim()&&!x&&(h(!0),setTimeout(()=>{t(a.trim(),n,l)},500))};return e.jsxs("form",{onSubmit:b,className:"bg-zinc-950 border border-zinc-900 p-8 space-y-6",children:[e.jsxs("div",{className:"border-b border-zinc-900 pb-4",children:[e.jsx("h3",{className:"text-lg font-bold text-white mb-1",children:"Deploy Configuration"}),e.jsx("p",{className:"text-xs text-zinc-600 uppercase tracking-widest",children:s})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("label",{className:"text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] block",children:"Project Name"}),e.jsx("input",{type:"text",value:a,onChange:o=>r(o.target.value),className:"w-full bg-black border border-zinc-800 h-12 px-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all",required:!0,autoFocus:!0}),e.jsxs("p",{className:"text-[10px] text-zinc-600",children:["Live URL: ",e.jsx("code",{className:"text-emerald-500 font-mono",children:g()})]})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsx("label",{className:"text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] block",children:"Deployment Platform"}),e.jsx("div",{className:"grid grid-cols-2 gap-3",children:L.map(o=>{const v=o.icon,w=n===o.id;return e.jsxs("button",{type:"button",onClick:()=>m(o.id),className:`
                                    relative p-4 border transition-all text-left
                                    ${w?"border-emerald-500 bg-emerald-500/5":"border-zinc-800 hover:border-zinc-700"}
                                `,children:[o.recommended&&e.jsx("span",{className:"absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-black text-[8px] font-bold uppercase tracking-widest",children:"Recommended"}),e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(v,{size:20,className:o.color}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h4",{className:"text-sm font-bold text-white",children:o.name}),w&&e.jsx(K,{size:16,className:"text-emerald-500"})]}),e.jsx("p",{className:"text-[10px] text-zinc-600 mt-1",children:o.description})]})]})]},o.id)})})]}),e.jsxs("div",{className:"flex items-center gap-3 p-4 bg-black border border-zinc-900",children:[e.jsx("input",{type:"checkbox",id:"private-repo",checked:l,onChange:o=>u(o.target.checked),className:"w-4 h-4 bg-zinc-900 border-zinc-800"}),e.jsx("label",{htmlFor:"private-repo",className:"text-xs text-zinc-500 cursor-pointer",children:"Make repository private"})]}),e.jsxs("div",{className:"flex justify-end gap-3 pt-4 border-t border-zinc-900",children:[e.jsx("button",{type:"button",onClick:i,className:"h-10 px-6 border border-zinc-800 text-xs font-bold text-zinc-500 uppercase tracking-widest hover:text-white hover:border-zinc-700 transition-all disabled:opacity-50",disabled:x,children:"Cancel"}),e.jsx("button",{type:"submit",className:"h-10 px-8 bg-emerald-500 text-black text-xs font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all disabled:bg-zinc-800 disabled:text-zinc-600 flex items-center gap-2",disabled:x,children:x?e.jsxs(e.Fragment,{children:[e.jsx(G,{size:14,className:"text-black"}),"Deploying..."]}):e.jsxs(e.Fragment,{children:["Deploy to ",L.find(o=>o.id===n)?.name]})})]})]})},H=({template:s,onDeploy:t})=>{const[i,a]=c.useState(!1),r=(n,m,l)=>{t(s,n,m,l),a(!1)};return e.jsxs("div",{className:"group relative bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-all duration-300 overflow-hidden flex flex-col h-full",children:[e.jsx("div",{className:"relative h-32 w-full bg-black border-b border-zinc-900 flex items-center justify-center overflow-hidden",children:s.imageUrl?e.jsx("img",{src:s.imageUrl,alt:s.name,className:"h-16 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"}):e.jsx("div",{className:"text-4xl opacity-50",children:s.category?.charAt(0)||"📦"})}),e.jsxs("div",{className:"p-6 flex flex-col flex-grow",children:[s.category&&e.jsx("div",{className:"mb-3",children:e.jsx("span",{className:"text-[9px] font-bold uppercase tracking-widest text-emerald-500",children:s.category})}),e.jsx("h3",{className:"text-lg font-bold text-white mb-2 tracking-tight",children:s.name}),e.jsx("p",{className:"text-xs text-zinc-500 font-medium leading-relaxed mb-4 flex-grow",children:s.description}),i?e.jsx("div",{className:"mt-auto",children:e.jsx(je,{templateName:s.name,onDeploy:r,onCancel:()=>a(!1)})}):e.jsxs("div",{className:"grid grid-cols-2 gap-2 mt-auto",children:[e.jsx("button",{onClick:()=>a(!0),className:"h-10 bg-white text-black text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-200 transition-all",children:"Deploy"}),e.jsx("button",{onClick:()=>s.previewUrl&&window.open(s.previewUrl,"_blank"),disabled:!s.previewUrl,className:"h-10 border border-zinc-800 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-900 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed",children:"Preview"})]})]})]})},ve=({amount:s=500,label:t="Support opendev-labs",onSuccess:i})=>{const a=()=>{console.log(`Initiating Razorpay payment for ${s} INR`),i?setTimeout(()=>{i({razorpay_payment_id:"pay_test_"+Date.now()})},2e3):alert("Razorpay Gateway Initiated: Supporting opendev-labs with ₹"+s)};return e.jsxs(f.button,{whileHover:{scale:1.02,backgroundColor:"#fff",color:"#000"},whileTap:{scale:.98},onClick:a,className:"group relative flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 border border-zinc-800 text-white rounded-none transition-all duration-300 overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"}),e.jsxs("div",{className:"flex flex-col items-start",children:[e.jsx("span",{className:"text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 group-hover:opacity-100 mb-0.5",children:"Premium Support"}),e.jsx("span",{className:"text-sm font-black uppercase tracking-tight",children:t})]}),e.jsx("div",{className:"ml-4 h-8 w-[1px] bg-zinc-800 group-hover:bg-zinc-200 transition-colors"}),e.jsx("div",{className:"flex items-center gap-2",children:e.jsxs("span",{className:"text-xl font-bold italic text-orange-500 group-hover:text-black",children:["₹",s]})}),e.jsx("div",{className:"absolute bottom-1 right-2 opacity-20 pointer-events-none",children:e.jsx("span",{className:"text-[6px] font-bold tracking-tighter uppercase",children:"Powered by Razorpay"})})]})},we=[],ye=({onDeployTemplate:s})=>{const t=z();return e.jsxs("div",{className:"max-w-7xl mx-auto py-20 px-4",children:[e.jsxs(f.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.8},className:"mb-20",children:[e.jsxs("button",{onClick:()=>t("/void/new"),className:"group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white mb-10 transition-all duration-300",children:[e.jsx("span",{className:"group-hover:-translate-x-2 transition-transform duration-300",children:"←"}),"Neural Genesis Options"]}),e.jsx("div",{className:"flex flex-col md:flex-row md:items-end justify-between gap-8",children:e.jsxs("div",{className:"max-w-2xl",children:[e.jsxs("h2",{className:"text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 uppercase",children:["Select ",e.jsx("span",{className:"text-zinc-500 italic font-serif",children:"Fabric."})]}),e.jsx("p",{className:"text-zinc-500 text-lg font-medium leading-relaxed",children:"Deploy high-fidelity boilerplates instantly. Each template is pre-configured with the opendev-labs neural mesh for autonomous scaling and edge sovereignty."})]})})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-32",children:we.map((i,a)=>e.jsx(f.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5,delay:a*.1},children:e.jsx(H,{template:i,onDeploy:s})},i.id))}),e.jsxs(f.div,{initial:{opacity:0},whileInView:{opacity:1},viewport:{once:!0},transition:{duration:1},className:"relative p-12 md:p-20 border border-zinc-900 bg-zinc-950/30 backdrop-blur-3xl overflow-hidden group",children:[e.jsx("div",{className:"absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full -mr-32 -mt-32"}),e.jsxs("div",{className:"relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12",children:[e.jsxs("div",{className:"text-center lg:text-left max-w-xl",children:[e.jsx("h3",{className:"text-3xl font-black text-white tracking-tight mb-4 uppercase",children:"Accelerate the Mission"}),e.jsx("p",{className:"text-zinc-500 font-medium leading-relaxed",children:"opendev-labs is a $1M logic engine in the making. Your support helps us expand the neural fabric and integrate advanced protocols like Razorpay enterprise gateways."})]}),e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[e.jsx(ve,{}),e.jsx("span",{className:"text-[10px] font-bold text-zinc-600 uppercase tracking-widest",children:"Secure Nexus Transaction via Razorpay"})]})]})]})]})},Ne=({defaultName:s,onDeploy:t,onCancel:i,showRepoOptions:a=!1})=>{const[r,n]=c.useState(s),[m,l]=c.useState(!1),[u,x]=c.useState(!1),[h,d]=c.useState(!1),g=r.toLowerCase().replace(/[^a-z0-9-]/g,"-"),b=o=>{o.preventDefault(),r.trim()&&!h&&(d(!0),setTimeout(()=>{t(r.trim(),m,u)},1e3))};return e.jsxs("form",{onSubmit:b,className:"border border-zinc-900 bg-black p-8 space-y-8 selection:bg-white selection:text-black",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("label",{className:"text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] block",children:"Project Identifier"}),e.jsx("input",{type:"text",value:r,onChange:o=>n(o.target.value),className:"w-full bg-zinc-950 border border-zinc-900 h-12 px-4 text-xs font-bold text-white placeholder:text-zinc-800 focus:outline-none focus:border-white transition-all uppercase tracking-widest",required:!0,autoFocus:!0}),e.jsxs("p",{className:"text-[10px] font-bold text-zinc-700 uppercase tracking-widest leading-loose",children:["This project will be initialized at ",e.jsxs("code",{className:"text-white italic",children:[g,".opendev.app"]})]})]}),e.jsxs("div",{className:"flex justify-end gap-4",children:[e.jsx("button",{type:"button",onClick:i,className:"h-10 border border-zinc-900 text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-8 hover:border-white hover:text-white transition-all disabled:opacity-20",disabled:h,children:"Abort"}),e.jsx("button",{type:"submit",className:"h-10 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-8 hover:bg-zinc-200 transition-all disabled:bg-zinc-800 disabled:text-zinc-500",disabled:h,children:h?e.jsx(G,{size:16,className:"text-black"}):"Launch"})]}),e.jsxs("div",{className:"mt-8 pt-8 border-t border-zinc-900 space-y-5",children:[e.jsxs("label",{className:"flex items-center gap-4 cursor-pointer group",children:[e.jsx("input",{type:"checkbox",checked:m,onChange:o=>l(o.target.checked),className:"form-checkbox h-4 w-4 bg-black border border-zinc-900 rounded-none checked:bg-white checked:border-white focus:ring-0 focus:ring-offset-0 transition-all"}),e.jsx("span",{className:"text-[10px] font-bold text-zinc-600 uppercase tracking-widest group-hover:text-white transition-colors",children:"Synchronize Nexus Repository"})]}),m&&e.jsxs("label",{className:"flex items-center gap-4 cursor-pointer group pl-8",children:[e.jsx("input",{type:"checkbox",checked:u,onChange:o=>x(o.target.checked),className:"form-checkbox h-4 w-4 bg-black border border-zinc-900 rounded-none checked:bg-white checked:border-white focus:ring-0 focus:ring-offset-0 transition-all"}),e.jsx("span",{className:"text-[10px] font-bold text-zinc-700 uppercase tracking-widest group-hover:text-zinc-400 transition-colors",children:"Encrypted Fragment Protocol"})]})]})]})},ke=({component:s})=>s.logoUrl?e.jsx("div",{className:"w-7 h-7 bg-zinc-950 flex items-center justify-center p-1.5 border border-zinc-900 shrink-0 rounded-md",children:e.jsx("img",{src:s.logoUrl,alt:`${s.name} logo`,className:"w-full h-full object-contain filter grayscale invert brightness-200"})}):e.jsx(se,{framework:s.name,size:"small"}),ze=({workflow:s,onDeploy:t})=>{const[i,a]=c.useState(!1);return e.jsxs("div",{className:"bg-black border border-zinc-900 p-8 transition-all duration-500 hover:bg-zinc-950 flex flex-col text-left h-full",children:[e.jsxs("div",{className:"mb-6",children:[e.jsx("div",{className:"flex items-center gap-2",children:s.components.map((r,n)=>e.jsxs(Z.Fragment,{children:[e.jsx(ke,{component:r}),n<s.components.length-1&&e.jsx("span",{className:"text-zinc-700 text-lg font-bold",children:"+"})]},n))}),e.jsx("h3",{className:"font-bold text-white tracking-tighter leading-tight mt-6 text-lg",children:s.name})]}),e.jsx("div",{className:"flex-grow mb-8",children:e.jsx("p",{className:"text-sm text-zinc-500 font-medium leading-relaxed",children:s.description})}),e.jsx("div",{className:"mt-auto pt-6 border-t border-zinc-900",children:i?e.jsx("div",{className:"animate-in fade-in slide-in-from-bottom-2",children:e.jsx(Ne,{defaultName:s.name.replace(/ /g,"-").toLowerCase(),onDeploy:r=>{t(s,r),a(!1)},onCancel:()=>a(!1)})}):e.jsx("button",{onClick:()=>a(!0),className:"w-full h-10 text-[11px] bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all rounded-md",children:"Deploy Workflow"})})]})},Se=({onDeployWorkflow:s})=>{const t=z();return e.jsxs("div",{className:"max-w-7xl mx-auto py-10",children:[e.jsxs("button",{onClick:()=>t("/void/new"),className:"group flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-white mb-12 transition-all",children:[e.jsx("span",{className:"group-hover:-translate-x-1 transition-transform",children:"←"}),"Genesis Options"]}),e.jsx("h2",{className:"text-3xl font-bold text-white tracking-tighter mb-10",children:"Mesh Architectures"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1",children:te.map(i=>e.jsx(ze,{workflow:i,onDeploy:s},i.id))})]})},Ce=()=>e.jsx("div",{className:"fixed inset-0 z-[60] bg-black",children:e.jsx(ie,{})}),Pe=[{id:"tmpl_portfolio",name:"Portfolio Website",framework:"HTML/CSS/JS",description:"Stunning portfolio to showcase your creative work. Perfect for designers, photographers, and artists.",author:"opendev-labs",imageUrl:"https://skillicons.dev/icons?i=html,css,js&theme=dark",previewUrl:"https://opendev-labs.github.io/templates/portfolio",features:["Responsive gallery","Contact form","About section","Project showcase"],category:"Creative"},{id:"tmpl_ecommerce",name:"E-Commerce Store",framework:"Next.js",description:"Complete online store with product listings, cart, and checkout. Start selling in minutes.",author:"opendev-labs",imageUrl:"https://skillicons.dev/icons?i=nextjs,tailwind&theme=dark",previewUrl:"https://opendev-labs.github.io/templates/ecommerce",features:["Product catalog","Shopping cart","Checkout flow","Admin dashboard"],category:"Business"},{id:"tmpl_saas_landing",name:"SaaS Landing Page",framework:"React",description:"High-converting landing page for your software product. Built for maximum conversions.",author:"opendev-labs",imageUrl:"https://skillicons.dev/icons?i=react,vite&theme=dark",previewUrl:"https://opendev-labs.github.io/templates/saas",features:["Hero section","Pricing table","Features showcase","CTA buttons"],category:"Marketing"},{id:"tmpl_agency",name:"Agency Website",framework:"Astro",description:"Professional website for digital agencies and creative studios. Showcase your services and portfolio.",author:"opendev-labs",imageUrl:"https://skillicons.dev/icons?i=astro,tailwind&theme=dark",features:["Services page","Team profiles","Case studies","Client testimonials"],category:"Business"},{id:"tmpl_restaurant",name:"Restaurant/Cafe",framework:"HTML/CSS/JS",description:"Appetizing website for restaurants and cafes. Menu display, reservations, and location.",author:"opendev-labs",imageUrl:"https://skillicons.dev/icons?i=html,css&theme=dark",features:["Digital menu","Reservation system","Gallery","Contact & hours"],category:"Local Business"},{id:"tmpl_realestate",name:"Real Estate",framework:"Next.js",description:"Property listing website. Showcase homes, condos, and commercial properties with style.",author:"opendev-labs",imageUrl:"https://skillicons.dev/icons?i=nextjs,postgres&theme=dark",features:["Property listings","Search & filter","Agent profiles","Virtual tours"],category:"Business"},{id:"tmpl_blog",name:"Blog/Magazine",framework:"Astro",description:"Content publishing platform. Perfect for bloggers, journalists, and content creators.",author:"opendev-labs",imageUrl:"https://skillicons.dev/icons?i=astro,md&theme=dark",features:["Article management","Categories & tags","Author pages","RSS feed"],category:"Publishing"},{id:"tmpl_startup",name:"Startup Landing",framework:"React",description:"Launch your startup MVP. Clean, modern design optimized for early-stage companies.",author:"opendev-labs",imageUrl:"https://skillicons.dev/icons?i=react,tailwind&theme=dark",features:["Product demo","Waitlist signup","Feature highlights","Investor deck"],category:"Startup"},{id:"tmpl_personal_brand",name:"Personal Brand",framework:"HTML/CSS/JS",description:"Build your personal brand. Perfect for creators, influencers, and thought leaders.",author:"opendev-labs",imageUrl:"https://skillicons.dev/icons?i=html,js&theme=dark",features:["Bio & story","Social links","Content hub","Newsletter signup"],category:"Personal"},{id:"tmpl_custom",name:"Custom Blank",framework:"Custom",description:"Start from scratch. Build exactly what you need with a clean, minimal foundation.",author:"opendev-labs",imageUrl:"https://skillicons.dev/icons?i=html,css,js&theme=dark",features:["Blank canvas","Basic structure","Modern tooling","Full flexibility"],category:"Custom"}];class Re{static generatePortfolio(t){return{files:{"index.html":`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t} - Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="logo">${t}</div>
            <ul class="nav-links">
                <li><a href="#work">Work</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <section class="hero">
        <div class="container">
            <h1>Creative Portfolio</h1>
            <p>Showcasing Photography & Design Excellence</p>
        </div>
    </section>

    <section id="work" class="work">
        <div class="container">
            <h2>Selected Work</h2>
            <div class="project-grid">
                <div class="project-card">
                    <div class="project-image"></div>
                    <h3>Project 1</h3>
                    <p>Photography</p>
                </div>
                <div class="project-card">
                    <div class="project-image"></div>
                    <h3>Project 2</h3>
                    <p>Design</p>
                </div>
                <div class="project-card">
                    <div class="project-image"></div>
                    <h3>Project 3</h3>
                    <p>Branding</p>
                </div>
            </div>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2>About</h2>
            <p>I'm a creative professional specializing in photography and design.</p>
        </div>
    </section>

    <section id="contact" class="contact">
        <div class="container">
            <h2>Get In Touch</h2>
            <form class="contact-form">
                <input type="text" placeholder="Name" required>
                <input type="email" placeholder="Email" required>
                <textarea placeholder="Message" required></textarea>
                <button type="submit">Send Message</button>
            </form>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2026 ${t}. Built with OpenDev Labs.</p>
        </div>
    </footer>
</body>
</html>`,"style.css":`* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: #000;
    color: #fff;
    line-height: 1.6;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.navbar {
    padding: 20px 0;
    border-bottom: 1px solid #222;
}

.navbar .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 24px;
    font-weight: bold;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 30px;
}

.nav-links a {
    color: #999;
    text-decoration: none;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: #fff;
}

.hero {
    padding: 120px 0;
    text-align: center;
}

.hero h1 {
    font-size: 72px;
    font-weight: bold;
    margin-bottom: 20px;
}

.hero p {
    font-size: 20px;
    color: #999;
}

.work {
    padding: 80px 0;
}

.work h2 {
    font-size: 36px;
    margin-bottom: 40px;
}

.project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.project-card {
    background: #111;
    border: 1px solid #222;
    padding: 20px;
    transition: transform 0.3s, border-color 0.3s;
}

.project-card:hover {
    transform: translateY(-5px);
    border-color: #fff;
}

.project-image {
    width: 100%;
    height: 200px;
    background: #222;
    margin-bottom: 15px;
}

.project-card h3 {
    font-size: 20px;
    margin-bottom: 5px;
}

.project-card p {
    color: #999;
    font-size: 14px;
}

.about, .contact {
    padding: 80px 0;
    text-align: center;
}

.about h2, .contact h2 {
    font-size: 36px;
    margin-bottom: 20px;
}

.about p {
    font-size: 18px;
    color: #999;
    max-width: 600px;
    margin: 0 auto;
}

.contact-form {
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.contact-form input,
.contact-form textarea {
    padding: 15px;
    background: #111;
    border: 1px solid #222;
    color: #fff;
    font-size: 16px;
}

.contact-form textarea {
    min-height: 150px;
    resize: vertical;
}

.contact-form button {
    padding: 15px;
    background: #fff;
    color: #000;
    border: none;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s;
}

.contact-form button:hover {
    background: #ddd;
}

footer {
    padding: 40px 0;
    border-top: 1px solid #222;
    text-align: center;
    color: #666;
    font-size: 14px;
}

@media (max-width: 768px) {
    .hero h1 {
        font-size: 48px;
    }
    
    .navbar .container {
        flex-direction: column;
        gap: 20px;
    }
    
    .project-grid {
        grid-template-columns: 1fr;
    }
}`},readme:`# ${t}

A modern, minimal portfolio website built with OpenDev Labs.

## Features
- Responsive design
- Project showcase grid
- Contact form
- Clean, modern aesthetic

## Deploy
- **Vercel**: \`vercel --prod\`
- **GitHub Pages**: Push to \`gh-pages\` branch
- **Firebase**: \`firebase deploy\`

Built with ❤️ using OpenDev Labs
`}}static generateTemplate(t,i){return t==="tmpl_portfolio"?this.generatePortfolio(i):this.generatePortfolio(i)}}class Te{async deployTemplate(t){try{const i=Re.generateTemplate(t.templateId,t.projectName),a=Object.entries(i.files).map(([r,n])=>({path:r,content:n}));switch(a.push({path:"README.md",content:i.readme}),t.platform){case"github":return await this.deployToGitHub(t.projectName,a,t.isPrivate);case"vercel":return await this.deployToVercel(t.projectName,a,t.isPrivate);case"firebase":return await this.deployToFirebase(t.projectName,a,t.isPrivate);case"huggingface":return await this.deployToHuggingFace(t.projectName,a,t.isPrivate);case"syncstack":return await this.deployToSyncStack(t.projectName,a,t.isPrivate);default:throw new Error(`Unsupported platform: ${t.platform}`)}}catch(i){return console.error("Deployment error:",i),{success:!1,error:i instanceof Error?i.message:"Unknown deployment error"}}}async deployToGitHub(t,i,a){const r=await U.deployToGitHubPages(t,i,`${t} - Created with OpenDev Labs`,a||!1);return{success:!0,repoUrl:r.repoUrl,liveUrl:r.pagesUrl}}async deployToVercel(t,i,a){return{success:!0,repoUrl:`https://github.com/user/${t}`,liveUrl:`https://${t}.vercel.app`,error:"Vercel deployment coming soon! For now, please deploy via GitHub first, then import to Vercel."}}async deployToFirebase(t,i,a){return{success:!0,repoUrl:`https://github.com/user/${t}`,liveUrl:`https://${t}.web.app`,error:"Firebase deployment coming soon! For now, please deploy via GitHub first, then use Firebase CLI."}}async deployToHuggingFace(t,i,a){return{success:!0,repoUrl:`https://huggingface.co/spaces/user/${t}`,liveUrl:`https://${t}.hf.space`,error:"HuggingFace deployment coming soon! For now, please deploy via GitHub first, then push to HF Spaces."}}isPATConfigured(){return!!U.getPAT()}async deployToSyncStack(t,i,a){try{return console.log(`SyncStack: Deploying ${t} to OpenDev Mesh...`),await new Promise(r=>setTimeout(r,3e3)),{success:!0,liveUrl:`https://${t.toLowerCase().replace(/[^a-z0-9-]/g,"-")}.opendev.app`}}catch(r){return{success:!1,error:r instanceof Error?r.message:"SyncStack deployment failed"}}}async convertSyncStackKey(t){return console.log("Converting SyncStack key to service-specific keys..."),await new Promise(i=>setTimeout(i,1e3)),{voidKey:`void_${t.substring(0,8)}_${Math.random().toString(36).substring(7)}`,lamaDBKey:`lamadb_${t.substring(0,8)}_${Math.random().toString(36).substring(7)}`}}}const F=new Te,De=()=>e.jsx("div",{className:"absolute inset-0 z-0 overflow-hidden pointer-events-none",children:e.jsx("div",{className:"absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full"})}),Ie=()=>{const s=[{name:"Portfolio",emoji:"🎨"},{name:"E-Commerce",emoji:"🛒"},{name:"SaaS",emoji:"💼"},{name:"Agency",emoji:"🏢"},{name:"Restaurant",emoji:"🍽️"},{name:"Real Estate",emoji:"🏘️"},{name:"Blog",emoji:"📝"},{name:"Startup",emoji:"🚀"},{name:"Personal",emoji:"👤"},{name:"Custom",emoji:"⚡"}];return e.jsxs("div",{className:"py-24 border-y border-zinc-900 overflow-hidden bg-zinc-950/20 backdrop-blur-3xl",children:[e.jsx("p",{className:"text-[10px] font-bold tracking-[0.4em] text-zinc-600 mb-16 uppercase text-center",children:"Professional Templates for Every Business"}),e.jsx("div",{className:"relative flex overflow-x-hidden",children:e.jsx("div",{className:"py-12 animate-marquee flex whitespace-nowrap gap-20",children:s.concat(s).map((t,i)=>e.jsxs("div",{className:"flex items-center gap-4 group",children:[e.jsx("span",{className:"text-3xl grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110",children:t.emoji}),e.jsx("span",{className:"text-zinc-600 group-hover:text-white font-bold text-xs uppercase tracking-[0.2em] transition-colors",children:t.name})]},`${t.name}-${i}`))})})]})},S=({icon:s,title:t,children:i})=>e.jsx(f.div,{whileHover:{scale:1.02},className:"group p-8 border border-zinc-900 transition-all hover:bg-zinc-950 duration-500 relative overflow-hidden h-full",children:e.jsxs("div",{className:"relative z-10",children:[e.jsx("div",{className:"w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 text-emerald-500 rounded mb-6 group-hover:border-emerald-500/30 transition-colors",children:s}),e.jsx("h3",{className:"text-lg font-bold text-white mb-3 tracking-tight",children:t}),e.jsx("p",{className:"text-zinc-500 text-sm font-medium leading-relaxed",children:i})]})}),Ue=({onDeployTemplate:s})=>{const t=z(),[i,a]=c.useState(!1),[r,n]=c.useState(null),m=async(l,u,x,h)=>{if(x==="github"&&!F.isPATConfigured()){alert("Please configure your GitHub PAT in the Import page first!"),t("/void/new/import");return}a(!0),n(`Generating ${l.name} code...`);try{const d=await F.deployTemplate({templateId:l.id,projectName:u,platform:x,isPrivate:h});d.success?(n(`✅ Deployed to ${x.toUpperCase()}! Live at: ${d.liveUrl}`),setTimeout(()=>{d.liveUrl&&window.open(d.liveUrl,"_blank")},2e3)):n(`❌ Error: ${d.error}`)}catch(d){n(`❌ Deployment failed: ${d instanceof Error?d.message:"Unknown error"}`)}finally{a(!1),setTimeout(()=>n(null),5e3)}};return e.jsxs("div",{className:"relative overflow-hidden bg-black -mx-4 -mt-8 pt-20",children:[e.jsx(De,{}),e.jsxs("div",{className:"relative z-10 container mx-auto px-6",children:[e.jsxs(f.button,{initial:{opacity:0},animate:{opacity:1},onClick:()=>t("/void/new"),className:"group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white mb-10 transition-all duration-300",children:[e.jsx("span",{className:"group-hover:-translate-x-2 transition-transform duration-300",children:"←"}),"Neural Genesis Options"]}),e.jsx("div",{className:"min-h-[60vh] flex flex-col justify-center py-20",children:e.jsxs(f.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.8},className:"max-w-4xl mx-auto text-center",children:[e.jsxs("span",{className:"inline-flex items-center gap-2 px-3 py-1 rounded-none bg-zinc-900 border border-zinc-800 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-8 select-none",children:[e.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"}),"Global Edge Infrastructure"]}),e.jsxs("h1",{className:"text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white leading-[0.85] mb-10",children:["Sync ",e.jsx("br",{}),e.jsx("span",{className:"text-emerald-500 italic font-serif",children:"Hosting."})]}),e.jsxs("p",{className:"max-w-xl mx-auto text-lg text-zinc-500 leading-relaxed font-medium mb-12",children:["Deploy any template to OpenDev's high-performance static hosting via SyncStack. Zero configuration. Instant global CDN. ",e.jsx("span",{className:"text-emerald-500 font-bold",children:"100% Free."})]})]})}),e.jsx(Ie,{}),e.jsxs("div",{className:"py-32 max-w-[1200px] mx-auto",children:[e.jsx("p",{className:"text-[10px] font-bold tracking-[0.4em] text-zinc-600 mb-16 uppercase text-center",children:"Production-Grade Infrastructure"}),e.jsxs("div",{className:"grid md:grid-cols-2 lg:grid-cols-4 gap-1",children:[e.jsx(S,{icon:e.jsx($,{size:20}),title:"Lightning Fast",children:"Global CDN with edge caching for instant load times worldwide. Sub-100ms response times."}),e.jsx(S,{icon:e.jsx(ae,{size:20}),title:"Secure by Default",children:"Free SSL certificates and automatic HTTPS for all deployments. Enterprise-grade security."}),e.jsx(S,{icon:e.jsx(de,{size:20}),title:"Unlimited Sites",children:"Deploy as many projects as you want. No limits, no hidden fees, no credit card required."}),e.jsx(S,{icon:e.jsx(J,{size:20}),title:"99.9% Uptime",children:"Powered by multi-region architecture with automatic failover and redundancy."})]})]}),e.jsxs("div",{className:"py-20",children:[e.jsxs("div",{className:"mb-16 text-center",children:[e.jsx("p",{className:"text-[10px] font-bold tracking-[0.4em] text-zinc-600 mb-4 uppercase",children:"Choose Your Template"}),e.jsxs("h2",{className:"text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-6",children:["SyncStack ",e.jsx("span",{className:"text-emerald-500",children:"Managed Nodes."})]}),e.jsx("p",{className:"max-w-2xl mx-auto text-zinc-500 text-sm font-medium",children:"Select a template below. SyncStack will automatically provision a GitHub repository and deploy it to our global edge mesh. These repositories are managed locally and synced in real-time."})]}),r&&e.jsx(f.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},className:"mb-8 p-6 bg-zinc-950 border border-emerald-500/30 text-center",children:e.jsx("p",{className:"text-sm font-bold text-white",children:r})}),e.jsx("div",{className:"grid md:grid-cols-2 lg:grid-cols-3 gap-6",children:Pe.map(l=>e.jsx(H,{template:l,onDeploy:m},l.id))})]}),e.jsxs("div",{className:"py-32 text-center border-t border-zinc-900",children:[e.jsx("p",{className:"text-zinc-600 text-sm font-medium mb-6",children:"Need a custom solution? Our agents can build anything."}),e.jsx("button",{onClick:()=>t("/void/new/sub0"),className:"h-12 px-10 rounded-none bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2",children:"Talk to sub0"})]})]})]})},He=({onDeployTemplate:s,onImportRepository:t,onDeployWorkflow:i})=>{const a=window.location.pathname.includes("/sub0");return e.jsxs("div",{className:a?"h-full":"pb-32 px-6",children:[e.jsxs(X,{children:[e.jsx(N,{index:!0,element:e.jsx(he,{})}),e.jsx(N,{path:"import",element:e.jsx(be,{onImportRepository:t})}),e.jsx(N,{path:"templates",element:e.jsx(ye,{onDeployTemplate:s})}),e.jsx(N,{path:"mesh",element:e.jsx(Se,{onDeployWorkflow:i})}),e.jsx(N,{path:"sub0",element:e.jsx(Ce,{})}),e.jsx(N,{path:"hosting",element:e.jsx(Ue,{onDeployTemplate:s})})]}),e.jsx(Q,{})]})};export{He as NewProjectPage};
