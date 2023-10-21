const url = "http://localhost:8080/";

const Method = {
    GET: "GET",
    POST: "POST"
}

function getGETRequestInit() {
    let headers = new Headers();
    headers.append('Accept', 'application/json');

    let requestInit = {
        method: Method.GET,
        headers: headers
    };

    return requestInit;
}

function getPOSTRequestInit(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let requestInit = {
        method: Method.POST,
        headers: headers,
        body: JSON.stringify(data)
    };

    return requestInit;
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

    return fetch(url + "judges/all", requestInit)
    .then(response => {
        if (response.status == 200) {
            return response.json();
        }
        else {
            return null;
        }
    })
}

export {
    url,
    getAllJudges
}