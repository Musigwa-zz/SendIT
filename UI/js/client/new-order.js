import Helpers from '../helpers/index.js';

const token = localStorage.getItem('token');
window.onChangeText = elementId => Helpers.onChangeText(elementId);
window.focused = elementId => Helpers.onFocus(elementId);

const createOrder = () => {
  const parcel = {
    origin: '',
    destination: '',
    weight: '',
    recipient_name: '',
    recipient_phone: ''
  };

  for (const id in parcel) {
    const element = document.getElementById(id);
    const message = Helpers.valid(id, element.value);
    if (message !== '') {
      element.reportValidity();
      element.setCustomValidity(message);
      return;
    }
    parcel[id] = element.value;
  }
  document.getElementById('loader').classList.add('active');
  fetch(`${Helpers.baseURL()}/parcels`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(parcel),
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
      else if (res.status >= 500) Helpers.toggleToast(undefined, { type: 'error' });
    })
    .catch(() => Helpers.toggleToast(undefined, { type: 'error' }));
};

const sButton = document.querySelector('.create-order');
sButton.addEventListener('click', e => {
  e.preventDefault();
  createOrder();
});
