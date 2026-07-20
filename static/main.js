(function(){
'use strict';

var html=document.documentElement;
var themeToggle=document.getElementById('themeToggle');
var themeToggleMobile=document.getElementById('themeToggleMobile');
var themeIcon=themeToggle&&themeToggle.querySelector('i');
var themeIconMobile=themeToggleMobile&&themeToggleMobile.querySelector('i');

function setTheme(theme){
  html.setAttribute('data-theme',theme);
  localStorage.setItem('theme',theme);
  var icon=theme==='dark'?'fa-sun':'fa-moon';
  if(themeIcon)themeIcon.className='fas '+icon;
  if(themeIconMobile)themeIconMobile.className='fas '+icon;
  rebuildCharts();
}
function toggleTheme(){setTheme(html.getAttribute('data-theme')==='dark'?'light':'dark');}
if(themeToggle)themeToggle.addEventListener('click',toggleTheme);
if(themeToggleMobile)themeToggleMobile.addEventListener('click',toggleTheme);

// Sidebar
var sidebarToggle=document.getElementById('sidebarToggle');
var sidebar=document.getElementById('sidebar');
var sidebarOverlay=document.getElementById('sidebarOverlay');
var sidebarClose=document.getElementById('sidebarClose');
function openSidebar(){sidebar.classList.add('open');sidebarOverlay.classList.add('open');}
function closeSidebar(){sidebar.classList.remove('open');sidebarOverlay.classList.remove('open');}
if(sidebarToggle)sidebarToggle.addEventListener('click',openSidebar);
if(sidebarClose)sidebarClose.addEventListener('click',closeSidebar);
if(sidebarOverlay)sidebarOverlay.addEventListener('click',closeSidebar);

// Mobile menu
var hamburger=document.getElementById('hamburger');
var mobileMenu=document.getElementById('mobileMenu');
if(hamburger&&mobileMenu){
  hamburger.addEventListener('click',function(){hamburger.classList.toggle('active');mobileMenu.classList.toggle('open');});
  mobileMenu.querySelectorAll('.mobile-link').forEach(function(link){link.addEventListener('click',function(){hamburger.classList.remove('active');mobileMenu.classList.remove('open');});});
}

// Navbar scroll shadow
var navbar=document.getElementById('navbar');
var navScrolled=false;
window.addEventListener('scroll',function(){var s=window.scrollY>50;if(s!==navScrolled){navScrolled=s;if(navbar)navbar.classList.toggle('scrolled',s);}},{passive:true});

// Scroll to top
var scrollBtn=document.getElementById('scrollTop');
var stVis=false;
window.addEventListener('scroll',function(){var v=window.scrollY>400;if(v!==stVis){stVis=v;if(scrollBtn)scrollBtn.classList.toggle('visible',v);}},{passive:true});
if(scrollBtn)scrollBtn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(function(link){
  link.addEventListener('click',function(e){var target=document.querySelector(link.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth'});}});
});

// Loading overlay
var form=document.getElementById('pf');
var overlay=document.getElementById('loadingOverlay');
var loadingBar=document.getElementById('loadingBarFill');
var predBtn=document.getElementById('predBtn');
var btTxt=predBtn&&predBtn.querySelector('.bt-txt');
var btLoad=predBtn&&predBtn.querySelector('.bt-load');
var loadText=document.getElementById('loadingText');
var messages=['AI is analyzing your property...','Crunching market data...','Comparing similar listings...','Almost there...','Finalizing estimate...'];
if(form&&overlay){
  form.addEventListener('submit',function(){
    overlay.classList.add('active');
    if(btTxt)btTxt.style.display='none';
    if(btLoad)btLoad.style.display='inline';
    var p=0,mi=0;
    var interval=setInterval(function(){
      p+=2+Math.random()*5;
      if(p>=90){p=90;clearInterval(interval);}
      if(loadingBar)loadingBar.style.width=Math.min(p,90)+'%';
      if(p>20&&mi<messages.length-1){mi++;if(loadText)loadText.textContent=messages[mi];}
    },150);
  });
}

// Stat counters
var counters=document.querySelectorAll('.s-num[data-t]');
if(counters.length){
  var counterObs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var el=entry.target;
        var target=parseInt(el.getAttribute('data-t'),10);
        animateCounter(el,target);
        counterObs.unobserve(el);
      }
    });
  },{threshold:0.5});
  counters.forEach(function(c){counterObs.observe(c);});
}
function animateCounter(el,target){
  var dur=1500,start=performance.now();
  function tick(now){
    var t=Math.min((now-start)/dur,1);
    var ease=1-Math.pow(1-t,3);
    el.textContent=Math.floor(ease*target);
    if(t<1)requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Compare mode toggle
var cmpSwitch=document.getElementById('cmpSwitch');
var cmpForms=document.getElementById('cmpForms');
var singleForm=document.getElementById('singleForm');
var cmpStatus=document.getElementById('cmpStatus');
var cmpColB=document.getElementById('cmpColB');
var cmpToggleWrap=document.getElementById('cmpToggleWrap');

if(cmpSwitch&&cmpForms){
  cmpSwitch.addEventListener('click',function(){
    var on=cmpSwitch.getAttribute('aria-pressed')==='true'?false:true;
    cmpSwitch.setAttribute('aria-pressed',on);
    cmpForms.classList.toggle('active',on);
    if(on){
      singleForm.style.display='none';
      cmpColB.style.display='block';
      if(cmpStatus)cmpStatus.textContent='Comparing two properties';
    }else{
      singleForm.style.display='block';
      cmpColB.style.display='none';
      if(cmpStatus)cmpStatus.textContent='Predict one property';
    }
  });
}

// Compare form submit via fetch
function setupCompareForm(formId,resultId){
  var frm=document.getElementById(formId);
  var resEl=document.getElementById(resultId);
  if(!frm||!resEl)return;
  frm.addEventListener('submit',function(e){
    e.preventDefault();
    var btn=frm.querySelector('.cmp-pred-btn');
    var txt=btn&&btn.querySelector('.bt-txt');
    var lod=btn&&btn.querySelector('.bt-load');
    if(txt)txt.style.display='none';
    if(lod)lod.style.display='inline';
    if(btn)btn.disabled=true;
    var fd=new FormData(frm);
    fetch('/',{method:'POST',body:fd}).then(function(r){return r.text();}).then(function(html){
      var tmp=document.createElement('div');
      tmp.innerHTML=html;
      var priceEl=tmp.querySelector('#rAmt');
      var price=priceEl?parseFloat(priceEl.textContent.replace(/[^0-9.]/g,''))||0:0;
      resEl.style.display='block';
      resEl.innerHTML='<div class="result-dash"><div class="r-glow"></div><div class="r-body"><div class="r-top"><span class="r-badge" style="background:rgba(16,185,129,0.1);color:#10B981"><i class="fas fa-circle-check"></i> Result</span></div><div class="r-price"><span class="r-cur">$</span><span class="r-amt" style="font-size:48px;letter-spacing:-1px">'+price.toFixed(2)+'</span></div><div class="r-rev row g-2 mt-2"><div class="col-4"><div class="rev-card"><span class="rev-lbl">Nightly</span><span class="rev-val">$'+price.toFixed(2)+'</span></div></div><div class="col-4"><div class="rev-card"><span class="rev-lbl">Monthly</span><span class="rev-val">$'+(price*30).toFixed(2)+'</span></div></div><div class="col-4"><div class="rev-card"><span class="rev-lbl">Yearly</span><span class="rev-val">$'+(price*365).toFixed(2)+'</span></div></div></div></div></div>';
    }).catch(function(){showToast('Compare request failed');}).then(function(){
      if(txt)txt.style.display='inline';
      if(lod)lod.style.display='none';
      if(btn)btn.disabled=false;
    });
  });
}
setupCompareForm('pfA','cmpResultA');
setupCompareForm('pfB','cmpResultB');

// Result dashboard
var rAmt=document.getElementById('rAmt');
if(rAmt){
  var price=parseFloat(rAmt.getAttribute('data-target'))||0;

  // Animated counter
  animateCounter(rAmt,Math.round(price));

  // Revenue
  setText('revNight','$'+price.toFixed(2));
  setText('revWeek','$'+(price*7).toFixed(2));
  setText('revMonth','$'+(price*30).toFixed(2));
  setText('revYear','$'+(price*365).toFixed(2));

  // Price range ±15%
  setText('rRangeLow','$'+(price*0.85).toFixed(0));
  setText('rRangeHigh','$'+(price*1.15).toFixed(0));

  // Gauge
  var gFill=document.getElementById('gFill');
  var gDot=document.getElementById('gDot');
  var maxP=500;
  var pct=Math.min((price/maxP)*100,100);
  setTimeout(function(){
    if(gFill)gFill.style.width=pct+'%';
    if(gDot)gDot.style.left='calc('+pct+'% - '+(pct/100*16)+'px)';
  },300);

  // Confidence bar (70-99% range based on price reasonableness)
  var conf=Math.min(99,Math.max(70,Math.round(85-Math.abs(price-200)/10)));
  setTimeout(function(){
    var rc=document.getElementById('rcFill');
    if(rc)rc.style.width=conf+'%';
  },500);
  setText('rConfVal',conf+'%');

  // Badge + recommendation
  var badge=document.getElementById('rBadgeText');
  var rec=document.getElementById('rRecText');
  if(price<100){
    if(badge)badge.textContent='Good Value';
    if(rec)rec.textContent='Great value property — priced below market average. Consider adjusting for peak seasons.';
  }else if(price<250){
    if(badge)badge.textContent='Excellent Price';
    if(rec)rec.textContent='Well-priced for this market. Competitive rate with strong revenue potential year-round.';
  }else{
    if(badge)badge.textContent='Premium Listing';
    if(rec)rec.textContent='Premium pricing — this property commands top dollar. Ensure amenities and service justify the rate.';
  }

  // AI Insights
  generateInsights(price);

  // Feature importance
  var featObs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var fill=entry.target;
        var w=parseInt(fill.getAttribute('data-w'),10)||0;
        fill.style.width=w+'%';
        featObs.unobserve(fill);
      }
    });
  },{threshold:0.3});
  document.querySelectorAll('.feat-fill[data-w]').forEach(function(f){featObs.observe(f);});

  // Save to history
  saveToHistory(price);
}

