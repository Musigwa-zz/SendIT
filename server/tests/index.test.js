import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../index';
import { baseUrl } from './testData';
import constants from '../helpers/constants';

const { expect } = chai;
const { OK, NOT_FOUND } = constants.statusCode;
chai.use(chaiHttp);
// Tests the entrypoint of the server

describe('/GET server', () => {
  it('should return a welcome message', done => {
    const exp = { msg: 'welcome' };
    chai
      .request(server)
      .get(baseUrl)
      .end((err, res) => {
        expect(res).to.have.status(OK);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property(
          'message',
          exp.msg,
          `expected message property to be '${exp.msg}'`
        );
        done();
      });
  });
  it('should return not found message', done => {
    chai
      .request(server)
      .get(`${baseUrl}unkown`)
      .end((err, res) => {
        expect(res).to.have.status(NOT_FOUND);
        expect(res.body).to.be.a('object');
        expect(res.body)
          .to.have.property('message')
          .contains('invalid url');
        done();
      });
  });
});
