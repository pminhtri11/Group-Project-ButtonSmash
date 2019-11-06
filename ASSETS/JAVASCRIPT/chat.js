$(document).on('click', '#reviewLink', function () {
    $("#navForm2").hide();
    $("#navForm1").show();
});

$(document).on('click', '#twitchLink', function () {
    $("#navForm1").hide();
    $("#navForm2").show();
});

$(document).on('click', '#chatButton', function () {
    $("#centerLogo").hide();
    $("#mainChatBox").show();
});

let colorArray = ["#ff0000", "magneta", "blue" , "yellow", "green", "white"];
let randomColor = Math.floor((Math.random() * 4 ) );
let colorChoosen = colorArray[randomColor];

var firebaseConfig = {
    apiKey: "AIzaSyC-whrX83MnrPBNMANSe7QfE2houDnuQmQ",
    authDomain: "live-chat-d9597.firebaseapp.com",
    databaseURL: "https://live-chat-d9597.firebaseio.com",
    projectId: "live-chat-d9597",
    storageBucket: "live-chat-d9597.appspot.com",
    messagingSenderId: "678532361733",
    appId: "1:678532361733:web:1aef1dca51755b7153766c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a variable to reference the database.
var database = firebase.database();

var connectionsRef = database.ref("/connections");
var chatConnection = database.ref("/chat");

// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function (snap) {
    // If they are connected..
    if (snap.val()) {
        // Add user to the connections list.
        var con = connectionsRef.push(true);
        // Remove user from the connection list when they disconnect.
        con.onDisconnect().remove();
    }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function (snap) {
    // Display the viewer count in the html.
    // The number of online users is the number of children in the connections list.
    $("#userinside").text("Chat with " + snap.numChildren() + " other users");
});

var anonyName = "Waiting for the DragonBorn";
var anonyText = "Waiting for the Shout";

// Disable Enter Key for this one
$(document).keypress(
    function(event){
      if (event.which == '13') {
        event.preventDefault();
      }
  });

$(document).on("click", "#add-text", function () {
    event.preventDefault();
    var name = $("#name-input").val();
    var text = $("#text-input").val();

    if (name && text)
    {
        chatConnection.push({
            text: text,
            textcolor: colorChoosen,
            name: name
        });
        $("#text-input").val("");
    }

    else
    {
        return;
    }
});

chatConnection.on("child_added", function (childSnapshot) {
    anonyName = childSnapshot.val().name;
    anonyText = childSnapshot.val().text;
    var annoyColor = childSnapshot.val().textcolor;
    var newRow = $("<div>").append($("<p>").css("color", annoyColor).text(anonyName + " : " + anonyText));
    $(".chatwindowcontainer").prepend(newRow);
})