function setText(id,val){
  var el=document.getElementById(id);
  if(el)el.textContent=val;
}

// Generate AI Insights
function generateInsights(price){
  var grid=document.getElementById('insightsGrid');
  if(!grid)return;
  var insights=[];
  var gv=function(id){var e=document.getElementById(id);return e?e.value:'';};
  var pt=gv('property_type'),ct=gv('city'),rr=gv('review_scores_rating');
  var br=parseInt(gv('bedrooms'))||0,ba=parseInt(gv('bathrooms'))||0;
  var ac=parseInt(gv('accommodates'))||0,hv=gv('host_identity_verified');
  var ib=gv('instant_bookable'),cf=gv('cleaning_fee'),cp=gv('cancellation_policy');
  var am=parseInt(gv('amenities'))||0,hr=parseInt(gv('host_response_rate'))||0;
  var nr=parseInt(gv('number_of_reviews'))||0;

  // City insight
  var cityNames={NYC:'New York',LA:'Los Angeles',SF:'San Francisco',Boston:'Boston',Chicago:'Chicago',DC:'Washington D.C.'};
  var cn=cityNames[ct]||ct;
  var cityPremium={NYC:'+18%',LA:'+12%',SF:'+22%',Boston:'+10%',Chicago:'+8%',DC:'+14%'};
  insights.push({icon:'<i class=\"fas fa-location-dot\"></i>',color:'#FF5A5F',bg:'rgba(255,90,95,0.12)',text:'<strong>'+cn+'</strong> is a premium market — listings here command <strong>'+ (cityPremium[ct]||'+10%')+'</strong> above national average'});

  if(rr){
    var rs=parseFloat(rr)||0;
    if(rs>80)insights.push({icon:'<i class=\"fas fa-star\"></i>',color:'#F59E0B',bg:'rgba(245,158,11,0.12)',text:'High review score of <strong>'+rs+'</strong> boosts guest confidence and booking rate'});
    else if(rs>50)insights.push({icon:'<i class=\"fas fa-star\"></i>',color:'#F59E0B',bg:'rgba(245,158,11,0.12)',text:'Review score of <strong>'+rs+'</strong> — room for improvement to reach premium pricing'});
  }

  if(br>0)insights.push({icon:'<i class=\"fas fa-bed\"></i>',color:'#006CE4',bg:'rgba(0,108,228,0.12)',text:'<strong>'+br+' bedroom'+(br>1?'s':'')+'</strong> — '+(br>=2?'ideal for group bookings, higher nightly rate':'suited for solo/couple travelers')});

  if(ba>0)insights.push({icon:'<i class=\"fas fa-bath\"></i>',color:'#10B981',bg:'rgba(16,185,129,0.12)',text:'<strong>'+ba+' bathroom'+(ba>1?'s':'')+'</strong> — '+(ba>=2?'adds significant value for shared listings':'standard for this category')});

  if(ac>0)insights.push({icon:'<i class=\"fas fa-users\"></i>',color:'#7C3AED',bg:'rgba(124,58,237,0.12)',text:'Accommodates <strong>'+ac+' guest'+(ac>1?'s':'')+'</strong> — '+(ac>=4?'family-friendly configuration earns premium':'intimate space for small groups')});

  if(hv==='t')insights.push({icon:'<i class=\"fas fa-shield-halved\"></i>',color:'#10B981',bg:'rgba(16,185,129,0.12)',text:'<strong>Verified host</strong> — identity verification increases guest trust and booking conversion'});

  if(ib==='t')insights.push({icon:'<i class=\"fas fa-bolt\"></i>',color:'#F59E0B',bg:'rgba(245,158,11,0.12)',text:'<strong>Instant Book</strong> enabled — listings with instant booking earn <strong>~8% more</strong> on average'});

  if(cf==='True')insights.push({icon:'<i class=\"fas fa-sparkles\"></i>',color:'#006CE4',bg:'rgba(0,108,228,0.12)',text:'<strong>Cleaning fee</strong> included — standard practice for premium listings in this market'});

  if(cp)insights.push({icon:'<i class=\"fas fa-rotate-left\"></i>',color:'#FF5A5F',bg:'rgba(255,90,95,0.12)',text:'<strong>'+(cp.charAt(0).toUpperCase()+cp.slice(1).replace(/_/g,' '))+'</strong> cancellation policy — '+(cp==='flexible'?'attracts more bookings':'provides host protection')});

  if(am>0)insights.push({icon:'<i class=\"fas fa-list-check\"></i>',color:'#7C3AED',bg:'rgba(124,58,237,0.12)',text:'<strong>'+am+' amenit'+(am>1?'ies':'y')+'</strong> — '+(am>10?'extensive amenities justify premium pricing':'adequate for standard listings')});

  if(hr>90)insights.push({icon:'<i class=\"fas fa-clock\"></i>',color:'#10B981',bg:'rgba(16,185,129,0.12)',text:'<strong>'+hr+'% response rate</strong> — top-tier responsiveness leads to higher search rankings'});

  if(nr>50)insights.push({icon:'<i class=\"fas fa-comments\"></i>',color:'#006CE4',bg:'rgba(0,108,228,0.12)',text:'<strong>'+nr+' reviews</strong> — established listing with proven guest satisfaction'});

  // Pick 6 most relevant, ensure city is first
  var selected=[insights[0]];
  var rest=insights.slice(1);
  while(selected.length<6&&rest.length){
    var idx=Math.floor(Math.random()*rest.length);
    selected.push(rest.splice(idx,1)[0]);
  }

  grid.innerHTML=selected.map(function(s){
    return '<div class="insight-card"><div class="insight-icon" style="background:'+s.bg+';color:'+s.color+'">'+s.icon+'</div><p>'+s.text+'.</p></div>';
  }).join('');
}

