require("dotenv").config();

var keys =      require("./keys.js");
var Spotify =   require ('node-spotify-api');
var spotify =   new Spotify(keys.spotify);
var moment =    require('moment');
var axios =     require("axios");
var fs =        require("fs");

var artist = process.argv.slice(2).join(" ");

axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function (response) {
        response.data.forEach(function(event){
            // console.log(event);
            console.log("\nVenue's Name: ", event.venue.name);
            console.log("Venue's Location: ", event.venue.city + ", " + (event.venue.region || event.venue.country));
            var date = moment(event.datetime);
            console.log("Event's Date: ", date.format("MM/DD/YYYY"));
            console.log("\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬");
        });
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



