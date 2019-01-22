import Helpers from '../helpers/index.js';

const token = localStorage.getItem('token');

window.cancelOrder = parcelId => {
  fetch(`${Helpers.baseURL()}/parcels/${parcelId}/cancel`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    mode: 'cors',
    cache: 'default'
  })
    .then(async res => {
      const body = await res.json();
      if (res.status === 201) window.location.reload();
      else if (res.status === 400) Helpers.toggleToast(body.message);
      else if (res.status === 401) window.location = '../../pages/auth/login.html';
      else if (res.status > 401 && res.status < 500) Helpers.toggleToast(body.message);
      else if (res.status >= 500) Helpers.toggleToast(undefined, { type: 'error' });
    })
    .catch(() => Helpers.toggleToast(undefined, { type: 'error' }));
};
