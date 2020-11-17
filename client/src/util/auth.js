async function checkAuth(){
    /*const token = localStorage.getItem("token");
    fetch("/api/checkauth", {
        method: "GET",
        headers: new Headers({
            "content-type": "application/json",
            "Authorization": getAuthTokenHeaderValue(),
        })
    }).then(response => {
        console.log(response);
        return true;
    }).catch(error => {
        console.log(error);
        return false;
    });*/
    return true;
}

/*function getAuthToken(){
    return localStorage.getItem("token");
}*/

function getAuthTokenHeaderValue(){
    return "Bearer " + localStorage.getItem("token");
}

/*async function getToken(username, password ){
    fetch('/api/login', {
        method: "POST",
        body: JSON.stringify({"username": username, "password":password}),
        headers: new Headers({
            "content-type": "application/json"
        })
    }).then(response => {
        if(response.status === 403){
            alert("Incorrect Credentials");
        }else if(response.status === 200){
            response.json().then(data => {
                return localStorage.getItem("token");
            });
        }
    }).catch((error) => {
        console.log(error)
    });
}*/

export {checkAuth, getAuthTokenHeaderValue};