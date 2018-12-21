const baseUrl = 'http://127.0.0.1:5070/api/v1/parcels';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdsb3JpYUBnbWFpbC5jb20iLCJpZCI6MTcsImlzYWRtaW4iOmZhbHNlLCJpYXQiOjE1NDUzOTkxMjAsImV4cCI6MTU0NTQwMjcyMH0.ZTcNLnV3FKr7Rkp2NL4Q1TevP0gLFPoflVOioWdRb1k';
let toShow;

const toggleToast = (message, timeout = 2000) => {
  document.getElementById('toast-div').classList.add('show');
  document.getElementById('toast-div').innerHTML = message;
  setTimeout(
    () => document.getElementById('toast-div').classList.remove('show'),
    timeout
  );
  // return `<div id="toast" class="toast">${message}. Use the bottom-right button to create one.</div>`;
};

fetch(baseUrl, {
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
    const { parcels = [], message = '' } = body;
    if (res.status === 200) {
      const overview = [0, 0, 0];
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
              <th>timestamp</th>
              <th></th>
            </tr>`;
      parcels.forEach(parcel => {
        if (parcel.status.includes('unco')) overview[0]++;
        else if (parcel.status.includes('deliv')) overview[1]++;
        else if (parcel.status.includes('trans')) overview[2]++;
        const hidden = parcel.status.includes('cancel') || parcel.status.includes('deliv');
        toShow += `
          <tr>
            <td>${parcel.id}</td>
            <td>${parcel.recipient_name}</td>
            <td>${parcel.recipient_phone}</td>
            <td>${parcel.origin}</td>
            <td>${parcel.present_location}</td>
            <td>${parcel.destination}</td>
            <td>`;
        toShow += hidden
          ? ''
          : `
              <img
                onclick="openModal('edit-dest')"
                class="hover"
                src="../../assets/icons/edit.png"
                alt="lg"
                title="Change destination"
              />`;
        toShow += `</td>
            <td>${parcel.weight}</td>
            <td>${parcel.price}</td>
            <td>${parcel.status}</td>
            <td>${new Date(parcel.createdat).toDateString()}</td>
            <td>`;
        toShow += hidden
          ? ''
          : `
              <img
                class="hover"
                src="../../assets/icons/x-button.png"
                alt="lg"
                title="Cancel order"
              />
            </td>
          </tr>
          `;
      });
      toShow += '</table></div></div>';
      overview.forEach((value, index) => {
        document.getElementsByClassName('data').item(index).innerHTML = value;
      });
      document.getElementById('table-container').innerHTML = toShow;
    } else if (res.status === 401) {
      window.location = '../../pages/auth/login.html';
    } else if (res.status === 404) {
      toggleToast(`${message}. Use the bottom-right button to create one.`);
    } else if (res.status === 500) {
      toShow = '<div id="toast" class="toast">Something went wrong! try again or contact the administrator.</div>';
    }
  })
  .catch(err => console.log(err));