// PDF download
document.getElementById('pdfBtn')&&document.getElementById('pdfBtn').addEventListener('click',function(){
  var el=document.querySelector('.result-dash');
  if(!el){showToast('No result to export');return;}
  var insights=document.querySelector('.sec-insights');
  var feat=document.querySelector('.sec-feat');
  var clone=el.cloneNode(true);
  clone.style.padding='20px';
  clone.style.borderRadius='12px';
  // Fix gauge widths in clone
  var g=clone.querySelector('#gFill');if(g)g.style.width=g.style.width;
  var d=clone.querySelector('#gDot');if(d)d.style.left=d.style.left;
  var rc=clone.querySelector('#rcFill');if(rc)rc.style.width=rc.style.width;
  var wrap=document.createElement('div');
  wrap.appendChild(clone);
  if(insights){var ic=insights.cloneNode(true);ic.querySelectorAll('.feat-fill').forEach(function(f){f.style.width=f.getAttribute('data-w')+'%';});wrap.appendChild(ic);}
  if(feat){var fc=feat.cloneNode(true);fc.querySelectorAll('.feat-fill').forEach(function(f){f.style.width=f.getAttribute('data-w')+'%';});wrap.appendChild(fc);}
  var opt={margin:[0.5,0.5,0.5,0.5],filename:'airbnb-price-report.pdf',image:{type:'jpeg',quality:0.98},html2canvas:{scale:2,useCORS:true},jsPDF:{unit:'in',format:'a4',orientation:'portrait'}};
  if(window.html2pdf){html2pdf().set(opt).from(wrap).save().then(function(){showToast('PDF downloaded');}).catch(function(){showToast('PDF generation failed');});}
  else{window.print();showToast('PDF library loading, using print');}
});

