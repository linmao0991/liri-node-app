require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var inquirer = require('inquirer');
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
initialInqury();

function initialInqury(){
    inquirer
        .prompt([
            {
                type: "list",
                choices: ["Concert This","Spotify This Song", "Movie This", "Do What It Says"],
                name: "command",
                message: "Please choose a command."
            }
        ]).then(function(data){
            switch(data.command) {
                case "Concert This":
                    inquirer
                        .prompt([
                            {
                            type: "input",
                            name: "userInput",
                            message: "Please type in a band or an artist."
                            }
                        ]).then(function(data){
                            console.log(data.userInput)
                            concertThis(data.userInput);
                        });
                    break;
                case "Spotify This Song":
                    inquirer
                        .prompt([
                            {
                            type: "input",
                            name: "userInput",
                            message: "Please type in a song."
                            }
                        ]).then(function(data){
                            console.log(data.userInput)
                            spotifyThisSong(data.userInput);
                        });
                    break;
                case "Movie This":
                    inquirer
                        .prompt([
                            {
                            type: "input",
                            name: "userInput",
                            message: "Please type in a movie."
                            }
                        ]).then(function(data){
                            console.log(data.userInput)
                            movieThis(data.userInput);
                        });
                    break;
                case "Do What It Says":
                    doWhatItSays();
                    break;
            }
        });
}

function repeatFunction(){
    inquirer
        .prompt([
            {
                type: "confirm",
                name: "repeat",
                message: "Would you like to perform another command?",
                default: true
            }
        ]).then(function(response){
            if(response.repeat){
                initialInqury();
            }else{
                console.log("Good Bye.");
            }
        });
}

