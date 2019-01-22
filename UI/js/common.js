const cancelOrder = element => {
  element.parentElement.parentElement.hidden = true;
};

const openModal = (id, parcelId = 0) => {
  if (parcelId) document.getElementById('parcel-id').value = parcelId;
  document.getElementById(id).style.display = 'flex';
};

const closeModal = id => {
  document.getElementById(id).style.display = 'none';
};

const logout = async () => {
  await localStorage.removeItem('token');
  window.location = '../../index.html';
};
