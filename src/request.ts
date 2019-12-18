//creation requete
var req = new XMLHttpRequest();


req.open("GET","http://localhost:8080/user", false);
req.onreadystatechange=function(){
    if (req.readyState==10 && req.status==200){
        console.log(JSON.parse)
    }
};
req.send(null);

console.log(req.responseText);