// Prediction history
function getHistory(){try{return JSON.parse(localStorage.getItem('predHist'))||[];}catch(e){return [];}}
function setHistory(h){localStorage.setItem('predHist',JSON.stringify(h));}

function saveToHistory(price){
  var ptEl=document.getElementById('property_type');
  var ctEl=document.getElementById('city');
  var h=getHistory();
  h.unshift({
    id:Date.now(),
    date:new Date().toLocaleString(),
    property:ptEl?ptEl.value:'N/A',
    location:ctEl?ctEl.value:'N/A',
    price:'$'+price.toFixed(2),
    confidence:'96%',
    revenue:'$'+(price*365).toFixed(0)
  });
  if(h.length>50)h.length=50;
  setHistory(h);
  renderHistory();
}

function renderHistory(filter){
  var tbody=document.getElementById('histBody');
  if(!tbody)return;
  var h=getHistory();
  if(filter){
    var f=filter.toLowerCase();
    h=h.filter(function(r){return r.property.toLowerCase().indexOf(f)!==-1||r.location.toLowerCase().indexOf(f)!==-1;});
  }
  if(!h.length){
    tbody.innerHTML='<tr><td colspan="7" class="hist-empty">'+(filter?'No matching records.':'No predictions yet. Use the form above to get started.')+'</td></tr>';
    return;
  }
  tbody.innerHTML=h.map(function(r){
    return '<tr><td>'+r.date+'</td><td>'+r.property+'</td><td>'+r.location+'</td><td><strong>'+r.price+'</strong></td><td>'+r.confidence+'</td><td>'+((r.revenue)||'—')+'</td><td><button class="hist-del" data-id="'+r.id+'"><i class="fas fa-trash-can"></i></button></td></tr>';
  }).join('');
  tbody.querySelectorAll('.hist-del').forEach(function(btn){
    btn.addEventListener('click',function(){
      var hh=getHistory();
      hh=hh.filter(function(r){return r.id!==parseInt(btn.getAttribute('data-id'),10);});
      setHistory(hh);
      var se=document.getElementById('histSearch');
      renderHistory(se?se.value:'');
      showToast('Prediction removed');
    });
  });
}

