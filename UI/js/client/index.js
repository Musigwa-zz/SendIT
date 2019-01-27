import Helpers from '../helpers/index.js';

const token = localStorage.getItem('token');
if (localStorage.getItem('admin') === false) window.location = '../../pages/auth/login.html';
let toShow;

fetch(`${Helpers.baseURL()}/parcels`, {
  method: 'GET',
  headers: {
    'Content-type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  mode: 'cors',
  cache: 'default'
})
  .then(async res => {
    const body = await res.json();
    const currency = 'Rwf';
    const weightUnit = 'Kg';
    const { parcels = [], message = '' } = body;
    if (res.status === 200) {
      Helpers.toggleToast(message, { type: 'success', expiresIn: 3000 });
      const overview = [0, 0, 0, 0];
      toShow = `
            <div class="lg-card-content"><div class="data-table">
            <table>
              <tr>
                <th>order id</th>
                <th>recipient names</th>
                <th>recipient phone</th>
                <th>pickup location</th>
                <th>current address</th>
                <th>destination</th>
                <th></th>
                <th>weight</th>
                <th>price</th>
                <th>status</th>
                <th>date created</th>
                <th></th>
              </tr>`;
      parcels.forEach(parcel => {
        if (parcel.status.includes('unco')) overview[0]++;
        else if (parcel.status.includes('trans')) overview[1]++;
        else if (parcel.status.includes('cancel')) overview[2]++;
        else if (parcel.status.includes('deliv')) overview[3]++;
        const hidden = parcel.status.includes('cancel') || parcel.status.includes('deliv');
        toShow += `
            <tr>
              <td>${parcel.id}</td>
              <td>${parcel.recipient_name}</td>
              <td>${parcel.recipient_phone}</td>
              <td>${parcel.origin}</td>
              <td>${parcel.present_location}</td>
              <td>${parcel.destination}</td>
              <td>
              `;
        toShow += hidden
          ? ''
          : ` <img
                onclick="openModal('edit-dest',${parcel.id})"
                class="hover"
                src="../../assets/icons/edit.png"
                alt="lg"
                title="Change destination"
              />`;
        toShow += `
              </td>
              <td>${parcel.weight} ${weightUnit}</td>
              <td>${parcel.price} ${currency}</td>
              <td>${parcel.status}</td>
              <td>${new Date(parcel.createdat).toDateString()}</td>
              <td>`;
        toShow += hidden
          ? ''
          : `<img
              onclick="cancelOrder(${parcel.id})"
              class="hover"
              src="../../assets/icons/x-button.png"
              alt="lg"
              title="Cancel order"
            />
            </td>
            </tr>`;
      });
      toShow += '</table></div></div>';
      overview.forEach((value, index) => {
        document.getElementsByClassName('data').item(index).innerHTML = value;
      });
      document.getElementById('table-container').innerHTML = toShow;
    } else if (res.status === 401) window.location = '../../pages/auth/login.html';
    else if (res.status === 404) Helpers.toggleToast(`${message}. Use the bottom-right button to create one.`);
    else if (res.status >= 500) Helpers.toggleToast(undefined, { expiresIn: false });
  })
  .catch(() => Helpers.toggleToast(undefined, { type: 'error', expiresIn: false }));
