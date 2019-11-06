$(document).on('click', '#reviewLink', function () {
    $("#navForm2").hide();
    $("#navForm1").show();
});

$(document).on('click', '#twitchLink', function () {
    $("#navForm1").hide();
    $("#navForm2").show();
});

$(document).on('click', '#show-random', function () {
    counter = 0;
    clearInfo();
    showRandomGame();
});

$(document).on('click', '#show-search', function () {
    clearRandom();
    getInfo();
    getVideo();
});

var urlSearch = new URL(location.href).searchParams.get('navSearch');

var topGames = ["portal-2", "red-dead-redemption-2", "dragon-age-origins-ultimate-edition", "the-legend-of-zelda-breath-of-the-wild", "heroes-of-might-and-magic-3-the-shadow-of-death", "marvels-spider-man", "divinity-original-sin-ii-definitive-edition", "warcraft-3-reign-of-chaos", "bioshock", "shin-megami-tensei-persona-4", "mortal-kombat-11"];
var counter = 0;

var fullInfo;
var countRandom;
var fullReviews;
var countSearch;

if (urlSearch === null || urlSearch === "") {
    console.log("url is null")
    clearInfo();
    showRandomGame();
} else {
    urlSearch = urlSearch.replace(/ /gi, "-")
    videoSearch = urlSearch.replace(/-/gi, "%20")

    clearRandom();
    getInfo();
    getVideo();
}

//random game start
function clearInfo() {
    $("#game-reviews").html("")
    $("#reviews").html("")
    $("#platforms").html("")
    $("#about").html("")
    $("#game-image").html("")
    $("#game-info").html("")
    $("#reddit").html("")
    $("#metacritic").html("")
    $("#average-rating").html("")
    $(".trailer-link").html("")
}

function clearRandom() {
    for (var i = 0; i < 6; i++) {
        $(`.random-game-${i} .about`).html("")
        $(`.random-game-${i} .game-image`).html("")
        $(`.random-game-${i} .game-info`).html("")
    }
}

function showRandomGame() {
    for (var i = 0; i < 6; i++) {
        var randomPosition = Math.floor(Math.random() * topGames.length)
        var randomGame = topGames[randomPosition]
        var randomLink = "https://api.rawg.io/api/games/" + randomGame + "/suggested?page_size=10";
        fullInfo = [];
        countRandom = 0;

        $.ajax({
            url: randomLink,
            method: "GET",
        }).then(function (response) {
            $("#credit-footer").attr("hidden", false)

            var suggestedPosition = Math.floor(Math.random() * 10)
            var randomSuggestion = response.results[suggestedPosition].slug
            var randomSuggestionLink = "https://api.rawg.io/api/games/" + randomSuggestion

            $.ajax({
                url: randomSuggestionLink,
                method: "GET",
            }).then(function (response) {

                website = $(`<a>`).attr({ "href": response.website, "target": "_blank" })
                imageWeb = $(`<img>`).attr("src", response.background_image)
                imageWeb.attr("class", "game-img");

                website.html(imageWeb);

                var gameInfo = response.description;
                if (gameInfo.length > 1100) {
                    var shortInfo = gameInfo.substring(0, 1000);
                    fullInfo.push(gameInfo)
                    var span = $("<span class='showRandom btn-outline-success my-2 mx-2' data-position='" + countRandom + "'>[Read More]</span>")
                    $(`.random-game-${counter} .game-info`).html(shortInfo).attr("id", countRandom).append(span)
                    countRandom++;
                }else{
                    $(`.random-game-${counter} .game-info`).html(gameInfo)
                }

                $(`.random-game-${counter} .about`).text(response.name)
                $(`.random-game-${counter} .game-image`).html(website)
                counter++;
            });
        });
    }
}
//random game end

//youtube api start
function getVideo() {
    var videoURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + videoSearch + "%20trailer&key=AIzaSyBIJ6pbEXcv9in6Xi-Z8IogrfMpxKUXVy0"
    $.ajax({
        url: videoURL,
        method: "GET",
    }).then(function (response) {
        var videoId = response.items[0].id.videoId;
        var videoLink = "https://www.youtube.com/watch?v=" + videoId;
        $(".trailer-link").attr("href", videoLink).text("[Trailer]");
        videoSetUp();

    });
}

