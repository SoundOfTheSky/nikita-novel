import '@/index.css';
import scripts from '@/script';
import chart from '@/chart';
let s = localStorage.getItem('saves');
if (!s) {
  localStorage.setItem('saves', []);
  s = '[]';
}
let saves = JSON.parse(s);
const game = {
  menu: 'menu',
  audio: {},
};
const menus = {
  game: document.getElementById('game'),
  'main-menu': document.getElementById('main-menu'),
  'save-menu': document.getElementById('save-menu'),
  disclaimer: document.getElementById('disclaimer'),
};
function setMenu(menu) {
  game.menu = menu;
  Object.values(menus).forEach(m => (m.style.display = null));
  menus[menu].style.display = 'flex';
}
function playAudio(name, loop) {
  const audio = new Audio('/audio/' + name);
  audio.loop = loop;
  audio.play();
  if (game.audio[name]) stopAudio(name);
  game.audio[name] = audio;
}
function stopAudio(name) {
  game.audio[name]?.pause();
  delete game.audio[name];
}
setMenu('disclaimer');
let mainMenuBackgroundInterval;
menus.disclaimer.addEventListener('click', () => {
  if (window.innerWidth < window.innerHeight) return;
  setMenu('main-menu');
  playAudio('airplanes.mp3', true);
  const backgrounds = ['/backgrounds/mordetwi1.jpg', '/backgrounds/mordetwi2.jpg', '/backgrounds/mordetwi3.jpg'];
  let bgi = 0;
  function gogomordetwi() {
    const img = document.createElement('img');
    img.src = backgrounds[bgi++];
    if (bgi === backgrounds.length) bgi = 0;
    img.className = 'background';
    const dirY = Math.random() > 0.5;
    const dirX = Math.random() > 0.5;
    img.style.left = (dirX ? -window.innerWidth : window.innerWidth) + 'px';
    img.style.top = (dirY ? -window.innerHeight : window.innerHeight) + 'px';
    menus['main-menu'].appendChild(img);
    requestAnimationFrame(() => {
      img.style.opacity = 1;
      img.style.left = 0;
      img.style.top = 0;
      setTimeout(() => {
        img.style.left = (dirX ? window.innerWidth : -window.innerWidth) + 'px';
        img.style.top = (dirY ? window.innerHeight : -window.innerHeight) + 'px';
        img.style.opacity = 0;
        setTimeout(() => img.remove(), 7000);
      }, 7000);
    });
  }
  gogomordetwi();
  mainMenuBackgroundInterval = setInterval(gogomordetwi, 3600);
});
const dialogText = document.getElementById('dialog-text');
const dialogName = document.getElementById('dialog-name');
const dialogAuto = document.getElementById('dialog-auto');
const dialogSkip = document.getElementById('dialog-skip');
const dialogSave = document.getElementById('dialog-save');
const $saves = document.getElementById('saves');
const choose = document.getElementById('choose');
const nextTick = () => new Promise(r => requestAnimationFrame(r));
const wait = t => new Promise(r => setTimeout(r, t));
let gameBackground;
let save;
let planeAnimation = false;
let dialogAutoEnabled = false;
let dialogSkipEnabled = false;
let autoEnabled = true;
let isSavesOpened = false;
function setAutoEnabled(isEnabled) {
  autoEnabled = isEnabled;
  dialogAuto.style.color = autoEnabled ? null : 'rgb(148, 148, 148)';
  dialogSkip.style.color = autoEnabled ? null : 'rgb(148, 148, 148)';
  if (!autoEnabled) {
    dialogAutoEnabled = false;
    dialogAuto.style.textDecoration = null;
    dialogSkipEnabled = false;
    dialogSkip.style.textDecoration = null;
  }
}
dialogAuto.addEventListener('click', e => {
  e.stopPropagation();
  if (!autoEnabled) return;
  dialogSkipEnabled = false;
  dialogSkip.style.textDecoration = null;
  dialogAutoEnabled = !dialogAutoEnabled;
  dialogAuto.style.textDecoration = dialogAutoEnabled ? 'underline' : null;
  if (!planeAnimation) {
    save.i++;
    renderPanel();
  }
});
dialogSkip.addEventListener('click', e => {
  e.stopPropagation();
  if (!autoEnabled) return;
  dialogAutoEnabled = false;
  dialogAuto.style.textDecoration = null;
  dialogSkipEnabled = !dialogSkipEnabled;
  dialogSkip.style.textDecoration = dialogSkipEnabled ? 'underline' : null;
  if (!planeAnimation) {
    save.i++;
    renderPanel();
  }
});
const actors = {};
[...document.getElementsByClassName('actor')].forEach(a => (actors[a.className.slice(8)] = a));

