const BaseURL = '';
export default class Request {
  static get(endPoint = '', headers = {}) {
    return new Promise((resolve, reject) => {
      fetch(`${BaseURL}${endPoint}`, {
        method: 'GET',
        headers: { ...headers, 'Content-Type': 'application/json' },
        mode: 'cors',
        cache: 'default'
      })
        .then(res => resolve({ ...res.body, ...res.headers }))
        .catch(error => reject(error));
    });
  }

  //   static postData(endPoint, userData, met = 'POST', headers = null) {
  //     return new Promise((resolve, reject) => {
  //       fetch(BaseURL + endPoint, {
  //         method: met,
  //         body: JSON.stringify(userData),
  //         headers: prepareHeaders(headers),
  //         mode: 'cors',
  //         cache: 'default'
  //       })
  //         .then(response => response.json())
  //         .then(res => resolve(res))
  //         .catch(error => reject(error));
  //     });
  //   }

  //   static deleteData(endPoint, headers = null) {
  //     return new Promise((resolve, reject) => {
  //       fetch(BaseURL + endPoint, {
  //         method: 'DELETE',
  //         headers: prepareHeaders(headers),
  //         mode: 'cors',
  //         cache: 'default'
  //       })
  //         .then(response => response.json())
  //         .then(res => resolve(res))
  //         .catch(error => reject(error));
  //     });
  //   }
}
