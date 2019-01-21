export default class Helpers {
  static baseURL() {
    return 'http://127.0.0.1:5070/api/v1';
  }

  static valid(itemId, value = '') {
    value.trim();
    switch (itemId) {
      case 'full_name':
        const [first = '', last = ''] = value.split(' ');
        return /^[A-Z][A-Z '.-]{1,40}$/i.test(first)
          && /^[A-Z][A-Z '.-]{1,40}$/i.test(last)
          ? ''
          : 'The (first and last) name should be separated by a single space.';

      case 'confirm':
        const { value: password } = document.getElementById('password');
        return this.valid('password', password) === '' && value === password
          ? ''
          : 'Make sure both passwords are equal.';
      case 'email':
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        )
          ? ''
          : 'Please input a valid email.';

      case 'phone':
        return /^\+?[1-9]\d{8,14}$/.test(value)
          ? ''
          : 'The phone number should be(unique, 9 min, 14 max). Country code is optional.';
      case 'password':
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{7,})/.test(
          value
        )
          ? ''
          : 'The password should be 7 chars min with at least one(uppercase,lowercase,number,symbol).';
      default:
        break;
    }
  }

  static onChangeText(elementId) {
    const element = document.getElementById(elementId);
    const { value, parentElement } = element;
    const message = this.valid(elementId, value);
    const check = parentElement.lastElementChild;
    if (!value.length) {
      check.innerHTML = '*';
      check.style.color = 'darkorange';
      check.style.fontSize = '24px';
    }
    if (message === '') {
      check.innerHTML = '&checkmark;';
      check.style.color = 'green';
      check.style.fontSize = '20px';
      element.setCustomValidity('');
    } else {
      check.innerHTML = '&cross;';
      check.style.color = 'red';
      check.style.fontSize = '15px';
    }
  }

  static onFocus(elementId) {
    const element = document.getElementById(elementId);
    const message = Helpers.valid(elementId, element.value);
    if (message !== '') {
      element.reportValidity();
      element.setCustomValidity(message);
    }
  }

  static toggleToast(
    message = 'Something went wrong! try again or contact the administrator.',
    options = { expiresIn: 6000, type: 'warn' }
  ) {
    const { expiresIn = 6000, type = 'warn' } = options;
    let bgColor = 'darkorange';
    const toast = document.getElementById('toast-div');
    if (type.includes('suc')) bgColor = 'green';
    else if (type.includes('er')) bgColor = 'red';
    toast.style.backgroundColor = bgColor;
    toast.classList.add('show');
    toast.innerHTML = message;
    if (expiresIn !== false) {
      toast.style.animation = `fadeInOut ${expiresIn / 1000}s`;
      toast.classList.add('fade');
      setTimeout(() => toast.classList.remove('show'), expiresIn);
    }
  }
}