async function renderPanel() {
  const i = save.i;
  const panel = save.script[save.i];
  console.log(panel);
  const isSimple = typeof panel === 'string';
  planeAnimation = true;
  if (!isSimple) {
    if (panel.bg) {
      if (gameBackground) {
        const bg = gameBackground;
        setTimeout(() => bg.remove(), 500);
      }
      const isColor = panel.bg.startsWith('#') || panel.bg.startsWith('rgb');
      const bg = document.createElement(isColor ? 'div' : 'img');
      bg.className = 'background';
      if (isColor) bg.style.backgroundColor = panel.bg;
      else bg.src = '/backgrounds/' + panel.bg;
      menus.game.appendChild(bg);
      await nextTick();
      bg.style.opacity = 1;
      gameBackground = bg;
    }
    if (panel.n !== undefined) dialogName.innerText = panel.n;
    if (panel.a) for (const a of panel.a) playAudio(...a);
    if (panel.as) for (const a of panel.as) stopAudio(a);
    if (panel.c) {
      setAutoEnabled(false);
      for (let ci = 0; ci < panel.c.length; ci++) {
        const btn = document.createElement('div');
        btn.innerText = panel.c[ci];
        btn.addEventListener('click', e => {
          e.stopPropagation();
          startScript(
            typeof scripts[panel.cc[ci]] === 'function' ? scripts[panel.cc[ci]](save) : scripts[panel.cc[ci]],
          );
          [...choose.children].forEach(child => child.remove());
          setAutoEnabled(true);
          save.choices.push(panel.c[ci]);
        });
        choose.appendChild(btn);
      }
    }
    if (panel.p)
      panel.p.forEach(async actor => {
        const img = actors[actor.n];
        if (actor.h) img.style.height = actor.h + 'vh';
        await nextTick();
        if (actor.a && actor.a.length) {
          for (let i = 0; i < actor.a.length; i++) {
            if (planeAnimation) {
              img.style.transition = (actor.a[i][2] ?? 0) + 'ms';
              img.style.left = actor.a[i][0] + 'vw';
              img.style.bottom = actor.a[i][1] + 'vh';
              await wait(actor.a[i][2] ?? 0);
              img.style.transition = 'none';
            } else {
              img.style.transition = 'none';
              img.style.left = actor.a[actor.a.length - 1][0] + 'vw';
              img.style.bottom = actor.a[actor.a.length - 1][1] + 'vh';
            }
          }
        }
      });
    if (panel.s) return startScript(typeof scripts[panel.s] === 'function' ? scripts[panel.s](save) : scripts[panel.s]);
    if (panel.playFinal) return playFinal();
  }

  dialogText.innerHTML = '';
  for (const char of isSimple ? panel : panel.q) {
    await wait(dialogSkipEnabled ? 1 : 50);
    if (!planeAnimation) break;
    if (i !== save.i) return;
    if (char === '\n') dialogText.innerHTML += '<br/>';
    else dialogText.innerHTML += char;
  }
  planeAnimation = false;
  if (dialogAutoEnabled || dialogSkipEnabled) {
    await wait(dialogSkipEnabled ? 20 : 1500);
    if (i !== save.i) return;
    nextPanel();
  }
}
function nextPanel() {
  save.i++;
  renderPanel();
}
menus.game.addEventListener('click', () => {
  if (isSavesOpened) closeSaves();
  else if (planeAnimation) {
    planeAnimation = false;
    const panel = save.script[save.i];
    dialogText.innerHTML = (typeof panel === 'string' ? panel : panel.q).replace(/\n/g, '<br/>');
  } else nextPanel();
});
function startScript(script) {
  save = {
    i: 0,
    script,
    choices: [],
  };
  renderPanel();
}
document.querySelector('#main-menu .buttons .new-game').addEventListener('click', () => {
  clearInterval(mainMenuBackgroundInterval);
  stopAudio('airplanes.mp3');
  setMenu('game');
  startScript(scripts.newGame);
});
document.querySelector('#main-menu .buttons .exit').addEventListener('click', () => window.close());
function closeSaves() {
  isSavesOpened = false;
  $saves.style.right = '-18vw';
  [...$saves.children].forEach(c => c.remove());
}
function updateSaves() {
  localStorage.setItem('saves', JSON.stringify(saves));
}
function populateSave() {
  save.bg = gameBackground?.src || gameBackground?.style.backgroundColor;
  save.name = dialogName.innerText;
  save.audio = Object.fromEntries(Object.entries(game.audio).map(el => [el[0], el[1].isLooped]));
  save.p = Object.entries(actors).map(a => ({
    n: a[0],
    h: +a[1].style.height.replace('vw', ''),
    a: [
      [
        a[1].style.left ? +a[1].style.left.replace('vw', '') : 50,
        a[1].style.bottom ? +a[1].style.bottom.replace('vh', '') : -300,
      ],
    ],
  }));
}
dialogSave.addEventListener('click', e => {
  e.stopPropagation();
  if (isSavesOpened) return closeSaves();
  isSavesOpened = true;
  $saves.style.right = '0';
  for (let i = 0; i < saves.length; i++) {
    const addBtn = document.createElement('div');
    addBtn.className = 'save';
    addBtn.style.background = `no-repeat 0 0/cover url(${saves[i].bg})`;
    addBtn.addEventListener('click', () => {
      populateSave();
      saves[i] = save;
      updateSaves();
      closeSaves();
    });
    $saves.appendChild(addBtn);
  }
  const addBtn = document.createElement('div');
  addBtn.innerText = 'Создать';
  addBtn.className = 'create-save';
  $saves.appendChild(addBtn);
  addBtn.addEventListener('click', () => {
    populateSave();
    saves.push(save);
    updateSaves();
    closeSaves();
  });
});
dialogLoad.addEventListener('click', e => {
  e.stopPropagation();
  if (isSavesOpened) return closeSaves();
  isSavesOpened = true;
  saves = JSON.parse(localStorage.getItem('saves'));
  $saves.style.right = '0';
  for (let i = 0; i < saves.length; i++) {
    const addBtn = document.createElement('div');
    addBtn.className = 'save';
    const isColor = saves[i].bg.startsWith('#') || saves[i].bg.startsWith('rgb');
    if (isColor) addBtn.style.backgroundColor = saves[i].bg;
    else addBtn.style.background = `no-repeat 0 0/cover url(${saves[i].bg})`;
    addBtn.addEventListener('click', () => !planeAnimation && loadGame(saves[i]));
    $saves.appendChild(addBtn);
  }
});
document.querySelector('#main-menu .buttons .load').addEventListener('click', e => {
  e.stopPropagation();
  if (isSavesOpened) return closeSaves();
  isSavesOpened = true;
  saves = JSON.parse(localStorage.getItem('saves'));
  $saves.style.right = '0';
  for (let i = 0; i < saves.length; i++) {
    const addBtn = document.createElement('div');
    addBtn.className = 'save';
    const isColor = saves[i].bg.startsWith('#') || saves[i].bg.startsWith('rgb');
    if (isColor) addBtn.style.backgroundColor = saves[i].bg;
    else addBtn.style.background = `no-repeat 0 0/cover url(${saves[i].bg})`;
    addBtn.addEventListener('click', () => {
      clearInterval(mainMenuBackgroundInterval);
      stopAudio('airplanes.mp3');
      setMenu('game');
      loadGame(saves[i]);
    });
    $saves.appendChild(addBtn);
  }
});
async function loadGame(s) {
  save = s;
  // Background
  const isColor = s.bg.startsWith('#') || s.bg.startsWith('rgb');
  const bg = document.createElement(isColor ? 'div' : 'img');
  bg.className = 'background';
  if (isColor) bg.style.backgroundColor = s.bg;
  else bg.src = s.bg;
  menus.game.appendChild(bg);
  await nextTick();
  bg.style.opacity = 1;
  gameBackground = bg;
  // Name
  dialogName.innerText = s.name;
  // Actors
  s.p.forEach(async actor => {
    const img = actors[actor.n];
    if (actor.h) img.style.height = actor.h + 'vh';
    await nextTick();
    if (actor.a && actor.a.length) {
      for (let i = 0; i < actor.a.length; i++) {
        img.style.transition = (actor.a[i][2] ?? 0) + 'ms';
        img.style.left = actor.a[i][0] + 'vw';
        img.style.bottom = actor.a[i][1] + 'vh';
        await wait(actor.a[i][2] ?? 0);
        img.style.transition = 'none';
      }
    }
  });
  // Audio
  Object.keys(game.audio).forEach(stopAudio);
  Object.entries(s.audio).forEach(a => playAudio(...a));
  renderPanel();
function playFinal() {
  closeSaves();
  const keys = [false, false, false, false];
  const keyDict = {
    ArrowLeft: 0,
    ArrowUp: 1,
    ArrowDown: 2,
    ArrowRight: 3,
  };
  document.addEventListener('keydown', e => {
    const i = keyDict[e.key];
    if (i === undefined) return;
    keys[i] = true;
    checkKeys();
  });
  document.addEventListener('keyup', e => {
    const i = keyDict[e.key];
    if (i === undefined) return;
    keys[i] = false;
    checkKeys();
  });
  const timeLine = [];
  for(const c of chart) {
    if(c[1][0]==='1') timeLine.push([c[0], 1]);
    if(c[1][1]==='1') timeLine.push([c[0], 2]);
    if(c[1][2]==='1') timeLine.push([c[0], 3]);
    if(c[1][3]==='1') timeLine.push([c[0], 4]);
    if(c[1][0]==='2') timeLine.push([c[0], 5]);
    if(c[1][1]==='2') timeLine.push([c[0], 6]);
    if(c[1][2]==='2') timeLine.push([c[0], 7]);
    if(c[1][3]==='2') timeLine.push([c[0], 8]);
  }
  playAudio('airplanes.mp3');
  const startTime = Date.now();
  let timeout;
  let misses=0;
  function missDetection() {
    timeout = setTimeout(()=>{}, Date.now()-chart[0][0]);
  }
  function checkKeys() {
    const songTime = Date.now();
    const ableToPress = [];
    for(const t of timeLine) {
      if(songTime+250<t[0]) break;
      ableToPress.push(t);
    }
    if(keys[0]) press(1);
    if(keys[1]) press(2);
    if(keys[2]) press(3);
    if(keys[3]) press(4);
    
    for(let i=0;i<ableToPress.length;i++) {
      
    }
    function press(n) {
      const i = ableToPress.indexOf(n);
      if(i!==-1) ableToPress.splice(i,1);
      else {
        const i = ableToPress.indexOf(n+4);
        if(i!==-1) ableToPress.splice(i,1);
      }
    }
  }
}
