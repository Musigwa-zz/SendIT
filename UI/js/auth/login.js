import Helpers from '../helpers/index.js';

window.onChangeText = elementId => Helpers.onChangeText(elementId);
window.focused = elementId => Helpers.onFocus(elementId);

const login = () => {
  const user = { password: '', email: '' };
  for (const id in user) {
    const element = document.getElementById(id);
    const message = Helpers.valid(id, element.value);
    if (message !== '') {
      element.reportValidity();
      element.setCustomValidity(`The ${id} is required.`);
      return;
    }
    user[id] = element.value;
  }
  fetch(`${Helpers.baseURL()}/auth/login`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(user),
    mode: 'cors',
    cache: 'default'
  })
    .then(async res => {
      const body = await res.json();
      if (res.status === 200) {
        await localStorage.setItem('token', body.token);
        await localStorage.setItem('admin', body.admin);
        const whom = body.admin ? 'admin' : 'client';
        window.location = `../../pages/${whom}/index.html`;
      } else if (res.status === 401) Helpers.toggleToast(body.message);
      else if (res.status >= 500) Helpers.toggleToast(undefined, { type: 'error' });
    })
    .catch(() => Helpers.toggleToast(undefined, { type: 'error' }));
};

const sButton = document.querySelector('.submit-btn');
sButton.addEventListener('click', e => {
  e.preventDefault();
  login();
});
