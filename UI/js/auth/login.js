import Helpers from '../helpers/index.js';

const login = () => {
  const user = { password: '', email: '' };
  for (const propName in user) {
    const { value } = document.getElementById(propName);
    if (!Helpers.valid(propName, value).status) return;
    user[propName] = value;
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
