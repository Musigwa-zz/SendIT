import Helpers from '../helpers/index.js';

const token = localStorage.getItem('token');
window.changeDest = elementId => Helpers.onChangeText(elementId);
window.focusDest = elementId => Helpers.onFocus(elementId);

const changeDestination = () => {
  const element = document.getElementById('new-destination');
  const message = Helpers.valid('new-destination', element.value);
  if (message !== '') {
    element.reportValidity();
    element.setCustomValidity(message);
    return;
  }
  const parcelId = document.getElementById('parcel-id').value;
  fetch(`${Helpers.baseURL()}/parcels/${parcelId}/destination`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ destination: element.value }),
    mode: 'cors',
    cache: 'default'
  })
    .then(async res => {
      const body = await res.json();
      if (res.status === 201) {
        window.location.reload();
        Helpers.toggleToast(body.message, { type: 'success' });
      } else if (res.status === 400) Helpers.toggleToast(body.message);
      else if (res.status === 401) window.location = '../../pages/auth/login.html';
      else if (res.status > 401 && res.status < 500) Helpers.toggleToast(body.message);
      else if (res.status >= 500) Helpers.toggleToast(undefined, { type: 'error' });
    })
    .catch(() => Helpers.toggleToast(undefined, { type: 'error' }));
};

const sButton = document.querySelector('#change-dest');
sButton.addEventListener('click', e => {
  e.preventDefault();
  changeDestination();
});
