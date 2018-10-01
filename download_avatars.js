var request = require('request');
var token = require('./secrets.js')

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



getRepoContributors('jquery', 'jquery', function(err, result){
  //   console.log("Errors:", err);
  // console.log("Result:", result);
})