const baseUrl = 'http://127.0.0.1:5070/api/v1/auth/signup';
const indexUrl = '../../pages/client/index.html';

const valid = (itemId, value = '') => {
  value.trim();
  let regex;
  const res = { status: false, message: '' };
  switch (itemId) {
    case 'full_name':
      const [first = '', last = ''] = value.split(' ');
      regex = /^[A-Z][A-Z '.-]{1,40}$/i;
      return {
        status: regex.test(first) && regex.test(last),
        message: 'The (first and last) name should be separated by a single space.'
      };
    case 'confirm':
      const { value: password } = document.getElementById('password');
      return {
        status: valid('password', password).status && value === password,
        message: 'Please double check the passwords equality.'
      };
    case 'email':
      regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      res.message = 'Please input a valid email.';
      break;
    case 'phone':
      regex = /^\+?[1-9]\d{8,14}$/;
      res.message = 'The phone number should be(unique, 9 min, 14 max). Country code is optional.';
      break;
    case 'password':
      regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{7,})/;
      res.message = 'The password should be 7 chars min with at least one(uppercase,lowercase,number,symbol).';
      break;
    default:
      break;
  }
  return { ...res, status: regex.test(value) };
};

const onChangeText = elmtId => {
  const element = document.getElementById(elmtId);
  const check = element.parentElement.lastElementChild;
  if (!element.value.length) {
    check.innerHTML = '*';
    check.style.color = 'darkorange';
    check.style.fontSize = '24px';
  } else if (valid(elmtId, element.value).status) {
    element.setCustomValidity('');
    check.innerHTML = '&checkmark;';
    check.style.color = 'green';
    check.style.fontSize = '20px';
  } else {
    element.setCustomValidity(valid(elmtId, element.value).message);
    check.innerHTML = '&cross;';
    check.style.color = 'red';
    check.style.fontSize = '15px';
  }
};

const createAccount = () => {
  const template = {
    full_name: '',
    phone: '',
    password: '',
    email: '',
    confirm: ''
  };
  for (const propname in template) {
    const { value } = document.getElementById(propname);
    if (!valid(propname, value).status) return;
    template[propname] = value;
  }
  const { confirm, user } = template;
  console.log(user);
  // fetch(baseUrl, {
  //   method: 'POST',
  //   headers: { 'Content-type': 'application/json' },
  //   body: JSON.stringify(user),
  //   mode: 'cors',
  //   cache: 'default'
  // })
  //   .then(async res => {
  //     console.log(res.headers);
  //     const body = await res.json();
  //     const { message = '' } = body;
  //     if (res.status === 201) {
  //       // save the token into localStorage and redirect the user to the index page
  //       window.location = indexUrl;
  //     } else if (res.status === 400) {
  //       //  toggleToast(body.message);
  //     } else if (res.status === 500) {
  //       // toggleToast(
  //       //   'Something went wrong! try again or contact the administrator.',
  //       //   {
  //       //     expiresIn: false
  //       //   }
  //       // );
  //     }
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     // toggleToast('Something went wrong. Contact the administrator.', {
  //     //   type: 'error',
  //     //   expiresIn: false
  //     // });
  //   });
};
