export default class Helpers {
  static baseURL = 'http://127.0.0.1:5070/api/v1';

  static get(endPoint = this.baseURL, headers = {}) {
    return fetch(`${this.baseURL}${endPoint}`, {
      method: 'GET',
      headers: { ...headers, 'Content-Type': 'application/json' },
      mode: 'cors',
      cache: 'default'
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
