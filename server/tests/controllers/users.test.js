import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../../index';
import { baseUrl } from '../testData';
import constants from '../../helpers/constants';
import User from '../../models/User';
import Parcel from '../../models/Parcel';
import { admins } from '../../database/migrations/createAdmin';

const { OK, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = constants.statusCode;
const { expect } = chai;
let adminToken;
const { email, password } = admins[0];
chai.use(chaiHttp);

before(done => {
  chai
    .request(server)
    .post(`${baseUrl}/auth/login`)
    .send({ email, password })
    .then(res => {
      adminToken = res.header['x-auth-token'];
      return done();
    })
    .catch(err => done(err));
});

after(done => {
  Parcel.removeAll()
    .then(() => User.removeAll())
    .then(() => done())
    .catch(err => done(err));
});

describe('/GET fetch the current user details', () => {
  const url = `${baseUrl}/users/me`;
  it('should return the [me] object containing the user details, STATUS [OK]', done => {
    chai
      .request(server)
      .get(url)
      .set('Authorization', `Bearer ${adminToken}`)
      .then(res => {
        expect(res).to.have.status(OK);
        expect(res.body)
          .haveOwnProperty('me')
          .be.an('object')
          .haveOwnProperty('isadmin')
          .equals(true);
        return done();
      })
      .catch(err => done(err));
  });
  it('should return an error if no access token provided, STATUS [UNAUTHORIZED]', done => {
    chai
      .request(server)
      .get(url)
      .then(res => {
        expect(res).to.have.status(UNAUTHORIZED);
        expect(res.body)
          .haveOwnProperty('message')
          .be.an('string')
          .includes('Access denied');
        return done();
      })
      .catch(err => done(err));
  });
  it('should return the error message if we send the incorrect authorization header, STATUS [INTERNAL_SERVER_ERROR]', done => {
    chai
      .request(server)
      .get(url)
      .set('Authorization', `Bear ${adminToken}`)
      .then(res => {
        expect(res).to.have.status(INTERNAL_SERVER_ERROR);
        expect(res.body).to.be.an('object');
        expect(res.body).to.haveOwnProperty('message');
        expect(res.body.message).to.contain('Access denied');
        return done();
      })
      .catch(err => done(err));
  });
});
