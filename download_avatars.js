var request = require('request');
var token = require('./secrets.js')
var fs = require('fs')

//Gets all repocontributors from a repo by creating a JSON object that is passed into the
//downloadImage function which in this case is the callback (cb) function
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': token.GITHUB_TOKEN
    }
  };
  request(options, function(err, res, body) {
    var result = JSON.parse(body)
    cb(err, result);
  });
}
// loops through all the results and calls download image by url function on each one
function downloadImage(err, result) {
  console.log("AVATAR URL: ")
  for (i = 0; i < result.length; i++) {
    let avatar_url = result[i].avatar_url
    let name = result[i].login
    downloadImageByURL(avatar_url, "avatars/" + name + ".gif")
  }
}

//downloads images
function downloadImageByURL(url, filePath) {
  request(url)
    .on('error', function (err) {
    throw err
    })
    .on('response', function (response) {
      console.log('Response Status Message: ', response.statusMessage, "\nDownloading images...")
    })
    .on('end', function (response) {
      console.log('Images Downloaded')
    })
  .pipe(fs.createWriteStream(filePath))
}

// check to see if directory exists if not Creates new "Avatar" directory
fs.stat('avatars', function (err, stat) {
  if (err) {
    console.log("error directory does not exist... \n Creating new avatar directory")
    fs.mkdir('./avatars')
  }
})


getRepoContributors('jquery', 'jquery', downloadImage )
