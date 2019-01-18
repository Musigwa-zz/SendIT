import Helpers from '../helpers/index.js';

window.onChangeText = elementId => {
  const element = document.getElementById(elementId);
  const check = element.parentElement.lastElementChild;
  if (!element.value.length) {
    check.innerHTML = '*';
    check.style.color = 'darkorange';
    check.style.fontSize = '24px';
  } else if (Helpers.valid(elementId, element.value).status) {
    element.setCustomValidity('');
    check.innerHTML = '&checkmark;';
    check.style.color = 'green';
    check.style.fontSize = '20px';
  } else {
    element.setCustomValidity(Helpers.valid(elementId, element.value).message);
    check.innerHTML = '&cross;';
    check.style.color = 'red';
    check.style.fontSize = '15px';
  }
};

const createAccount = () => {
  const user = {
    full_name: '',
    phone: '',
    password: '',
    email: '',
    confirm: ''
  };
  for (const propName in user) {
    const { value } = document.getElementById(propName);
    if (!Helpers.valid(propName, value).status) return;
    user[propName] = value;
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

const sbutton = document.querySelector('.submit-btn');
sbutton.addEventListener('click', e => {
  e.preventDefault();
  createAccount();
});
