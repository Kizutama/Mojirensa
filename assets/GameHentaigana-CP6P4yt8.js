const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/kangChecker-DCV3Bsx0.js","assets/index-CruSlUGv.js","assets/index-DTh1yn5v.css"])))=>i.map(i=>d[i]);
import{b as D,d as p,e as I,u as L,r as h,w as P,t as B,_ as H,f as O,g as E,c as d,o as c,h as V,a as g,i as b,j as y,F as T,k as w,l as v,n as F,m as R,p as j,G as K,q as N}from"./index-CruSlUGv.js";import Y from"./ScoreBoard-0Xzw2mkx.js";async function q(){const e=await fetch("/data/hentaigana_data_fixed.json"),{hentaigana_data:t}=await e.json(),u=t.sort(()=>Math.random()-.5),l=[],o=new Set;for(let a=0;a<u.length&&l.length<8;a++){const n=u[a];o.has(n.kanji)||(o.add(n.kanji),l.push(n))}return l.flatMap(a=>{const n=Math.random()<.1;return[{type:"kana",value:a.hentaigana,pairId:a.kanji,matched:!1,pairData:{...a,isTreasure:n},isTreasure:n},{type:"kanji",value:a.kanji,pairId:a.kanji,matched:!1,pairData:a}]}).sort(()=>Math.random()-.5)}function z({cards:e,firstSelected:t,secondSelected:u,selectedIndices:l,updateScore:o,refreshCards:m,resultStore:a,onYaku:n}){const r=e.value[t.value],i=e.value[u.value];if(r&&i)if(r.pairId===i.pairId&&r.type!==i.type){r.matched=!0,i.matched=!0;const f=r.type==="kana"?r.pairData:i.pairData,k=r.isTreasure||i.isTreasure;a.results.unshift({...f,isTreasure:k}),a.currentIndex=a.results.length-1,a.latestResult=a.results[a.results.length-1],o(100),k&&(a.multiplier||(a.multiplier=1),a.multiplier++,a.treasureCount++,typeof n=="function"&&n("ドラ")),r.animationClass="card-puff-out",i.animationClass="card-puff-out",setTimeout(()=>{r.removed=!0,i.removed=!0,r.animationClass="",i.animationClass="",t.value=null,u.value=null,l.value=[],D(()=>import("./kangChecker-DCV3Bsx0.js"),__vite__mapDeps([0,1,2])).then(s=>{s.checkKang()}).catch(console.error),e.value.every(s=>s.removed)&&m()},100)}else o(-10),e.value[t.value].isTreasure&&(e.value[t.value].isTreasure=!1),e.value[u.value].isTreasure&&(e.value[u.value].isTreasure=!1),e.value[t.value].error=!1,e.value[u.value].error=!1,setTimeout(()=>{e.value[t.value].error=!0,e.value[u.value].error=!0},0),setTimeout(()=>{e.value[t.value].error=!1,e.value[u.value].error=!1,l.value=l.value.filter(f=>f!==t.value&&f!==u.value),t.value=null,u.value=null},100)}let G=null;function M(e){G=e}function A(){const e=p([]),t=p(null),u=p(null),l=p([]),o=async()=>{e.value=await q(),t.value=null,u.value=null,l.value=[]},m=a=>{e.value[a].matched||e.value[a].removed||t.value!==null&&u.value!==null||(l.value.includes(a)||l.value.push(a),t.value===null?t.value=a:u.value===null&&(u.value=a,setTimeout(()=>{z({cards:e,firstSelected:t,secondSelected:u,selectedIndices:l,updateScore:L,refreshCards:o,resultStore:h,onYaku:G})},200)))};return I(()=>{o()}),{cards:e,selectedIndices:l,handleCardClick:m,refreshCards:o,setOnYakuCallback:M}}function $(){const e=p(!1);return P(B,t=>{t<=0&&(e.value=!0)}),{isGameOver:e}}const x={class:"game-container"},J={class:"grid"},Q=["onClick"],U={key:0},W={class:"yaku-popup-container"},X={__name:"GameHentaigana",setup(e){const{cards:t,selectedIndices:u,handleCardClick:l}=A(),{isGameOver:o}=$(),m=O(),a=E(),n=p([]);function r(k){const _=Date.now()+Math.random();n.value.push({id:_,text:k}),setTimeout(()=>{n.value=n.value.filter(s=>s.id!==_)},3e3)}M(r);const i=()=>{loadingScreen.value&&loadingScreen.value.showLoading&&loadingScreen.value.showLoading(),setTimeout(()=>{j.value=0,h.results=[],window.location.reload()},1e3),gameKey.value++,m.replace({path:a.fullPath})},f=()=>{N(),window.location.href="/"};return(k,_)=>(c(),d("div",x,[V(Y),g("div",J,[(c(!0),d(T,null,w(v(t),(s,C)=>(c(),d("div",{key:C,class:F(["card",["card",s.animationClass,{selected:v(u).includes(C),removed:s.removed,matched:s.matched,treasure:s.isTreasure,error:s.error}]]),onClick:Z=>v(l)(C)},[s.removed?y("",!0):(c(),d("span",U,R(s.value),1))],10,Q))),128)),g("div",W,[(c(!0),d(T,null,w(n.value,s=>(c(),d("div",{key:s.id,class:"yaku-popup"},R(s.text),1))),128))])]),v(o)?(c(),b(K,{key:0,finalScore:v(j),multiplier:v(h).multiplier,treasureCount:v(h).treasureCount,matchedResults:v(h).results,kanCards:v(h).kanCards,onReplay:i,onGoHome:f},null,8,["finalScore","multiplier","treasureCount","matchedResults","kanCards"])):y("",!0)]))}},ea=H(X,[["__scopeId","data-v-9d5e9c43"]]);export{ea as default};
