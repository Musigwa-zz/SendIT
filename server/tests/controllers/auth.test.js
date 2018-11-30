import chai from 'chai';
import chaiHTTP from 'chai-http';

import server from '../../index';
import { baseUrl, newUser } from '../testData';
import User from '../../models/User';

const should = chai.should();
chai.use(chaiHTTP);

// Tests for the [Authentication] api endpoints //

describe('Test all APIs related with Authentication', () => {
  // clear data before and after any testing

  // POST parcels [returns all created parcel delivery orders

  describe('/POST create a new user account', () => {
    const url = `${baseUrl}/auth/signup`;
    it('it should return an object with message property, STATUS [201]', done => {
      chai
        .request(server)
        .post(url)
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('message', '', 'expected error to be null');
          res.body.should.have.property('token').be.a('string');
        });
      done();
    });
    it('The Phone is required [400]', done => {
      const { phone, ...rest } = newUser;
      chai
        .request(server)
        .post(url)
        .send(rest)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
        });
      done();
    });
  });
  // login
  describe('/POST log into a user account', () => {
    const url = `${baseUrl}/auth/login`;
    it('it should return an object with message property, STATUS [201]', done => {
      const { password, email } = newUser;
      chai
        .request(server)
        .post(url)
        .send({ email, password })
        .end((err, res) => {
          res.should.have.status(201);
          //   res.body.should.be.a('object');
          //   res.body.should.have.property('message', '', 'expected error to be null');
          //   res.body.should.have.property('token').be.a('string');
        });
      done();
    });
    // it('The Phone is required [400]', done => {
    //   const { phone, ...rest } = newUser;
    //   chai
    //     .request(server)
    //     .post(url)
    //     .send(rest)
    //     .end((err, res) => {
    //       res.should.have.status(400);
    //       res.body.should.be.a('object');
    //       res.body.should.have.property('message');
    //     });
    //   done();
    // });
  });
});
