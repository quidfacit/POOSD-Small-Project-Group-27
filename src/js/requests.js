function sendRequest(path, payload, callback, errorCallback) {
  const url = `http://contacts27.com/LAMPAPI/${path}.php`;

  console.log(url);
  console.log(payload);

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const { Error: err } = JSON.parse(xhr.responseText);
      if (err) {
        errorCallback(err);
      } else {
        callback(xhr);
      }
    }
  };

  xhr.send(payload);
}
