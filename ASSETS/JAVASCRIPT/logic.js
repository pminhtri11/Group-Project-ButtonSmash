$.ajax('https://api.twitch.tv/kraken/clips/top?period=day&trending=true&limit=4', {
    headers: {
        "Client-ID": '7lnuz8zrv8kyrdspsju9qbv8kg92tz', // put your Client-ID here
        'Accept': 'application/vnd.twitchtv.v5+json'
    }
}).then(function(response) {
    console.log(response);
    for (var i = 0; i < response.clips.length; i++) {

        var overlay = $("<div class='overlay'>")
        var a = $("<a>").attr({ href: response.clips[i].url, target: "_blank" })
        var b = $("<img>").attr({ src: response.clips[i].thumbnails.medium, id: "imageClips" });
        var c = $("<p>").text(response.clips[i].title);
        overlay.append(b);
        a.append(overlay, c);
        $(".topClips").append(a);
    }
})

$(document).on('click', '#reviewLink', function() {
    $("#navForm2").hide();
    $("#navForm1").show();
});

$(document).on('click', '#twitchLink', function() {
    $("#navForm1").hide();
    $("#navForm2").show();
});