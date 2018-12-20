import bcrypt from 'bcrypt';

export const admins = [
  {
    full_name: 'MUSIGWA Pacifique',
    phone: '+250722782928',
    email: 'pacifique.musigwa@gmail.com',
    password: 'secret@742SENDIT',
    isadmin: true
  }
];

const createAdmin = (db, debug, index = 0) => {
  if (index === admins.length) return;
  bcrypt.hash(admins[index].password, 10, (err, password) => {
    if (err) return debug(`Can't create Admin because: ${err}`);
    db.save({ ...admins[index], password })
      .then(admin => {
        debug(`Created the admin: ${admin.full_name}`);
        setTimeout(() => createAdmin(db, debug, index + 1), 1000);
      })
      .catch(error => debug(error));
  });
};

export default createAdmin;
