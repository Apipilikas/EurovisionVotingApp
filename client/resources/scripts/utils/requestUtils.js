const serverURL = {
    p8080: "http://localhost:8080/",
    p3000: "http://localhost:3000/"
};

const clientURL = "http://127.0.0.1:5500/";

const Method = {
    GET: "GET",
    POST: "POST"
}

function getRequestInit(method, data = null) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let jsonData = (data == null) ? null : JSON.stringify(data);

    let requestInit = {
        method: method,
        headers: headers,
        body: jsonData
    };

    return requestInit;
}

function getAllJudges() {
    let requestInit = getRequestInit(Method.GET);

    return fetch(serverURL.p8080 + "judges/all", requestInit)
    .then(response => {
        if (response.status == 200) {
            return response.json();
        }
        else {
            return null;
        }
    });
}

function postCountry(data) {
    let requestInit = getRequestInit(Method.POST, data);

    return fetch(serverURL.p8080 + "country", requestInit)
    .then(response => {
        if (response.status == 201) {
            console.log("Sucess!");
        }
    });
}

export {
    serverURL,
    clientURL,
    getAllJudges,
    postCountry
}