import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';

import server from '../../index';
import { baseUrl, newUser } from '../testData';
import constants from '../../helpers/constants';
import User from '../../models/User';
import Parcel from '../../models/Parcel';
import { admins } from '../../database/migrations/createAdmin';

const {
  CREATED, OK, UNAUTHORIZED, BAD_REQUEST
} = constants.statusCode;
const { expect } = chai;
chai.use(chaiHttp);

before(done => {
  Parcel.removeAll()
    .then(() => User.remove(undefined, { isAdmin: false }))
    .then(() => done())
    .catch(err => done(err));
});

after(done => {
  Parcel.removeAll()
    .then(() => User.removeAll())
    .then(() => done())
    .catch(err => done(err));
});

describe('Authentication/Authorization [signup, login]', () => {
  const { email, password, ...rest } = newUser[0];
  describe('/POST signup a new user account', () => {
    const url = `${baseUrl}/auth/signup`;
    it('should return the access token, STATUS [CREATED]', done => {
      chai
        .request(server)
        .post(url)
        .send(newUser[0])
        .then(res => {
          expect(res).to.have.status(CREATED);
          expect(res.header)
            .to.haveOwnProperty('x-auth-token')
            .to.be.a('string');
          return done();
        })
        .catch(err => done(err));
    });
    it('should return an error if there some missing user properties, STATUS [BAD_REQUEST]', done => {
      chai
        .request(server)
        .post(url)
        .send(rest)
        .then(res => {
          expect(res).to.have.status(BAD_REQUEST);
          expect(res.body)
            .to.haveOwnProperty('message')
            .to.be.a('string')
            .includes('required');
          return done();
        })
        .catch(err => done(err));
    });
    it('should upload the profile picture, save the rest and return the access token, STATUS [CREATED]', done => {
      chai
        .request(server)
        .post(url)
        .field('full_name', 'KALISA Clement')
        .field('phone', '+251230864356')
        .field('email', 'clement@gmail.com')
        .field('password', 'secret!742SENDIT')
        .attach('avatar', fs.readFileSync('avatar.jpg'))
        .then(res => {
          expect(res).to.have.status(CREATED);
          expect(res.header)
            .to.haveOwnProperty('x-auth-token')
            .to.be.a('string');
          return done();
        })
        .catch(err => done(err));
    });
  });

  describe('/POST user account login', () => {
    const url = `${baseUrl}/auth/login`;
    const [admin] = admins;
    it('should return the access token, STATUS [OK]', done => {
      chai
        .request(server)
        .post(url)
        .send({ email: admin.email, password: admin.password })
        .then(res => {
          expect(res).to.have.status(OK);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('message');
          expect(res.header)
            .to.haveOwnProperty('x-auth-token')
            .to.be.a('string');
          expect(res.body.message).to.contain('success');
          return done();
        })
        .catch(err => done(err));
    });
    it('should return the error message, STATUS [UNAUTHORIZED]', done => {
      chai
        .request(server)
        .post(url)
        .send({ email, password: `${password}bjv` })
        .then(res => {
          expect(res).to.have.status(UNAUTHORIZED);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('message');
          expect(res.body.message).to.contain(
            'email or password',
            'Expected message property to contain "email or password mismatch"'
          );
          return done();
        })
        .catch(err => done(err));
    });
    it('should return the error message, STATUS [UNAUTHORIZED]', done => {
      chai
        .request(server)
        .post(url)
        .send({ email: 'kamanzi@webmail.com', password })
        .then(res => {
          expect(res).to.have.status(UNAUTHORIZED);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('message');
          expect(res.body.message).to.contain(
            'email or password',
            'Expected message property to contain "email or password mismatch"'
          );
          return done();
        })
        .catch(err => done(err));
    });
  });
});
