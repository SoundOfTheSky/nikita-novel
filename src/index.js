import '@/index.css';
import scripts from '@/script';
let s = localStorage.getItem('saves');
if (!s) {
  localStorage.setItem('saves', []);
  s = '[]';
}
const saves = JSON.parse(s);
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
  audio.isLooped=loop;
  audio.play();
  if (game.audio[name]) stopAudio(name);
  game.audio[name] = audio;
  if (loop)
    audio.addEventListener('ended', () => {
      console.log('ended');
      playAudio(name);
    });
}
function stopAudio(name) {
  game.audio[name]?.pause();
  game.audio[name] = null;
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
const dialogLoad = document.getElementById('dialog-load');
const $saves = document.getElementById('saves');
const choose = document.getElementById('choose');
const nextTick = () => new Promise(r => requestAnimationFrame(r));
const wait = t => new Promise(r => setTimeout(r, t));
let gameBackground;
let save;
let textAnimation = false;
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
  if (!textAnimation) {
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
  if (!textAnimation) {
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
  if (!isSimple) {
    if (panel.bg) {
      if (gameBackground) {
        const bg = gameBackground;
        setTimeout(() => bg.remove(), 500);
      }
      const isColor = panel.bg.startsWith('#');
      const bg = document.createElement(isColor ? 'div' : 'img');
      bg.className = 'background';
      if (isColor) bg.style.backgroundColor = panel.bg;
      else bg.src = '/backgrounds/' + panel.bg;
      menus.game.appendChild(bg);
      if (!gameBackground) bg.style.opacity = 1;
      else {
        await nextTick();
        bg.style.opacity = 1;
      }
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
    if (panel.p) {
      panel.p.forEach(async actor => {
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
    }
    if (panel.s) return startScript(typeof scripts[panel.s] === 'function' ? scripts[panel.s](save) : scripts[panel.s]);
  }

  dialogText.innerHTML = '';
  textAnimation = true;
  for (const char of isSimple ? panel : panel.q) {
    await wait(dialogSkipEnabled ? 1 : 50);
    if (!textAnimation) break;
    if (i !== save.i) return;
    if (char === '\n') dialogText.innerHTML += '<br/>';
    else dialogText.innerHTML += char;
  }
  textAnimation = false;
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
  else if (textAnimation) {
    textAnimation = false;
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
dialogSave.addEventListener('click', e => {
  e.stopPropagation();
  isSavesOpened = true;
  $saves.style.right = '0';
  saves.forEach(x => {
    const addBtn = document.createElement('div');
    addBtn.className = 'save';
    $saves.appendChild(addBtn);
  });
  const addBtn = document.createElement('div');
  addBtn.innerText = 'Создать';
  addBtn.className = 'create-save';
  $saves.appendChild(addBtn);
  addBtn.addEventListener('click', () => {
    save.bg = document.getElementsByClassName('background')[0].src;
    save.name = dialogName.innerText;
    save.audio = Object.fromEntries(Object.entries(game.audio).map(el=>[el[0],el[1].isLooped]))
    saves.push(save);
    updateSaves();
    closeSaves();
  });
  
});
