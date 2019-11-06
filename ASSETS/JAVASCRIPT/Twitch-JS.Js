$(document).on('click', '#reviewLink', function () {
    $("#navForm2").hide();
    $("#navForm1").show();
});

$(document).on('click', '#twitchLink', function () {
    $("#navForm1").hide();
    $("#navForm2").show();
});

var gameid;
var streamer;

$("#twitch-embed").empty();
$("#twitch-embed").hide();
$(".feature").empty();

console.log(window.location.search);
var urlSearch = new URL(location.href).searchParams.get('navSearch');
var gameSearch = urlSearch;
console.log(gameSearch);

if (gameSearch) {
    searchGame();
    gamesearch = 0;
}
else {
    featureGame();
}

// If Feature Games Button was Click
$("#feature-Game").on("click", function () {
    featureGame();
})


// Feature Streamer Button Click
$("#feature-Streamer").on("click", function () {
    $(".feature").empty();
    $("#twitch-embed").empty();
    event.preventDefault();
    $.ajax('https://api.twitch.tv/kraken/streams/featured?limit=12', // put your channel/user ID here
        {
            headers: {
                "Client-ID": '7lnuz8zrv8kyrdspsju9qbv8kg92tz', // put your Client-ID here
                'Accept': 'application/vnd.twitchtv.v5+json'
            }
        }).then(function (response) {
            console.log(response);
            // using loop to generate all the avaible games that user search.
            for (var i = 0; i < response.featured.length; i++) {

                var cardContainer = $("<div>").attr({ class: "card card10"});
                // streamerName will help us find a preview image for our channels;
                var streamerName = response.featured[i].stream.channel.name.toLowerCase().split(' ').join('');
                // generating images of the channels
                var cardImage = $("<img>").attr({ src: "https://static-cdn.jtvnw.net/previews-ttv/live_user_" + streamerName + ".jpg", class: "allchannelImage", id: "channel-image", userName: response.featured[i].stream.channel.name });

                // channel Title                        
                var cardtext = $("<p>").attr({ class: "card-text card-text10" }).text(response.featured[i].stream.channel.status);
                // Channel UserName
                var cardtitle = $("<h5>").attr({ class: "card-title card-title10" }).text(response.featured[i].stream.channel.name);

                var cardbody = $("<div>").attr({ class: "card-body card-body10" })

                var cardFooter = $("<div>").attr({ class: "card-footer card-footer10" })
                // creating icon next to the viewer count
                var iconCreate = $("<i>").attr({ class: "fas fa-user-alt", id: "icon" });
                var viewerChannel = $("<p>").attr({ id: "viewer-Channel-count" }).text(" " + response.featured[i].stream.viewers);

                //Append UserName, Icon and viewCount to a subContainer

                cardbody.append(cardtitle, cardtext);
                cardFooter.append(iconCreate, viewerChannel);
                cardContainer.append(cardImage, cardbody, cardFooter);
                $(".feature").append(cardContainer);
            }
        });
})

// after clicking on the games the user search for.
$(document).on("click", ".allgameImage", function () {
    // clear the container for new result
    $(".feature").empty();
    $("#twitch-embed").empty();

    // Overall Game information will be display here.

    var gameImage = $("<img>").attr({ src: $(this).attr("src") })
    var gameTitle = $("<h3>").attr({ id: "game-Header" }).text($(this).attr("gameName"));

    $(".header").prepend(gameTitle, gameImage);

    // Using the clicked image attribute to get the game ID to look for live channels.
    gameid = $(this).attr("game_id");
    $.ajax('https://api.twitch.tv/helix/streams?first=10&language=en&game_id=' + gameid, // put your channel/user ID here
        {
            headers: {
                "Client-ID": '7lnuz8zrv8kyrdspsju9qbv8kg92tz', // put your Client-ID here
                'Accept': 'application/vnd.twitchtv.v5+json'
            }
        }).then(function (response) {
            console.log(response);

            // looping 10 time to get the top 10 channels
            for (var i = 0; i < response.data.length; i++) {

                var cardContainer = $("<div>").attr({ class: "card card10" });
                // streamerName will help us find a preview image for our channels;
                var streamerName = response.data[i].user_name.toLowerCase().split(' ').join('');
                // generating images of the channels
                var cardImage = $("<img>").attr({ src: "https://static-cdn.jtvnw.net/previews-ttv/live_user_" + streamerName + ".jpg", class: "card-img-top allchannelImage", id: "channel-image", userName: response.data[i].user_name });

                // channel Title                        
                var cardtext = $("<p>").attr({ class: "card-text card-text10" }).text(response.data[i].title);

                // Channel UserName
                var cardtitle = $("<h5>").attr({ class: "card-title card-title10" }).text(response.data[i].user_name);

                var cardbody = $("<div>").attr({ class: "card-body card-body10" })

                var cardFooter = $("<div>").attr({ class: "card-footer card-footer10" })
                // creating icon next to the viewer count
                var iconCreate = $("<i>").attr({ class: "fas fa-user-alt", id: "icon" });
                var viewerChannel = $("<p>").attr({ id: "viewer-Channel-count" }).text(response.data[i].viewer_count);

                cardbody.append(cardtitle, cardtext);
                cardFooter.append(iconCreate, viewerChannel);
                cardContainer.append(cardImage, cardbody, cardFooter);
                $(".feature").append(cardContainer);
            }

        });
})

