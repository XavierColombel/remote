var DEBUG = true;

var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');
var ajax = require('ajax');
var Accel = require('ui/accel');

Accel.init();

// CONSTANTS
var urlBox = 'http://hd1.freebox.fr/pub/remote_control';
var remote = Settings.option( "remote" );
var activeWindow = 1;

// FUNCTIONS
function sendCommand(command)
{
  if( typeof  Settings.option( "remoteCode" + remote ) !== "undefined" &&  Settings.option( "remoteCode" + remote ) !== null ) { 
    ajax(
      {
        url: urlBox + '?code=' + Settings.option( "remoteCode" + remote ) + '&key=' + command
      },
      function() {
        //splash.title( "Power" );
        console.log(command);
      }
    );
  } else {
    // ERROR
  }
}


// WINDOWS
var noConfig = new UI.Card(
{
  title: "FreeboxTV",
  body: "Ouvrez l'outil de configuration sur votre téléphone.",
  //icon: "images/icon.png",
  style: "small",
  scrollable: true
});

var error = new UI.Card(
{
  title: "Erreur",
  body: "",
  //icon: "images/error.png",
  style: "small",
  scrollable: true
});

var loading = new UI.Card( { banner: "images/loading.png" } );
var listMenu = new UI.Menu( {sections: [{items:[]}] } );
var sublistMenu = new UI.Menu( {sections: [{items:[]}] } );

/*var splash = new UI.Window( {
  //title: "test",
  //banner: "images/splash.png"
} );*/

var splash = new UI.Card(
{
title: "FreeboxTV",
  subtitle: Settings.option( "remoteName" + remote ),
  body: "Boutons Haut/Bas :\nVolume +/-",
  //icon: "images/icon.png",
  style: "small",
  scrollable: true
});

var image = new UI.Image({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  image: 'images/splash.png'
});

splash.add(image);

splash.on('click', 'select', function(e) {
      
  switch (activeWindow) {
      
    case 1:
      sendCommand('mute');
      break;
         
  }
  
});

splash.on('accelTap', function(e) {
  console.log('Tapped the window');
  sendCommand('mute');
});


// CONFIGURATION
Settings.config(
  {
    url: "http://www.hexacode.fr/pebble?" + encodeURI('remoteName1=' + Settings.option( "remoteName1" ) + '&remoteCode1=' + Settings.option( "remoteCode1" ) + 
      '&remoteName2=' + Settings.option( "remoteName2" ) + '&remoteCode2=' + Settings.option( "remoteCode2" ) + 
      '&remoteName3=' + Settings.option( "remoteName3" ) + '&remoteCode3=' + Settings.option( "remoteCode3" ) + 
      '&remoteName4=' + Settings.option( "remoteName4" ) + '&remoteCode4=' + Settings.option( "remoteCode4" ) +
      '&remote=' + Settings.option( "remote" ))
    //url: "http://jahdaicintron.com/wunderpebbleconfig/?token=" + Settings.option( "token" ) + "&reporting=" + Settings.option( "reporting" ) + "&email=" + Settings.option( "email" )
  },
  function( e )
  {
    console.log( "Open Configuration" );
  },
  function( e )
  {
    console.log( "Closed Configuration" );
    /*
    var data = JSON.parse( e.response );
    console.log( JSON.stringify( data ) );
    */
    var config_data = JSON.parse(decodeURIComponent(e.response));
    
    Settings.option({"remoteName1": config_data.remoteName1,
                     "remoteCode1": config_data.remoteCode1,
                     "remoteName2": config_data.remoteName2,
                     "remoteCode2": config_data.remoteCode2,
                     "remoteName3": config_data.remoteName3,
                     "remoteCode3": config_data.remoteCode3,
                     "remoteName4": config_data.remoteName4,
                     "remoteCode4": config_data.remoteCode4,
                     "remote": config_data.remote});
    remote = Settings.option( "remote" );
    splash.subtitle(Settings.option( "remoteName" + remote ));
    
    if (DEBUG) {
      console.log("remoteName1 = " + config_data.remoteName1);
      console.log("remoteCode1 = " + config_data.remoteCode1);
      console.log("remoteName2 = " + config_data.remoteName2);
      console.log("remoteCode2 = " + config_data.remoteCode2);
      console.log("remoteName3 = " + config_data.remoteName3);
      console.log("remoteCode3 = " + config_data.remoteCode3);
      console.log("remoteName4 = " + config_data.remoteName4);
      console.log("remoteCode4 = " + config_data.remoteCode4);
      console.log("remote = " + config_data.remote);
    }
    
    
    /*if( "access_token" in data ) Settings.option( "token", data.access_token );
    header = { "X-Access-Token": Settings.option( "token" ), "X-Client-ID": clientID, contentType: "application/json; charset=utf-8" };
    getUserData();*/
  }
);

// PROGRAM START
function programStart()
{
  if( typeof remote !== "undefined" && remote !== null ) {
    
    /*
    var textfield = new UI.Text({
        position: new Vector2(0, 65),
        size: new Vector2(144, 30),
        font: 'gothic-24-bold',
        text: 'Code : ' + Settings.option( "remoteCode1" ),
        textAlign: 'center',
        color: 'blue'
    });
    
    splash.add(textfield);*/
    
    //splash.title( Settings.option( "remoteCode1" ) );
    
    splash.show();
    noConfig.hide();
    
  } else {
    
    noConfig.show();
    
  }
}

programStart();