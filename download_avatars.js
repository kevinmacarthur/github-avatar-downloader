var request = require('request');
var token = require('./secrets.js')
var fs = require('fs')


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

function loopThrough(err, result) {
  console.log("AVATAR URL: ")
  for (i = 0; i < result.length; i++) {
    let avatar_url = result[i].avatar_url
    let name = result[i].login
    downloadImageByURL(avatar_url, "avatars/" + name + ".gif")
  }
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
// downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")


getRepoContributors('jquery', 'jquery', loopThrough )