// clicking on one of the channels will open an embed stream within our sites
$(document).on("click", ".allchannelImage", function () {
    $(".feature").empty();
    $("#twitch-embed").empty();
    $(".header").empty();
    $("#twitch-embed").show();

    console.log("Streamer Should be shown");
    var liveName = $(this).attr("userName");
    new Twitch.Embed("twitch-embed", {
        width: "100%",
        height: "100%",
        channel: liveName
    });
})


// Feature Game function
function featureGame() {
    $(".feature").empty();
    $("#twitch-embed").empty();
    $.ajax('https://api.twitch.tv/kraken/games/top?limit=12', // put your channel/user ID here
        {
            headers: {
                "Client-ID": '7lnuz8zrv8kyrdspsju9qbv8kg92tz', // put your Client-ID here
                'Accept': 'application/vnd.twitchtv.v5+json'
            }
        }).then(function (response) {
            console.log(response);

            // using loop to generate all the avaible games that user search.
            for (var i = 0; i < response.top.length; i++) {

                // new container to hold the game image and number of views
                var cardContainer = $("<div>").attr({ class: "card card10" });

                var cardImage = $("<img>").attr({ src: response.top[i].game.box.large, gameName: response.top[i].game.name, game_id: response.top[i].game._id, class: "card-img-top allgameImage " });


                var cardbody = $("<div>").attr({ class: "card-body card-body10" });
                var cardtext = $("<p>").attr({ class: "card-text totheRight" });
                var iconCreate = $("<i>").attr({ class: "fas fa-user-alt", id: "icon" });
                // viewers count  

                var viewergameCount = $("<p>").attr({ id: "viewer-game-count" }).text(response.top[i].game.popularity + " viewer");

                cardtext.append(iconCreate, viewergameCount);

                cardbody.append(cardtext);
                cardContainer.append(cardImage, cardbody);
                $(".feature").append(cardContainer);
            }
        });
}

function searchGame() {
    $.ajax('https://api.twitch.tv/kraken/search/games?query=' + gameSearch + "&live=true", // put your channel/user ID here
        {
            headers: {
                "Client-ID": '7lnuz8zrv8kyrdspsju9qbv8kg92tz', // put your Client-ID here
                'Accept': 'application/vnd.twitchtv.v5+json'
            }
        }).then(function (response) {
            console.log(response);
            // using loop to generate all the avaible games that user search.
            for (var i = 0; i < response.games.length; i++) {
                // new container to hold the game image and number of views
                var cardContainer = $("<div>").attr({ class: "card cardSearchgame" });
                // image of the game (will be use to on-click function later)    
                var cardImage = $("<img>").attr({ src: response.games[i].box.large, gameName: response.games[i].name, game_id: response.games[i]._id, class: "card-img-top allgameImage" });

                var cardbody = $("<div>").attr({ class: "card-body card-body10" });
                var cardtext = $("<p>").attr({ class: "card-text card-text10" });
                var iconCreate = $("<i>").attr({ class: "fas fa-user-alt", id: "icon" });
                // viewers count      
                var viewergameCount = $("<p>").attr({ id: "viewer-game-count" }).text(response.games[i].popularity + " viewer");

                cardtext.append(iconCreate, viewergameCount);

                cardbody.append(cardtext);
                cardContainer.append(cardImage, cardbody);
                $(".feature").append(cardContainer);
            }
        });
}