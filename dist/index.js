"use strict";function objToNode(e,t,o){var n;return"#text"===e.nodeName?n=o.document.createTextNode(e.data):"#comment"===e.nodeName?n=o.document.createComment(e.data):("svg"===e.nodeName||t?(n=o.document.createElementNS("http://www.w3.org/2000/svg",e.nodeName),t=!0):n=o.caseSensitive?o.document.createElementNS(null,e.nodeName):o.document.createElement(e.nodeName),e.attributes&&Object.entries(e.attributes).forEach(function(e){var t=e[0],o=e[1];return n.setAttribute(t,o)}),e.childNodes&&e.childNodes.forEach(function(e){return n.appendChild(objToNode(e,t,o))}),o.valueDiffing&&(e.value&&(n.value=e.value),e.checked&&(n.checked=e.checked),e.selected&&(n.selected=e.selected))),n}function getFromRoute(e,t){for(t=t.slice();t.length>0;){if(!e.childNodes)return!1;var o=t.splice(0,1)[0];e=e.childNodes[o]}return e}function applyDiff(e,t,o){var n,s,i,a,l=getFromRoute(e,t[o._const.route]),r={diff:t,node:l};if(o.preDiffApply(r))return!0;switch(t[o._const.action]){case o._const.addAttribute:if(!l||!l.setAttribute)return!1;l.setAttribute(t[o._const.name],t[o._const.value]);break;case o._const.modifyAttribute:if(!l||!l.setAttribute)return!1;l.setAttribute(t[o._const.name],t[o._const.newValue]),"INPUT"===l.nodeName&&"value"===t[o._const.name]&&(l.value=t[o._const.newValue]);break;case o._const.removeAttribute:if(!l||!l.removeAttribute)return!1;l.removeAttribute(t[o._const.name]);break;case o._const.modifyTextElement:if(!l||3!==l.nodeType)return!1;o.textDiff(l,l.data,t[o._const.oldValue],t[o._const.newValue]);break;case o._const.modifyValue:if(!l||void 0===l.value)return!1;l.value=t[o._const.newValue];break;case o._const.modifyComment:if(!l||void 0===l.data)return!1;o.textDiff(l,l.data,t[o._const.oldValue],t[o._const.newValue]);break;case o._const.modifyChecked:if(!l||void 0===l.checked)return!1;l.checked=t[o._const.newValue];break;case o._const.modifySelected:if(!l||void 0===l.selected)return!1;l.selected=t[o._const.newValue];break;case o._const.replaceElement:l.parentNode.replaceChild(objToNode(t[o._const.newValue],"http://www.w3.org/2000/svg"===l.namespaceURI,o),l);break;case o._const.relocateGroup:Array.apply(void 0,new Array(t.groupLength)).map(function(){return l.removeChild(l.childNodes[t[o._const.from]])}).forEach(function(e,n){0===n&&(s=l.childNodes[t[o._const.to]]),l.insertBefore(e,s||null)});break;case o._const.removeElement:l.parentNode.removeChild(l);break;case o._const.addElement:a=(i=t[o._const.route].slice()).splice(i.length-1,1)[0],(l=getFromRoute(e,i)).insertBefore(objToNode(t[o._const.element],"http://www.w3.org/2000/svg"===l.namespaceURI,o),l.childNodes[a]||null);break;case o._const.removeTextElement:if(!l||3!==l.nodeType)return!1;l.parentNode.removeChild(l);break;case o._const.addTextElement:if(a=(i=t[o._const.route].slice()).splice(i.length-1,1)[0],n=o.document.createTextNode(t[o._const.value]),!(l=getFromRoute(e,i))||!l.childNodes)return!1;l.insertBefore(n,l.childNodes[a]||null);break;default:console.log("unknown action")}return r.newNode=n,o.postDiffApply(r),!0}function applyDOM(e,t,o){return t.every(function(t){return applyDiff(e,t,o)})}function swap(e,t,o){var n=e[t];e[t]=e[o],e[o]=n}function undoDiff(e,t,o){switch(t[o._const.action]){case o._const.addAttribute:t[o._const.action]=o._const.removeAttribute,applyDiff(e,t,o);break;case o._const.modifyAttribute:swap(t,o._const.oldValue,o._const.newValue),applyDiff(e,t,o);break;case o._const.removeAttribute:t[o._const.action]=o._const.addAttribute,applyDiff(e,t,o);break;case o._const.modifyTextElement:case o._const.modifyValue:case o._const.modifyComment:case o._const.modifyChecked:case o._const.modifySelected:case o._const.replaceElement:swap(t,o._const.oldValue,o._const.newValue),applyDiff(e,t,o);break;case o._const.relocateGroup:swap(t,o._const.from,o._const.to),applyDiff(e,t,o);break;case o._const.removeElement:t[o._const.action]=o._const.addElement,applyDiff(e,t,o);break;case o._const.addElement:t[o._const.action]=o._const.removeElement,applyDiff(e,t,o);break;case o._const.removeTextElement:t[o._const.action]=o._const.addTextElement,applyDiff(e,t,o);break;case o._const.addTextElement:t[o._const.action]=o._const.removeTextElement,applyDiff(e,t,o);break;default:console.log("unknown action")}}function undoDOM(e,t,o){t.length||(t=[t]),(t=t.slice()).reverse(),t.forEach(function(t){undoDiff(e,t,o)})}Object.defineProperty(exports,"__esModule",{value:!0});var Diff=function(e){var t=this;void 0===e&&(e={}),Object.entries(e).forEach(function(e){var o=e[0],n=e[1];return t[o]=n})};function elementDescriptors(e){var t=[];return"#text"!==e.nodeName&&"#comment"!==e.nodeName&&(t.push(e.nodeName),e.attributes&&(e.attributes.class&&t.push(e.nodeName+"."+e.attributes.class.replace(/ /g,".")),e.attributes.id&&t.push(e.nodeName+"#"+e.attributes.id))),t}function findUniqueDescriptors(e){var t={},o={};return e.forEach(function(e){elementDescriptors(e).forEach(function(e){var n=e in t;n||e in o?n&&(delete t[e],o[e]=!0):t[e]=!0})}),t}function uniqueInBoth(e,t){var o=findUniqueDescriptors(e),n=findUniqueDescriptors(t),s={};return Object.keys(o).forEach(function(e){n[e]&&(s[e]=!0)}),s}function removeDone(e){return delete e.outerDone,delete e.innerDone,delete e.valueDone,!e.childNodes||e.childNodes.every(removeDone)}function isEqual(e,t){if(!["nodeName","value","checked","selected","data"].every(function(o){return e[o]===t[o]}))return!1;if(Boolean(e.attributes)!==Boolean(t.attributes))return!1;if(Boolean(e.childNodes)!==Boolean(t.childNodes))return!1;if(e.attributes){var o=Object.keys(e.attributes),n=Object.keys(t.attributes);if(o.length!==n.length)return!1;if(!o.every(function(o){return e.attributes[o]===t.attributes[o]}))return!1}if(e.childNodes){if(e.childNodes.length!==t.childNodes.length)return!1;if(!e.childNodes.every(function(e,o){return isEqual(e,t.childNodes[o])}))return!1}return!0}function roughlyEqual(e,t,o,n,s){if(!e||!t)return!1;if(e.nodeName!==t.nodeName)return!1;if("#text"===e.nodeName)return!!s||e.data===t.data;if(e.nodeName in o)return!0;if(e.attributes&&t.attributes){if(e.attributes.id){if(e.attributes.id!==t.attributes.id)return!1;if(e.nodeName+"#"+e.attributes.id in o)return!0}if(e.attributes.class&&e.attributes.class===t.attributes.class)if(e.nodeName+"."+e.attributes.class.replace(/ /g,".")in o)return!0}if(n)return!0;var i=e.childNodes?e.childNodes.slice().reverse():[],a=t.childNodes?t.childNodes.slice().reverse():[];if(i.length!==a.length)return!1;if(s)return i.every(function(e,t){return e.nodeName===a[t].nodeName});var l=uniqueInBoth(i,a);return i.every(function(e,t){return roughlyEqual(e,a[t],l,!0,!0)})}function cloneObj(e){return JSON.parse(JSON.stringify(e))}function findCommonSubsets(e,t,o,n){var s=0,i=[],a=e.length,l=t.length,r=Array.apply(void 0,new Array(a+1)).map(function(){return[]}),c=uniqueInBoth(e,t),u=a===l;u&&e.some(function(e,o){var n=elementDescriptors(e),s=elementDescriptors(t[o]);return n.length!==s.length?(u=!1,!0):(n.some(function(e,t){if(e!==s[t])return u=!1,!0}),!u||void 0)});for(var d=0;d<a;d++)for(var f=e[d],h=0;h<l;h++){var p=t[h];o[d]||n[h]||!roughlyEqual(f,p,c,u)?r[d+1][h+1]=0:(r[d+1][h+1]=r[d][h]?r[d][h]+1:1,r[d+1][h+1]>=s&&(s=r[d+1][h+1],i=[d+1,h+1]))}return 0!==s&&{oldValue:i[0]-s,newValue:i[1]-s,length:s}}function makeArray(e,t){return Array.apply(void 0,new Array(e)).map(function(){return t})}function getGapInformation(e,t,o){var n=e.childNodes?makeArray(e.childNodes.length,!0):[],s=t.childNodes?makeArray(t.childNodes.length,!0):[],i=0;return o.forEach(function(e){for(var t=e.oldValue+e.length,o=e.newValue+e.length,a=e.oldValue;a<t;a+=1)n[a]=i;for(var l=e.newValue;l<o;l+=1)s[l]=i;i+=1}),{gaps1:n,gaps2:s}}function markSubTrees(e,t){for(var o=e.childNodes?e.childNodes:[],n=t.childNodes?t.childNodes:[],s=makeArray(o.length,!1),i=makeArray(n.length,!1),a=[],l=!0,r=function(){return arguments[1]};l;){if(l=findCommonSubsets(o,n,s,i))a.push(l),Array.apply(void 0,new Array(l.length)).map(r).forEach(function(e){return t=e,s[l.oldValue+t]=!0,void(i[l.newValue+t]=!0);var t})}return e.subsets=a,e.subsetsAge=100,a}Diff.prototype.toString=function(){return JSON.stringify(this)},Diff.prototype.setValue=function(e,t){return this[e]=t,this};var DiffTracker=function(){this.list=[]};function getFromVirtualRoute(e,t){var o,n,s=e;for(t=t.slice();t.length>0;){if(!s.childNodes)return!1;n=t.splice(0,1)[0],o=s,s=s.childNodes[n]}return{node:s,parentNode:o,nodeIndex:n}}function applyVirtualDiff(e,t,o){var n,s,i,a=getFromVirtualRoute(e,t[o._const.route]),l=a.node,r=a.parentNode,c=a.nodeIndex,u=[],d={diff:t,node:l};if(o.preDiffApply(d))return!0;switch(t[o._const.action]){case o._const.addAttribute:l.attributes||(l.attributes={}),l.attributes[t[o._const.name]]=t[o._const.value],"checked"===t[o._const.name]?l.checked=!0:"selected"===t[o._const.name]?l.selected=!0:"INPUT"===l.nodeName&&"value"===t[o._const.name]&&(l.value=t[o._const.value]);break;case o._const.modifyAttribute:l.attributes[t[o._const.name]]=t[o._const.newValue];break;case o._const.removeAttribute:delete l.attributes[t[o._const.name]],0===Object.keys(l.attributes).length&&delete l.attributes,"checked"===t[o._const.name]?l.checked=!1:"selected"===t[o._const.name]?delete l.selected:"INPUT"===l.nodeName&&"value"===t[o._const.name]&&delete l.value;break;case o._const.modifyTextElement:l.data=t[o._const.newValue];break;case o._const.modifyValue:l.value=t[o._const.newValue];break;case o._const.modifyComment:l.data=t[o._const.newValue];break;case o._const.modifyChecked:l.checked=t[o._const.newValue];break;case o._const.modifySelected:l.selected=t[o._const.newValue];break;case o._const.replaceElement:(n=cloneObj(t[o._const.newValue])).outerDone=!0,n.innerDone=!0,n.valueDone=!0,r.childNodes[c]=n;break;case o._const.relocateGroup:l.childNodes.splice(t[o._const.from],t.groupLength).reverse().forEach(function(e){return l.childNodes.splice(t[o._const.to],0,e)}),l.subsets&&l.subsets.forEach(function(e){if(t[o._const.from]<t[o._const.to]&&e.oldValue<=t[o._const.to]&&e.oldValue>t[o._const.from]){e.oldValue-=t.groupLength;var n=e.oldValue+e.length-t[o._const.to];n>0&&(u.push({oldValue:t[o._const.to]+t.groupLength,newValue:e.newValue+e.length-n,length:n}),e.length-=n)}else if(t[o._const.from]>t[o._const.to]&&e.oldValue>t[o._const.to]&&e.oldValue<t[o._const.from]){e.oldValue+=t.groupLength;var s=e.oldValue+e.length-t[o._const.to];s>0&&(u.push({oldValue:t[o._const.to]+t.groupLength,newValue:e.newValue+e.length-s,length:s}),e.length-=s)}else e.oldValue===t[o._const.from]&&(e.oldValue=t[o._const.to])});break;case o._const.removeElement:r.childNodes.splice(c,1),r.subsets&&r.subsets.forEach(function(e){e.oldValue>c?e.oldValue-=1:e.oldValue===c?e.delete=!0:e.oldValue<c&&e.oldValue+e.length>c&&(e.oldValue+e.length-1===c?e.length--:(u.push({newValue:e.newValue+c-e.oldValue,oldValue:c,length:e.length-c+e.oldValue-1}),e.length=c-e.oldValue))}),l=r;break;case o._const.addElement:s=t[o._const.route].slice(),i=s.splice(s.length-1,1)[0],l=getFromVirtualRoute(e,s).node,(n=cloneObj(t[o._const.element])).outerDone=!0,n.innerDone=!0,n.valueDone=!0,l.childNodes||(l.childNodes=[]),i>=l.childNodes.length?l.childNodes.push(n):l.childNodes.splice(i,0,n),l.subsets&&l.subsets.forEach(function(e){if(e.oldValue>=i)e.oldValue+=1;else if(e.oldValue<i&&e.oldValue+e.length>i){var t=e.oldValue+e.length-i;u.push({newValue:e.newValue+e.length-t,oldValue:i+1,length:t}),e.length-=t}});break;case o._const.removeTextElement:r.childNodes.splice(c,1),"TEXTAREA"===r.nodeName&&delete r.value,r.subsets&&r.subsets.forEach(function(e){e.oldValue>c?e.oldValue-=1:e.oldValue===c?e.delete=!0:e.oldValue<c&&e.oldValue+e.length>c&&(e.oldValue+e.length-1===c?e.length--:(u.push({newValue:e.newValue+c-e.oldValue,oldValue:c,length:e.length-c+e.oldValue-1}),e.length=c-e.oldValue))}),l=r;break;case o._const.addTextElement:s=t[o._const.route].slice(),i=s.splice(s.length-1,1)[0],(n={}).nodeName="#text",n.data=t[o._const.value],(l=getFromVirtualRoute(e,s).node).childNodes||(l.childNodes=[]),i>=l.childNodes.length?l.childNodes.push(n):l.childNodes.splice(i,0,n),"TEXTAREA"===l.nodeName&&(l.value=t[o._const.newValue]),l.subsets&&l.subsets.forEach(function(e){if(e.oldValue>=i&&(e.oldValue+=1),e.oldValue<i&&e.oldValue+e.length>i){var t=e.oldValue+e.length-i;u.push({newValue:e.newValue+e.length-t,oldValue:i+1,length:t}),e.length-=t}});break;default:console.log("unknown action")}l.subsets&&(l.subsets=l.subsets.filter(function(e){return!e.delete&&e.oldValue!==e.newValue}),u.length&&(l.subsets=l.subsets.concat(u))),d.newNode=n,o.postDiffApply(d)}function applyVirtual(e,t,o){return t.forEach(function(t){applyVirtualDiff(e,t,o)}),!0}function nodeToObj(e,t){void 0===t&&(t={});var o={};if(o.nodeName=e.nodeName,"#text"===o.nodeName||"#comment"===o.nodeName)o.data=e.data;else{if(e.attributes&&e.attributes.length>0)o.attributes={},Array.prototype.slice.call(e.attributes).forEach(function(e){return o.attributes[e.name]=e.value});if("TEXTAREA"===o.nodeName)o.value=e.value;else if(e.childNodes&&e.childNodes.length>0){o.childNodes=[],Array.prototype.slice.call(e.childNodes).forEach(function(e){return o.childNodes.push(nodeToObj(e,t))})}t.valueDiffing&&(void 0!==e.checked&&e.type&&["radio","checkbox"].includes(e.type.toLowerCase())?o.checked=e.checked:void 0!==e.value&&(o.value=e.value),void 0!==e.selected&&(o.selected=e.selected))}return o}DiffTracker.prototype.add=function(e){var t;(t=this.list).push.apply(t,e)},DiffTracker.prototype.forEach=function(e){this.list.forEach(function(t){return e(t)})};var tagRE=/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g,empty=Object.create?Object.create(null):{},attrRE=/([\w-:]+)|(['"])([^'"]*)\2/g,lookup={area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,menuItem:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0};function parseTag(e){var t,o=0,n={nodeName:""};return e.replace(attrRE,function(s){o%2?t=s:0===o?((lookup[s]||"/"===e.charAt(e.length-2))&&(n.voidElement=!0),n.nodeName=s.toUpperCase()):(n.attributes||(n.attributes={}),n.attributes[t]=s.replace(/^['"]|['"]$/g,"")),o++}),n}function parse(e,t){void 0===t&&(t={components:empty});var o,n=[],s=-1,i=[],a={},l=!1;return e.replace(tagRE,function(r,c){if(l){if(r!=="</"+o.nodeName+">")return;l=!1}var u,d="/"!==r.charAt(1),f=c+r.length,h=e.charAt(f);if(d&&(s++,"tag"===(o=parseTag(r)).type&&t.components[o.nodeName]&&(o.type="component",l=!0),o.voidElement||l||!h||"<"===h||(o.childNodes||(o.childNodes=[]),o.childNodes.push({nodeName:"#text",data:e.slice(f,e.indexOf("<",f))})),a[o.tagName]=o,0===s&&n.push(o),(u=i[s-1])&&(u.childNodes||(u.childNodes=[]),u.childNodes.push(o)),i[s]=o),(!d||o.voidElement)&&(s--,!l&&"<"!==h&&h)){u=-1===s?n:i[s].childNodes||[];var p=e.indexOf("<",f),m=e.slice(f,-1===p?void 0:p);u.push({nodeName:"#text",data:m})}}),n[0]}function cleanObj(e){return delete e.voidElement,e.childNodes&&e.childNodes.forEach(function(e){return cleanObj(e)}),e}function stringToObj(e){return cleanObj(parse(e))}var DiffFinder=function(e,t,o){this.options=o,this.t1=e instanceof HTMLElement?nodeToObj(e,this.options):"string"==typeof e?stringToObj(e,this.options):JSON.parse(JSON.stringify(e)),this.t2=t instanceof HTMLElement?nodeToObj(t,this.options):"string"==typeof t?stringToObj(t,this.options):JSON.parse(JSON.stringify(t)),this.diffcount=0,this.foundAll=!1,this.debug&&(this.t1Orig=nodeToObj(e,this.options),this.t2Orig=nodeToObj(t,this.options)),this.tracker=new DiffTracker};DiffFinder.prototype.init=function(){return this.findDiffs(this.t1,this.t2)},DiffFinder.prototype.findDiffs=function(e,t){var o;do{if(this.options.debug&&(this.diffcount+=1,this.diffcount>this.options.diffcap))throw window.diffError=[this.t1Orig,this.t2Orig],new Error("surpassed diffcap:"+JSON.stringify(this.t1Orig)+" -> "+JSON.stringify(this.t2Orig));0===(o=this.findNextDiff(e,t,[])).length&&(isEqual(e,t)||(this.foundAll?console.error("Could not find remaining diffs!"):(this.foundAll=!0,removeDone(e),o=this.findNextDiff(e,t,[])))),o.length>0&&(this.foundAll=!1,this.tracker.add(o),applyVirtual(e,o,this.options))}while(o.length>0);return this.tracker.list},DiffFinder.prototype.findNextDiff=function(e,t,o){var n,s;if(this.options.maxDepth&&o.length>this.options.maxDepth)return[];if(!e.outerDone){if(n=this.findOuterDiff(e,t,o),this.options.filterOuterDiff&&(s=this.options.filterOuterDiff(e,t,n))&&(n=s),n.length>0)return e.outerDone=!0,n;e.outerDone=!0}if(!e.innerDone){if((n=this.findInnerDiff(e,t,o)).length>0)return n;e.innerDone=!0}if(this.options.valueDiffing&&!e.valueDone){if((n=this.findValueDiff(e,t,o)).length>0)return e.valueDone=!0,n;e.valueDone=!0}return[]},DiffFinder.prototype.findOuterDiff=function(e,t,o){var n,s,i,a,l,r,c=[];if(e.nodeName!==t.nodeName){if(!o.length)throw new Error("Top level nodes have to be of the same kind.");return[(new Diff).setValue(this.options._const.action,this.options._const.replaceElement).setValue(this.options._const.oldValue,cloneObj(e)).setValue(this.options._const.newValue,cloneObj(t)).setValue(this.options._const.route,o)]}if(o.length&&this.options.maxNodeDiffCount<Math.abs((e.childNodes||[]).length-(t.childNodes||[]).length))return[(new Diff).setValue(this.options._const.action,this.options._const.replaceElement).setValue(this.options._const.oldValue,cloneObj(e)).setValue(this.options._const.newValue,cloneObj(t)).setValue(this.options._const.route,o)];if(e.data!==t.data)return"#text"===e.nodeName?[(new Diff).setValue(this.options._const.action,this.options._const.modifyTextElement).setValue(this.options._const.route,o).setValue(this.options._const.oldValue,e.data).setValue(this.options._const.newValue,t.data)]:[(new Diff).setValue(this.options._const.action,this.options._const.modifyComment).setValue(this.options._const.route,o).setValue(this.options._const.oldValue,e.data).setValue(this.options._const.newValue,t.data)];for(s=e.attributes?Object.keys(e.attributes).sort():[],i=t.attributes?Object.keys(t.attributes).sort():[],a=s.length,r=0;r<a;r++)n=s[r],-1===(l=i.indexOf(n))?c.push((new Diff).setValue(this.options._const.action,this.options._const.removeAttribute).setValue(this.options._const.route,o).setValue(this.options._const.name,n).setValue(this.options._const.value,e.attributes[n])):(i.splice(l,1),e.attributes[n]!==t.attributes[n]&&c.push((new Diff).setValue(this.options._const.action,this.options._const.modifyAttribute).setValue(this.options._const.route,o).setValue(this.options._const.name,n).setValue(this.options._const.oldValue,e.attributes[n]).setValue(this.options._const.newValue,t.attributes[n])));for(a=i.length,r=0;r<a;r++)n=i[r],c.push((new Diff).setValue(this.options._const.action,this.options._const.addAttribute).setValue(this.options._const.route,o).setValue(this.options._const.name,n).setValue(this.options._const.value,t.attributes[n]));return c},DiffFinder.prototype.findInnerDiff=function(e,t,o){var n=e.childNodes?e.childNodes.slice():[],s=t.childNodes?t.childNodes.slice():[],i=Math.max(n.length,s.length),a=Math.abs(n.length-s.length),l=[],r=0;if(!this.options.maxChildCount||i<this.options.maxChildCount){var c=e.subsets&&e.subsetsAge--?e.subsets:e.childNodes&&t.childNodes?markSubTrees(e,t):[];if(c.length>0&&(l=this.attemptGroupRelocation(e,t,c,o)).length>0)return l}for(var u=0;u<i;u+=1){var d=n[u],f=s[u];a&&(d&&!f?"#text"===d.nodeName?(l.push((new Diff).setValue(this.options._const.action,this.options._const.removeTextElement).setValue(this.options._const.route,o.concat(r)).setValue(this.options._const.value,d.data)),r-=1):(l.push((new Diff).setValue(this.options._const.action,this.options._const.removeElement).setValue(this.options._const.route,o.concat(r)).setValue(this.options._const.element,cloneObj(d))),r-=1):f&&!d&&("#text"===f.nodeName?l.push((new Diff).setValue(this.options._const.action,this.options._const.addTextElement).setValue(this.options._const.route,o.concat(r)).setValue(this.options._const.value,f.data)):l.push((new Diff).setValue(this.options._const.action,this.options._const.addElement).setValue(this.options._const.route,o.concat(r)).setValue(this.options._const.element,cloneObj(f))))),d&&f&&(!this.options.maxChildCount||i<this.options.maxChildCount?l=l.concat(this.findNextDiff(d,f,o.concat(r))):isEqual(d,f)||(n.length>s.length?(l=l.concat([(new Diff).setValue(this.options._const.action,this.options._const.removeElement).setValue(this.options._const.element,cloneObj(d)).setValue(this.options._const.route,o.concat(r))]),n.splice(u,1),r-=1,a-=1):n.length<s.length?(l=l.concat([(new Diff).setValue(this.options._const.action,this.options._const.addElement).setValue(this.options._const.element,cloneObj(f)).setValue(this.options._const.route,o.concat(r))]),n.splice(u,0,{}),a-=1):l=l.concat([(new Diff).setValue(this.options._const.action,this.options._const.replaceElement).setValue(this.options._const.oldValue,cloneObj(d)).setValue(this.options._const.newValue,cloneObj(f)).setValue(this.options._const.route,o.concat(r))]))),r+=1}return e.innerDone=!0,l},DiffFinder.prototype.attemptGroupRelocation=function(e,t,o,n){for(var s,i,a,l,r,c,u=getGapInformation(e,t,o),d=u.gaps1,f=u.gaps2,h=Math.min(d.length,f.length),p=[],m=0,_=0;m<h;_+=1,m+=1)if(!0===d[m])if("#text"===(l=e.childNodes[_]).nodeName){if("#text"===t.childNodes[m].nodeName&&l.data!==t.childNodes[m].data){for(c=_;e.childNodes.length>c+1&&"#text"===e.childNodes[c+1].nodeName;)if(c+=1,t.childNodes[m].data===e.childNodes[c].data){r=!0;break}if(!r)return p.push((new Diff).setValue(this.options._const.action,this.options._const.modifyTextElement).setValue(this.options._const.route,n.concat(m)).setValue(this.options._const.oldValue,l.data).setValue(this.options._const.newValue,t.childNodes[m].data)),p}p.push((new Diff).setValue(this.options._const.action,this.options._const.removeTextElement).setValue(this.options._const.route,n.concat(m)).setValue(this.options._const.value,l.data)),d.splice(m,1),h=Math.min(d.length,f.length),m-=1}else p.push((new Diff).setValue(this.options._const.action,this.options._const.removeElement).setValue(this.options._const.route,n.concat(m)).setValue(this.options._const.element,cloneObj(l))),d.splice(m,1),h=Math.min(d.length,f.length),m-=1;else if(!0===f[m])"#text"===(l=t.childNodes[m]).nodeName?(p.push((new Diff).setValue(this.options._const.action,this.options._const.addTextElement).setValue(this.options._const.route,n.concat(m)).setValue(this.options._const.value,l.data)),d.splice(m,0,!0),h=Math.min(d.length,f.length),_-=1):(p.push((new Diff).setValue(this.options._const.action,this.options._const.addElement).setValue(this.options._const.route,n.concat(m)).setValue(this.options._const.element,cloneObj(l))),d.splice(m,0,!0),h=Math.min(d.length,f.length),_-=1);else if(d[m]!==f[m]){if(p.length>0)return p;if(a=o[d[m]],(i=Math.min(a.newValue,e.childNodes.length-a.length))!==a.oldValue){s=!1;for(var g=0;g<a.length;g+=1)roughlyEqual(e.childNodes[i+g],e.childNodes[a.oldValue+g],[],!1,!0)||(s=!0);if(s)return[(new Diff).setValue(this.options._const.action,this.options._const.relocateGroup).setValue("groupLength",a.length).setValue(this.options._const.from,a.oldValue).setValue(this.options._const.to,i).setValue(this.options._const.route,n)]}}return p},DiffFinder.prototype.findValueDiff=function(e,t,o){var n=[];return e.selected!==t.selected&&n.push((new Diff).setValue(this.options._const.action,this.options._const.modifySelected).setValue(this.options._const.oldValue,e.selected).setValue(this.options._const.newValue,t.selected).setValue(this.options._const.route,o)),(e.value||t.value)&&e.value!==t.value&&"OPTION"!==e.nodeName&&n.push((new Diff).setValue(this.options._const.action,this.options._const.modifyValue).setValue(this.options._const.oldValue,e.value||"").setValue(this.options._const.newValue,t.value||"").setValue(this.options._const.route,o)),e.checked!==t.checked&&n.push((new Diff).setValue(this.options._const.action,this.options._const.modifyChecked).setValue(this.options._const.oldValue,e.checked).setValue(this.options._const.newValue,t.checked).setValue(this.options._const.route,o)),n};var DEFAULT_OPTIONS={debug:!1,diffcap:10,maxDepth:!1,maxChildCount:50,valueDiffing:!0,textDiff:function(e,t,o,n){e.data=n},preVirtualDiffApply:function(){},postVirtualDiffApply:function(){},preDiffApply:function(){},postDiffApply:function(){},filterOuterDiff:null,compress:!1,caseSensitive:!1,_const:!1,document:!(!window||!window.document)&&window.document},DiffDOM=function(e){var t=this;if(void 0===e&&(e={}),this.options=e,Object.entries(DEFAULT_OPTIONS).forEach(function(e){var o=e[0],n=e[1];Object.prototype.hasOwnProperty.call(t.options,o)||(t.options[o]=n)}),!this.options._const){var o=["addAttribute","modifyAttribute","removeAttribute","modifyTextElement","relocateGroup","removeElement","addElement","removeTextElement","addTextElement","replaceElement","modifyValue","modifyChecked","modifySelected","modifyComment","action","route","oldValue","newValue","element","group","from","to","name","value","data","attributes","nodeName","childNodes","checked","selected"];this.options._const={},this.options.compress?o.forEach(function(e,o){return t.options._const[e]=o}):o.forEach(function(e){return t.options._const[e]=e})}this.DiffFinder=DiffFinder};DiffDOM.prototype.apply=function(e,t){return applyDOM(e,t,this.options)},DiffDOM.prototype.undo=function(e,t){return undoDOM(e,t,this.options)},DiffDOM.prototype.diff=function(e,t){return new this.DiffFinder(e,t,this.options).init()};var TraceLogger=function(e){var t=this;void 0===e&&(e={}),this.pad="│   ",this.padding="",this.tick=1,this.messages=[];var o=function(e,o){var n=e[o];e[o]=function(){for(var s=[],i=arguments.length;i--;)s[i]=arguments[i];t.fin(o,Array.prototype.slice.call(s));var a=n.apply(e,s);return t.fout(o,a),a}};for(var n in e)"function"==typeof e[n]&&o(e,n);this.log("┌ TRACELOG START")};TraceLogger.prototype.fin=function(e,t){this.padding+=this.pad,this.log("├─> entering "+e,t)},TraceLogger.prototype.fout=function(e,t){this.log("│<──┘ generated return value",t),this.padding=this.padding.substring(0,this.padding.length-this.pad.length)},TraceLogger.prototype.format=function(e,t){return function(e){for(e=""+e;e.length<4;)e="0"+e;return e}(t)+"> "+this.padding+e},TraceLogger.prototype.log=function(){var e=Array.prototype.slice.call(arguments),t=function(e){return e?"string"==typeof e?e:e instanceof HTMLElement?e.outerHTML||"<empty>":e instanceof Array?"["+e.map(t).join(",")+"]":e.toString()||e.valueOf()||"<unknown>":"<falsey>"};e=e.map(t).join(", "),this.messages.push(this.format(e,this.tick++))},TraceLogger.prototype.toString=function(){for(var e="└───";e.length<=this.padding.length+this.pad.length;)e+="×   ";var t=this.padding;return this.padding="",e=this.format(e,this.tick),this.padding=t,this.messages.join("\n")+"\n"+e},exports.DiffDOM=DiffDOM,exports.TraceLogger=TraceLogger,exports.nodeToObj=nodeToObj,exports.stringToObj=stringToObj;
//# sourceMappingURL=index.js.map
