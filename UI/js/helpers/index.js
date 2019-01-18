export default class Helpers {
  static baseURL() {
    return 'http://127.0.0.1:5070/api/v1';
  }

  static valid(itemId, value = '') {
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
          status: this.valid('password', password).status && value === password,
          message: "Passwords don't match."
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
