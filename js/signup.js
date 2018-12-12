// const BaseURL = 'http://localhost:5070/api/v1';

// const prepareHeaders = data => {
//   const myHeaders = new Headers();
//   if (data) for (const key in data) myHeaders.append(key, data[key]);
//   else myHeaders.append('Content-Type', 'application/json');
//   return myHeaders;
// };

// const request = (
//   endPoint = '',
//   options = { body: undefined, method: 'GET', headers: null }
// ) => {
//   if (options.body !== undefined) options.body = JSON.stringify(options.body);
//   console.log(options);
//   return fetch(`${BaseURL}${endPoint}`, {
//     ...options,
//     headers: prepareHeaders(options.headers),
//     mode: 'no-cors',
//     cache: 'default'
//   });
// };

// const createAccount = () => {
//   const data = {
//     full_name: null,
//     email: null,
//     password: null,
//     phone: null
//   };
//   for (const prop in data) data[prop] = document.getElementById(prop).value;
//   console.log(data);
//   fetch(`${BaseURL}/auth/signup`, { method: 'POST', body: JSON.stringify(data) })
//     .then(res => {
//       console.log(res.json());
//       console.log(res.status);
//       console.log(res.headers);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };
