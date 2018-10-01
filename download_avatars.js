var request = require('request');
// var token = require('./secrets.js')    **not necessary due to envfile
var fs = require('fs')
var key = require('dotenv').config()
var args = process.argv.slice(2)

// check to see if directory exists if not Creates new "Avatar" directory which is necessary
fs.stat('avatars', function (err, stat) {
  if (err) {
    console.log("error directory does not exist... \n...Creating new avatar directory")
    fs.mkdir('./avatars')
  }
})

//Gets all repocontributors from a repo by creating a JSON object that is passed into the downloadImage function which in this case is the callback (cb) function

function getRepoContributors(repoOwner, repoName, cb) {
  if (args.length !== 2) {
    console.log('Missing either Repo Owner or Repo Name \nPlease ensure both parameters are present')
    process.exit()
  }
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + key.parsed['key']
    }
  };
  request(options, function(err, res, body) {
    var result = JSON.parse(body)
    cb(err, result);
  });
}

// loops through all the results and calls download image by url function on each one
function downloadImage(err, result) {
  for (i = 0; i < result.length; i++) {
    let avatar_url = result[i].avatar_url;
    let name = result[i].login;
    downloadImageByURL(avatar_url, "avatars/" + name + ".gif")
  }
}

//This function actually downloads and streams the image to the avatar directory
function downloadImageByURL(url, filePath) {
  request(url)
    .on('error', function (err) {
      throw err
    })
    .on('response', function (response) {
      console.log('Response Status Message: ', response.statusMessage, "\nDownloading image...")
    })
    .on('end', function (response) {
      console.log('Image Downloaded');
    })
  .pipe(fs.createWriteStream(filePath));
}


getRepoContributors(args[0], args[1], downloadImage)
