 

//creation requete
var req = new XMLHttpRequest();

req.open("GET","http://localhost:8080/api/metrics/", false);

req.send(null);

console.log(req.responseText);

