
FT.Render.ContentTabs=function(el){this.el=el;var myself=this,tabContentIDs=[],selectedClass="ft-state-selected",hiddenClass="ft-state-hidden",defaultClass="ft-state-default";function init(){myself.el.find('> li').each(function(tabIndex){var $this=FT.$(this),dataTabComps=$this.data('tab-comps')||"";tabContentIDs[tabIndex]=dataTabComps.toString().split('-');});myself.selectTab(myself.el.find("."+selectedClass).index());myself.el.on("click.contentTabEvents","a",function(ev){ev.preventDefault();var clickedTab=FT.$(ev.target).closest("li");if(clickedTab.length){myself.selectTab(clickedTab.index());}});}
function getTabContentIDs(tabId){return tabContentIDs[tabId];}
function getAllIDs(){var all=[];return all.concat.apply(all,tabContentIDs);}
function setTabContentVisibility(selectedTabIndex){var allIDs=getAllIDs(),selectedTabContentIDs=getTabContentIDs(selectedTabIndex);FT.$.each(allIDs,function(k,id){FT.$("#"+id).addClass(hiddenClass);});FT.$.each(selectedTabContentIDs,function(i,tabContentID){FT.$("#"+tabContentID).removeClass(hiddenClass);});}
function highlightTab(tabIndex){var selectedTab=myself.el.find("> li").eq(tabIndex);if(selectedTab.length){myself.el.find("> li").removeClass(selectedClass).addClass(defaultClass);selectedTab.removeClass(defaultClass).addClass(selectedClass);}}
this.selectTab=function(tabIndex){highlightTab(tabIndex);setTabContentVisibility(tabIndex);FT.customEvents.trigger("contentTabSelected",{selectedTabText:FT.$.trim(myself.el.find("> li").eq(tabIndex).text()),selectedTabIDs:getTabContentIDs(tabIndex)});};this.destroy=function(){myself.el.off("click.contentTabEvents","li");};init();};FT.LiveFeedWidget=function(listEl,config){if(FT.$.type(config)!=="object"){config={};}
var items=[],itemLimit=config.itemLimit||10,renderLimit=config.renderLimit||4,widgetName=config.name||"livefeedwidget",transition="none",transitionDuration=config.transitionDuration||2000,timeoutDelay=config.timeoutDelay||2000;function renderItem(data){var titleTagStart='<'+((config.url)?'a href="'+config.url+'"':'span')+' class="'+widgetName+'-title">',titleTagEnd=(config.url)?'</a>':'</span>',htmlStr='<div class="'+widgetName+'-listitem" data-itemid="'+data.id+'" data-transition="'+transition+'">';htmlStr+=titleTagStart+data.title+titleTagEnd;htmlStr+='</div>';data.el=FT.$(htmlStr);}
function renderItems(){listEl.empty();var c,l;for(c=0,l=Math.min(items.length,renderLimit);c<l;c=c+1){listEl.append(items[c].el);}}
function applyTransitions(){var highlightEls=listEl.find("[data-transition=highlight]");transitionDuration=(FT.featureDetect&&!FT.featureDetect.supportsTransitions)?transitionDuration:10;highlightEls.addClass(widgetName+"-state-highlight");highlightEls.attr("data-transition","none");setTimeout(function(){highlightEls.removeClass(widgetName+"-state-highlight");},transitionDuration);}
function clearItems(){items=[];renderItems();}
function hasItem(item){if(!item||!item.id){return false;}
var c;for(c=0;c<items.length;c=c+1){if(items[c].id===item.id){return true;}}
return false;}
function removeItem(item){if(!item||!item.id){return;}
var c,reRender=false;for(c=0;c<items.length;c=c+1){if(items[c].id===item.id){items.splice(c,1);c=c-1;reRender=true;}}
if(reRender){renderItems();}}
function limitItems(){if(items.length>itemLimit){items.splice(itemLimit);}}
function sortItems(){items.sort(function(a,b){if(a&&a.datepublished&&b&&b.datepublished){return b.datepublished-a.datepublished;}
return 0;});}
function addItem(item){var hasTheItem=hasItem(item);removeItem(item);if(!item||item.status!=="live"){return;}
items.push(item);sortItems();if(!hasTheItem&&items.length>renderLimit&&items[0]==item){transition="highlight";}else{transition="none";}
renderItem(item);limitItems();renderItems();applyTransitions();}
function getItems(){return items;}
this.add=addItem;this.update=addItem;this.getItems=getItems;this.remove=removeItem;this.removeAll=clearItems;setTimeout(function(){listEl.find(".fastft-unavailable").removeClass("ft-state-hidden");},timeoutDelay);};FT.MarketsDataWidget=function(el,config){var containerEl,tabsEl,tabContentEls=[],lastUpdated=[],dataTimeToLive=config.dataTimeToLive||0,templates={container:'<div class="marketsDataWidget"></div>',tabsContainer:'<div class="ft-header-medium ft-header-medium-tint">{{headerTitle}}<ul class="ft-tabs-small">{{tabs}}</ul></div>',headerTitle:'<h3 class="ft-header-medium-title">{{headerTitleText}}</h3>',tab:'<li class="ft-tab-small"><a href="{{href}}" class="ft-tab-title">{{title}}</a></li>',tabContent:'<div class="mdw-tabcontent ft-state-hidden" id="{{id}}" ><table>{{tableContent}}</table>'+'<div class="mdw-chart"></div><div class="mdw-footer">{{footerContent}}</div>'+'<div class="mdw-loadingOverlay"></div></div>',tableRow:'<tr data-symbol="{{symbol}}" ><td>{{nameLinkOrText}}</td><td></td><td></td></tr>',nameLink:'<a href="http://markets.ft.com/research/markets/Tearsheets/Summary?s={{symbolForLink}}" >{{name}}</a>',nameNoLink:'{{name}}',footerLink:'<a href="{{href}}" >{{text}}</a>',footerLinkContainer:'<div class="mdw-footerLinks">{{footerLinks}}</div>'},analytics=false,analyticsTimeout;function logAnalyticsEvent(v,delay){if(analytics){clearTimeout(analyticsTimeout);analyticsTimeout=setTimeout(function(){FT.analytics.siteIntelligence.sendAdditionalTracer("/eventonpage",v);},delay||0);}}
function stripSpaces(s){return s.replace(/\s+/g,"").toLowerCase();}
function getAnalyticsTabName(){return encodeURIComponent(stripSpaces(tabsEl.find("li.ft-state-selected").text()));}
function renderTemplate(template,data){var rex=/\{\{[^\s]+\}\}/g,matches=template.match(rex),i,key;for(i=matches.length-1;i>=0;i--){key=matches[i].replace(/\{\{|\}\}/g,'');if(typeof(data[key])!=="undefined"){template=template.replace(matches[i],data[key]);}}
return template;}
function renderTabs(){var tabsHTML="",headerTitleHTML="";FT.$.each(config.tabs,function(i,tabConfig){tabsHTML+=renderTemplate(templates.tab,{href:'#marketsDataTabContent'+i,title:tabConfig.tabTitle});});if(config.headerTitle){headerTitleHTML=renderTemplate(templates.headerTitle,{headerTitleText:config.headerTitle});}
tabsEl=FT.$(renderTemplate(templates.tabsContainer,{headerTitle:headerTitleHTML,tabs:tabsHTML}));containerEl.append(tabsEl);}
function getTabContent(tabId,tabConfig){var nameLinkOrText,tableContent="",tabContent;FT.$.each(tabConfig.tabItems,function(i,tabItem){nameLinkOrText=renderTemplate(tabItem.symbolForLink?templates.nameLink:templates.nameNoLink,tabItem);tableContent+=renderTemplate(templates.tableRow,{symbol:tabItem.symbol,nameLinkOrText:nameLinkOrText});});tabContent=renderTemplate(templates.tabContent,{id:"marketsDataTabContent"+tabId,tableContent:tableContent,footerContent:tabConfig.tabFooter});tabContentEls[tabId]=FT.$(tabContent);return tabContentEls[tabId];}
function renderTabsContent(){FT.$.each(config.tabs,function(i,tabConfig){containerEl.append(getTabContent(i,tabConfig));});}
function renderFooterLinks(){var footerLinksHTML='';FT.$.each(config.footerLinks,function(i,footerLink){footerLinksHTML+=renderTemplate(templates.footerLink,footerLink);});containerEl.append(FT.$(renderTemplate(templates.footerLinkContainer,{footerLinks:footerLinksHTML})));}
function formatNumber(n,decPlaces){n=FT.numberFormatting.stripCommas(n);n=FT.numberFormatting.forceDecimalPlaces(n,decPlaces);return FT.numberFormatting.insertCommas(n);}
function getChangeClass(v){v=Number(stripSpaces(v).replace("%",""));var c="neu";if(v>0){c="pos";}else if(v<0){c="neg";}
return c;}
function setChangeClass(el){var v=stripSpaces(el.text()).replace("%","");el.removeClass("pos neg neu").addClass(getChangeClass(v));}
function renderTabData(tabId,symbols,data){FT.$.each(symbols,function(i,symbol){var colEls=tabContentEls[tabId].find("tr[data-symbol="+symbol+"] td"),col2Value,col3Value;if(config.tabs[tabId].type==="bond"){col2Value=data[i].YieldBid;col3Value=data[i].YieldChange;}else{col2Value=formatNumber(data[i].LastValue,config.tabs[tabId].decimalPlaces||2);col3Value=data[i].PriceChangePercent1Day;}
colEls.eq(1).html((config.tabs[tabId].prefix||"")+col2Value);colEls.eq(2).html(stripSpaces(col3Value));setChangeClass(colEls.eq(2));});}
function getSymbolsForTab(tabId){var symbols=[];FT.$.each(config.tabs[tabId].tabItems,function(i,tabItem){symbols.push(tabItem.symbol);});return symbols;}
function selectDataRow(tabId,row){var trEls=tabContentEls[tabId].find("tr"),chartEl,transitionDuration=200;if(trEls.eq(row).hasClass("ft-state-selected")){return;}
trEls.removeClass("ft-state-selected").eq(row).addClass("ft-state-selected");chartEl=tabContentEls[tabId].find(".mdw-chart");chartEl.stop().animate({opacity:0,avoidCSSTransitions:true},transitionDuration,function(){chartEl.css("background-position","0 "+(105*row*-1)+"px").fadeIn(transitionDuration);});logAnalyticsEvent("type=mdw-chart&data="+getAnalyticsTabName()+"-"+encodeURIComponent(stripSpaces(trEls.eq(row).find("td").eq(0).text())),500);}
function hasDataExpired(tabId){return(!lastUpdated[tabId]||lastUpdated[tabId]<(new Date().getTime()-dataTimeToLive));}
function updateTabData(tabId){var symbols=getSymbolsForTab(tabId);if(tabContentEls[tabId].hasClass("ft-state-loading")||symbols.length===0){return;}
tabContentEls[tabId].addClass("ft-state-loading");FT.data.markets.getQuote(symbols,"full",function(data){renderTabData(tabId,symbols,data);tabContentEls[tabId].removeClass("ft-state-loading");lastUpdated[tabId]=new Date().getTime();});tabContentEls[tabId].find(".mdw-chart").css("backgroundImage","url('"+FT.data.markets.getChartUrl(symbols)+"')");}
function showTab(tabId){tabsEl.find("li").removeClass("ft-state-selected").eq(tabId).addClass("ft-state-selected");containerEl.find(".mdw-tabcontent").addClass("ft-state-hidden");containerEl.find("#marketsDataTabContent"+tabId).removeClass("ft-state-hidden");if(hasDataExpired(tabId)){updateTabData(tabId);}
if(tabContentEls[tabId].find("tr.ft-state-selected").length===0){selectDataRow(tabId,0);}
logAnalyticsEvent("type=mdw-tab&data="+getAnalyticsTabName(),0);}
function enableTabs(){containerEl.on("click.mdwEvents","li a",function(ev){ev.preventDefault();showTab(this.getAttribute("href").slice(-1));});}
function enableChartChange(){containerEl.on("mouseover.mdwEvents focus.mdwEvents","tr",function(){var thisRow=FT.$(this),rowNum=thisRow.parent().children().index(thisRow);selectDataRow(thisRow.closest(".mdw-tabcontent").attr("id").slice(-1),rowNum);});}
this.updateTab=updateTabData;this.showTab=showTab;this.destroy=function(){tabsEl.remove();containerEl.off(".mdwEvents");clearTimeout(analyticsTimeout);};containerEl=FT.$(templates.container);el.append(containerEl);renderTabs();renderTabsContent();renderFooterLinks();enableTabs();enableChartChange();showTab(0);analytics=true;};FT.render=FT.render||{};FT.render.SimpleSlideshow=function(el){var container,slides=[],carousel,currentSlide,myself=this;function isValidSlide(n){return(FT.$.type(n)==="number"&&n>=0&&n<slides.length);}
function renderContainer(){var c,l,slideEl;if(!container){container=FT.$('<ul class="carousel-collection"></ul>');for(c=0,l=slides.length;c<l;c++){slideEl=FT.$('<li class="carousel-item" data-slide="'+c+'"></li>');container.append(slideEl);}
el.append(container);container.after(FT.$('<div class="carousel-nav carousel-prev"><span>Previous image</span></div>'));container.after(FT.$('<div class="carousel-nav carousel-next"><span>Next image</span></div>'));carousel=new FT.render.Carousel(el,{itemsPerView:1,onChange:function(g){myself.setCurrentSlide(g);}});}}
function getCreditHTML(data){var html="";if(data&&(data.text)){html=(data.url)?'<a href="'+data.url+'"':'<span';html=html+' class="ft-overlay-credit">'+data.text;html=html+((data.url)?'</a>':'</span>');}
return html;}
function renderSlideContent(n){if(!isValidSlide(n)){return;}
renderContainer();var slideEl=container.find(".carousel-item[data-slide="+n+"]"),slideData=slides[n];if(slideEl.size()>0&&slideEl.html()===""){slideEl.addClass("slideshow-loading");var imgCont=FT.$('<div class="ft-image ft-image-leader"></div>'),img=FT.$('<img />',{src:slideData.url,alt:slideData.alt}).load(function(){if(slideEl){slideEl.removeClass("slideshow-loading");}});if(slideData.linkUrl){img=FT.$('<a href="'+slideData.linkUrl+'" />').append(img);}
imgCont.append(img);if(slideData.caption||slideData.credit){var overlay=FT.$('<div class="ft-overlay ft-overlay-bottom ft-overlay-bg50"></div>');var h='<p class="ft-overlay-caption">'+(slideData.caption||"")+getCreditHTML(slideData.credit)+'</p>';overlay.append(h);imgCont.append(overlay);}
slideEl.append(imgCont);}}
function reset(){slides=[];if(container){container.remove();container=null;}
if(carousel){carousel.destroy();}}
this.setSlides=function(data){if(FT.$.type(data)==="array"&&data.length>0){reset();slides=data;myself.setCurrentSlide(0);}};this.setCurrentSlide=function(n){if(isValidSlide(n)&&n!==currentSlide){currentSlide=n;renderSlideContent(currentSlide);renderSlideContent(currentSlide+1);renderSlideContent(currentSlide-1);carousel.setCurrentItem(currentSlide);FT.analytics.siteIntelligence.sendAdditionalTracer("/eventonpage","type=slideshow&data=slide"+n);}};this.goToNext=function(){myself.setCurrentSlide(currentSlide+1);};this.goToPrevious=function(){myself.setCurrentSlide(currentSlide-1);};this.destroy=reset;};FT.render.Top5Slideshow=function(el,data){function addUrlToSlideData(data,url){var c,l;if(typeof url==="string"){for(c=0,l=data.length;c<l;c++){data[c].linkUrl=url+"#slide"+c;}}
return data;}
if(data&&data.slides&&FT.$.type(data.slides)==="array"&&data.slides.length>0){el.addClass("slideshow slideshow-narrow carousel");var slideData=addUrlToSlideData(data.slides,el.find("a").attr("href")),slideshow=new FT.render.SimpleSlideshow(el);slideshow.setSlides(slideData);}};FT.data=FT.data||{};FT.data.markets=(function(){var chartsUrl="http://markets.ft.com/Research/Remote/API/EasyChart?",quotesUrl="http://markets.ft.com/RESEARCH/MarketsApi/Quote/Symbol/jsonp?",iterator=0;function getSymbolParam(v){if(FT.$.type(v)!=="array"){v=[v];}
return"symbols="+encodeURIComponent(v.join("|"));}
function getFunctionName(){return"jsonmarketsquote"+iterator++;}
function getChartUrl(symbols){return chartsUrl+getSymbolParam(symbols);}
function getQuoteUrl(symbols,type){return quotesUrl+getSymbolParam(symbols)+(type?"&type="+type:"");}
function getQuote(symbols,type,callback){var jsonpFuncName=getFunctionName();window[jsonpFuncName]=function(data){if(FT.$.type(callback)==="function"){callback(data);}};FT.$.ajax({url:getQuoteUrl(symbols,type),dataType:"jsonp",jsonp:'jsoncallback',jsonpCallback:jsonpFuncName,complete:function(){window[jsonpFuncName]=undefined;try{delete window[jsonpFuncName];}catch(e){}}});}
return{getChartUrl:getChartUrl,getQuote:getQuote};}());FT.$(document).ready(function(){if(!FT.render.page.isEditor()){FT.render.contentTabs=[];FT.$('[data-behaviour=contentTabs]').each(function(index,el){FT.render.contentTabs.push(new FT.Render.ContentTabs(FT.$(el)));});FT.customEvents.listen("contentTabSelected",function(ev){FT.analytics.siteIntelligence.sendAdditionalTracer("/eventonpage","type=contentTab-change&data="+ev.selectedTabText);});}});FT.numberFormatting={stripCommas:function(s){return String(s).replace(/,/g,"");},insertCommas:function(n){var p=n.toString().split(".");p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,",");return p.join(".");},forceDecimalPlaces:function(n,d){return Number(n).toFixed(d||2);}};
