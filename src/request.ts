module.exports= {
//creation requete
req : (user) =>{

    var req = new XMLHttpRequest();
    let url: string = "http://localhost:8080/api/metrics/" + user
    req.open("GET", url, false);
    req.send(null);
    console.log(req.responseText);
    } 
}

