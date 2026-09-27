
(() => {
  const app = document.getElementById('app');
  const toast = document.getElementById('toast');
  const soundBtn = document.getElementById('soundBtn');
  const resetBtn = document.getElementById('resetBtn');

  const CATS = [
    ["أعلام الدول","🌍"],["ماركات ألعاب الفيديو / جيمنج","🎮"],["أنواع وماركات السيارات","🚗"],
    ["أندية ولعيبة كرة القدم","⚽"],["أفلام ومسلسلات","🎬"],["أكلات ومطاعم","🍔"],
    ["عواصم ومدن","🏙️"],["شخصيات كرتونية","🧸"],["تطبيقات وسوشيال ميديا","📱"],
    ["حيوانات وطبيعة","🦁"],["مهن ووظائف","🧑‍🔧"],["أشياء في البيت","🏠"],
    ["معالم عالمية","🗿"],["أنمي ومانجا","🍥"],["أسئلة دينية","🕌"],
    ["ألعاب شعبية ولوحية","🎲"],["تقنية وأجهزة","💻"],["كلمات من لهجات عربية","🗣️"],
    ["أسئلة بنعم أو لا","❓"],["عجائب ومعلومات عامة","🧠"]
  ];
  const CAT_MAP = Object.fromEntries(CATS.map((x,i)=>[x[0],{name:x[0],emoji:x[1],key:i+1}]));
  const DIFF = { "سهل": {points:1, penalty:0, icon:"🟢"}, "متوسط": {points:2, penalty:-1, icon:"🟡"}, "صعب": {points:3, penalty:-2, icon:"🔴"} };

  const state = {
    screen:"home", players:[], teams:[[],[]], shared:null, currentTeam:0, scores:[0,0],
    selectedCategory:null, selectedDifficulty:null, question:null, options:[], used:new Set(),
    timeLeft:180, timer:null, answered:false, sound:true, questionStart:0,
    assists:[{instagram:6,tiktok:4,chatgpt:2,eliminate:3},{instagram:6,tiktok:4,chatgpt:2,eliminate:3}],
    eliminated:false, turnResult:null, winner:null, nextDelta:0, assistTimer:null, assistLeft:0
  };

  function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function cls(x){return x.replace(/[^\w\u0600-\u06ff-]/g,'-');}
  function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x;}
  function play(kind="click"){
    if(!state.sound) return;
    try{
      const C=window.AudioContext||window.webkitAudioContext; if(!C)return;
      const c=new C(),o=c.createOscillator(),g=c.createGain();
      const map={click:[420,.05],good:[680,.16],bad:[180,.13],win:[760,.35],tick:[250,.04]};
      const [f,d]=map[kind]||map.click;o.frequency.value=f;o.type=kind==="bad"?"sawtooth":"sine";
      g.gain.setValueAtTime(.0001,c.currentTime);g.gain.exponentialRampToValueAtTime(.09,c.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d);
      o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+d+.02);
    }catch{}
  }
  function showToast(msg){
    toast.textContent=msg;toast.classList.add('show');clearTimeout(showToast.t);
    showToast.t=setTimeout(()=>toast.classList.remove('show'),1900);
  }
  function stopTimer(){clearInterval(state.timer);state.timer=null}
  function stopAssistTimer(){clearInterval(state.assistTimer);state.assistTimer=null}
  function render(html){app.innerHTML=`<section class="screen">${html}</section>`;window.scrollTo({top:0,behavior:"smooth"})}

  function home(){
    stopTimer();stopAssistTimer();state.screen="home";
    render(`
      <div class="hero">
        <div class="hero-card clay neo">
          <img class="logo-large" src="assets/logo.jpg" alt="لعبة الذكاء">
          <h1>لعبة الذكاء</h1>
          <p>لعبة جماعية على جوال واحد. مرّر الجوال، اختبر معلوماتكم، واجمعوا 20 نقطة قبل الفريق الآخر.</p>
          <div class="feature-row">
            <span class="pill">🎮 لعب جماعي</span><span class="pill">🧠 1800 سؤال</span>
            <span class="pill">⚡ 20 فئة</span><span class="pill">🎯 6 خيارات</span>
          </div>
          <button class="btn primary" onclick="IQ.startSetup()">ابدأ اللعبة</button>
          <div class="note" style="margin-top:16px">تصميم تفاعلي يجمع Claymorphism + Skeuomorphism + Neumorphism</div>
        </div>
      </div>
    `);
  }

  function startSetup(){
    state.players=[];state.scores=[0,0];state.used=new Set();state.winner=null;
    render(`
      <div class="setup-card clay neo">
        <h2 class="section-title">👥 إعداد اللاعبين</h2>
        <p class="sub">أدخل أسماء اللاعبين. سيتم توزيعهم عشوائيًا على فريقين.</p>
        <div class="number-row">
          <strong>عدد اللاعبين:</strong>
          <div class="stepper"><button class="skeu-btn" onclick="IQ.changeCount(-1)">−</button><strong id="count">4</strong><button class="skeu-btn" onclick="IQ.changeCount(1)">+</button></div>
        </div>
        <div id="playerFields" class="player-list"></div>
        <p class="note">الحد الأدنى لاعبان. إذا كان العدد فرديًا، يصبح لاعب واحد «اللاعب المشترك» ويشارك مع الفريقين.</p>
        <div class="small-actions"><button class="btn skeu-btn" onclick="IQ.home()">رجوع</button><button class="btn primary" onclick="IQ.assignTeams()">توزيع الفرق 🎲</button></div>
      </div>
    `);
    updateFields(4);
  }
  let playerCount=4;
  function changeCount(d){playerCount=Math.max(2,Math.min(12,playerCount+d));document.getElementById('count').textContent=playerCount;updateFields(playerCount)}
  function updateFields(n){
    const box=document.getElementById('playerFields'); if(!box)return;
    box.innerHTML=Array.from({length:n},(_,i)=>`<label class="field clay"><span>👤</span><input id="p${i}" maxlength="20" placeholder="اسم اللاعب ${i+1}" value="${esc(state.players[i]||"")}"></label>`).join("");
  }

  function assignTeams(){
    const names=Array.from({length:playerCount},(_,i)=>document.getElementById('p'+i)?.value.trim()||`لاعب ${i+1}`);
    const shuffled=shuffle(names);
    if(shuffled.length%2===0){state.teams=[shuffled.slice(0,shuffled.length/2),shuffled.slice(shuffled.length/2)];state.shared=null}
    else{
      state.shared=shuffled[shuffled.length-1];
      const rest=shuffled.slice(0,-1),half=rest.length/2;
      state.teams=[rest.slice(0,half),rest.slice(half)];
    }
    state.players=names;state.currentTeam=Math.random()<.5?0:1;
    play("click");renderTeams();
  }
  function renderTeams(){
    render(`
      <div class="reveal-card clay neo">
        <h2 class="section-title">🎲 تم توزيع الفرق!</h2>
        <p class="sub">تم التوزيع عشوائيًا. الفريق الذي سيبدأ يظهر في الشاشة التالية.</p>
        <div class="teams">
          <div class="team-card t1 clay"><div class="team-badge">🔴</div><h3>الفريق الأول</h3><ul>${state.teams[0].map(esc).map(n=>`<li>• ${n}</li>`).join("")}</ul></div>
          <div class="team-card t2 clay"><div class="team-badge">🔵</div><h3>الفريق الثاني</h3><ul>${state.teams[1].map(esc).map(n=>`<li>• ${n}</li>`).join("")}</ul></div>
        </div>
        ${state.shared?`<div class="help-strip neo-inset"><strong>⭐ اللاعب المشترك:</strong><span>${esc(state.shared)}</span></div>`:""}
        <button class="btn primary" onclick="IQ.intro()">ابدأ الجولة 🚀</button>
      </div>
    `);
  }
  function intro(){
    render(`
      <div class="pass-card clay neo">
        <div class="phone">📱</div>
        <h2>الجوال مع ${state.currentTeam===0?"الفريق الأول":"الفريق الثاني"}</h2>
        <p class="sub">كل جولة تبدأ باختيار الفئة ثم مستوى الصعوبة. أول فريق يصل إلى 20 نقطة يفوز.</p>
        <button class="btn primary" onclick="IQ.categories()">اضغط للمتابعة</button>
      </div>
    `);
  }

  function scoreBar(){
    return `<div class="scorebar">
      <div class="score clay"><span>الفريق الأول</span><strong>${state.scores[0]}</strong></div>
      <div class="turn">دور ${state.currentTeam===0?"🔴 الفريق الأول":"🔵 الفريق الثاني"}</div>
      <div class="score clay"><span>الفريق الثاني</span><strong>${state.scores[1]}</strong></div>
    </div>`;
  }
  function categories(){
    render(`${scoreBar()}
      <div class="clay neo" style="padding:22px">
        <h2 class="section-title">🧩 اختر الفئة</h2><p class="sub">اختر الفئة التي تريدون اللعب منها.</p>
        <div class="category-grid">${CATS.map(([name,emoji])=>{
          const count=window.IQ_QUESTIONS.filter(q=>q.category===name).length;
          return `<button class="cat clay neo" ${count===0?"disabled":""} onclick="${count===0?"IQ.emptyCategory()":"IQ.pickCategory('"+esc(name).replace(/'/g,"\\'")+"')"}"><span class="emoji">${emoji}</span><strong>${esc(name)}</strong><small>${count?count+" سؤال":"غير متوفر في بنك الأسئلة"}</small></button>`
        }).join("")}</div>
      </div>`);
  }
  function emptyCategory(){showToast("هذه الفئة موجودة في الدليل لكنها لا تحتوي أسئلة في البنك المرفق.");}
  function pickCategory(name){state.selectedCategory=name;play();difficulty()}

  function difficulty(){
    render(`${scoreBar()}
      <div class="clay neo" style="padding:24px">
        <h2 class="section-title">🎚️ اختر الصعوبة</h2><p class="sub">الفئة: <b>${esc(state.selectedCategory)}</b></p>
        <div class="diff-grid">
          <button class="diff clay neo easy" onclick="IQ.pickDifficulty('سهل')"><div class="big">🟢</div><h3>سهل</h3><p>إجابة صحيحة +1 • انتهاء الوقت 0</p></button>
          <button class="diff clay neo medium" onclick="IQ.pickDifficulty('متوسط')"><div class="big">🟡</div><h3>متوسط</h3><p>إجابة صحيحة +2 • انتهاء الوقت -1</p></button>
          <button class="diff clay neo hard" onclick="IQ.pickDifficulty('صعب')"><div class="big">🔴</div><h3>صعب</h3><p>إجابة صحيحة +3 • انتهاء الوقت -2</p></button>
        </div>
      </div>`);
  }
  function pickDifficulty(d){state.selectedDifficulty=d;loadQuestion()}

  function loadQuestion(){
    stopTimer();stopAssistTimer();state.answered=false;state.eliminated=false;state.turnResult=null;
    let pool=window.IQ_QUESTIONS.filter(q=>q.category===state.selectedCategory&&q.difficulty===state.selectedDifficulty&&!state.used.has(q.id));
    if(!pool.length){
      // reset only this category/difficulty pool as specified
      state.used.forEach(id=>{});
      pool=window.IQ_QUESTIONS.filter(q=>q.category===state.selectedCategory&&q.difficulty===state.selectedDifficulty);
      showToast("تم استهلاك هذه المجموعة — سيعاد تدوير الأسئلة");
    }
    state.question=pool[Math.floor(Math.random()*pool.length)];state.used.add(state.question.id);
    state.options=shuffle(state.question.options.map((o,i)=>({...o,uid:`${state.question.id}-${i}`})));
    state.timeLeft=180;state.questionStart=Date.now();
    renderQuestion();startTimer();
  }

  function renderQuestion(){
    const q=state.question,d=DIFF[q.difficulty],cat=CAT_MAP[q.category];
    const letters="ABCDEF";
    render(`${scoreBar()}
      <div class="game-card clay neo">
        <div class="question-head">
          <div class="meta"><span>${cat?.emoji||"🧠"} ${esc(q.category)}</span><span>${d.icon} ${q.difficulty}</span><span>${q.type==="yes-no"?"نعم / لا":"اختيار من متعدد"}</span></div>
          <div class="timer-wrap"><div class="timer"><div id="timerBar" class="timer-bar"></div></div><div id="timerText" class="timer-text">03:00</div></div>
        </div>
        <div class="question clay">${esc(q.question)}</div>
        <div id="feedback" class="feedback"></div>
        <div id="options" class="options">
          ${state.options.map((o,i)=>`<button id="opt-${i}" class="option clay neo" onclick="IQ.answer(${i})"><span class="letter">${letters[i]}</span><span>${esc(o.text)}</span></button>`).join("")}
        </div>
        <div class="assists">
          <button class="assist skeu-btn" ${state.assists[state.currentTeam].instagram<=0?"disabled":""} onclick="IQ.external('instagram')"><b>📸</b>إنستغرام <span>${state.assists[state.currentTeam].instagram}</span></button>
          <button class="assist skeu-btn" ${state.assists[state.currentTeam].tiktok<=0?"disabled":""} onclick="IQ.external('tiktok')"><b>🎵</b>تيك توك <span>${state.assists[state.currentTeam].tiktok}</span></button>
          <button class="assist skeu-btn" ${state.assists[state.currentTeam].chatgpt<=0?"disabled":""} onclick="IQ.external('chatgpt')"><b>🤖</b>ChatGPT <span>${state.assists[state.currentTeam].chatgpt}</span></button>
          <button class="assist skeu-btn" ${state.assists[state.currentTeam].eliminate<=0||state.question.type==="yes-no"?"disabled":""} onclick="IQ.eliminate()"><b>🎯</b>حذف 4 <span>${state.assists[state.currentTeam].eliminate}</span></button>
        </div>
        <div class="help-strip neo-inset"><small>الأخطاء لا تخصم نقاطًا. يمكنك المحاولة مرة أخرى حتى الإجابة الصحيحة أو انتهاء الوقت.</small><strong>${d.points>0?"+"+d.points:""} نقطة</strong></div>
      </div>`);
  }

  function startTimer(){
    state.timer=setInterval(()=>{
      if(state.timeLeft<=0){timeout();return}
      state.timeLeft--;
      if(state.timeLeft%30===0)play("tick");
      updateTimer();
    },1000);
    updateTimer();
  }
  function updateTimer(){
    const bar=document.getElementById('timerBar'),txt=document.getElementById('timerText');if(!bar||!txt)return;
    bar.style.width=(state.timeLeft/180*100)+"%";
    const m=Math.floor(state.timeLeft/60),s=state.timeLeft%60;txt.textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  }

  function answer(i){
    if(state.answered)return;
    const o=state.options[i],btn=document.getElementById('opt-'+i),fb=document.getElementById('feedback');
    if(o.correct){
      state.answered=true;stopTimer();play("good");btn.classList.add("correct");
      const d=DIFF[state.selectedDifficulty];state.scores[state.currentTeam]+=d.points;state.nextDelta=d.points;
      fb.className="feedback good";fb.textContent="إجابة صحيحة! 🎉";
      setTimeout(()=>afterResult(true),900);
    }else{
      play("bad");btn.classList.add("wrong");fb.className="feedback bad";fb.textContent="الإجابة خاطئة 😭 جرّب خيارًا آخر";
      setTimeout(()=>btn.classList.remove("wrong"),400);
    }
  }

  function timeout(){
    if(state.answered)return;state.answered=true;stopTimer();play("bad");
    const d=DIFF[state.selectedDifficulty];state.scores[state.currentTeam]+=d.penalty;state.nextDelta=d.penalty;
    const correctIndex=state.options.findIndex(o=>o.correct);
    if(correctIndex>=0)document.getElementById('opt-'+correctIndex)?.classList.add("reveal");
    const fb=document.getElementById('feedback');if(fb){fb.className="feedback timeout";fb.textContent="انتهى الوقت! ⏰";}
    setTimeout(()=>afterResult(false,true),1400);
  }

  function afterResult(correct,timedOut=false){
    if(state.scores[state.currentTeam]>=20){winner(state.currentTeam);return}
    const sign=state.nextDelta>=0?"+":"";
    render(`${scoreBar()}<div class="score-update clay neo">
      <div style="font-size:48px">${correct?"🎉":"⏰"}</div>
      <h2>${correct?"إجابة صحيحة!":"انتهى الوقت!"}</h2>
      <div class="delta ${state.nextDelta<0?"minus":""}">${sign}${state.nextDelta}</div>
      <p class="sub">${correct?`تمت إضافة النقاط للفريق ${state.currentTeam===0?"الأول":"الثاني"}.`:`تم تطبيق عقوبة مستوى ${esc(state.selectedDifficulty)}.`}</p>
      <div class="small-actions"><button class="btn primary" onclick="IQ.passPhone()">مرّر الجوال 📱</button></div>
    </div>`);
  }

  function passPhone(){
    state.currentTeam=state.currentTeam===0?1:0;state.nextDelta=0;
    render(`<div class="pass-card clay neo"><div class="phone">📱</div><h2>مرّر الجوال إلى ${state.currentTeam===0?"الفريق الأول":"الفريق الثاني"}</h2><p class="sub">تأكد أن الفريق الصحيح يمسك الجوال قبل المتابعة.</p><button class="btn primary" onclick="IQ.categories()">اضغط للمتابعة</button></div>`);
  }

  function eliminate(){
    if(state.answered||state.question.type==="yes-no")return;
    const inv=state.assists[state.currentTeam];if(inv.eliminate<=0)return;
    inv.eliminate--;state.eliminated=true;play("good");
    const wrong=state.options.map((o,i)=>o.correct?null:i).filter(i=>i!==null);
    const hide=shuffle(wrong).slice(0,4);
    hide.forEach(i=>document.getElementById('opt-'+i)?.classList.add('dim'));
    showToast("تم حذف 4 خيارات! 🎯");
  }

  function external(type){
    if(state.answered)return;
    const inv=state.assists[state.currentTeam],key=type;
    if(inv[key]<=0)return;inv[key]--;stopTimer();state.assistLeft=60;
    const urls={instagram:"https://www.instagram.com/explore/",tiktok:"https://www.tiktok.com/search",chatgpt:"https://chatgpt.com/"};
    try{window.open(urls[type],"_blank","noopener,noreferrer")}catch{}
    const labels={instagram:"إنستغرام",tiktok:"تيك توك",chatgpt:"ChatGPT"};
    showSearchModal(labels[type]);
  }
  function showSearchModal(label){
    const back=document.createElement('div');back.className="modal-back";back.id="searchModal";
    back.innerHTML=`<div class="modal clay neo"><div style="font-size:46px">🔎</div><h3>وقت البحث — ${label}</h3><p>تم إيقاف مؤقت السؤال. ابحثوا باستخدام الجهاز الخارجي ثم عودوا للجوال.</p><div class="search-timer" id="assistCountdown">01:00</div><button class="btn primary" id="finishSearch">إنهاء البحث الآن</button></div>`;
    document.body.appendChild(back);
    document.getElementById('finishSearch').onclick=finishSearch;
    state.assistTimer=setInterval(()=>{
      state.assistLeft--;document.getElementById('assistCountdown').textContent=`00:${String(state.assistLeft).padStart(2,"0")}`;
      if(state.assistLeft<=0)finishSearch();
    },1000);
  }
  function finishSearch(){
    stopAssistTimer();document.getElementById('searchModal')?.remove();showToast("عاد مؤقت السؤال ⏱️");startTimer();
  }

  function winner(team){
    stopTimer();stopAssistTimer();state.winner=team;play("win");
    render(`<div class="winner clay neo"><div class="trophy">🏆</div><h1>الفوز للفريق ${team===0?"الأول":"الثاني"}!</h1><p class="sub">وصل الفريق إلى ${state.scores[team]} نقطة.</p>
      <div class="teams"><div class="team-card t1 clay"><h3>🔴 الفريق الأول</h3><strong style="font-size:42px">${state.scores[0]}</strong></div><div class="team-card t2 clay"><h3>🔵 الفريق الثاني</h3><strong style="font-size:42px">${state.scores[1]}</strong></div></div>
      <button class="btn primary" onclick="IQ.startSetup()">لعبة جديدة 🎮</button></div>`);
  }

  soundBtn.onclick=()=>{state.sound=!state.sound;soundBtn.textContent=state.sound?"🔊":"🔇";play("click")};
  resetBtn.onclick=()=>{if(confirm("إعادة اللعبة والعودة للبداية؟"))home()};
  window.IQ={home,startSetup,changeCount,assignTeams,intro,categories,pickCategory,emptyCategory,difficulty,pickDifficulty,answer,passPhone,eliminate,external};
  home();
})();
