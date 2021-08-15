(function(e){function t(t){for(var r,o,u=t[0],i=t[1],l=t[2],s=0,p=[];s<u.length;s++)o=u[s],Object.prototype.hasOwnProperty.call(n,o)&&n[o]&&p.push(n[o][0]),n[o]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(e[r]=i[r]);d&&d(t);while(p.length)p.shift()();return c.push.apply(c,l||[]),a()}function a(){for(var e,t=0;t<c.length;t++){for(var a=c[t],r=!0,o=1;o<a.length;o++){var i=a[o];0!==n[i]&&(r=!1)}r&&(c.splice(t--,1),e=u(u.s=a[0]))}return e}var r={},n={app:0},c=[];function o(e){return u.p+"js/"+({about:"about"}[e]||e)+"."+{about:"331ff43b"}[e]+".js"}function u(t){if(r[t])return r[t].exports;var a=r[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,u),a.l=!0,a.exports}u.e=function(e){var t=[],a=n[e];if(0!==a)if(a)t.push(a[2]);else{var r=new Promise((function(t,r){a=n[e]=[t,r]}));t.push(a[2]=r);var c,i=document.createElement("script");i.charset="utf-8",i.timeout=120,u.nc&&i.setAttribute("nonce",u.nc),i.src=o(e);var l=new Error;c=function(t){i.onerror=i.onload=null,clearTimeout(s);var a=n[e];if(0!==a){if(a){var r=t&&("load"===t.type?"missing":t.type),c=t&&t.target&&t.target.src;l.message="Loading chunk "+e+" failed.\n("+r+": "+c+")",l.name="ChunkLoadError",l.type=r,l.request=c,a[1](l)}n[e]=void 0}};var s=setTimeout((function(){c({type:"timeout",target:i})}),12e4);i.onerror=i.onload=c,document.head.appendChild(i)}return Promise.all(t)},u.m=e,u.c=r,u.d=function(e,t,a){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(u.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)u.d(a,r,function(t){return e[t]}.bind(null,r));return a},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="/",u.oe=function(e){throw console.error(e),e};var i=window["webpackJsonp"]=window["webpackJsonp"]||[],l=i.push.bind(i);i.push=t,i=i.slice();for(var s=0;s<i.length;s++)t(i[s]);var d=l;c.push([0,"chunk-vendors"]),a()})({0:function(e,t,a){e.exports=a("cd49")},"078c":function(e,t,a){"use strict";a("7a5c")},"669d":function(e,t,a){},"7a5c":function(e,t,a){},"9db0":function(e,t,a){},a227:function(e,t,a){"use strict";a("9db0")},cd49:function(e,t,a){"use strict";a.r(t);a("e260"),a("e6cf"),a("cca6"),a("a79d");var r=a("7a23"),n=a("3835"),c=a("1da1"),o=(a("96cf"),a("b0c0"),a("a1e9")),u=a("6c02");Object(r["u"])("data-v-32d44e7a");var i={class:"flex justify-center gap-2 p-8"};Object(r["s"])();var l=Object(r["j"])({setup:function(e){var t=Object(u["c"])(),a=Object(o["c"])((function(){return t.getRoutes()}));return function(e,t){var n=Object(r["y"])("router-link");return Object(r["r"])(),Object(r["e"])("div",i,[(Object(r["r"])(!0),Object(r["e"])(r["a"],null,Object(r["x"])(Object(r["B"])(a),(function(e){return Object(r["r"])(),Object(r["d"])(n,{key:e.path,to:e.path},{default:Object(r["E"])((function(){return[Object(r["h"])(Object(r["A"])(e.name),1)]})),_:2},1032,["to"])})),128))])}}});a("078c");l.__scopeId="data-v-32d44e7a";var s,d,p,v,b,f,j=l,h=a("ade3"),g=a("5530"),T=(a("d81d"),a("a4d3"),a("e01a"),a("d3b7"),a("5502")),O=a("bc3a"),m=a.n(O),_=m.a.create({baseURL:"/api"});(function(e){e["SET_DATA"]="SET_DATA",e["SET_STATUS"]="SET_STATUS"})(s||(s={})),function(e){e["INITIALIZE_DATA"]="INITIALIZE_DATA",e["UPDATE_DATA"]="UPDATE_DATA"}(d||(d={})),function(e){e["GET_ALL"]="GET_ALL",e["GET_BY_ID"]="GET_BY_ID",e["GET_STATUS"]="GET_STATUS"}(p||(p={})),function(e){e["LOADING"]="LOADING",e["SUCCESS"]="SUCCESS",e["IDLE"]="IDLE"}(v||(v={}));var A={namespaced:!0,state:{data:[],status:v.IDLE},mutations:(b={},Object(h["a"])(b,s.SET_DATA,(function(e,t){e.data=t})),Object(h["a"])(b,s.SET_STATUS,(function(e,t){e.status=t})),b),actions:Object(h["a"])({},d.INITIALIZE_DATA,(function(e){return Object(c["a"])(regeneratorRuntime.mark((function t(){var a,r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return a=e.commit,a(s.SET_STATUS,v.LOADING),t.next=4,_.get("/people");case 4:r=t.sent,a(s.SET_DATA,r.data),a(s.SET_STATUS,v.SUCCESS);case 7:case"end":return t.stop()}}),t)})))()})),getters:(f={},Object(h["a"])(f,p.GET_ALL,(function(e){return e.data})),Object(h["a"])(f,p.GET_STATUS,(function(e){return e.status})),f)},S=A,E=Symbol(),I=Object(T["a"])({modules:{person:S}});function y(){return Object(T["b"])(E)}var k=function(){var e,t="person/",a=y(),r=function(){var e=a.getters[t+p.GET_ALL];return e.map((function(e){return Object(g["a"])(Object(g["a"])({},e),{},{jobTitle:e.jobTitle.name})}))},n=function(){return a.getters[t+p.GET_STATUS]},c=function(){return a.dispatch(t+d.INITIALIZE_DATA)};return e={},Object(h["a"])(e,p.GET_ALL,r),Object(h["a"])(e,p.GET_STATUS,n),Object(h["a"])(e,d.INITIALIZE_DATA,c),e},L=k,w=Object(r["j"])({setup:function(e){return Object(c["a"])(regeneratorRuntime.mark((function e(){var t,a,c,o,u;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return u=L(),u.GET_STATUS(),v.IDLE,t=Object(r["D"])((function(){return u.INITIALIZE_DATA()})),a=Object(n["a"])(t,2),c=a[0],o=a[1],e.next=5,c;case 5:return c=e.sent,o(),e.abrupt("return",(function(e,t){var a=Object(r["y"])("router-view");return Object(r["r"])(),Object(r["e"])(r["a"],null,[Object(r["i"])(j),Object(r["i"])(a)],64)}));case 8:case"end":return e.stop()}}),e)})))()}}),D=(a("fc02"),w),x=(a("3ca3"),a("ddb0"),a("cf05")),U=a.n(x),G={class:"home"},C=Object(r["f"])("img",{alt:"Vue logo",src:U.a},null,-1);function P(e,t,a,n,c,o){var u=Object(r["y"])("HelloWorld");return Object(r["r"])(),Object(r["e"])("div",G,[C,Object(r["i"])(u,{msg:"Welcome to Your Vue.js + TypeScript App"})])}Object(r["u"])("data-v-2d6a9ce7");var N={class:"hello"},R=Object(r["g"])('<p data-v-2d6a9ce7> For a guide and recipes on how to configure / customize this project,<br data-v-2d6a9ce7> check out the <a href="https://cli.vuejs.org" target="_blank" rel="noopener" data-v-2d6a9ce7>vue-cli documentation</a>. </p><h3 data-v-2d6a9ce7>Installed CLI Plugins</h3><ul data-v-2d6a9ce7><li data-v-2d6a9ce7><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener" data-v-2d6a9ce7>babel</a></li><li data-v-2d6a9ce7><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-router" target="_blank" rel="noopener" data-v-2d6a9ce7>router</a></li><li data-v-2d6a9ce7><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-vuex" target="_blank" rel="noopener" data-v-2d6a9ce7>vuex</a></li><li data-v-2d6a9ce7><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript" target="_blank" rel="noopener" data-v-2d6a9ce7>typescript</a></li></ul><h3 data-v-2d6a9ce7>Essential Links</h3><ul data-v-2d6a9ce7><li data-v-2d6a9ce7><a href="https://vuejs.org" target="_blank" rel="noopener" data-v-2d6a9ce7>Core Docs</a></li><li data-v-2d6a9ce7><a href="https://forum.vuejs.org" target="_blank" rel="noopener" data-v-2d6a9ce7>Forum</a></li><li data-v-2d6a9ce7><a href="https://chat.vuejs.org" target="_blank" rel="noopener" data-v-2d6a9ce7>Community Chat</a></li><li data-v-2d6a9ce7><a href="https://twitter.com/vuejs" target="_blank" rel="noopener" data-v-2d6a9ce7>Twitter</a></li><li data-v-2d6a9ce7><a href="https://news.vuejs.org" target="_blank" rel="noopener" data-v-2d6a9ce7>News</a></li></ul><h3 data-v-2d6a9ce7>Ecosystem</h3><ul data-v-2d6a9ce7><li data-v-2d6a9ce7><a href="https://router.vuejs.org" target="_blank" rel="noopener" data-v-2d6a9ce7>vue-router</a></li><li data-v-2d6a9ce7><a href="https://vuex.vuejs.org" target="_blank" rel="noopener" data-v-2d6a9ce7>vuex</a></li><li data-v-2d6a9ce7><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener" data-v-2d6a9ce7>vue-devtools</a></li><li data-v-2d6a9ce7><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener" data-v-2d6a9ce7>vue-loader</a></li><li data-v-2d6a9ce7><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener" data-v-2d6a9ce7>awesome-vue</a></li></ul>',7);function Z(e,t,a,n,c,o){return Object(r["r"])(),Object(r["e"])("div",N,[Object(r["f"])("h1",null,Object(r["A"])(e.msg),1),R])}Object(r["s"])();var H=Object(r["j"])({name:"HelloWorld",props:{msg:String},mounted:function(){fetch("/api/people").then((function(e){return e.json()})).then((function(e){return console.log(e)}))}});a("a227");H.render=Z,H.__scopeId="data-v-2d6a9ce7";var M=H,W=Object(r["j"])({name:"Home",components:{HelloWorld:M}});W.render=P;var B=W,Y=[{path:"/",name:"Home",component:B},{path:"/about",name:"About",component:function(){return a.e("about").then(a.bind(null,"f820"))}}],F=Object(u["a"])({history:Object(u["b"])(),routes:Y}),J=F;Object(r["c"])(D).use(I,E).use(J).mount("#app")},cf05:function(e,t,a){e.exports=a.p+"img/logo.82b9c7a5.png"},fc02:function(e,t,a){"use strict";a("669d")}});
//# sourceMappingURL=app.32ba93b4.js.map