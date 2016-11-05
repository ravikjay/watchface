/**
 * Pomodoro -- now in JS! 
 */

var UI = require('ui');
var Vector2 = require('vector2');
var Wakeup = require('wakeup');


var main = new UI.Card({
  title: 'Tre Pomodori',
  icon: 'images/menu_icon.png',
  subtitle: 'Hi!',
  body: 'Press select to go again, up for short break, down for long break.',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

var menu = new UI.Menu({
    sections: [{
      title: 'Tre Pomodori',
      items: [{
        title: 'Short Break',
        subtitle: '5m'
      }, {
        title: 'Pomodoro',
        subtitle: '25m'
      }, {
        title: 'Long Break',
        subtitle: '20m'
      }]
    }]
  });

var timerDone = new UI.Card({
  title: 'Tre Pomodori',
  icon: 'images/menu_icon.png',
  subtitle: 'Good job, one pomodoro down',
  body: 'Press select to go again, up for short break, down for long break.',
  subtitleColor: 'indigo',
  bodyColor: '#9a0036'
});

Wakeup.launch(function(e) {
  if (e.wakeup) {
    console.log('Launch because one pomodoro completed.');
    timerDone.show();
  }
  // Do not pass the event to additional handlers
  return false;
});

// Since the launch wakeup handler returns false,
// this becomes an already-running wakeup handler
Wakeup.on('wakeup', function(e) {
  if (!e.wakeup) {
    console.log('Regular launch not by a wakeup event.');
    main.show();
  }
});

menu.show();

menu.on('click', 'up', onTimerSelect);
menu.on('click', 'down', onTimerSelect);
menu.on('click', 'select', onTimerSelect);


menu.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

menu.on('click', 'select', onTimerSelect {
  var wind = new UI.Window({
    fullscreen: true,
  });
  var textfield = new UI.Text({
    position: new Vector2(0, 65),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Timer begun!',
    textAlign: 'center'
  });

  var Wakeup1 = new Wakeup();
  Wakeup1.schedule(
    {
      // Set the wakeup event for 25 minutes from now
      //time: Date.now() / 1000 + 1500,      
      time: Date.now() / 1000 + 60,
      // Pass data for the app on launch
      data: { hello: 'world' }
    },
    function(e) {
      if (e.failed) {
        // Log the error reason
        console.log('Wakeup set failed: ' + e.error);
      } else {
        console.log('Wakeup set! Event ID: ' + e.id);
      }
    }
  );
  
  wind.add(textfield);
  wind.show();
});

menu.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});

var timeouts = {
  '5m': 300,
  '20m': 1200,
  '25m': 1500,
};

function onTimerSelect(e){
  var timeout = timeouts[e.item.subtitle];
  timer(timeout);
}

var pomodoroDone = new UI.Card({
  title: 'You made it!',
  body: 'Take a break.'
});

var shortBreakDone = new UI.Card({
  title: 'Break\'s over kid!',
  body: 'Back to it.'
});

function timer(timerInSec) {
  pomodoroDone.show();
}

function timer(timerInSec){
  var intervalId = setInterval(function(){
    timerInSec--;

    // notify with double vibration
    if (timerInSec == 1){
      Vibe.vibrate('double');
    }
    if (timerInSec > 0){
      timerText.text(getTimeString(timerInSec));
    } else {
      pomodoroDone.show();
      timerWindow.hide();

      clearInterval(intervalId);

      // notify with long vibration
      Vibe.vibrate('long');
    }
  }, 1000);
  
  var timerWindow = new UI.Window();
  var timerText = new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(144, 30),
    font: 'bitham-42-light',
    text: getTimeString(timerInSec),
    textAlign: 'center'
  });

  timerWindow.add(timerText);
  timerWindow.show();
  timerWindow.on('hide', function(){
    clearInterval(intervalId);
  });
}

// format remaining time into 00:00 string
function getTimeString(timeInSec){
  var minutes = parseInt(timeInSec / 60);
  var seconds = timeInSec % 60;
  return minutes + ':' + (seconds < 10 ? ('0' + seconds) : seconds);
}


