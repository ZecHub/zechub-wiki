// @ts-nocheck

/*! zcash-payment-request-widget.embed.v2.js | (c) PayWithZcash Widget | Dual-mode: auto + programmatic */
(async function () {
  // ---------- Configuration ----------
  const DEFAULT_API_BASE =
    typeof window !== "undefined" &&
    window.ZPWZ_CONFIG &&
    window.ZPWZ_CONFIG.apiBase
      ? window.ZPWZ_CONFIG.apiBase
      : "";


  const FOCUSABLE =
    'a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])';
  let dialogSeq = 0;

  /**
 * Minified by jsDelivr using Terser v5.37.0.
 * Original file: /npm/qrcode-generator@1.4.4/qrcode.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
var qrcode=function(){var t=function(t,r){var e=t,n=g[r],o=null,i=0,a=null,u=[],f={},c=function(t,r){o=function(t){for(var r=new Array(t),e=0;e<t;e+=1){r[e]=new Array(t);for(var n=0;n<t;n+=1)r[e][n]=null}return r}(i=4*e+17),l(0,0),l(i-7,0),l(0,i-7),s(),h(),d(t,r),e>=7&&v(t),null==a&&(a=p(e,n,u)),w(a,r)},l=function(t,r){for(var e=-1;e<=7;e+=1)if(!(t+e<=-1||i<=t+e))for(var n=-1;n<=7;n+=1)r+n<=-1||i<=r+n||(o[t+e][r+n]=0<=e&&e<=6&&(0==n||6==n)||0<=n&&n<=6&&(0==e||6==e)||2<=e&&e<=4&&2<=n&&n<=4)},h=function(){for(var t=8;t<i-8;t+=1)null==o[t][6]&&(o[t][6]=t%2==0);for(var r=8;r<i-8;r+=1)null==o[6][r]&&(o[6][r]=r%2==0)},s=function(){for(var t=B.getPatternPosition(e),r=0;r<t.length;r+=1)for(var n=0;n<t.length;n+=1){var i=t[r],a=t[n];if(null==o[i][a])for(var u=-2;u<=2;u+=1)for(var f=-2;f<=2;f+=1)o[i+u][a+f]=-2==u||2==u||-2==f||2==f||0==u&&0==f}},v=function(t){for(var r=B.getBCHTypeNumber(e),n=0;n<18;n+=1){var a=!t&&1==(r>>n&1);o[Math.floor(n/3)][n%3+i-8-3]=a}for(n=0;n<18;n+=1){a=!t&&1==(r>>n&1);o[n%3+i-8-3][Math.floor(n/3)]=a}},d=function(t,r){for(var e=n<<3|r,a=B.getBCHTypeInfo(e),u=0;u<15;u+=1){var f=!t&&1==(a>>u&1);u<6?o[u][8]=f:u<8?o[u+1][8]=f:o[i-15+u][8]=f}for(u=0;u<15;u+=1){f=!t&&1==(a>>u&1);u<8?o[8][i-u-1]=f:u<9?o[8][15-u-1+1]=f:o[8][15-u-1]=f}o[i-8][8]=!t},w=function(t,r){for(var e=-1,n=i-1,a=7,u=0,f=B.getMaskFunction(r),c=i-1;c>0;c-=2)for(6==c&&(c-=1);;){for(var g=0;g<2;g+=1)if(null==o[n][c-g]){var l=!1;u<t.length&&(l=1==(t[u]>>>a&1)),f(n,c-g)&&(l=!l),o[n][c-g]=l,-1==(a-=1)&&(u+=1,a=7)}if((n+=e)<0||i<=n){n-=e,e=-e;break}}},p=function(t,r,e){for(var n=A.getRSBlocks(t,r),o=b(),i=0;i<e.length;i+=1){var a=e[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var u=0;for(i=0;i<n.length;i+=1)u+=n[i].dataCount;if(o.getLengthInBits()>8*u)throw"code length overflow. ("+o.getLengthInBits()+">"+8*u+")";for(o.getLengthInBits()+4<=8*u&&o.put(0,4);o.getLengthInBits()%8!=0;)o.putBit(!1);for(;!(o.getLengthInBits()>=8*u||(o.put(236,8),o.getLengthInBits()>=8*u));)o.put(17,8);return function(t,r){for(var e=0,n=0,o=0,i=new Array(r.length),a=new Array(r.length),u=0;u<r.length;u+=1){var f=r[u].dataCount,c=r[u].totalCount-f;n=Math.max(n,f),o=Math.max(o,c),i[u]=new Array(f);for(var g=0;g<i[u].length;g+=1)i[u][g]=255&t.getBuffer()[g+e];e+=f;var l=B.getErrorCorrectPolynomial(c),h=k(i[u],l.getLength()-1).mod(l);for(a[u]=new Array(l.getLength()-1),g=0;g<a[u].length;g+=1){var s=g+h.getLength()-a[u].length;a[u][g]=s>=0?h.getAt(s):0}}var v=0;for(g=0;g<r.length;g+=1)v+=r[g].totalCount;var d=new Array(v),w=0;for(g=0;g<n;g+=1)for(u=0;u<r.length;u+=1)g<i[u].length&&(d[w]=i[u][g],w+=1);for(g=0;g<o;g+=1)for(u=0;u<r.length;u+=1)g<a[u].length&&(d[w]=a[u][g],w+=1);return d}(o,n)};f.addData=function(t,r){var e=null;switch(r=r||"Byte"){case"Numeric":e=M(t);break;case"Alphanumeric":e=x(t);break;case"Byte":e=m(t);break;case"Kanji":e=L(t);break;default:throw"mode:"+r}u.push(e),a=null},f.isDark=function(t,r){if(t<0||i<=t||r<0||i<=r)throw t+","+r;return o[t][r]},f.getModuleCount=function(){return i},f.make=function(){if(e<1){for(var t=1;t<40;t++){for(var r=A.getRSBlocks(t,n),o=b(),i=0;i<u.length;i++){var a=u[i];o.put(a.getMode(),4),o.put(a.getLength(),B.getLengthInBits(a.getMode(),t)),a.write(o)}var g=0;for(i=0;i<r.length;i++)g+=r[i].dataCount;if(o.getLengthInBits()<=8*g)break}e=t}c(!1,function(){for(var t=0,r=0,e=0;e<8;e+=1){c(!0,e);var n=B.getLostPoint(f);(0==e||t>n)&&(t=n,r=e)}return r}())},f.createTableTag=function(t,r){t=t||2;var e="";e+='<table style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: "+(r=void 0===r?4*t:r)+"px;",e+='">',e+="<tbody>";for(var n=0;n<f.getModuleCount();n+=1){e+="<tr>";for(var o=0;o<f.getModuleCount();o+=1)e+='<td style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: 0px;",e+=" width: "+t+"px;",e+=" height: "+t+"px;",e+=" background-color: ",e+=f.isDark(n,o)?"#000000":"#ffffff",e+=";",e+='"/>';e+="</tr>"}return e+="</tbody>",e+="</table>"},f.createSvgTag=function(t,r,e,n){var o={};"object"==typeof arguments[0]&&(t=(o=arguments[0]).cellSize,r=o.margin,e=o.alt,n=o.title),t=t||2,r=void 0===r?4*t:r,(e="string"==typeof e?{text:e}:e||{}).text=e.text||null,e.id=e.text?e.id||"qrcode-description":null,(n="string"==typeof n?{text:n}:n||{}).text=n.text||null,n.id=n.text?n.id||"qrcode-title":null;var i,a,u,c,g=f.getModuleCount()*t+2*r,l="";for(c="l"+t+",0 0,"+t+" -"+t+",0 0,-"+t+"z ",l+='<svg version="1.1" xmlns="http://www.w3.org/2000/svg"',l+=o.scalable?"":' width="'+g+'px" height="'+g+'px"',l+=' viewBox="0 0 '+g+" "+g+'" ',l+=' preserveAspectRatio="xMinYMin meet"',l+=n.text||e.text?' role="img" aria-labelledby="'+y([n.id,e.id].join(" ").trim())+'"':"",l+=">",l+=n.text?'<title id="'+y(n.id)+'">'+y(n.text)+"</title>":"",l+=e.text?'<description id="'+y(e.id)+'">'+y(e.text)+"</description>":"",l+='<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>',l+='<path d="',a=0;a<f.getModuleCount();a+=1)for(u=a*t+r,i=0;i<f.getModuleCount();i+=1)f.isDark(a,i)&&(l+="M"+(i*t+r)+","+u+c);return l+='" stroke="transparent" fill="black"/>',l+="</svg>"},f.createDataURL=function(t,r){t=t||2,r=void 0===r?4*t:r;var e=f.getModuleCount()*t+2*r,n=r,o=e-r;return I(e,e,(function(r,e){if(n<=r&&r<o&&n<=e&&e<o){var i=Math.floor((r-n)/t),a=Math.floor((e-n)/t);return f.isDark(a,i)?0:1}return 1}))},f.createImgTag=function(t,r,e){t=t||2,r=void 0===r?4*t:r;var n=f.getModuleCount()*t+2*r,o="";return o+="<img",o+=' src="',o+=f.createDataURL(t,r),o+='"',o+=' width="',o+=n,o+='"',o+=' height="',o+=n,o+='"',e&&(o+=' alt="',o+=y(e),o+='"'),o+="/>"};var y=function(t){for(var r="",e=0;e<t.length;e+=1){var n=t.charAt(e);switch(n){case"<":r+="&lt;";break;case">":r+="&gt;";break;case"&":r+="&amp;";break;case'"':r+="&quot;";break;default:r+=n}}return r};return f.createASCII=function(t,r){if((t=t||1)<2)return function(t){t=void 0===t?2:t;var r,e,n,o,i,a=1*f.getModuleCount()+2*t,u=t,c=a-t,g={"██":"█","█ ":"▀"," █":"▄","  ":" "},l={"██":"▀","█ ":"▀"," █":" ","  ":" "},h="";for(r=0;r<a;r+=2){for(n=Math.floor((r-u)/1),o=Math.floor((r+1-u)/1),e=0;e<a;e+=1)i="█",u<=e&&e<c&&u<=r&&r<c&&f.isDark(n,Math.floor((e-u)/1))&&(i=" "),u<=e&&e<c&&u<=r+1&&r+1<c&&f.isDark(o,Math.floor((e-u)/1))?i+=" ":i+="█",h+=t<1&&r+1>=c?l[i]:g[i];h+="\n"}return a%2&&t>0?h.substring(0,h.length-a-1)+Array(a+1).join("▀"):h.substring(0,h.length-1)}(r);t-=1,r=void 0===r?2*t:r;var e,n,o,i,a=f.getModuleCount()*t+2*r,u=r,c=a-r,g=Array(t+1).join("██"),l=Array(t+1).join("  "),h="",s="";for(e=0;e<a;e+=1){for(o=Math.floor((e-u)/t),s="",n=0;n<a;n+=1)i=1,u<=n&&n<c&&u<=e&&e<c&&f.isDark(o,Math.floor((n-u)/t))&&(i=0),s+=i?g:l;for(o=0;o<t;o+=1)h+=s+"\n"}return h.substring(0,h.length-1)},f.renderTo2dContext=function(t,r){r=r||2;for(var e=f.getModuleCount(),n=0;n<e;n++)for(var o=0;o<e;o++)t.fillStyle=f.isDark(n,o)?"black":"white",t.fillRect(n*r,o*r,r,r)},f};t.stringToBytes=(t.stringToBytesFuncs={default:function(t){for(var r=[],e=0;e<t.length;e+=1){var n=t.charCodeAt(e);r.push(255&n)}return r}}).default,t.createStringToBytes=function(t,r){var e=function(){for(var e=S(t),n=function(){var t=e.read();if(-1==t)throw"eof";return t},o=0,i={};;){var a=e.read();if(-1==a)break;var u=n(),f=n()<<8|n();i[String.fromCharCode(a<<8|u)]=f,o+=1}if(o!=r)throw o+" != "+r;return i}(),n="?".charCodeAt(0);return function(t){for(var r=[],o=0;o<t.length;o+=1){var i=t.charCodeAt(o);if(i<128)r.push(i);else{var a=e[t.charAt(o)];"number"==typeof a?(255&a)==a?r.push(a):(r.push(a>>>8),r.push(255&a)):r.push(n)}}return r}};var r,e,n,o,i,a=1,u=2,f=4,c=8,g={L:1,M:0,Q:3,H:2},l=0,h=1,s=2,v=3,d=4,w=5,p=6,y=7,B=(r=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],e=1335,n=7973,i=function(t){for(var r=0;0!=t;)r+=1,t>>>=1;return r},(o={}).getBCHTypeInfo=function(t){for(var r=t<<10;i(r)-i(e)>=0;)r^=e<<i(r)-i(e);return 21522^(t<<10|r)},o.getBCHTypeNumber=function(t){for(var r=t<<12;i(r)-i(n)>=0;)r^=n<<i(r)-i(n);return t<<12|r},o.getPatternPosition=function(t){return r[t-1]},o.getMaskFunction=function(t){switch(t){case l:return function(t,r){return(t+r)%2==0};case h:return function(t,r){return t%2==0};case s:return function(t,r){return r%3==0};case v:return function(t,r){return(t+r)%3==0};case d:return function(t,r){return(Math.floor(t/2)+Math.floor(r/3))%2==0};case w:return function(t,r){return t*r%2+t*r%3==0};case p:return function(t,r){return(t*r%2+t*r%3)%2==0};case y:return function(t,r){return(t*r%3+(t+r)%2)%2==0};default:throw"bad maskPattern:"+t}},o.getErrorCorrectPolynomial=function(t){for(var r=k([1],0),e=0;e<t;e+=1)r=r.multiply(k([1,C.gexp(e)],0));return r},o.getLengthInBits=function(t,r){if(1<=r&&r<10)switch(t){case a:return 10;case u:return 9;case f:case c:return 8;default:throw"mode:"+t}else if(r<27)switch(t){case a:return 12;case u:return 11;case f:return 16;case c:return 10;default:throw"mode:"+t}else{if(!(r<41))throw"type:"+r;switch(t){case a:return 14;case u:return 13;case f:return 16;case c:return 12;default:throw"mode:"+t}}},o.getLostPoint=function(t){for(var r=t.getModuleCount(),e=0,n=0;n<r;n+=1)for(var o=0;o<r;o+=1){for(var i=0,a=t.isDark(n,o),u=-1;u<=1;u+=1)if(!(n+u<0||r<=n+u))for(var f=-1;f<=1;f+=1)o+f<0||r<=o+f||0==u&&0==f||a==t.isDark(n+u,o+f)&&(i+=1);i>5&&(e+=3+i-5)}for(n=0;n<r-1;n+=1)for(o=0;o<r-1;o+=1){var c=0;t.isDark(n,o)&&(c+=1),t.isDark(n+1,o)&&(c+=1),t.isDark(n,o+1)&&(c+=1),t.isDark(n+1,o+1)&&(c+=1),0!=c&&4!=c||(e+=3)}for(n=0;n<r;n+=1)for(o=0;o<r-6;o+=1)t.isDark(n,o)&&!t.isDark(n,o+1)&&t.isDark(n,o+2)&&t.isDark(n,o+3)&&t.isDark(n,o+4)&&!t.isDark(n,o+5)&&t.isDark(n,o+6)&&(e+=40);for(o=0;o<r;o+=1)for(n=0;n<r-6;n+=1)t.isDark(n,o)&&!t.isDark(n+1,o)&&t.isDark(n+2,o)&&t.isDark(n+3,o)&&t.isDark(n+4,o)&&!t.isDark(n+5,o)&&t.isDark(n+6,o)&&(e+=40);var g=0;for(o=0;o<r;o+=1)for(n=0;n<r;n+=1)t.isDark(n,o)&&(g+=1);return e+=Math.abs(100*g/r/r-50)/5*10},o),C=function(){for(var t=new Array(256),r=new Array(256),e=0;e<8;e+=1)t[e]=1<<e;for(e=8;e<256;e+=1)t[e]=t[e-4]^t[e-5]^t[e-6]^t[e-8];for(e=0;e<255;e+=1)r[t[e]]=e;var n={glog:function(t){if(t<1)throw"glog("+t+")";return r[t]},gexp:function(r){for(;r<0;)r+=255;for(;r>=256;)r-=255;return t[r]}};return n}();function k(t,r){if(void 0===t.length)throw t.length+"/"+r;var e=function(){for(var e=0;e<t.length&&0==t[e];)e+=1;for(var n=new Array(t.length-e+r),o=0;o<t.length-e;o+=1)n[o]=t[o+e];return n}(),n={getAt:function(t){return e[t]},getLength:function(){return e.length},multiply:function(t){for(var r=new Array(n.getLength()+t.getLength()-1),e=0;e<n.getLength();e+=1)for(var o=0;o<t.getLength();o+=1)r[e+o]^=C.gexp(C.glog(n.getAt(e))+C.glog(t.getAt(o)));return k(r,0)},mod:function(t){if(n.getLength()-t.getLength()<0)return n;for(var r=C.glog(n.getAt(0))-C.glog(t.getAt(0)),e=new Array(n.getLength()),o=0;o<n.getLength();o+=1)e[o]=n.getAt(o);for(o=0;o<t.getLength();o+=1)e[o]^=C.gexp(C.glog(t.getAt(o))+r);return k(e,0).mod(t)}};return n}var A=function(){var t=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],r=function(t,r){var e={};return e.totalCount=t,e.dataCount=r,e},e={};return e.getRSBlocks=function(e,n){var o=function(r,e){switch(e){case g.L:return t[4*(r-1)+0];case g.M:return t[4*(r-1)+1];case g.Q:return t[4*(r-1)+2];case g.H:return t[4*(r-1)+3];default:return}}(e,n);if(void 0===o)throw"bad rs block @ typeNumber:"+e+"/errorCorrectionLevel:"+n;for(var i=o.length/3,a=[],u=0;u<i;u+=1)for(var f=o[3*u+0],c=o[3*u+1],l=o[3*u+2],h=0;h<f;h+=1)a.push(r(c,l));return a},e}(),b=function(){var t=[],r=0,e={getBuffer:function(){return t},getAt:function(r){var e=Math.floor(r/8);return 1==(t[e]>>>7-r%8&1)},put:function(t,r){for(var n=0;n<r;n+=1)e.putBit(1==(t>>>r-n-1&1))},getLengthInBits:function(){return r},putBit:function(e){var n=Math.floor(r/8);t.length<=n&&t.push(0),e&&(t[n]|=128>>>r%8),r+=1}};return e},M=function(t){var r=a,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+2<r.length;)t.put(o(r.substring(n,n+3)),10),n+=3;n<r.length&&(r.length-n==1?t.put(o(r.substring(n,n+1)),4):r.length-n==2&&t.put(o(r.substring(n,n+2)),7))}},o=function(t){for(var r=0,e=0;e<t.length;e+=1)r=10*r+i(t.charAt(e));return r},i=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);throw"illegal char :"+t};return n},x=function(t){var r=u,e=t,n={getMode:function(){return r},getLength:function(t){return e.length},write:function(t){for(var r=e,n=0;n+1<r.length;)t.put(45*o(r.charAt(n))+o(r.charAt(n+1)),11),n+=2;n<r.length&&t.put(o(r.charAt(n)),6)}},o=function(t){if("0"<=t&&t<="9")return t.charCodeAt(0)-"0".charCodeAt(0);if("A"<=t&&t<="Z")return t.charCodeAt(0)-"A".charCodeAt(0)+10;switch(t){case" ":return 36;case"$":return 37;case"%":return 38;case"*":return 39;case"+":return 40;case"-":return 41;case".":return 42;case"/":return 43;case":":return 44;default:throw"illegal char :"+t}};return n},m=function(r){var e=f,n=t.stringToBytes(r),o={getMode:function(){return e},getLength:function(t){return n.length},write:function(t){for(var r=0;r<n.length;r+=1)t.put(n[r],8)}};return o},L=function(r){var e=c,n=t.stringToBytesFuncs.SJIS;if(!n)throw"sjis not supported.";!function(){var t=n("友");if(2!=t.length||38726!=(t[0]<<8|t[1]))throw"sjis not supported."}();var o=n(r),i={getMode:function(){return e},getLength:function(t){return~~(o.length/2)},write:function(t){for(var r=o,e=0;e+1<r.length;){var n=(255&r[e])<<8|255&r[e+1];if(33088<=n&&n<=40956)n-=33088;else{if(!(57408<=n&&n<=60351))throw"illegal char at "+(e+1)+"/"+n;n-=49472}n=192*(n>>>8&255)+(255&n),t.put(n,13),e+=2}if(e<r.length)throw"illegal char at "+(e+1)}};return i},D=function(){var t=[],r={writeByte:function(r){t.push(255&r)},writeShort:function(t){r.writeByte(t),r.writeByte(t>>>8)},writeBytes:function(t,e,n){e=e||0,n=n||t.length;for(var o=0;o<n;o+=1)r.writeByte(t[o+e])},writeString:function(t){for(var e=0;e<t.length;e+=1)r.writeByte(t.charCodeAt(e))},toByteArray:function(){return t},toString:function(){var r="";r+="[";for(var e=0;e<t.length;e+=1)e>0&&(r+=","),r+=t[e];return r+="]"}};return r},S=function(t){var r=t,e=0,n=0,o=0,i={read:function(){for(;o<8;){if(e>=r.length){if(0==o)return-1;throw"unexpected end of file./"+o}var t=r.charAt(e);if(e+=1,"="==t)return o=0,-1;t.match(/^\s$/)||(n=n<<6|a(t.charCodeAt(0)),o+=6)}var i=n>>>o-8&255;return o-=8,i}},a=function(t){if(65<=t&&t<=90)return t-65;if(97<=t&&t<=122)return t-97+26;if(48<=t&&t<=57)return t-48+52;if(43==t)return 62;if(47==t)return 63;throw"c:"+t};return i},I=function(t,r,e){for(var n=function(t,r){var e=t,n=r,o=new Array(t*r),i={setPixel:function(t,r,n){o[r*e+t]=n},write:function(t){t.writeString("GIF87a"),t.writeShort(e),t.writeShort(n),t.writeByte(128),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(0),t.writeByte(255),t.writeByte(255),t.writeByte(255),t.writeString(","),t.writeShort(0),t.writeShort(0),t.writeShort(e),t.writeShort(n),t.writeByte(0);var r=a(2);t.writeByte(2);for(var o=0;r.length-o>255;)t.writeByte(255),t.writeBytes(r,o,255),o+=255;t.writeByte(r.length-o),t.writeBytes(r,o,r.length-o),t.writeByte(0),t.writeString(";")}},a=function(t){for(var r=1<<t,e=1+(1<<t),n=t+1,i=u(),a=0;a<r;a+=1)i.add(String.fromCharCode(a));i.add(String.fromCharCode(r)),i.add(String.fromCharCode(e));var f,c,g,l=D(),h=(f=l,c=0,g=0,{write:function(t,r){if(t>>>r!=0)throw"length over";for(;c+r>=8;)f.writeByte(255&(t<<c|g)),r-=8-c,t>>>=8-c,g=0,c=0;g|=t<<c,c+=r},flush:function(){c>0&&f.writeByte(g)}});h.write(r,n);var s=0,v=String.fromCharCode(o[s]);for(s+=1;s<o.length;){var d=String.fromCharCode(o[s]);s+=1,i.contains(v+d)?v+=d:(h.write(i.indexOf(v),n),i.size()<4095&&(i.size()==1<<n&&(n+=1),i.add(v+d)),v=d)}return h.write(i.indexOf(v),n),h.write(e,n),h.flush(),l.toByteArray()},u=function(){var t={},r=0,e={add:function(n){if(e.contains(n))throw"dup key:"+n;t[n]=r,r+=1},size:function(){return r},indexOf:function(r){return t[r]},contains:function(r){return void 0!==t[r]}};return e};return i}(t,r),o=0;o<r;o+=1)for(var i=0;i<t;i+=1)n.setPixel(i,o,e(i,o));var a=D();n.write(a);for(var u=function(){var t=0,r=0,e=0,n="",o={},i=function(t){n+=String.fromCharCode(a(63&t))},a=function(t){if(t<0);else{if(t<26)return 65+t;if(t<52)return t-26+97;if(t<62)return t-52+48;if(62==t)return 43;if(63==t)return 47}throw"n:"+t};return o.writeByte=function(n){for(t=t<<8|255&n,r+=8,e+=1;r>=6;)i(t>>>r-6),r-=6},o.flush=function(){if(r>0&&(i(t<<6-r),t=0,r=0),e%3!=0)for(var o=3-e%3,a=0;a<o;a+=1)n+="="},o.toString=function(){return n},o}(),f=a.toByteArray(),c=0;c<f.length;c+=1)u.writeByte(f[c]);return u.flush(),"data:image/gif;base64,"+u};return t}();qrcode.stringToBytesFuncs["UTF-8"]=function(t){return function(t){for(var r=[],e=0;e<t.length;e++){var n=t.charCodeAt(e);n<128?r.push(n):n<2048?r.push(192|n>>6,128|63&n):n<55296||n>=57344?r.push(224|n>>12,128|n>>6&63,128|63&n):(e++,n=65536+((1023&n)<<10|1023&t.charCodeAt(e)),r.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n))}return r}(t)},function(t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports&&(module.exports=t())}((function(){return qrcode}));
//# sourceMappingURL=/sm/26b4b0d0b1e283d6b3ec9857ac597d7a60c76ac17be1ef4c965f03086de426bb.map

  function resolveApiBase(raw) {
    const v = String(raw || "").trim().replace(/\/$/, "");
    if (!v || v === "undefined" || v === "null") {
      return typeof location !== "undefined" ? location.origin + "/api" : "/api";
    }
    if (v.startsWith("/")) {
      return typeof location !== "undefined" ? location.origin + v : v;
    }
    return v;
  }

  function qrDataUrl(text) {
    const qr = qrcode(0, "M");
    qr.addData(text);
    qr.make();
    return qr.createDataURL(6, 4);
  }


  // Load CSS (your original CSS preserved exactly)
  const style = document.createElement("style");
  style.textContent = `
    .zwg-btn{position:relative;display:inline-flex;align-items:center;gap:10px;padding:14px 28px;background:linear-gradient(135deg,#F4B728 0%,#E5A420 100%);color:#1a1a1a;font:600 15px/1 system-ui,-apple-system,sans-serif;border:0;border-radius:14px;cursor:pointer;box-shadow:0 4px 24px -4px rgba(244,183,40,0.5),inset 0 1px 0 rgba(255,255,255,0.3);transition:all .2s ease;overflow:hidden}
    .zwg-btn:active{transform:translateY(0) scale(.98)}
    .zwg-btn::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.25),transparent);transform:translateX(-100%);transition:transform .6s}
    .zwg-btn svg{width:18px;height:18px}
    .zwg-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:99999;padding:20px;animation:zwg-fade .25s ease}
    @keyframes zwg-fade{from{opacity:0}to{opacity:1}}
    .zwg-modal{width:100%;max-width:400px;background:var(--zwg-bg);color:var(--zwg-text);border-radius:28px;padding:28px;font-family:system-ui,-apple-system,sans-serif;box-shadow:0 32px 64px -16px rgba(0,0,0,.4),0 0 0 1px var(--zwg-border);animation:zwg-pop .35s cubic-bezier(.16,1,.3,1);position:relative}
    @keyframes zwg-pop{from{opacity:0;transform:scale(.92) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
    .zwg-light{--zwg-bg:#fff;--zwg-text:#111;--zwg-muted:#6b7280;--zwg-surface:#f3f4f6;--zwg-border:rgba(0,0,0,.08)}
    .zwg-dark{--zwg-bg:#18181b;--zwg-text:#fafafa;--zwg-muted:#a1a1aa;--zwg-surface:#27272a;--zwg-border:rgba(255,255,255,.1)}
    .zwg-head{text-align:center;margin-bottom:24px}
    .zwg-icon{width:56px;height:56px;margin:0 auto 14px;background:linear-gradient(145deg,#F4B728,#D4940F);border-radius:16px;display:flex;align-items:center;justify-content:center;font:700 24px/1 system-ui;color:#1a1a1a;box-shadow:0 8px 20px -6px rgba(244,183,40,.5)}
    .zwg-title{margin:0 0 4px;font:700 22px/1.2 system-ui}
    .zwg-label{margin:0;font-size:13px;color:var(--zwg-muted)}
    .zwg-qr{background:#fff;border-radius:20px;padding:20px;margin-bottom:20px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}
    .zwg-qr img{display:block;width:180px;height:180px;margin:0 auto;border-radius:12px}
    .zwg-amt{background:var(--zwg-surface);border-radius:16px;padding:16px;text-align:center;margin-bottom:16px}
    .zwg-amt-lbl{margin:0 0 2px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--zwg-muted)}
    .zwg-amt-val{margin:0;font:700 32px/1.2 system-ui}
    .zwg-amt-val b{color:#F4B728}
    .zwg-amt-val small{font-size:16px;color:var(--zwg-muted);margin-left:6px;font-weight:500}
    .zwg-fld{margin-bottom:14px}
    .zwg-fld-lbl{display:block;margin-bottom:6px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--zwg-muted)}
    .zwg-fld-row{display:flex;align-items:center;gap:8px;background:var(--zwg-surface);border-radius:12px;padding:10px 12px}
    .zwg-fld-txt{flex:1;margin:0;font:500 12px/1.4 ui-monospace,SFMono-Regular,monospace;word-break:break-all;color:var(--zwg-text)}
    .zwg-fld-inp{flex:1;background:0;border:0;outline:0;font:500 12px/1.4 ui-monospace,SFMono-Regular,monospace;color:var(--zwg-text);width:100%}
    .zwg-memo{background:var(--zwg-surface);border-radius:12px;padding:12px 14px;font-size:13px;line-height:1.5;color:var(--zwg-text)}
    .zwg-copy{flex-shrink:0;width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:0;border:0;border-radius:8px;cursor:pointer;color:var(--zwg-muted);transition:all .15s}
    .zwg-copy:hover{background:var(--zwg-bg);color:var(--zwg-text)}
    .zwg-copy.ok{background:rgba(34,197,94,.15);color:#22c55e}
    .zwg-copy svg{width:14px;height:14px}
    .zwg-acts{display:flex;gap:10px;margin-top:20px}
    .zwg-btn2{flex:1;padding:14px;font:600 13px/1 system-ui;border:0;border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .15s}
    .zwg-btn2 svg{width:14px;height:14px}
    .zwg-sec{background:var(--zwg-surface);color:var(--zwg-text)}
    .zwg-sec:hover{filter:brightness(1.05)}
    .zwg-pri{background:linear-gradient(135deg,#F4B728,#E5A420);color:#1a1a1a}
    .zwg-pri:hover{box-shadow:0 6px 20px -4px rgba(244,183,40,.5);transform:translateY(-1px)}
    .zwg-pri:disabled{opacity:.5;cursor:not-allowed;transform:none}
    .zwg-spin{width:14px;height:14px;border:2px solid rgba(26,26,26,.2);border-top-color:#1a1a1a;border-radius:50%;animation:zwg-sp .7s linear infinite}
    @keyframes zwg-sp{to{transform:rotate(360deg)}}
    .zwg-link{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:14px;font-size:13px;color:var(--zwg-muted);text-decoration:none;transition:color .15s}
    .zwg-link:hover{color:var(--zwg-text)}
    .zwg-link svg{width:14px;height:14px}
    .zwg-x{position:absolute;top:14px;right:14px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:0;border:0;border-radius:50%;cursor:pointer;color:var(--zwg-muted);transition:all .15s}
    .zwg-x:hover{background:var(--zwg-surface);color:var(--zwg-text)}
    .zwg-x svg{width:16px;height:16px}
    .zwg-disabled{opacity:0.5;cursor:none;}
    .zwg-footer{display:flex;justify-content:center;margin-top:24px;font-size:12px;text-align:center;opacity:0.7;}
    @media(max-width:480px){.zwg-modal{padding:22px;border-radius:24px}.zwg-acts{flex-direction:column}}
  `;
  document.head.appendChild(style);

  // Icons
  const ic = {
    z: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M8 9h8M8 15h8M15 9l-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
    x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
    cp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
    ok: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>`,
    lnk: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`,
    ext: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>`,
  };

  // DOM helpers. Host-supplied values (label, address, memo, URI) and API
  // responses are only ever inserted as text nodes or element properties,
  // never parsed as HTML.
  function el(tag, className, ...children) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    for (const child of children) {
      if (child == null || child === false) continue;
      node.append(
        typeof child === "string" || typeof child === "number"
          ? document.createTextNode(String(child))
          : child,
      );
    }
    return node;
  }

  // Only ever called with the constant SVG strings from `ic` above.
  function svg(markup) {
    const tpl = document.createElement("template");
    tpl.innerHTML = markup;
    return tpl.content.firstElementChild;
  }

  function setIcon(node, markup) {
    node.replaceChildren(svg(markup));
  }


  // ---------- ZIP-321 request validation ----------
  // Mirrors src/lib/zip321.ts (amount formatting, Sprout rejection,
  // transparent/TEX memo prohibition, 512-byte UTF-8 memo limit, unpadded base64url memo
  // encoding). Reimplemented locally because this file ships as a single
  // dependency-free static script. Keep in sync with src/lib/zip321.ts.
  const ZIP321_MAX_ZEC_SUPPLY = 21_000_000;
  const ZIP321_MAX_MEMO_BYTES = 512;
  const ZIP321_ZATOSHI_DECIMALS = 8;

  function isTransparentZcashAddress(address) {
    if (!address) return false;
    const trimmed = String(address).trim();
    return (
      trimmed.startsWith("t1") ||
      trimmed.startsWith("t3") ||
      trimmed.startsWith("tm") ||
      trimmed.startsWith("t2") ||
      trimmed.startsWith("tex1") ||
      trimmed.startsWith("textest1")
    );
  }

  // ZIP 321: "Sprout addresses MUST NOT be supported in payment requests."
  function isSproutZcashAddress(address) {
    return /^z[ct][1-9A-HJ-NP-Za-km-z]{93}$/.test(String(address || "").trim());
  }

  function formatZip321Amount(amount) {
    if (amount === undefined || amount === null || amount === "") {
      throw new Error("Amount is required");
    }

    let str;
    if (typeof amount === "number") {
      if (isNaN(amount) || !isFinite(amount)) {
        throw new Error("Invalid amount: must be a finite number");
      }
      if (amount <= 0) {
        throw new Error("Invalid amount: must be greater than zero");
      }
      str = amount.toFixed(8);
    } else {
      str = String(amount).trim();
      if (/e/i.test(str)) {
        const num = Number(str);
        if (isNaN(num) || !isFinite(num) || num <= 0) {
          throw new Error("Invalid amount: must be greater than zero");
        }
        str = num.toFixed(8);
      }
    }

    if (!/^\d+(\.\d+)?$/.test(str)) {
      throw new Error("Invalid amount format: must be a positive decimal number");
    }

    const parts = str.split(".");
    let intPart = parts[0];
    const fracPart = parts[1] || "";

    if (fracPart.length > ZIP321_ZATOSHI_DECIMALS) {
      throw new Error(
        `Invalid amount: exceeds maximum ${ZIP321_ZATOSHI_DECIMALS} decimal places (zatoshi precision)`,
      );
    }

    intPart = intPart.replace(/^0+(?=\d)/, "") || "0";

    const numVal = parseFloat(`${intPart}${fracPart ? "." + fracPart : ""}`);
    if (numVal <= 0) {
      throw new Error("Invalid amount: must be greater than zero");
    }
    if (numVal > ZIP321_MAX_ZEC_SUPPLY) {
      throw new Error(
        `Invalid amount: exceeds maximum ZEC supply (${ZIP321_MAX_ZEC_SUPPLY})`,
      );
    }

    if (fracPart) {
      const trimmedFrac = fracPart.replace(/0+$/, "");
      return trimmedFrac ? `${intPart}.${trimmedFrac}` : intPart;
    }

    return intPart;
  }

  function encodeZip321MemoLocal(memo, address) {
    if (!memo) return "";

    if (address && isTransparentZcashAddress(address)) {
      throw new Error(
        "Memos are not supported for transparent addresses in ZIP 321",
      );
    }

    const bytes = new TextEncoder().encode(memo);
    if (bytes.length > ZIP321_MAX_MEMO_BYTES) {
      throw new Error(
        `Memo exceeds ${ZIP321_MAX_MEMO_BYTES}-byte limit (actual: ${bytes.length} bytes)`,
      );
    }

    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    const base64 = btoa(binary);
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function isQrCapacityError(err) {
    return err instanceof RangeError && /data too long/i.test(err.message || "");
  }
  // ---------- End ZIP-321 request validation ----------

  async function getZecUsdRate(zecUsdRate, apiBase) {
    const url = `${apiBase}/payment-request-uri/zcash-price-feed`;

    if (zecUsdRate != null) return zecUsdRate;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const rate = data.rate ?? data.price ?? data?.data?.rate ?? null;

      return rate;
    } catch (err) {
      console.error("Failed to fetch rate", err);
      return null;
    }
  }

  // ------------------------------
  //   MAIN RENDER FUNCTION
  // ------------------------------

  async function renderZcashButton(selector, opts) {
    const container = document.querySelector(selector);

    if (!container) {
      console.error(
        `[Zcash-Payment-URI-Widget] Container not found for selector: ${selector}`,
      );
      return null;
    }

    const address = opts.address;
    const amount = opts.amount;
    const label = opts.label || "Pay with Zcash";
    const theme = opts.theme || "light";
    const memo = opts.memo || "";
    const apiBase = resolveApiBase(opts.apiBase || DEFAULT_API_BASE);
    const isDisabled = opts.disabled === true || opts.disabled === "true";

    const zecUsdRate =
      opts.zecUsdRate != null
        ? opts.zecUsdRate
        : await getZecUsdRate(opts.zecUsdRate, apiBase);

    const usdValue =
      zecUsdRate && !isNaN(zecUsdRate)
        ? (amount * Number(zecUsdRate)).toFixed(2)
        : null;

    if (!address || !amount) {
      console.error(
        "[Zcash-Payment-URI-Widget] Missing required fields: address or amount.",
      );
      return null;
    }

    if (isSproutZcashAddress(address)) {
      console.error(
        "[Zcash-Payment-URI-Widget] Sprout addresses are not supported in ZIP 321 payment requests.",
      );
      return null;
    }

    let formattedAmount;
    try {
      formattedAmount = formatZip321Amount(amount);
    } catch (err) {
      console.error("[Zcash-Payment-URI-Widget] Invalid amount:", err.message);
      return null;
    }

    let encodedMemo;
    try {
      encodedMemo = encodeZip321MemoLocal(memo, address);
    } catch (err) {
      console.error("[Zcash-Payment-URI-Widget] Invalid memo:", err.message);
      return null;
    }

    // Create trigger button
    const btn = document.createElement("button");
    btn.className = "zwg-btn";
    btn.append(svg(ic.z), el("span", null, label));
    container.appendChild(btn);

    if (isDisabled) {
      btn.classList.add("zwg-disabled");
      btn.style.opacity = "0.5";
      btn.style.pointerEvents = "none";

      return;
    }

    // Create modal overlay (hidden initially)
    let overlay = null;
    let onKeyDown = null;
    let onFocusIn = null;
    let opener = null;

    function openError(message) {
      if (overlay) return;
      overlay = document.createElement("div");
      overlay.className = "zwg-overlay";
      const cls = theme === "dark" ? "zwg-dark" : "zwg-light";
      const closeX = el("button", "zwg-x", svg(ic.x));
      closeX.setAttribute("aria-label", "Close");
      overlay.append(
        el(
          "div",
          `zwg-modal ${cls}`,
          closeX,
          el(
            "div",
            "zwg-head",
            el("div", "zwg-icon", "Z"),
            el("h2", "zwg-title", "Unable to create payment request"),
          ),
          el("p", "zwg-label", message),
        ),
      );
      document.body.appendChild(overlay);
      overlay.onclick = (e) => e.target === overlay && close();
      overlay.querySelector(".zwg-x").onclick = close;
    }

    function open() {
      if (overlay) return;

      const uri = `zcash:${address}?amount=${formattedAmount}${
        encodedMemo ? `&memo=${encodedMemo}` : ""
      }`;

      try {

      overlay = document.createElement("div");
      overlay.className = "zwg-overlay";

      const cls = theme === "dark" ? "zwg-dark" : "zwg-light";

      const closeX = el("button", "zwg-x", svg(ic.x));
      closeX.setAttribute("aria-label", "Close");

      let qrImg = el("img");
      qrImg.alt = "QR Code";
      try {
        qrImg.src = qrDataUrl(uri);
      } catch (err) {
        console.error("[Zcash-Payment-URI-Widget] Client QR failed", err);
        // Never send the payment URI to the server; show a text fallback.
        qrImg = el(
          "p",
          "zwg-qr-error",
          "QR code unavailable. Use the Copy or Open in Wallet buttons instead.",
        );
      }

      let usdEl = null;
      if (usdValue) {
        usdEl = el("p", null, `≈ $${usdValue} USD`);
        usdEl.style.cssText =
          "margin-top:4px;font-size:12px;font-style:italic;color:var(--zwg-muted)";
      }

      const addressCopy = el("button", "zwg-copy", svg(ic.cp));
      addressCopy.dataset.c = address;
      addressCopy.setAttribute("aria-label", "Copy address");

      const uriInput = el("input", "zwg-fld-inp");
      uriInput.value = uri;
      uriInput.readOnly = true;

      const uriCopy = el("button", "zwg-copy", svg(ic.cp));
      uriCopy.dataset.c = uri;
      uriCopy.setAttribute("aria-label", "Copy payment URI");

      const walletLink = el("a", "zwg-link", svg(ic.ext), " Open in Wallet");
      walletLink.href = uri;

      overlay.append(
        el(
          "div",
          `zwg-modal ${cls}`,
          closeX,
          el(
            "div",
            "zwg-head",
            el("div", "zwg-icon", "Z"),
            label ? el("h2", "zwg-title", label) : "Pay with Zcash",
          ),
          el("div", "zwg-qr", qrImg),
          el(
            "div",
            "zwg-amt",
            el("p", "zwg-amt-lbl", "Amount Due"),
            el(
              "p",
              "zwg-amt-val",
              el("b", null, Number(amount).toFixed(3)),
              el("small", null, "ZEC"),
            ),
            usdEl,
          ),
          el(
            "div",
            "zwg-fld",
            el("span", "zwg-fld-lbl", "Address"),
            el(
              "div",
              "zwg-fld-row",
              el("p", "zwg-fld-txt", address),
              addressCopy,
            ),
          ),
          memo
            ? el(
                "div",
                "zwg-fld",
                el("span", "zwg-fld-lbl", "Memo"),
                el("div", "zwg-memo", memo),
              )
            : null,
          el(
            "div",
            "zwg-fld",
            el("span", "zwg-fld-lbl", "Payment URI"),
            el("div", "zwg-fld-row", uriInput, uriCopy),
          ),
          el(
            "div",
            "zwg-acts",
            el("button", "zwg-btn2 zwg-sec zwg-close", "Close"),
            el("button", "zwg-btn2 zwg-pri zwg-short", svg(ic.lnk), " Short URL"),
          ),
          walletLink,
          el("footer", "zwg-footer", ` ${new Date().getFullYear()} Pay with Zcash`),
        ),
      );

      document.body.appendChild(overlay);

      overlay.onclick = (e) => e.target === overlay && close();
      overlay.querySelector(".zwg-x").onclick = close;
      overlay.querySelector(".zwg-close").onclick = close;

      const modal = overlay.querySelector(".zwg-modal");
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.tabIndex = -1;

      const title = overlay.querySelector(".zwg-title");
      if (title) {
        title.id = `zwg-title-${++dialogSeq}`;
        modal.setAttribute("aria-labelledby", title.id);
      } else {
        modal.setAttribute("aria-label", "Pay with Zcash");
      }

      overlay.querySelectorAll("svg").forEach((s) => s.setAttribute("aria-hidden", "true"));

      const active = document.activeElement;
      opener =
        active instanceof HTMLElement && active !== document.body ? active : btn;

      const focusables = () =>
        Array.from(overlay.querySelectorAll(FOCUSABLE)).filter(
          (n) => !n.hasAttribute("disabled") && n.getAttribute("aria-hidden") !== "true",
        );

      onKeyDown = (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          close();
          return;
        }
        if (e.key !== "Tab") return;

        const items = focusables();
        if (items.length === 0) {
          e.preventDefault();
          modal.focus();
          return;
        }

        const first = items[0];
        const last = items[items.length - 1];
        const current = document.activeElement;
        const inside = overlay.contains(current);

        if (e.shiftKey && (current === first || !inside || current === modal)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (current === last || !inside || current === modal)) {
          e.preventDefault();
          first.focus();
        }
      };

      onFocusIn = (e) => {
        if (overlay.contains(e.target)) return;
        const items = focusables();
        (items[0] || modal).focus();
      };

      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("focusin", onFocusIn);
      modal.focus();

      overlay.querySelectorAll(".zwg-copy").forEach((b) => {
        b.onclick = async () => {
          try {
            await navigator.clipboard.writeText(b.dataset.c);
            b.classList.add("ok");
            setIcon(b, ic.ok);
            setTimeout(() => {
              b.classList.remove("ok");
              setIcon(b, ic.cp);
            }, 1500);
          } catch {}
        };
      });

      const shortBtn = overlay.querySelector(".zwg-short");
      shortBtn.onclick = async () => {
        shortBtn.disabled = true;
        shortBtn.replaceChildren(el("span", "zwg-spin"));

        try {
          const res = await fetch(`${apiBase}/payment-request-uri/shorten`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uri }),
          });

          const { shortUrl } = await res.json();
          shortBtn.replaceChildren(svg(ic.ok), document.createTextNode(" Done"));

          const shortInput = el("input", "zwg-fld-inp");
          shortInput.value = shortUrl;
          shortInput.readOnly = true;

          const shortCopy = el("button", "zwg-copy", svg(ic.cp));
          shortCopy.dataset.c = shortUrl;
          shortCopy.setAttribute("aria-label", "Copy short URL");
          shortCopy.querySelectorAll("svg").forEach((s) => s.setAttribute("aria-hidden", "true"));

          const fld = el(
            "div",
            "zwg-fld",
            el("span", "zwg-fld-lbl", "Short URL"),
            el("div", "zwg-fld-row", shortInput, shortCopy),
          );

          overlay.querySelector(".zwg-acts").before(fld);

          fld.querySelector(".zwg-copy").onclick = async function () {
            try {
              await navigator.clipboard.writeText(shortUrl);
              this.classList.add("ok");
              setIcon(this, ic.ok);
              setTimeout(() => {
                this.classList.remove("ok");
                setIcon(this, ic.cp);
              }, 1500);
            } catch {}
          };
        } catch (err) {
          shortBtn.replaceChildren(svg(ic.lnk), document.createTextNode(" Retry"));
          shortBtn.disabled = false;
          console.error(err);
        }
      };
      } catch (err) {
        overlay = null;
        if (isQrCapacityError(err)) {
          openError(
            "This payment request is too large to display as a QR code. Try a shorter memo.",
          );
        } else {
          console.error("[Zcash-Payment-URI-Widget] Failed to open:", err);
          openError("Something went wrong while creating this payment request.");
        }
      }
    }

    function close() {
      if (!overlay) return;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      onKeyDown = null;
      onFocusIn = null;
      overlay.remove();
      overlay = null;

      const target = opener;
      opener = null;
      if (target && target.isConnected && typeof target.focus === "function") {
        target.focus();
      }
    }

    function destroy() {
      close();
      btn.remove();
    }

    btn.setAttribute("aria-haspopup", "dialog");
    btn.querySelectorAll("svg").forEach((s) => s.setAttribute("aria-hidden", "true"));
    btn.onclick = open;

    return { open, close, destroy };
  }

  // Expose globally
  window.renderZcashButton = renderZcashButton;

  // ------------------------------
  //   AUTO-MOUNT HANDLING
  // ------------------------------
  const script = document.currentScript;

  if (
    script &&
    script.dataset &&
    script.dataset.target &&
    script.dataset.address &&
    script.dataset.amount
  ) {
    const target = script.dataset.target;

    const inst = renderZcashButton(target, {
      address: script.dataset.address,
      amount: script.dataset.amount,
      zecUsdRate: script.dataset.zecUsdRate,
      label: script.dataset.label,
      theme: script.dataset.theme,
      memo: script.dataset.memo,
      apiBase: script.dataset.apiBase || DEFAULT_API_BASE,
      disabled: script.dataset.disabled,
    });

    window.__zcash_paymet_uri_widget_autoinstance = inst;
  }
})();
