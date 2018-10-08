const transcript = function () {
  let data;
  let handlers = {};
  let isPlaying = false;
  let audio;


  async function load(file) {
    loadAudio(file + '.wav');
    let raw = await fetch(file + '.json').then((data) => data.json());
    if (!raw.results) {
      raw = raw.response;
    }
    const screens = [];
    let screenId = 0;
    for (const screen of raw.results) {
      const words = screen.alternatives[0].words;
      for (let i = 0; i < words.length; i++) {
        words[i].id = 's' + screenId + '-w' + i;
        words[i].startTime = parseFloat(words[i].startTime);
        words[i].endTime = parseFloat(words[i].endTime);
      }
      const startTime = parseFloat(words[0].startTime);
      const endTime = parseFloat(words[words.length - 1].endTime);
      screens.push({
        startTime: startTime,
        endTime: endTime,
        words: words,
        id: 's' + screenId,
      });
      screenId++;
    }
    data = {
      screens: screens
    };
    return data;
  }

  function loadAudio(file) {
    audio = new Audio(file);
    audio.addEventListener('ended', () => pause());
    audio.preload = true;
  }

  function on(evt, handler) {
    if (!handlers[evt]) {
      handlers[evt] = [];
    }
    handlers[evt].push(handler);
  }

  function update() {
    if (isPlaying) {
      requestAnimationFrame(update);
    }

    if (handlers['update']) {
      for (const handler of handlers['update']) {
        handler(audio.currentTime);
      }
    }
  }

  function play() {
    //audio.playbackRate = 0.5;
    audio.play();
    isPlaying = true;
    update();
  }

  function pause() {
    audio.pause();
    isPlaying = false;
  }

  function toggle() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
    document.getElementById("instruction").remove();
    document.getElementById("instruction2").remove();
  }

  return {
    load: load,
    on: on,
    play: play,
    pause: pause,
    toggle: toggle,
  }
}();