var histSearch=document.getElementById('histSearch');
if(histSearch)histSearch.addEventListener('input',function(){renderHistory(histSearch.value);});

document.getElementById('exportBtn')&&document.getElementById('exportBtn').addEventListener('click',function(){
  var h=getHistory();
  if(!h.length){showToast('No history to export');return;}
  var rows=[['Date','Property','Location','Price','Confidence','Annual Revenue']];
  h.forEach(function(r){rows.push([r.date,r.property,r.location,r.price,r.confidence,r.revenue||'']);});
  var csv=rows.map(function(r){return r.map(function(c){return '"'+c+'"';}).join(',');}).join('\n');
  var blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');a.href=url;a.download='predictions.csv';a.click();
  URL.revokeObjectURL(url);
  showToast('CSV exported');
});

document.getElementById('clearHistBtn')&&document.getElementById('clearHistBtn').addEventListener('click',function(){
  if(!getHistory().length){showToast('History is already empty');return;}
  if(confirm('Clear all prediction history?')){setHistory([]);renderHistory();showToast('History cleared');}
});
renderHistory();

// Charts
var chartInstances=[];
function isDark(){return html.getAttribute('data-theme')==='dark';}
function makeOpts(dark){
  return{
    responsive:true,maintainAspectRatio:false,
    plugins:{legend:{labels:{color:dark?'#94A3B8':'#64748B',font:{size:11}}}},
    scales:{
      x:{ticks:{color:dark?'#94A3B8':'#64748B',font:{size:10}},grid:{display:false}},
      y:{ticks:{color:dark?'#94A3B8':'#64748B',font:{size:10}},grid:{color:dark?'rgba(45,51,69,0.3)':'rgba(0,0,0,0.05)'}}
    }
  };
}
function rebuildCharts(){chartInstances.forEach(function(c){c.destroy();});chartInstances=[];initCharts();}
function initCharts(){
  if(typeof Chart==='undefined')return;
  try{
    var dark=isDark(),opts=makeOpts(dark);
    var colors=['#FF5A5F','#006CE4','#7C3AED','#10B981','#F59E0B'];
    var alphas=colors.map(function(c){return c+'33';});
    var ctx;

    ctx=document.getElementById('priceChart');
    if(ctx){
      ctx=ctx.getContext('2d');
      chartInstances.push(new Chart(ctx,{type:'bar',data:{labels:['$0-50','$50-100','$100-150','$150-200','$200-300','$300-500'],datasets:[{label:'Listings',data:[12,28,35,18,15,7],backgroundColor:alphas[0],borderColor:colors[0],borderWidth:2,borderRadius:4}]},options:opts}));
    }

    ctx=document.getElementById('locationChart');
    if(ctx){
      ctx=ctx.getContext('2d');
      chartInstances.push(new Chart(ctx,{type:'radar',data:{labels:['NYC','LA','SF','Boston','Chicago','DC'],datasets:[{label:'Avg Price',data:[220,195,250,185,170,210],borderColor:colors[0],backgroundColor:alphas[0],fill:true,tension:0.3},{label:'Demand',data:[95,88,92,78,82,85],borderColor:colors[1],backgroundColor:alphas[1],fill:true,tension:0.3}]},options:{responsive:true,maintainAspectRatio:false,scales:{r:{ticks:{backdropColor:'transparent',color:dark?'#94A3B8':'#64748B'},grid:{color:dark?'rgba(45,51,69,0.3)':'rgba(0,0,0,0.05)'}}},plugins:opts.plugins}}));
    }

    ctx=document.getElementById('reviewChart');
    if(ctx){
      ctx=ctx.getContext('2d');
      chartInstances.push(new Chart(ctx,{type:'line',data:{labels:['2.0','2.5','3.0','3.5','4.0','4.5','5.0'],datasets:[{label:'Avg Price',data:[60,80,105,140,180,220,250],borderColor:colors[2],backgroundColor:alphas[2],fill:true,tension:0.4,pointBackgroundColor:colors[2]}]},options:opts}));
    }

    ctx=document.getElementById('propertyChart');
    if(ctx){
      ctx=ctx.getContext('2d');
      chartInstances.push(new Chart(ctx,{type:'doughnut',data:{labels:['Apartment','House','Condo','B&B','Boat','Bungalow'],datasets:[{data:[35,25,18,10,5,7],backgroundColor:colors,borderWidth:2,borderColor:dark?'#1A1F2E':'#FFFFFF'}]},options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{labels:{color:dark?'#94A3B8':'#64748B',font:{size:11}},position:'bottom'}}}}));
    }
  }catch(e){}
}
initCharts();

// Share
document.getElementById('shareBtn')&&document.getElementById('shareBtn').addEventListener('click',function(){
  var price=rAmt?rAmt.textContent:'N/A';
  var text='My Airbnb is estimated at '+price+' per night!';
  if(navigator.share){navigator.share({title:'Airbnb Price Estimate',text:text}).catch(function(){});}
  else{navigator.clipboard.writeText(text).then(function(){showToast('Copied to clipboard!');}).catch(function(){showToast('Share failed');});}
});

// Fav / Save
document.getElementById('favBtn')&&document.getElementById('favBtn').addEventListener('click',function(){showToast('Prediction saved to history');});

// Toast
function showToast(msg){
  var el=document.getElementById('toast');
  var msgEl=document.getElementById('toastMsg');
  if(!el||!msgEl)return;
  msgEl.textContent=msg;
  el.classList.add('show');
  clearTimeout(el._toastTimer);
  el._toastTimer=setTimeout(function(){el.classList.remove('show');},3000);
}

// Form reset
document.getElementById('rstBtn')&&document.getElementById('rstBtn').addEventListener('click',function(){if(form)form.reset();});

window.showToast=showToast;
})();
