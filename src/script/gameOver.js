export default save => {
  if (!localStorage.getItem('permaSave'))
    localStorage.setItem(
      'permaSave',
      JSON.stringify({
        lastMet: Date.now(),
        gameOver: 1,
      }),
    );
  permaSave = JSON.parse(localStorage.getItem('permaSave'));
  const script = [
    {
      p: [{ n: 'nikita-eyes-closed', a: [[50, 0, 500]] }],
      q: '...',
      qs: 'nikita.wav',
    },
  ];
  let ending;
  if (save.choices.includes('А, помнишь, как я тебе тогда помогла?'))
    ending = [
      {
        q: 'Блин, бедная моя... Тебе надо аккуратнее ходить вокруг бассейна!',
        qs: 'nikita.wav',
      },
      {
        q: 'Это, пожалуй, самая ужасная концовка, на которую ты могла выйти...',
        qs: 'nikita.wav',
      },
      {
        q: '[Концовка 1/4] "Самая глупая концовка"',
        qs: 'nikita.wav',
      },
    ];
  else ending = [];
  const isTodayBirthday = new Date().getDate() === 3 && new Date().getMonth() === 9;
  const age = new Date().getFullYear() - 2000;
  const daysSinceLastMet = Math.floor(((permaSave.lastMet - Date.now()) / 24) * 60 * 60 * 1000);
  if (permaSave.gameOver === 1)
    script.push(
      {
        q: 'Привет',
        qs: 'nikita.wav',
      },
      {
        q: 'Похоже, мы видимся в первый раз, если это можно так назвать.',
        qs: 'nikita.wav',
      },
      {
        q: 'Поздравляю! Это твоя первая концовка!\nЯ буду их нумеровать, чтобы тебе было легче найти их все.',
        qs: 'nikita.wav',
      },
      {
        q: 'Не, то что бы это было супер сложно, ведь я эту игру сделал очень короткой.',
        qs: 'nikita.wav',
      },
      {
        q: 'Кто знал, что делать игры (даже такого качества) очень долго и сложно?',
        qs: 'nikita.wav',
      },
    );
  else
    script.push({
      q: 'Снова, приветствую тебя, дорогая.',
    });
  if (daysSinceLastMet === 0 && permaSave.gameOver !== 1)
    script.push({
      q: 'Кажется, мы уже сегодня виделись, хаха.',
      qs: 'nikita.wav',
    });
  else if (daysSinceLastMet === 1)
    script.push(
      {
        q: 'Вау, я не видел тебя целый день!',
        qs: 'nikita.wav',
      },
      {
        q: 'Знаешь-ли, я очень соскучился.',
        qs: 'nikita.wav',
      },
      {
        q: 'Не то что бы я был настоящим...Но я частичка Никиты, и тоже очень люблю внимание от любимой~',
        qs: 'nikita.wav',
      },
      {
        q: 'А, так же я очень польщен, тем что ты до сих пор играешь в эту игру, ахаха.',
        qs: 'nikita.wav',
      },
    );
  else if (daysSinceLastMet > 1 && daysSinceLastMet < 7)
    script.push(
      {
        q: 'Взяла перерыв, от игры?',
        qs: 'nikita.wav',
      },
      {
        q: 'Хотя она действительно не большая, я думаю за час ее можно с легкостью пройти...',
        qs: 'nikita.wav',
      },
      {
        q: 'Либо ты вернулась, чтобы снова навестить меня?)',
        qs: 'nikita.wav',
      },
      {
        q: 'Если так, то приходи почаще, я всегда рад тебя видеть)',
        qs: 'nikita.wav',
      },
    );
  else if (daysSinceLastMet >= 7 && daysSinceLastMet < 30)
    script.push(
      {
        q: 'Я не видел тебя больше недели!',
        qs: 'nikita.wav',
      },
      {
        q: 'Ты не представляешь, как я рад тебя снова здесь видеть, хаха.',
        qs: 'nikita.wav',
      },
      {
        q: 'Неужели ты еще не прошла эту игру?',
        qs: 'nikita.wav',
      },
      {
        q: 'Или ты здесь чисто, чтобы узнать, что я могу тебе еще интересного сказать?)',
        qs: 'nikita.wav',
      },
    );
  else if (daysSinceLastMet >= 30 && daysSinceLastMet < 180)
    script.push(
      {
        q: 'Это был долгий сон...',
        qs: 'nikita.wav',
      },
      {
        q: 'Сколько уже времени, прошло?..',
        qs: 'nikita.wav',
      },
      {
        q: 'В любом случае, я рад тебя видеть здесь снова.',
        qs: 'nikita.wav',
      },
      {
        q: 'Блин, я бы хотел тебе дать какой-то подарок за то, что до сих пор вспоминаешь обо мне...',
        qs: 'nikita.wav',
      },
      {
        q: 'Скажи реальному Никите об этом, я думаю он придумает, как тебя отблагодарить)',
        qs: 'nikita.wav',
      },
    );
  else if (daysSinceLastMet >= 180 && daysSinceLastMet < 360)
    script.push(
      {
        q: 'Знаешь... Прошло уже пол года, как я видел тебя...',
        qs: 'nikita.wav',
      },
      {
        q: 'Мне без тебя очень-очень плохо, заходи ко мне почаще.',
        qs: 'nikita.wav',
      },
      {
        q: 'Люблю тебя.',
        qs: 'nikita.wav',
      },
    );
  else if (daysSinceLastMet >= 360)
    script.push(
      {
        q: '...',
        qs: 'nikita.wav',
      },
      {
        q: '...',
        qs: 'nikita.wav',
      },
      {
        q: '...',
        qs: 'nikita.wav',
      },
      {
        q: 'Ты должно быть, счастлива с настоящим Никитой.',
        qs: 'nikita.wav',
      },
      {
        q: 'Я очень рад, за тебя.',
        qs: 'nikita.wav',
      },
    );
  if (isTodayBirthday && !(daysSinceLastMet === 0 && permaSave.gameOver !== 1)) {
    script.push(
      {
        q: 'О, сегодня твой день рождения!',
        qs: 'nikita.wav',
      },
      {
        q: 'Поздравляю, тебя, моя дорогая!\nЯ тебя очень люблю!',
        qs: 'nikita.wav',
      },
      {
        q: 'Ты говорила, что ты не очень любишь свои дни рождения...',
        qs: 'nikita.wav',
      },
      {
        q: 'Но я люблю твой день рождения. Ведь сегодня на свет появилась та, ради кого я живу!',
        qs: 'nikita.wav',
      },
      {
        q: 'Ты моё счастье!\n*чмок*',
        qs: 'nikita.wav',
      },
    );
    if (age > 21)
      script.push(
        {
          q: 'Стоп-стоп. Тебе уже ' + age + '!',
          qs: 'nikita.wav',
        },
        {
          q: 'Поверить не могу!\nТы до сих пор заходишь на свой день рождения, в эту игру!',
          qs: 'nikita.wav',
        },
        {
          q: 'Она не стоит того...\nНо мне очень приятно)',
          qs: 'nikita.wav',
        },
        {
          q: '*чмок чмок чмок чмок чмок*',
          qs: 'nikita.wav',
        },
      );
  }
  script[1].p = [
    { n: 'nikita-eyes-closed', a: [[50, -300]] },
    { n: 'nikita', a: [[50, 0]] },
  ];
  script.push(
    {
      q: 'На этом всё! Можешь нажать кнопочку "Загрузить" снизу, и попробовать снова.',
      qs: 'nikita.wav',
    },
    {
      s: 'gameOverEndless',
    },
  );
  return script;
};
