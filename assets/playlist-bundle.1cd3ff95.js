(self.webpackChunkeokoneyo_github_io=self.webpackChunkeokoneyo_github_io||[]).push([[449],{1550:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return C}});n(2222),n(7327),n(9600),n(5827),n(8309),n(1539),n(8674),n(7727);var r=n(3038),a=n.n(r),i=n(7757),s=n.n(i),c=(n(5666),n(8926)),o=n.n(c),u=n(4575),l=n.n(u),d=n(3913),h=n.n(d),f=n(1506),p=n.n(f),y=n(2205),m=n.n(y),v=n(8585),g=n.n(v),w=n(9754),E=n.n(w),k=n(9713),b=n.n(k),S=n(5091),T=n(8620),_=n(3007),P=(n(9554),n(6992),n(7941),n(8783),n(4747),n(3948),n(285),function(e){var t=e.url,n=e.method,r=void 0===n?"GET":n,a=e.body,i=e.headers,s=new XMLHttpRequest;return new Promise((function(e,n){if(s.addEventListener("readystatechange",(function(){if(this.readyState===XMLHttpRequest.DONE){var t=this.status,r=this.responseText;0===t||t>=200&&t<400?e(JSON.parse(r)):n(new Error(JSON.parse(r)))}})),s.open(r,t,!0),s.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),i&&Object.keys(i).forEach((function(e){return s.setRequestHeader(e,i[e])})),_.Z.debug("making request to %s ...",t),a){var c=new URLSearchParams;Object.keys(a).forEach((function(e){return c.append(e,a[e])})),s.send(c)}else s.send(null)}))});function R(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=E()(e);if(t){var a=E()(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return g()(this,n)}}var C=function(e){m()(r,e);var t,n=R(r);function r(e){var t;return l()(this,r),t=n.call(this,e),b()(p()(t),"userId",void 0),b()(p()(t),"renderErrorFetchingPlaylists",(function(){var e=document.createElement("div");return e.innerHTML="Error fetching playlist data...",e})),b()(p()(t),"renderPlaylists",(function(e){var t=document.createElement("ul");return(0,T.cn)(t,"no-style-list playlist-wrapper row"),null==e||e.reduce((function(e,t){var n=document.createElement("li");return(0,T.cn)(n,"playlist-item column-12 column-md-4"),n.innerHTML='\n        <figure>\n          <a href="'.concat(t.external_urls.spotify,'" target="_blank">\n              <picture>\n                ').concat(t.images.reduce((function(e,t){return t.width&&e.push('<source srcset="'.concat(t.url," ").concat(t.width,'w">')),e}),[]).concat('<img src="'.concat(t.images[0].url,'" alt="cover art for ').concat(t.name,'"/>')).join(""),"\n              </picture>\n              <figcaption>").concat(t.name,"</figcaption>\n          </a>\n        </figure>\n      "),e.append(n),e}),t),t})),t.userId={}.SPOTIFY_USERNAME,t.ref={},t}return h()(r,[{key:"handlePlaylistFetch",value:(t=o()(s().mark((function e(){var t,n,r,a,i=this;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,this.setState({fetching:!0}),e.next=4,o={}.SPOTIFY_CLIENT_ID,u={}.SPOTIFY_CLIENT_SECRET,P({url:"https://accounts.spotify.com/api/token",method:"POST",body:{grant_type:"client_credentials"},headers:{Authorization:["Basic",window.btoa("".concat(o,":").concat(u))].join(" ")}});case 4:return t=e.sent,n=t.access_token,e.next=8,s=this.userId,c=n,P({url:"https://api.spotify.com/v1/users/".concat(s,"/playlists"),headers:{Authorization:["Bearer",c].join(" ")}});case 8:r=e.sent,a=r.items,this.setState({playlists:a.filter((function(e){return e.public&&e.owner.id===i.userId}))}),e.next=17;break;case 13:e.prev=13,e.t0=e.catch(0),_.Z.error(e.t0),this.setState({error:e.t0.message});case 17:return e.prev=17,this.setState({fetching:!1}),e.finish(17);case 20:case"end":return e.stop()}var s,c,o,u}),e,this,[[0,13,17,20]])}))),function(){return t.apply(this,arguments)})},{key:"renderFetchOutcome",value:function(){var e=a()(this.ref.playlistLoader,1)[0],t=a()(this.ref.playlistContainer,1)[0],n=document.createDocumentFragment(),r=this.state,i=r.error,s=r.playlists,c=i?this.renderErrorFetchingPlaylists():this.renderPlaylists(null!=s?s:[]);(0,T.KT)(e,{hidden:""}),n.appendChild(c),t.appendChild(n)}},{key:"stateChange",value:function(e){("playlists"in e||"error"in e)&&(0,T.KT)(this.element,{"data-loaded":"true"})}},{key:"mount",value:function(){a()(this.ref.playlistLoader,1)[0].addEventListener("animationend",this.renderFetchOutcome.bind(this)),this.handlePlaylistFetch().finally((function(){return _.Z.debug("playlist fetch done")}))}}]),r}(S.Component)}}]);