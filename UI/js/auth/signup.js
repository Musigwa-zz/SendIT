import Helpers from '../helpers/index.js';

window.onChangeText = elementId => Helpers.onChangeText(elementId);
window.focused = elementId => Helpers.onFocus(elementId);

const createAccount = () => {
  const user = {
    full_name: '',
    phone: '',
    password: '',
    email: '',
    confirm: ''
  };
  for (const id in user) {
    const element = document.getElementById(id);
    const message = Helpers.valid(id, element.value);
    if (message !== '') {
      element.reportValidity();
      element.setCustomValidity(message);
      return;
    }
    user[id] = element.value;
  }
  delete user.confirm;
  fetch(`${Helpers.baseURL()}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(user),
    mode: 'cors',
    cache: 'default'
  })
    .then(async res => {
      const body = await res.json();
      if (res.status === 201) {
        await localStorage.setItem('token', body.token);
        window.location = '../../pages/client/index.html';
      } else if (res.status === 400) Helpers.toggleToast(body.message);
      else if (res.status >= 500) Helpers.toggleToast(undefined, { type: 'error' });
    })
    .catch(() => Helpers.toggleToast(undefined, { type: 'error' }));
};

const sButton = document.querySelector('.submit-btn');
sButton.addEventListener('click', e => {
  e.preventDefault();
  createAccount();
});
