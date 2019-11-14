require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var axios = require("axios");
var fs = require("fs");

var command = process.argv[2];
var term = process.argv.slice(3).join(" ");

/* Function makes api request to bands in town website to find artist concerts */
function findConcerts(artistName) {
    axios.get("https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp")
        .then(function (response) {
            // Check if response is an array and array contains any values
            if (Array.isArray(response.data) && response.data.length) {
                var textInfo = "";
                //Loop through response array containing all concert events
                response.data.forEach(function (event) {
                    var date = moment(event.datetime);
                    textInfo += `\nVenue's Name: ${event.venue.name}\nVenue's Location: ${event.venue.city}, ${event.venue.region || event.venue.country}\nEvent's Date: ${date.format("MM/DD/YYYY")}\n${'▬'.repeat(35)}`;
                });
                console.log(textInfo);
                appendTextToFile("\n\n>>>>> " + artistName.toUpperCase() + " CONCERTS <<<<<\n" + textInfo);
            } else {
                console.log("No Upcoming Events");
            }
        })
        .catch(function (error) {
            console.log(error.response.data.message);
        });
}

/* Function makes api request to Spotify website to find song's details */
function findSongInfo(songName) {
    //If no song name is provided, default it to "The Sign"
    if (songName === "") songName = "The Sign";

    spotify.search({ type: 'track', query: songName, limit: 5 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else if (data.tracks.items.length) {
            var results = data.tracks.items;
            var textInfo = "";
            results.forEach(function (item) {
                textInfo += `\nArtist's Name: ${item.artists[0].name}\nSong's Name: ${item.name} \nSong's Preview Link: ${item.external_urls.spotify}\nAlbum's Name: ${item.album.name}\n\n${'▬'.repeat(35)}\n`;
            });
            console.log(textInfo);
            appendTextToFile("\n\n>>>>> SPOTIFY SEARCH LOG ON: " + songName.toUpperCase() + " <<<<<\n" + textInfo);
        } else {
            console.log("Song not found");
        }
    });
}

/* Function makes api request to OMDB website to obtain movie information */
function findMovie(movieName) {
    // If no movie name is not provided, set movieName variable to "Mr. Nobody"
    if (movieName == "") movieName = "Mr. Nobody";
    axios.get("http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy")
        .then(function (response) {
            var textInfo = "";
            // Check if response return movie info
            if (response.data.Response === "True") {
                textInfo += `\nMovie Title: ${response.data.Title}\nYear: ${response.data.Year}\nIMDB Rating: ${response.data.Ratings[0].Value}\nRotten Tomatoes Rating: ${response.data.Ratings[1].Value}\nCountry: ${response.data.Country}\nLanguage: ${response.data.Language}\nMovie Plot: ${response.data.Plot}\nActors: ${response.data.Actors}\n\n${'▬'.repeat(40)}`;
                console.log(textInfo);
                appendTextToFile("\n\n>>>>> MOVIE: " + movieName.toUpperCase() + " <<<<<\n" + textInfo);
            } else {
                console.log(response.data.Error);
            }
        }).catch(function (error) {
            console.log(error);
        });
}

/* Function will take the text inside random.txt and the use it to call the 
   specific function based on the command variable */
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        command = data.split(",")[0];
        // Regular expressions will match A to Z characters as well as white spaces
        var RegEx = /[a-zA-Z\s]+/;
        term = data.split(",")[1].trim().match(RegEx).join("");

        if (command === "concert-this") {
            findConcerts(term);
        } else if (command === "spotify-this-song") {
            findSongInfo(term);
        } else if (command === "movie-this") {
            findMovie(term);
        }
    });
}

function appendTextToFile(text) {
    fs.appendFile("log.txt", text, function (err) {
        if (err) console.log(err);
    });
}

/* Evaluate the command variable to execute the statement associated to each case value */
switch (command) {
    case "concert-this":
        findConcerts(term);
        break;
    case "spotify-this-song":
        findSongInfo(term);
        break;
    case "movie-this":
        findMovie(term);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
}
