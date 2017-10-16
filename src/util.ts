export function fetch(
    url: string,
    responseType: XMLHttpRequestResponseType = "",
) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true /* asynchronous */);
        xhr.responseType = responseType;

        xhr.onload = (event) => {
            if (xhr.status >= 200 &&
                xhr.status <= 299 &&
                !!xhr.response) {
                resolve((xhr.response));
            } else {
                reject(xhr.status);
            }
        };

        xhr.onerror = (event) => {
            reject("Fetch failed: " + url);
        };

        xhr.send(null);
    });
}
