import chai from 'chai';
import chaiHTTP from 'chai-http';

import server from '../../index';
import Parcel from '../../models/Parcel';
import { newParcel, baseUrl } from '../testData';

const should = chai.should();
chai.use(chaiHTTP);

// Tests for the [parcels] api endpoints //

describe('Test all API methods related with parcels', () => {
  // clear data before and after any testing

  beforeEach(async () => await Parcel.remove());
  afterEach(async () => await Parcel.remove());

  // POST parcels [returns all created parcel delivery orders

  describe('/POST create a new parcel delivery order', () => {
    it('it should return an object with error=null property, STATUS [201]', (done) => {
      chai
        .request(server)
        .post(`${baseUrl}/parcels`)
        .send(newParcel)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('error', null, 'expected error to be null');
          res.body.should.have
            .property('parcels')
            .be.a('array')
            .length(1);
        });
      done();
    });
    it('the sender of the order is required, it should return an object with error property, STATUS [400]', (done) => {
      const { sender, ...rest } = newParcel;
      chai
        .request(server)
        .post(`${baseUrl}/parcels`)
        .send(rest)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.have.property('name', 'ValidationError');
          res.body.error.should.have.property('message', '"sender" is required');
        });
      done();
    });
    it('the sender of the order is a string of atleast 1 char, it should return an object with error property STATUS [400]', (done) => {
      const data = { ...newParcel, sender: '' };
      chai
        .request(server)
        .post(`${baseUrl}/parcels`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.have.property('name', 'ValidationError');
          res.body.error.should.have.property(
            'message',
            '"sender" is not allowed to be empty',
            'expected error message include [not allowed to be empty]',
          );
        });
      done();
    });
    it('the recipient of the order is required, it should return an object with error property STATUS [400]', (done) => {
      const { recipient, ...rest } = newParcel;
      chai
        .request(server)
        .post(`${baseUrl}/parcels`)
        .send(rest)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.have.property('name', 'ValidationError');
          res.body.error.should.have.property('message', '"recipient" is required');
        });
      done();
    });
    it('the recipient must be an object of atleast phone property, it should return an object with error property STATUS [400]', (done) => {
      const data = { ...newParcel, recipient: {} };
      chai
        .request(server)
        .post(`${baseUrl}/parcels`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .be.a('object', 'expected error to be an object');
          res.body.error.should.have.property('name', 'ValidationError');
          res.body.error.should.have.property('message', '"phone" is required');
        });
      done();
    });
    it("the recipient's phone number must be an object of atleast 10 chars, it should return an object with error property STATUS [400]", (done) => {
      const data = { ...newParcel, recipient: { phone: '0789' } };
      chai
        .request(server)
        .post(`${baseUrl}/parcels`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .be.a('object', 'expected error to be an object');
          res.body.error.should.have.property('name', 'ValidationError');
          res.body.error.should.have.property(
            'message',
            '"phone" length must be at least 10 characters long',
          );
        });
      done();
    });
    it('the pick up location [origin] of the order must be provided, it should return an object with error property STATUS [400]', (done) => {
      const { origin, ...rest } = newParcel;
      chai
        .request(server)
        .post(`${baseUrl}/parcels`)
        .send(rest)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .be.a('object', 'expected error to be an object');
          res.body.error.should.have.property('name', 'ValidationError');
          res.body.error.should.have.property('message', '"origin" is required');
        });
      done();
    });
    it('the pick up location [origin] of the order must be a string of atleast one char, it should return an object with error property STATUS [400]', (done) => {
      const data = { ...newParcel, origin: '' };

      chai
        .request(server)
        .post(`${baseUrl}/parcels`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .be.a('object', 'expected error to be an object');
          res.body.error.should.have.property('name', 'ValidationError');
          res.body.error.should.have.property(
            'message',
            '"origin" is not allowed to be empty',
          );
        });
      done();
    });
    it('the [destination] of the order must be provided, it should return an object with error property STATUS [400]', (done) => {
      const { destination, ...rest } = newParcel;
      chai
        .request(server)
        .post(`${baseUrl}/parcels`)
        .send(rest)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .be.a('object', 'expected error to be an object');
          res.body.error.should.have.property('name', 'ValidationError');
          res.body.error.should.have.property(
            'message',
            '"destination" is required',
          );
        });
      done();
    });
    it('the [destination] of the order must be a string of atleast one char, it should return an object with error property STATUS [400]', (done) => {
      const data = { ...newParcel, destination: '' };

      chai
        .request(server)
        .post(`${baseUrl}/parcels`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .be.a('object', 'expected error to be an object');
          res.body.error.should.have.property('name', 'ValidationError');
          res.body.error.should.have.property(
            'message',
            '"destination" is not allowed to be empty',
          );
        });
      done();
    });
    it('the [weight] of the parcel must be provided, it should return an object with error property STATUS [400]', (done) => {
      const { weight, ...rest } = newParcel;
      chai
        .request(server)
        .post(`${baseUrl}/parcels`)
        .send(rest)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .be.a('object', 'expected error to be an object');
          res.body.error.should.have.property('name', 'ValidationError');
          res.body.error.should.have.property('message', '"weight" is required');
        });
      done();
    });
    it('the [weight] of the parcel must be a nummber >= [one], it should return an object with error property STATUS [400]', (done) => {
      const data = { ...newParcel, weight: 0 };

      chai
        .request(server)
        .post(`${baseUrl}/parcels`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .be.a('object', 'expected error to be an object');
          res.body.error.should.have.property('name', 'ValidationError');
          res.body.error.should.have.property(
            'message',
            '"weight" must be larger than or equal to 1',
          );
        });
      done();
    });
    it('it should decline the order with properties not matching the order schema, it should return an object with error property STATUS [400]', (done) => {
      const data = { ...newParcel, limit: 0 };
      chai
        .request(server)
        .post(`${baseUrl}/parcels`)
        .send(data)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have
            .property('error')
            .be.a('object', 'expected error to be an object');
          res.body.error.should.have.property('name', 'ValidationError');
          res.body.error.should.have.property('message', '"limit" is not allowed');
        });
      done();
    });
  });

  // GET parcels [returns all parcel deliv orders created by the users]

  describe('/GET parcel delivery orders', () => {
    it('it should return an object with error=null, and array of parcels,STATUS [200]', (done) => {
      Parcel.save(newParcel) // must save the verified data to match the schema
        .then(() => {
          chai
            .request(server)
            .get(`${baseUrl}/parcels`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('parcels');
              res.body.should.have.property(
                'error',
                null,
                'expected error to be null',
              );
              res.body.parcels.should.be
                .a('array', 'expected parcels to be an array')
                .length(1);
            });
          done();
        });
    });
    it('it should return an object with an empty array parcels, STATUS [204]', (done) => {
      chai
        .request(server)
        .get(`${baseUrl}/parcels`)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.should.have.status(204);
        });
      done();
    });
  });

});