function doWhatItSays(){
    var validCommands = ["concert-this","spotify-this-song","movie-this","do-what-it-says"];
    fs.readFile("random.txt","utf8", function(err, data){
        if (err){
            console.log(err);
        }
        var dataArray = data.split(",");
        userInput = dataArray[1].replace(/"/g,"");
        userCommand = dataArray[0];
        console.log(userInput);
        console.log(userCommand);
        if(validCommands.indexOf(userCommand) !== -1){
            switch (userCommand){
                case "concert-this":
                    concertThis(userInput);
                    break;
                case "spotify-this-song":
                    spotifyThisSong(userInput);
                    break;
                case "movie-this":
                    movieThis(userInput);
                    break;
            }
        }else{
            console.log("----------------------------------------");
            console.log("Command: do-what-it-says");
            console.log("Command: "+userCommand);
            console.log("Input: "+userInput);
            console.log("----------------------------------------");
            console.log("command '"+userCommand+"' is not valid. Please check file and try again.");
            fs.writeFileSync("log.txt",
            "\r\n----------------------------------------"+
            "\r\nCommand: do-what-it-says"+
            "\r\nCommand: "+userCommand+
            "\r\nInput: "+userInput+
            "\r\n----------------------------------------"+
            "\r\ncommand '"+userCommand+"' is not valid. Please check file and try again.",
            function (err){
                if(err){
                    console.log(err);
                }
            });
        }
    })
}
function movieThis(userInput){
    if(userInput.length > 0){
        var movie = userInput;
    }else{
        var movie = "Mr. Nobody";
        console.log("Nothing entered, default search: Mr. Nobody.");
        fs.writeFileSync("log.txt",
        "\r\nNothing entered, default search: Mr. Nobody.",
        function(err){
            if (err){
                console.log(err);
            }
        });
    }
    var queryUrl = "http://www.omdbapi.com/?t="+movie+"&apikey=trilogy";
    axios.get(queryUrl)
    .then( function(response){
        console.log("----------------------------------------");
        console.log("Command: movie-this");
        console.log("Movie: "+movie);
        console.log("----------------------------------------");
        fs.appendFileSync("log.txt",
            "\r\n----------------------------------------"+
            "\r\nCommand: movie-this"+
            "\r\nMovie: "+movie+
            "\r\n----------------------------------------"+
            "\r\nTitle: "+response.data.Title+
            "\r\nRelease Date: "+response.data.Released+
            "\r\nIMDB Rating: "+response.data.Ratings[0].Value+
            "\r\nRotten Tomatoes: "+response.data.Ratings[1].Value+
            "\r\nCountry: "+response.data.Country+
            "\r\nLanguage: "+response.data.Language+
            "\r\nPlot: "+response.data.Plot+
            "\r\nActors: "+response.data.Actors+
            "\r\n----------------------------------------"+
            "\r\n"
            ,function(err) {
            if (err) {
                return console.log(err);
            }
        });
        console.log("Title: "+response.data.Title);
        console.log("Release Date: "+response.data.Released);
        console.log("IMDB Rating: "+response.data.Ratings[0].Value);
        console.log("Rotten Tomatoes: "+response.data.Ratings[1].Value);
        console.log("Country: "+response.data.Country);
        console.log("Language: "+response.data.Language);
        console.log("Plot: "+response.data.Plot);
        console.log("Actors: "+response.data.Actors);
        console.log("----------------------------------------");
        repeatFunction()
    })
    .catch( function (error){
        console.log(error);
    })
}
function spotifyThisSong(userInput){
    if(userInput.length > 0 ){
        var searchSong = userInput;
    }else{
        var searchSong = "The Sign";
        console.log("Nothing entered, default search: The Sign");
        fs.writeFileSync("log.txt",
        "\r\nNothing entered, default search: The Sign",
        function(err){
            if (err){
                console.log(err);
            }
        });
    }
    console.log("----------------------------------------");
    console.log("Command: spotify-this-song");
    console.log("Song: "+searchSong);
    console.log("----------------------------------------");
    fs.appendFileSync("log.txt",
        "\r\n----------------------------------------"+
        "\r\nCommand: spotify-this-song"+
        "\r\nSong: "+searchSong+
        "\r\n----------------------------------------"
        ,function(err){
            return console.log(err);
    });

    spotify.search({type: "track", query: searchSong, limit: 10}, function(err,data){
        var result = 0;
        if(err){
            console.log("----------Error Occurred----------");
            console.log(err);
            console.log("----------------------------------")
        }
        if(data.tracks.items.length > 0){
            for (var i = 0; i < data.tracks.items.length; i++){
                var currentTrack = data.tracks.items[i].name;
                if( searchSong.toLowerCase() === currentTrack.toLowerCase() && searchSong.length == currentTrack.length){
                    result++;
                    console.log("----------Result ("+result+")----------");
                    console.log("Artist: "+data.tracks.items[i].artists[0].name);
                    console.log("Track Name: "+data.tracks.items[i].name);
                    console.log("Spotify Link: "+data.tracks.items[0].external_urls.spotify);
                    console.log("Album Name: "+data.tracks.items[i].album.name);
                    fs.appendFileSync("log.txt",
                    "\r\n----------Result ("+result+")----------"+
                    "\r\nArtist: "+data.tracks.items[i].artists[0].name+
                    "\r\nTrack Name: "+data.tracks.items[i].name+
                    "\r\nSpotify Link: "+data.tracks.items[0].external_urls.spotify+
                    "\r\nAlbum Name: "+data.tracks.items[i].album.name
                    ,function(err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                }
            }
            console.log("----------------------------------------")
            fs.appendFileSync("log.txt",
            "\r\n----------------------------------------"
            ,function(err){
                if (err) {
                    return console.log(err);
                }
            });
        }else{
            console.log("No results for: "+searchSong+".")
            console.log("Default search to: The Sign.")
            fs.appendFileSync("log.txt",
            "\r\nNo results for: "+searchSong+"."+
            "\r\nDefault search to: The Sign.",
            function(err){
                if(err){
                    return console.log(err);
                }
            });
            spotifyThisSong("The Sign");
        }
        repeatFunction();
    });
}
function concertThis(userInput){
    var artist = userInput;
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryUrl)
    .then(function(data){
        if( Array.isArray(data.data) && data.data.length > 0){
            console.log("----------------------------------------");
            console.log("Command: concert-this");
            console.log("Artist: "+artist);
            console.log("----------------------------------------");
            fs.appendFileSync("log.txt",
                "\r\n----------------------------------------"+
                "\r\nCommand: concert-this"+
                "\r\nArtist: "+artist+
                "\r\n----------------------------------------"
                ,function(err){
                if (err) {
                    return console.log(err);
                }
            });
            for ( var i = 0; i < data.data.length; i++){
                var dateTime = moment(data.data[i].datetime).format("MMMM Do YYYY, h:mm a");
                console.log("------------------------------");
                console.log(data.data[i].venue.name);
                console.log(data.data[i].venue.city+", "+data.data[i].venue.region+", "+data.data[i].venue.country);
                console.log(dateTime);
                fs.appendFileSync("log.txt",
                    "\r\n------------------------------"+
                    "\r\nVenue: "+data.data[i].venue.name+
                    "\r\nLocation: "+data.data[i].venue.city+", "+data.data[i].venue.region+", "+data.data[i].venue.country+
                    "\r\nEvent Time: "+dateTime
                    ,function(err){
                    if (err) {
                        return console.log(err);
                    }
                });
            }
            console.log("----------------------------------------")
            repeatFunction()
        }else{
            console.log("----------------------------------------");
            console.log("Command: concert-this");
            console.log("Artist: "+artist);
            console.log("----------------------------------------");
            console.log("No results found")
            fs.appendFileSync("log.txt",
            "\r\n----------------------------------------"+
            "\r\nCommand: concert-this"+
            "\r\nArtist: "+artist+
            "\r\n----------------------------------------"+
            "\r\nNo results found"
            ,function(err){
            if (err) {
                return console.log(err);
            }
        });
        repeatFunction();
        }
    })
    .catch( function (error){
        console.log(error);
    })
}