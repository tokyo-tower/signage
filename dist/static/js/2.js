webpackJsonp([2],{"5zde":function(t,e,a){a("zQR9"),a("qyJz"),t.exports=a("FeBl").Array.from},Gu7T:function(t,e,a){"use strict";e.__esModule=!0;var n,r=a("c/Tr"),s=(n=r)&&n.__esModule?n:{default:n};e.default=function(t){if(Array.isArray(t)){for(var e=0,a=Array(t.length);e<t.length;e++)a[e]=t[e];return a}return(0,s.default)(t)}},PdC8:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("Xxa5"),r=a.n(n),s=a("pFYg"),c=a.n(s),i=a("Gu7T"),u=a.n(i),o=a("exGp"),l=a.n(o),h=a("//Fk"),_=a.n(h),f=a("PJh5"),m=a("msXN");a("ORgI"),f.locale("ja");var v={data:function(){return{langArray:["ja","en","zh-hans"],currentLangIndex:0,locale:{tourNumber:{ja:"ツアーNo",en:"Tour No.","zh-hans":"游览编号"},entranceTime:{ja:"入場受付時間",en:"Entrance Time","zh-hans":"入场受理时间"},availability:{ja:"空き状況",en:"Availability","zh-hans":"可预约情况"}},ticketinfoArray:[{ticket_id:"001",price:2800,ja:{name:"大人",cap:"高校生以上"},en:{name:"Adult",cap:"16 years or over"},"zh-hans":{name:"成人",cap:"16岁以上"}},{ticket_id:"002",price:1800,ja:{name:"子供",cap:"小・中学生"},en:{name:"Junior",cap:"7 to 15 years"},"zh-hans":{name:"儿童",cap:"7～15岁"}},{ticket_id:"003",price:1200,ja:{name:"幼児",cap:"4歳以上"},en:{name:"Child",cap:"4 to 6 years"},"zh-hans":{name:"幼儿",cap:"4～6岁"}}],nearStatusArray:[],futureAvgStatusArray:[],timeoutInstance_changeLang:null,timeoutInstance_IntervalFetch:null}},computed:{currentLang:function(){return this.langArray[this.currentLangIndex]}},methods:{fetchScheduleStatus:m.a,getNextTickUnixtime:m.b,getStatusClassNameByPerformance:m.c,manipulateScheduleData:m.d,echoPrice:function(t){return"￥"+t.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1,")},updateStatus:function(){var t,e=this;return new _.a((t=l()(r.a.mark(function t(a,n){var s,i,o,l,h,_,m;return r.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,s=f().minute(0).second(0),t.next=4,e.fetchScheduleStatus({startFrom:s.toISOString(),startThrough:s.add(4,"hour").minute(59).second(59).toISOString()});case 4:i=t.sent,o=f().hour(),l=[],h=[],_={},e.manipulateScheduleData(i).forEach(function(t){try{if(f().isAfter(f(t.endDate)))return!0;-1===h.indexOf(t.hour)&&(h.push(t.hour),_[t.hour]=[]),_[t.hour].push(t),l.length<4&&l.push(t)}catch(t){return console.log(t),!0}return!0}),e.nearStatusArray=l,m=[].concat(u()(Array(4))).map(function(t,e){return e+1+o}),e.futureAvgStatusArray=m.filter(function(t){return"object"===c()(_[t])}).map(function(t){var e=!0,a=Math.floor(_[t].reduce(function(t,a){if(!a.unavailable){e=!1;var n=parseInt(a.seat_status,10);return isNaN(n)&&(n=0),t+n}return t},0)/_[t].length);return{hours:t+":00～"+("0"+(parseInt(t,10)+1)).slice(1)+":00",seat_status:a,unavailable:e,is_avg:!0}}),t.next=18;break;case 15:return t.prev=15,t.t0=t.catch(0),t.abrupt("return",n(t.t0));case 18:return t.abrupt("return",a());case 19:case"end":return t.stop()}},t,e,[[0,15]])})),function(e,a){return t.apply(this,arguments)}))},setFetchStatusDataTimeout:function(){var t=this;this.timeoutInstance_IntervalFetch=setTimeout(l()(r.a.mark(function e(){return r.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.updateStatus();case 2:t.setFetchStatusDataTimeout();case 3:case"end":return e.stop()}},e,t)})),this.getNextTickUnixtime())},setChangeLangTimeout:function(t){var e=this;this.timeoutInstance_changeLang=setTimeout(function(){e.$emit("langChanged"),e.currentLangIndex++,e.currentLangIndex>e.langArray.length-1?(e.currentLangIndex=0,e.setChangeLangTimeout(6e3)):e.setChangeLangTimeout()},t||3e3)}},created:function(){var t=this;this.$store.commit("SET_LOADINGMSG","最新の情報を取得中..."),this.updateStatus().then(function(){t.$store.commit("CLEAR_LOADINGMSG"),t.setFetchStatusDataTimeout(),t.setChangeLangTimeout(6e3)})},beforeDestroy:function(){clearTimeout(this.timeoutInstance_IntervalFetch),clearTimeout(this.timeoutInstance_changeLang)}},d={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{class:["container","container-ticketstatus","lang-"+t.currentLang,{onerror:t.$store.state.errorMsgStr}]},[t.$store.state.errorMsgStr?a("errorOneline",{attrs:{errorMsgStr:"通信エラーが発生しています "+t.$store.state.errorMsgStr}}):t._e(),t._v(" "),t._m(0),t._v(" "),a("div",{staticClass:"area area-schedule"},[t._m(1),t._v(" "),a("table",{staticClass:"table-main"},[t._m(2),t._v(" "),a("tbody",t._l(t.nearStatusArray,function(e){return a("tr",{key:e.id,class:["item",t.getStatusClassNameByPerformance(t.$store.state.moment,e,10)]},[a("td",[t._v(t._s(e.tour_number))]),t._v(" "),a("td",{staticClass:"time"},[t._v(t._s(e.start_time)+" ～ "+t._s(e.end_time))]),t._v(" "),a("td",{staticClass:"wrapper-status"},[a("span",{staticClass:"status"},[t._v(t._s(e.seat_status))])])])})),t._v(" "),a("tfoot",[a("tr",[a("td",{attrs:{colspan:"3"}},t._l(t.futureAvgStatusArray,function(e,n){return a("div",{key:n,class:["houritem",t.getStatusClassNameByPerformance(t.$store.state.moment,e)]},[a("p",{staticClass:"hours"},[t._v(t._s(e.hours))]),t._v(" "),a("div",{staticClass:"wrapper-status"},[a("p",{staticClass:"status"},[t._v(t._s(e.seat_status))])])])}))])])])])],1)},staticRenderFns:[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"area area-info"},[a("div",{staticClass:"mainvisual"},[a("p",[a("shine-icon",{attrs:{targetEvent:"langChanged"}})],1)]),t._v(" "),a("div",{staticClass:"prices"},t._l(t.ticketinfoArray,function(e){return a("section",{key:e.ticket_id},[a("div",[a("h2",[t._l(t.langArray,function(n){return a("span",{key:"ticketname_"+n,class:"langcontent langcontent-"+n},[t._v(t._s(e[n].name))])}),t._v(" "),a("span",{staticClass:"cap"},t._l(t.langArray,function(n){return a("span",{key:"ticketcap_"+n,class:"langcontent langcontent-"+n},[t._v(t._s(e[n].cap))])}))],2),t._v(" "),a("p",[t._v(t._s(t.echoPrice(e.price)))])])])}))])},function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"header"},[e("span",{staticClass:"tdt"},[this._v("Top Deck Tour")]),this._v(" "),e("span",{staticClass:"separator"}),this._v(" "),e("clock",{staticClass:"iconBefore icon-clock"})],1)},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("thead",[a("tr",[a("th",t._l(t.langArray,function(e){return a("span",{key:"tourNumber_"+e,class:"langcontent langcontent-"+e},[t._v(t._s(t.locale.tourNumber[e]))])})),t._v(" "),a("th",{staticClass:"time"},t._l(t.langArray,function(e){return a("span",{key:"entranceTime_"+e,class:"langcontent langcontent-"+e},[t._v(t._s(t.locale.entranceTime[e]))])})),t._v(" "),a("th",t._l(t.langArray,function(e){return a("span",{key:"availability_"+e,class:"langcontent langcontent-"+e},[t._v(t._s(t.locale.availability[e]))])}))])])}]};var g=a("VU/8")(v,d,!1,function(t){a("uhZ8")},null,null);e.default=g.exports},"c/Tr":function(t,e,a){t.exports={default:a("5zde"),__esModule:!0}},fBQ2:function(t,e,a){"use strict";var n=a("evD5"),r=a("X8DO");t.exports=function(t,e,a){e in t?n.f(t,e,r(0,a)):t[e]=a}},qyJz:function(t,e,a){"use strict";var n=a("+ZMJ"),r=a("kM2E"),s=a("sB3e"),c=a("msXi"),i=a("Mhyx"),u=a("QRG4"),o=a("fBQ2"),l=a("3fs2");r(r.S+r.F*!a("dY0y")(function(t){Array.from(t)}),"Array",{from:function(t){var e,a,r,h,_=s(t),f="function"==typeof this?this:Array,m=arguments.length,v=m>1?arguments[1]:void 0,d=void 0!==v,g=0,p=l(_);if(d&&(v=n(v,m>2?arguments[2]:void 0,2)),void 0==p||f==Array&&i(p))for(a=new f(e=u(_.length));e>g;g++)o(a,g,d?v(_[g],g):_[g]);else for(h=p.call(_),a=new f;!(r=h.next()).done;g++)o(a,g,d?c(h,v,[r.value,g],!0):r.value);return a.length=g,a}})},uhZ8:function(t,e){}});