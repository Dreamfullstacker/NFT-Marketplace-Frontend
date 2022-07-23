import axios from 'axios';

export const baseUrl = 'http://10.10.13.28:5001/';

// axios.defaults.withCredentials = true;
axios.defaults.headers.common.Accept = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

function Request (url, method="GET", data={}) {
  return new Promise((resolve, reject) => {
    axios({
        method,
        url: baseUrl + url,
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        resolve(response.data);
    })
    .catch(function (error) {
        reject(error);
    });

  })
}

function APIRequest (url, method="GET", data={}) {
  return new Promise((resolve, reject) => {
    axios({
        method,
        url: url,
        data,
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        console.log('api: '+response);
        // resolve(response.data.result);
    })
    .catch(function (error) {
        reject(error);
    });

  })
}

export { Request, APIRequest };
