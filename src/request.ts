var rp = require('request-promise-native');
import './server'

var options = {
    uri: 'http://localhost:8080/api/all',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
};

rp(options)
    .then(function (repos) {
        console.log('User has %d repos', repos.length);
        let a = repos
    })
    .catch(function (err) {
        // API call failed...
    });
