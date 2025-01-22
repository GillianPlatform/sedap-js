var https = require('https');
var fs = require('fs');

function download(filename, url) {
  var file = fs.createWriteStream(filename);
  var request = https.get(url, function(response) {
    response.pipe(file);
  });
}

console.log('Downloading schema file...');
download('schema/sedap.schema.json', 'https://raw.githubusercontent.com/GillianPlatform/sedap/refs/heads/main/sedap.schema.json')
