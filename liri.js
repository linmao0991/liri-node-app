require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

spotify.search({type: "track", query: "Mr. Brightside"}, function(err,data){
    if(err){
        return console.log("Error Occurred: "+err);
    }
    console.log("Results-----");
    console.log(data.tracks.items[0]);
})