function videoSetUp() {
    $(`.trailer-link`).magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fade',
        preloader: true,
    });
}
//youtube api end

function getInfo() {
    var queryURL = "https://api.rawg.io/api/games/" + urlSearch;
    $("#credit-footer").attr("hidden", false)
    
    $.ajax({
        url: queryURL,
        method: "GET",
        error: function() {
            $("#about").html(`<p>That is not a game :(</p><p>Please enter a full game name</p>`)
            $("#credit-footer").attr("hidden", true)
            $(".trailer-link").html("")
        }
    }).then(function (response) {

        platforms = $("<p>").text("Available for ")
        for (var i = 0; i < response.platforms.length; i++) {
            platforms.append(response.platforms[i].platform.name)
            if (i < (response.platforms.length - 2)) {
                platforms.append(", ")
            } else if (i === (response.platforms.length - 2)) {
                platforms.append(" and ")
            }
        }

        averageRating = $(`<p>`).text(`Average RAWG Rating: ${response.rating}`)
        oficialName = response.slug

        reddit = $(`<a>`).attr({ "href": response.reddit_url, "target": "_blank" })
        imageRed = $(`<img>`).attr("src", "ASSETS/IMAGES/redditLogoSmall.jpg")
        reddit.html(imageRed)

        metacritic = $(`<a>`).attr("href", response.metacritic_url).text(`Metacritic Score: ${response.metacritic}`)

        website = $(`<a>`).attr("href", response.website)
        imageWeb = $(`<img>`).attr("src", response.background_image)
        imageWeb.attr("class", "game-img");

        website.html(imageWeb);

        $("#platforms").html(platforms)
        $("#about").text(response.name)
        $("#game-image").html(website)
        $("#game-info").html(response.description)
        $("#reddit").html(reddit)
        $("#metacritic").html(metacritic)
        $("#average-rating").html(averageRating)

        getReview(oficialName);
    });
}

function getReview(oficialName) {
    var queryURL = "https://api.rawg.io/api/games/" + oficialName + "/reviews";
    fullReviews = [];
    countSearch = 0;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        
        $("#game-reviews").html("")
        $("#reviews").text("Reviews")

        for (var i = 0; i < response.results.length; i++) {
            review = response.results[i].text
            newPRating = $(`<p>`).text(`Rating: ${response.results[i].rating}/5`).attr("class", "rating")

            var newPReview;
            if (review.length > 600) {
                var shortString = review.substring(0, 500);
                fullReviews.push(review)
                var span = $("<span class='show btn-outline-success my-2 mx-2' data-position='" + countSearch + "'>[Read More]</span>")
                newPReview = $(`<p>${shortString}</p>$`).attr("id", countSearch)
                newPReview.append(span)
                countSearch++;
            }else{
                newPReview = $(`<p>${review}</p>`)
            }

            $("#game-reviews").append(newPReview, newPRating);
        }
    });
}

//truncate show/hide

$(document).on("click", ".show", function () {
    var position = $(this).attr("data-position")
    $(`#${position}`).html(fullReviews[position] + "<span class='hide btn-outline-success my-2 mx-2' data-position='" + position + "'>[Read Less]</span>");
});

$(document).on("click", ".hide", function () {
    var position = $(this).attr("data-position")
    $(`#${position}`).html(fullReviews[position].substring(0, 500) + "<span class='show btn-outline-success my-2 mx-2' data-position='" + position + "'>[Read More]</span>");
});

$(document).on("click", ".showRandom", function () {
    var position = $(this).attr("data-position")
    $(`#${position}`).html(fullInfo[position] + "<span class='hideRandom btn-outline-success my-2 mx-2' data-position='" + position + "'>[Read Less]</span>");
});

$(document).on("click", ".hideRandom", function () {
    var position = $(this).attr("data-position")
    $(`#${position}`).html(fullInfo[position].substring(0, 1000) + "<span class='showRandom btn-outline-success my-2 mx-2' data-position='" + position + "'>[Read More]</span>");
});