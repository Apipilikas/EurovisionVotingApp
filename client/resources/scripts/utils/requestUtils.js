const serverURL = {
    p8080: "http://localhost:8080/",
    p3000: "http://localhost:3000/"
};

const clientURL = "http://127.0.0.1:5500/";

const Method = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
}

function sendRequest(method, urlEnding, data = null) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let jsonData = (data == null) ? null : JSON.stringify(data);

    let requestInit = {
        method: method,
        headers: headers,
        body: jsonData
    };

    let url = serverURL.p8080 + urlEnding;

    return fetch(url, requestInit);
}

function getAllJudges() {

    return sendRequest(Method.GET, "judges/all")
    .then(response => {
        if (response.status == 200) {
            return response.json();
        }
        else {
            return null;
        }
    });
}

function createCountry(data) {

    return sendRequest(Method.POST, "country", data)
    .then(response => {
        if (response.status == 201) {
            console.log("Success!");
        }
    });
}

export {
    serverURL,
    clientURL,
    getAllJudges,
    createCountry
}