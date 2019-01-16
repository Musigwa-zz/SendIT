const newParcel = {
  origin: 'kigali',
  destination: 'kigembe',
  recipient_phone: '+250783676567',
  recipient_name: 'zachee ndikumana',
  present_location: 'kigali',
  weight: 3.6,
  price: 10.3
};

const newUser = [
  {
    full_name: 'Gloria ATETE',
    phone: '+250725464556',
    email: 'gloria@gmail.com',
    password: 'secret@742SENDIT'
  },
  {
    full_name: 'KAGABO Eric',
    phone: '+250783198552',
    email: 'kagabo@gmail.com',
    password: 'secret@742SENDIT'
  },
  {
    full_name: 'TUYISENGE Claude',
    phone: '+250753128552',
    email: 'tuyisenge@hotmail.com',
    password: 'secret@742SENDIT'
  }
];

const baseUrl = '/api/v1';

export { newParcel, newUser, baseUrl };
