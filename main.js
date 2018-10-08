face = [];
for (let i = 1; i <= 8; i++) {
  face.push(document.querySelector('#face' + i));
}
let screens;

var currWord = 0;
var whichWord = 0;

let firstPlayIsOn = false;
let time = 0;

document.addEventListener('click', onClick);
let clockwise = true;
let coef;
let currAngle = 0;


const audio = new Audio('data/tip.wav');
audio.volume = 0.1;

function onClick() {
  clockwise = !clockwise;
}

function writeWords() {
  for (const screen of screens) {
    for (let i = 0; i < screen.words.length; i++) {
      let word = screen.words[i];
      if (time > word.startTime && time < word.endTime) {
        whichWord = i;
        if (i > 1)
          coef = screen.words[i].startTime - screen.words[i - 1].startTime;
        if (word.speakerTag == 1) {
          face[0].innerHTML = '<span id="reverse">' + word.word + ' </span>';
          face[2].innerHTML = '<span id="reverse">' + word.word + ' </span>';
          face[4].innerHTML = '<span id="reverse">' + word.word + ' </span>';
          face[6].innerHTML = '<span id="reverse">' + word.word + ' </span>';
          clockwise = true;
        } else if (word.speakerTag == 2) {
          face[1].innerHTML = '<span>' + word.word + ' </span>';
          face[3].innerHTML = '<span>' + word.word + ' </span>';
          face[5].innerHTML = '<span>' + word.word + ' </span>';
          face[7].innerHTML = '<span>' + word.word + ' </span>';
          clockwise = false;
        }
      }
    }
  }
}

function rotateWords() {
  if (whichWord != currWord && whichWord > 0) {
    currWord = whichWord;
    audio.play();
    // console.log(coef);
    document.getElementsByTagName('section')[0].style.transitionDuration = coef;
    if (clockwise) {
      currAngle += 90;
      // console.log('currAngle++');
    } else {
      currAngle -= 90;
      // console.log('currAngle--');
    }
    if (currWord != 0) {
      // console.log(
      //   screens[0].words[currWord].speakerTag + ' : ' +
      //   screens[0].words[currWord].word + ' : ' + currAngle);
      if (screens[0].words[currWord].id == 's0-w64') {
        setTimeout(function () {
          transcript.toggle();
          for (const div of face) {
            div.innerHTML = '';
          }
        }, 8000);
      }
    }
    const angles = [
      currAngle, //
      currAngle, //
      currAngle + 90, //
      currAngle + 90, //
      currAngle + 180, //
      currAngle + 180, //
      currAngle + 270, //
      currAngle + 270
    ];
    for (let i = 0; i < 8; i++) {
      if (face[i].style.setProperty) {
        face[i].style.setProperty(
          'transform', 'rotateY(' + (angles[i]) + 'deg)');
      }
    }
  }
}

function update(t) {
  time = t;
  writeWords();
  rotateWords();
}

function setup(tr) {
  screens = tr.screens;
  transcript.on('update', update);
  transcript.play();
  firstPlayIsOn = true;
  document.addEventListener('click', transcript.toggle);
}

const file = 'data/samantha';
transcript.load(file).then(setup);