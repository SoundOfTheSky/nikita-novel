export default save => {
  if (!localStorage.getItem('permaSave'))
    localStorage.setItem(
      'permaSave',
      JSON.stringify({
        lastMet: Date.now(),
        gameOver: 1,
      }),
    );
  const permaSave = JSON.parse(localStorage.getItem('permaSave'));
  const script = [
    {
      p: [{ n: 'nikita-eyes-closed', h: 80, a: [[50, 0, 1000]] }],
      q: '...',
    },
  ];
  let ending;
  if (save.choices.includes('А, помнишь, как я тебе тогда помогла?'))
    ending = [
      {
        q: 'Блин, бедная моя... Тебе надо аккуратнее ходить вокруг бассейна!',
        qs: 'nikita.mp3',
      },
      {
        q: 'Это, пожалуй, самая ужасная концовка, на которую ты могла выйти...',
        qs: 'nikita.mp3',
      },
      {
        q: '[Концовка 1/4] "Самая глупая концовка"',
        qs: 'nikita.mp3',
      },
    ];
  else if (save.choices.includes('Отдохнуть'))
    ending = [
      {
        q: 'Ой, ты кажется уснула.',
        qs: 'nikita.mp3',
      },
      {
        q: 'Я должен был бы тебя предупредить заранее, но у тебя всего один день на этом острове.',
        qs: 'nikita.mp3',
      },
      {
        q: 'И ты его весь проспала))',
        qs: 'nikita.mp3',
      },
      {
        q: 'Но ты всегда можешь загрузиться!\nГлавное чтобы сохранения не сломались, я их так долго делал(',
        qs: 'nikita.mp3',
      },
      {
        q: '[Концовка 2/4] "Ачё в смысле, спать нельзя?"',
        qs: 'nikita.mp3',
      },
    ];
  else if (save.choices.includes('Сделать жалобное лицо'))
    ending = [
      {
        q: 'Кто знал, что если делать жалобное лицо, в попытках получить пиво-',
        qs: 'nikita.mp3',
      },
      {
        q: 'Ты сама превратишься в Пиво)0))))0))',
        qs: 'nikita.mp3',
      },
      {
        q: 'Аххахахахааааааааааа',
        qs: 'nikita.mp3',
      },
      {
        n: '',
        q: 'Никита вытирает слёзы, после смеха.',
      },
      {
        q: 'Ладно-ладно, прости.',
        qs: 'nikita.mp3',
      },
      {
        q: '[Концовка 3/4] "Я переродилась в другом мире, чтобы сбежать из Ставрополя, но комплементировалась. Ну и что?"',
        qs: 'nikita.mp3',
      },
    ];
  else if (save.choices.includes('А зачем, ты ходил к Твайлайт?'))
    ending = [
      {
        q: 'Ммм, запретная любовь~',
        qs: 'nikita.mp3',
      },
      {
        q: 'Я надеюсь их самолёты, окажутся звёздами.',
        qs: 'nikita.mp3',
      },
      {
        q: 'Поздравляю, это кстати самая длинная для получения концовка!',
        qs: 'nikita.mp3',
      },
      {
        q: 'Эта игра вышла гораздо короче чем я планировал.',
        qs: 'nikita.mp3',
      },
      {
        q: 'Изначально, я хотел как минимум 4 интересных концовки, геймплей на часик и возможность грабить караваны.',
        qs: 'nikita.mp3',
      },
      {
        q: 'Но переоценил себя)',
        qs: 'nikita.mp3',
      },
      {
        q: 'Ну короче типичный Nikita-dev. Жду донаты на патреон.',
        qs: 'nikita.mp3',
      },
      {
        q: '[Концовка 4/4] "Airplanes"',
        qs: 'nikita.mp3',
      },
    ];
  else ending = [];
  const isTodayBirthday = new Date().getDate() === 3 && new Date().getMonth() === 9;
  const age = new Date().getFullYear() - 2000;
  const daysSinceLastMet = Math.floor((Date.now() - permaSave.lastMet) / (24 * 60 * 60 * 1000));
  console.log(daysSinceLastMet);
  if (permaSave.gameOver === 1)
    script.push(
      {
        q: 'Привет',
        qs: 'nikita.mp3',
      },
      {
        q: 'Похоже, мы видимся в первый раз, если это можно так назвать.',
        qs: 'nikita.mp3',
      },
      {
        q: 'Поздравляю! Это твоя первая концовка!\nЯ буду их нумеровать, чтобы тебе было легче найти их все.',
        qs: 'nikita.mp3',
      },
      {
        q: 'Не, то что бы это было супер сложно, ведь я эту игру сделал очень короткой.',
        qs: 'nikita.mp3',
      },
      {
        q: 'Кто знал, что делать игры (даже такого качества) очень долго и сложно?',
        qs: 'nikita.mp3',
      },
    );
  else
    script.push({
      q: 'Снова, приветствую тебя, дорогая.',
      qs: 'nikita.mp3',
    });
  if (daysSinceLastMet === 0 && permaSave.gameOver !== 1)
    script.push({
      q: 'Кажется, мы уже сегодня виделись, хаха.',
      qs: 'nikita.mp3',
    });
  else if (daysSinceLastMet === 1)
    script.push(
      {
        q: 'Вау, я не видел тебя целый день!',
        qs: 'nikita.mp3',
      },
      {
        q: 'Знаешь-ли, я очень соскучился.',
        qs: 'nikita.mp3',
      },
      {
        q: 'Не то что бы я был настоящим...Но я частичка Никиты, и тоже очень люблю внимание от любимой~',
        qs: 'nikita.mp3',
      },
      {
        q: 'А, так же я очень польщен, тем что ты до сих пор играешь в эту игру, ахаха.',
        qs: 'nikita.mp3',
      },
    );
  else if (daysSinceLastMet > 1 && daysSinceLastMet < 7)
    script.push(
      {
        q: 'Взяла перерыв, от игры?',
        qs: 'nikita.mp3',
      },
      {
        q: 'Хотя она действительно не большая, я думаю за час ее можно с легкостью пройти...',
        qs: 'nikita.mp3',
      },
      {
        q: 'Либо ты вернулась, чтобы снова навестить меня?)',
        qs: 'nikita.mp3',
      },
      {
        q: 'Если так, то приходи почаще, я всегда рад тебя видеть)',
        qs: 'nikita.mp3',
      },
    );
  else if (daysSinceLastMet >= 7 && daysSinceLastMet < 30)
    script.push(
      {
        q: 'Я не видел тебя больше недели!',
        qs: 'nikita.mp3',
      },
      {
        q: 'Ты не представляешь, как я рад тебя снова здесь видеть, хаха.',
        qs: 'nikita.mp3',
      },
      {
        q: 'Неужели ты еще не прошла эту игру?',
        qs: 'nikita.mp3',
      },
      {
        q: 'Или ты здесь чисто, чтобы узнать, что я могу тебе еще интересного сказать?)',
        qs: 'nikita.mp3',
      },
    );
  else if (daysSinceLastMet >= 30 && daysSinceLastMet < 180)
    script.push(
      {
        q: 'Это был долгий сон...',
        qs: 'nikita.mp3',
      },
      {
        q: 'Сколько уже времени, прошло?..',
        qs: 'nikita.mp3',
      },
      {
        q: 'В любом случае, я рад тебя видеть здесь снова.',
        qs: 'nikita.mp3',
      },
      {
        q: 'Блин, я бы хотел тебе дать какой-то подарок за то, что до сих пор вспоминаешь обо мне...',
        qs: 'nikita.mp3',
      },
      {
        q: 'Скажи реальному Никите об этом, я думаю он придумает, как тебя отблагодарить)',
        qs: 'nikita.mp3',
      },
    );
  else if (daysSinceLastMet >= 180 && daysSinceLastMet < 360)
    script.push(
      {
        q: 'Знаешь... Прошло уже пол года, как я видел тебя...',
        qs: 'nikita.mp3',
      },
      {
        q: 'Мне без тебя очень-очень плохо, заходи ко мне почаще.',
        qs: 'nikita.mp3',
      },
      {
        q: 'Люблю тебя.',
        qs: 'nikita.mp3',
      },
    );
  else if (daysSinceLastMet >= 360)
    script.push(
      {
        q: '...',
        qs: 'nikita.mp3',
      },
      {
        q: '...',
        qs: 'nikita.mp3',
      },
      {
        q: '...',
        qs: 'nikita.mp3',
      },
      {
        q: 'Ты должно быть, счастлива с настоящим Никитой.',
        qs: 'nikita.mp3',
      },
      {
        q: 'Я очень рад, за тебя.',
        qs: 'nikita.mp3',
      },
    );
  if (isTodayBirthday && !(daysSinceLastMet === 0 && permaSave.gameOver !== 1)) {
    script.push(
      {
        q: 'О, сегодня твой день рождения!',
        qs: 'nikita.mp3',
      },
      {
        q: 'Поздравляю, тебя, моя дорогая!\nЯ тебя очень люблю!',
        qs: 'nikita.mp3',
      },
      {
        q: 'Ты говорила, что ты не очень любишь свои дни рождения...',
        qs: 'nikita.mp3',
      },
      {
        q: 'Но я люблю твой день рождения. Ведь сегодня на свет появилась та, ради кого я живу!',
        qs: 'nikita.mp3',
      },
      {
        q: 'Ты моё счастье!\n*чмок*',
        qs: 'nikita.mp3',
      },
    );
    if (age > 21)
      script.push(
        {
          q: 'Стоп-стоп. Тебе уже ' + age + '!',
          qs: 'nikita.mp3',
        },
        {
          q: 'Поверить не могу!\nТы до сих пор заходишь на свой день рождения, в эту игру!',
          qs: 'nikita.mp3',
        },
        {
          q: 'Она не стоит того...\nНо мне очень приятно)',
          qs: 'nikita.mp3',
        },
        {
          q: '*чмок чмок чмок чмок чмок*',
          qs: 'nikita.mp3',
        },
      );
  }
  script[1].p = [
    { n: 'nikita-eyes-closed', a: [[50, -300]] },
    { n: 'nikita', h: 80, a: [[50, 0]] },
  ];
  script.push(
    ...ending,
    {
      q: 'На этом всё! Можешь нажать кнопочку "Загрузить" снизу, и попробовать снова.',
      qs: 'nikita.mp3',
    },
    {
      s: 'gameOverEndless',
    },
  );
  permaSave.lastMet = Date.now();
  permaSave.gameOver++;
  localStorage.setItem('permaSave', JSON.stringify(permaSave));
  return script;
};
