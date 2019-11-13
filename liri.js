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
function findConcerts(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function (response) {
            if (response.data.length) {
                response.data.forEach(function (event) {
                    console.log("\nVenue's Name: ", event.venue.name);
                    console.log("Venue's Location: ", event.venue.city + ", " + (event.venue.region || event.venue.country));
                    var date = moment(event.datetime);
                    console.log("Event's Date: ", date.format("MM/DD/YYYY"));
                    console.log("\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬");
                });
            } else {
                console.log("No Upcoming Events");
            }
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

/* Function makes api request to Spotify website to find song's details */
function findSongInfo(songName) {
    if (songName) {
        spotify.search({ type: 'track', query: songName, limit: 5 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            var results = data.tracks.items;
            results.forEach(function (item) {
                console.log("\nArtist's Name: " + item.artists[0].name);
                console.log("Song's Name: " + item.name);
                console.log("Song's Preview Link: " + item.external_urls.spotify);
                console.log("Album's Name: " + item.album.name);
                console.log("\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬");
            });
        });
    } else {
        console.log("Song details not found");
    }
}

/* Evaluate the command variable to execute the statement associated each case value */
switch (command) {
    case "concert-this":
        findConcerts(term);
        break;
    case "spotify-this-song":
        findSongInfo(term);
        break;
}



