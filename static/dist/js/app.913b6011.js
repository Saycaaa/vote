(function(t){function e(e){for(var a,r,n=e[0],i=e[1],c=e[2],u=0,p=[];u<n.length;u++)r=n[u],Object.prototype.hasOwnProperty.call(o,r)&&o[r]&&p.push(o[r][0]),o[r]=0;for(a in i)Object.prototype.hasOwnProperty.call(i,a)&&(t[a]=i[a]);v&&v(e);while(p.length)p.shift()();return s.push.apply(s,c||[]),l()}function l(){for(var t,e=0;e<s.length;e++){for(var l=s[e],a=!0,r=1;r<l.length;r++){var i=l[r];0!==o[i]&&(a=!1)}a&&(s.splice(e--,1),t=n(n.s=l[0]))}return t}var a={},o={app:0},s=[];function r(t){return n.p+"js/"+({about:"about"}[t]||t)+"."+{about:"d83cb903"}[t]+".js"}function n(e){if(a[e])return a[e].exports;var l=a[e]={i:e,l:!1,exports:{}};return t[e].call(l.exports,l,l.exports,n),l.l=!0,l.exports}n.e=function(t){var e=[],l=o[t];if(0!==l)if(l)e.push(l[2]);else{var a=new Promise((function(e,a){l=o[t]=[e,a]}));e.push(l[2]=a);var s,i=document.createElement("script");i.charset="utf-8",i.timeout=120,n.nc&&i.setAttribute("nonce",n.nc),i.src=r(t);var c=new Error;s=function(e){i.onerror=i.onload=null,clearTimeout(u);var l=o[t];if(0!==l){if(l){var a=e&&("load"===e.type?"missing":e.type),s=e&&e.target&&e.target.src;c.message="Loading chunk "+t+" failed.\n("+a+": "+s+")",c.name="ChunkLoadError",c.type=a,c.request=s,l[1](c)}o[t]=void 0}};var u=setTimeout((function(){s({type:"timeout",target:i})}),12e4);i.onerror=i.onload=s,document.head.appendChild(i)}return Promise.all(e)},n.m=t,n.c=a,n.d=function(t,e,l){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:l})},n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var l=Object.create(null);if(n.r(l),Object.defineProperty(l,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)n.d(l,a,function(e){return t[e]}.bind(null,a));return l},n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/",n.oe=function(t){throw console.error(t),t};var i=window["webpackJsonp"]=window["webpackJsonp"]||[],c=i.push.bind(i);i.push=e,i=i.slice();for(var u=0;u<i.length;u++)e(i[u]);var v=c;s.push([0,"chunk-vendors"]),l()})({0:function(t,e,l){t.exports=l("56d7")},"034f":function(t,e,l){"use strict";var a=l("85ec"),o=l.n(a);o.a},"46cd":function(t,e,l){},"56d7":function(t,e,l){"use strict";l.r(e);l("e260"),l("e6cf"),l("cca6"),l("a79d");var a=l("2b0e"),o=l("5c96"),s=l.n(o),r=(l("0fae"),function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("div",{attrs:{id:"app"}},[l("router-view")],1)}),n=[],i=(l("034f"),l("2877")),c={},u=Object(i["a"])(c,r,n,!1,null,null,null),v=u.exports,p=(l("d3b7"),l("8c4f")),f=function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("div",{staticClass:"home"},[l("div",{staticClass:"content"},[l("h2",[t._v("新建表决")]),l("el-form",{attrs:{size:"small"}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("标题：")]),l("el-input",{model:{value:t.vote.title,callback:function(e){t.$set(t.vote,"title",e)},expression:"vote.title"}})],1),t._l(t.vote.discussionList,(function(e,a){return l("div",{key:a},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("内容：")]),l("el-input",{attrs:{type:"textarea",rows:2,placeholder:"请输入内容"},model:{value:e.content,callback:function(l){t.$set(e,"content",l)},expression:"dis.content"}})],1),t._l(e.options,(function(e,o){return l("el-row",{key:o,attrs:{type:"flex"}},[l("el-col",{attrs:{span:16}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("选项1：")]),l("el-input",{attrs:{placeholder:"输入选项内容"},model:{value:t.vote.title,callback:function(e){t.$set(t.vote,"title",e)},expression:"vote.title"}})],1)],1),l("el-col",{attrs:{span:8}},[l("el-button",{staticClass:"remOpt",attrs:{type:"primary"},on:{click:function(e){return t.remOpt(a,o)}}},[t._v("删除选项")])],1)],1)})),l("el-row",{attrs:{type:"flex"}},[l("el-col",{attrs:{span:24}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("可选选项数")]),l("el-input-number",{attrs:{min:1,max:10},model:{value:t.num,callback:function(e){t.num=e},expression:"num"}})],1)],1)],1),l("el-row",{attrs:{type:"flex"}},[l("el-col",{attrs:{span:12}},[l("el-button",{staticClass:"remOpt",attrs:{type:"primary"},on:{click:function(e){return t.addOpt(a)}}},[t._v("新增选项")])],1),l("el-col",{attrs:{span:12}},[l("el-button",{staticClass:"remOpt",attrs:{type:"primary"},on:{click:function(e){return t.remDis(a)}}},[t._v("删除议题")])],1)],1)],2)})),l("el-row",{attrs:{type:"flex"}},[l("el-col",{attrs:{span:24}},[l("el-button",{staticClass:"remOpt",attrs:{type:"primary"},on:{click:function(e){return t.addDis()}}},[t._v("新增议题")])],1)],1),l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("表决设置")])]),l("hr"),l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("监票人员数：")]),l("el-input-number",{attrs:{min:1,max:10},model:{value:t.num,callback:function(e){t.num=e},expression:"num"}})],1),l("hr"),l("el-row",{attrs:{type:"flex"}},[l("el-col",{attrs:{span:4}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("口径设置：")])])],1),l("el-col",{attrs:{span:10}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("按股数统计")]),l("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#CCC"},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}})],1)],1),l("el-col",{attrs:{span:10}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("按票数统计")]),l("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#CCC"},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}})],1)],1)],1),l("el-row",{attrs:{type:"flex"}},[l("el-col",{attrs:{span:4}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("方式设置：")])])],1),l("el-col",{attrs:{span:10}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("占已投比例")]),l("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#CCC"},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}})],1)],1),l("el-col",{attrs:{span:10}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("占应投比例")]),l("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#CCC"},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}})],1)],1)],1),l("el-row",{attrs:{type:"flex"}},[l("el-col",{attrs:{span:4}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("查看设置：")])])],1),l("el-col",{attrs:{span:10}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("过程中查看")]),l("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#CCC"},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}})],1)],1),l("el-col",{attrs:{span:10}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("结束后查看")]),l("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#CCC"},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}})],1)],1)],1),l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("表决设置（针对监票员）")])]),l("el-row",{attrs:{type:"flex"}},[l("el-col",{attrs:{span:4}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("口径设置：")])])],1),l("el-col",{attrs:{span:10}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("按股数统计")]),l("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#CCC"},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}})],1)],1),l("el-col",{attrs:{span:10}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("按票数统计")]),l("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#CCC"},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}})],1)],1)],1),l("el-row",{attrs:{type:"flex"}},[l("el-col",{attrs:{span:4}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("方式设置：")])])],1),l("el-col",{attrs:{span:10}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("占已投比例")]),l("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#CCC"},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}})],1)],1),l("el-col",{attrs:{span:10}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("占应投比例")]),l("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#CCC"},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}})],1)],1)],1),l("el-row",{attrs:{type:"flex"}},[l("el-col",{attrs:{span:4}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("查看设置：")])])],1),l("el-col",{attrs:{span:10}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("过程中查看")]),l("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#CCC"},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}})],1)],1),l("el-col",{attrs:{span:10}},[l("el-form-item",[l("div",{staticClass:"label",attrs:{slot:"label"},slot:"label"},[t._v("结束后查看")]),l("el-switch",{attrs:{"active-color":"#13ce66","inactive-color":"#CCC"},model:{value:t.value,callback:function(e){t.value=e},expression:"value"}})],1)],1)],1),l("el-row",[l("el-col",{attrs:{span:24}},[l("el-button",{attrs:{type:"primary"}},[t._v("选择发布范围(已选参与人数120)")])],1)],1),l("el-row",[l("el-col",{attrs:{span:12}},[l("el-button",{attrs:{type:"primary"}},[t._v("保存议题")])],1),l("el-col",{attrs:{span:12}},[l("el-button",{attrs:{type:"primary"}},[t._v("暂存议题")])],1)],1)],2)],1)])},d=[],m=(l("a434"),l("9c55")),b=l("4328"),h=l.n(b),C=l("bc3a"),y=l.n(C),w={corpId:"ding989f59cf138502f135c2f4657eb6378f",domain:"http://localhost:8080"},x={confirm:function(t,e,l,a){return new Promise((function(o,s){m["ready"]((function(){m["device"].notification.confirm({message:t,title:e,buttonLabels:[l,a],onSuccess:function(t){0==t.buttonIndex?o(t):s(t)},onFail:function(t){s(t)}})}))}))},login:function(){return new Promise((function(t,e){m["ready"]((function(){m["runtime"].permission.requestAuthCode({corpId:w.corpId,onSuccess:function(e){var l=e.code;y()({method:"post",url:w.domain+"/login",data:h.a.stringify({authCode:l}),withCredentials:!0,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}}).then((function(e){t(e)}))},onFail:function(t){e(t)}})}))}))},getDept:function(t){y()({method:"post",data:h.a.stringify({pId:t}),url:w.domain+"/getDept",withCredentials:!0,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}}).then((function(t){window.console.log(t)}))}},_={name:"home",data:function(){return{num:0,value:!0,vote:{title:"",copies:0,parUser:[],totalWeight:0,alreadyWeight:0,operPerId:"",operPerName:"",monitorList:[],settingObj:{setForVoters:{kind:{weight:!0,votes:!0},way:{already:!0,should:!0},view:{inProcess:!0,afterProcess:!0}},setForMonitor:{num:3,kind:{weight:!0,votes:!0},way:{already:!0,should:!0},view:{inProcess:!0,afterProcess:!0}}},state:4,state2:0,votedUserIdList:[],discussionList:[{type:1,content:"",settingObj:{num:1},options:[{text:"",votes:0,userIds:[]},{text:"",votes:0,userIds:[]}]},{type:1,content:"",settingObj:{num:1},options:[{text:"",votes:0,userIds:[]},{text:"",votes:0,userIds:[]}]}]}}},created:function(){x.login().then((function(){x.getDept()}))},methods:{addOpt:function(t){var e={text:"新增选项",votes:0,userIds:[]};this.vote.discussionList[t].options.push(e)},remOpt:function(t,e){this.vote.discussionList[t].options.splice(e,1)},addDis:function(){var t={type:1,content:"新增表决议案",settingObj:{num:1},options:[{text:"默认选项1",votes:0,userIds:[]},{text:"默认选项2",votes:0,userIds:[]}]};this.vote.discussionList.push(t)},remDis:function(t){var e=this;x.confirm("不可逆操作！是否删除议题？","不可逆操作","确认","取消").then((function(){e.vote.discussionList.splice(t,1)}))}}},g=_,k=(l("9fb4"),Object(i["a"])(g,f,d,!1,null,"5a997bb0",null)),O=k.exports;a["default"].use(p["a"]);var j=[{path:"/",name:"addNewVote",component:O},{path:"/about",name:"about",component:function(){return l.e("about").then(l.bind(null,"f820"))}}],P=new p["a"]({routes:j}),I=P,L=l("2f62");a["default"].use(L["a"]);var T=new L["a"].Store({state:{},mutations:{},actions:{},modules:{}});a["default"].use(s.a),a["default"].config.productionTip=!1,new a["default"]({router:I,store:T,render:function(t){return t(v)}}).$mount("#app")},"85ec":function(t,e,l){},"9fb4":function(t,e,l){"use strict";var a=l("46cd"),o=l.n(a);o.a}});
//# sourceMappingURL=app.913b6011.js.map