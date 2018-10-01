var request = require('request');
var token = require('./secrets.js')
var fs = require('fs')

// console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token' + token
    }
  };
  request(options, function(err, res, body) {
    var result = JSON.parse(body)
    cb(err, result); {
      for (i = 0; i < result.length; i++) {
        console.log(result[i].avatar_url)
      }
    }
  });
}

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

downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")

// getRepoContributors('jquery', 'jquery', function(err, result){
//   //   console.log("Errors:", err);
//   // console.log("Result:", result);
// })