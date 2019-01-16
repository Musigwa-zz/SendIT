import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../index';
import { baseUrl, newParcel, newUser } from '../testData';
import constants from '../../helpers/constants';
import User from '../../models/User';
import Parcel from '../../models/Parcel';
import Helpers from '../../helpers';
import { admins } from '../../database/migrations/createAdmin';

const {
  CREATED,
  UNAUTHORIZED,
  BAD_REQUEST,
  OK,
  NOT_FOUND,
  FORBIDDEN
} = constants.statusCode;
const { expect } = chai;
let clientToken;
chai.use(chaiHttp);

before(done => {
  Parcel.removeAll()
    .then(() => User.remove(undefined, { isAdmin: false }))
    .then(() => User.validate(newUser[1]))
    .then(valid => User.save(valid))
    .then(user => {
      clientToken = Helpers.createToken(user);
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

describe('All endpoints concerning the parcel delivery orders', () => {
  const url = `${baseUrl}/parcels`;
  describe('/POST create a new parcel delivery order', () => {
    it('should return an error if provided an invalid token, STATUS [UNAUTHORIZED]', done => {
      // console.log('USER TOKEN:', token);
      chai
        .request(server)
        .post(url)
        .set('Authorization', `Bearer ${clientToken}sh`)
        .send(newParcel)
        .then(res => {
          expect(res).to.have.status(UNAUTHORIZED);
          expect(res.body).to.be.an('object');
          expect(res.body)
            .to.haveOwnProperty('message')
            .to.includes('Access denied');
          return done();
        })
        .catch(err => done(err));
    });

    it('should return the created parcel order, STATUS [201]', done => {
      chai
        .request(server)
        .post(url)
        .set('Authorization', `Bearer ${clientToken}`)
        .send(newParcel)
        .then(res => {
          expect(res).to.have.status(CREATED);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('parcel');
          expect(res.body.parcel).to.be.an('object');
          expect(res.body).to.haveOwnProperty('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.contain('created');
          expect(res.body.parcel).to.haveOwnProperty('id');
          return done();
        })
        .catch(err => done(err));
    });

    it('should return an error if no recipient_phone provided, STATUS [BAD_REQUEST]', done => {
      const { recipient_phone, ...rest } = newParcel;
      chai
        .request(server)
        .post(url)
        .set('Authorization', `Bearer ${clientToken}`)
        .send(rest)
        .then(res => {
          expect(res).to.have.status(BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('message');
          expect(res.body.message).to.contain('(unique, 9 min, 14 max)');
          return done();
        })
        .catch(err => done(err));
    });

    it("should return an error if the recipeint_phone doesn't match the following pattern:(unique, 9 min, 14 max) digits and/or starts with (+) symbol, STATUS [BAD_REQUEST]", done => {
      const data = { ...newParcel, recipient_phone: 78965 };
      chai
        .request(server)
        .post(url)
        .set('Authorization', `Bearer ${clientToken}`)
        .send(data)
        .then(res => {
          expect(res).to.have.status(BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('message');
          expect(res.body.message).to.contain('(unique, 9 min, 14 max)');
          return done();
        })
        .catch(err => done(err));
    });

    it('should return an error if no pick up location [origin] provided, STATUS [BAD_REQUEST]', done => {
      const { origin, ...rest } = newParcel;
      chai
        .request(server)
        .post(url)
        .set('Authorization', `Bearer ${clientToken}`)
        .send(rest)
        .then(res => {
          expect(res).to.have.status(BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body)
            .to.haveOwnProperty('message')
            .be.a('string')
            .includes('"origin" is required');
          return done();
        })
        .catch(err => done(err));
    });

    it('should return an error if the pick up location [origin] is not a string of atleast one char, STATUS [BAD_REQUEST]', done => {
      const data = { ...newParcel, origin: '' };
      chai
        .request(server)
        .post(url)
        .set('Authorization', `Bearer ${clientToken}`)
        .send(data)
        .then(res => {
          expect(res).to.have.status(BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('message');
          return done();
        })
        .catch(err => done(err));
    });

    it('should return an error if no [destination] provided or an invalid destination, STATUS [BAD_REQUEST]', done => {
      const { destination, ...rest } = newParcel;
      chai
        .request(server)
        .post(url)
        .set('Authorization', `Bearer ${clientToken}`)
        .send(rest)
        .then(res => {
          expect(res).to.have.status(BAD_REQUEST);
          expect(res.body).to.be.an('object');
          expect(res.body)
            .to.haveOwnProperty('message')
            .contain('"destination" is required');
          return done();
        })
        .catch(err => done(err));
    });
  });

  describe('/GET parcel delivery orders', () => {
    it('should return an array of all created parcels, STATUS [OK]', done => {
      chai
        .request(server)
        .get(url)
        .set('Authorization', `Bearer ${clientToken}`)
        .then(res => {
          expect(res).to.have.status(OK);
          expect(res.body).to.be.an('object');
          expect(res.body).to.haveOwnProperty('parcels');
          expect(res.body.parcels).to.be.an('array');
          expect(res.body)
            .to.haveOwnProperty('message')
            .contain('Successful');
          return done();
        })
        .catch(err => done(err));
    });
  });
  describe('/GET a specific parcel delivery order', () => {
    it('should return parcel object property, STATUS [OK]', done => {
      chai
        .request(server)
        .get(`${url}/1`)
        .set('Authorization', `Bearer ${clientToken}`)
        .then(res => {
          expect(res).to.have.status(OK);
          expect(res.body)
            .to.be.an('object')
            .haveOwnProperty('message')
            .includes('Successful');
          expect(res.body)
            .to.haveOwnProperty('parcel')
            .to.be.an('object');
          return done();
        })
        .catch(err => done(err));
    });
    it('should return an error if the given ID is not found, STATUS [NOT_FOUND]', done => {
      chai
        .request(server)
        .get(`${url}/4`)
        .set('Authorization', `Bearer ${clientToken}`)
        .then(res => {
          expect(res).to.have.status(NOT_FOUND);
          expect(res.body)
            .to.be.an('object')
            .haveOwnProperty('message')
            .contain('No parcel order');
          return done();
        })
        .catch(err => done(err));
    });
  });

  describe("/GET fetch the user's parcel delivery orders", () => {
    it('should return an array of parcels, STATUS [OK]', done => {
      const { id } = Helpers.decodeToken(clientToken);
      chai
        .request(server)
        .get(`${baseUrl}/users/${id}/parcels`)
        .set('Authorization', `Bearer ${clientToken}`)
        .then(res => {
          expect(res).to.have.status(OK);
          expect(res.body)
            .to.be.an('object')
            .haveOwnProperty('parcels')
            .be.an('array');
          expect(res.body)
            .to.haveOwnProperty('message')
            .be.an('string')
            .includes('Successful');
          return done();
        })
        .catch(err => done(err));
    });
    it("should return an error if the user doesn't exist, STATUS [NOT_FOUND]", done => {
      chai
        .request(server)
        .get(`${baseUrl}/users/34R/parcels`)
        .set('Authorization', `Bearer ${clientToken}`)
        .then(res => {
          expect(res).to.have.status(NOT_FOUND);
          expect(res.body)
            .to.haveOwnProperty('message')
            .be.an('string')
            .includes('No parcel orders');
          return done();
        })
        .catch(err => done(err));
    });
  });

  describe('/PUT cancel the parcel delivery order', () => {
    it('should return the canceled order, STATUS [CREATED]', done => {
      chai
        .request(server)
        .put(`${url}/1/cancel`)
        .set('Authorization', `Bearer ${clientToken}`)
        .then(res => {
          expect(res).to.have.status(CREATED);
          expect(res.body)
            .to.be.an('object')
            .haveOwnProperty('parcel')
            .to.be.an('object')
            .haveOwnProperty('status')
            .equals('cancelled');
          return done();
        })
        .catch(err => done(err));
    });
    it('should return an error if provided an invalid id, STATUS [BAD_REQUEST]', done => {
      chai
        .request(server)
        .put(`${url}/1ddsKJBKdbj354/cancel`)
        .set('Authorization', `Bearer ${clientToken}`)
        .then(res => {
          expect(res).to.have.status(NOT_FOUND);
          expect(res.body)
            .to.be.an('object')
            .haveOwnProperty('message')
            .includes('No such parcel');
          return done();
        })
        .catch(err => done(err));
    });
    it('should return an error if the target parcel is cancelled or delivered, STATUS [FORBIDDEN]', done => {
      chai
        .request(server)
        .put(`${url}/1/cancel`)
        .set('Authorization', `Bearer ${clientToken}`)
        .then(res => {
          expect(res).to.have.status(FORBIDDEN);
          expect(res.body)
            .to.be.an('object')
            .haveOwnProperty('message')
            .be.a('string')
            .includes("Can't update the delivered or cancelled order");
          return done();
        })
        .catch(err => done(err));
    });
  });

  describe('/PUT change the destination of a parcel delivery order', () => {
    let parcelId;
    before(done => {
      chai
        .request(server)
        .post(url)
        .set('Authorization', `Bearer ${clientToken}`)
        .send(newParcel)
        .then(res => {
          parcelId = res.body.parcel.id;
          return done();
        })
        .catch(err => done(err));
    });
    it('should return an updated parcel object, STATUS [CREATED]', done => {
      chai
        .request(server)
        .put(`${url}/${parcelId}/destination`)
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ destination: 'Kabgayi' })
        .then(res => {
          expect(res).to.have.status(CREATED);
          expect(res.body)
            .to.be.an('object')
            .haveOwnProperty('message')
            .to.be.a('string')
            .includes('Successful');
          expect(res.body)
            .to.haveOwnProperty('parcel')
            .to.be.an('object')
            .haveOwnProperty('destination')
            .equals('Kabgayi');
          return done();
        })
        .catch(err => done(err));
    });
    it('should return an error if no new destination provided, STATUS [BAD_REQUEST]', done => {
      chai
        .request(server)
        .put(`${url}/${parcelId}/destination`)
        .set('Authorization', `Bearer ${clientToken}`)
        .then(res => {
          expect(res).to.have.status(BAD_REQUEST);
          expect(res.body)
            .to.be.an('object')
            .haveOwnProperty('message')
            .to.be.a('string')
            .includes('Provide the new value(s)');
          return done();
        })
        .catch(err => done(err));
    });
    it('should return a not found error if the parcelId is invalid, STATUS [NOT_FOUND]', done => {
      chai
        .request(server)
        .put(`${url}/89/destination`)
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ destination: 'Kabgayi' })
        .then(res => {
          expect(res).to.have.status(NOT_FOUND);
          expect(res.body)
            .to.be.an('object')
            .haveOwnProperty('message')
            .to.be.a('string')
            .includes('No such parcel found');
          return done();
        })
        .catch(err => done(err));
    });
  });

  describe('Administrator activities for parcels orders', () => {
    const { email, password } = admins[0];
    let adminToken;
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
    describe('/PUT change the status of a parcel delivery order', () => {
      it('should return an updated parcel object, STATUS [CREATED]', done => {
        // console.log('ADMIN TOKEN:', adminToken);
        chai
          .request(server)
          .put(`${url}/2/status`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ status: 'transit' })
          .then(res => {
            expect(res).to.have.status(CREATED);
            expect(res.body)
              .to.haveOwnProperty('message')
              .be.an('string')
              .includes('Successful');
            expect(res.body)
              .to.be.an('object')
              .haveOwnProperty('parcel')
              .be.an('object')
              .haveOwnProperty('status')
              .equals('transit');
            return done();
          })
          .catch(err => done(err));
      });
      it('should return an error if no new status provided, STATUS [BAD_REQUEST]', done => {
        chai
          .request(server)
          .put(`${url}/2/status`)
          .set('Authorization', `Bearer ${adminToken}`)
          .then(res => {
            expect(res).to.have.status(BAD_REQUEST);
            expect(res.body)
              .to.be.an('object')
              .haveOwnProperty('message')
              .to.be.a('string')
              .includes('Provide the new value(s)');
            return done();
          })
          .catch(err => done(err));
      });
      it('should return an error if the user access level is not administrator, STATUS [FORBIDDEN]', done => {
        chai
          .request(server)
          .put(`${url}/2/status`)
          .set('Authorization', `Bearer ${clientToken}`)
          .send({ status: 'transit' })
          .then(res => {
            expect(res).to.have.status(FORBIDDEN);
            expect(res.body)
              .to.be.an('object')
              .haveOwnProperty('message')
              .to.be.a('string')
              .includes("Can't perform this task");
            return done();
          })
          .catch(err => done(err));
      });
    });

    describe('/PUT change the presentLocation of a parcel delivery order', () => {
      it('should return an updated parcel object, STATUS [CREATED]', done => {
        chai
          .request(server)
          .put(`${url}/2/presentLocation`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ present_location: 'Kimisagara' })
          .then(res => {
            expect(res).to.have.status(CREATED);
            expect(res.body)
              .to.haveOwnProperty('message')
              .be.an('string')
              .includes('Successful');
            expect(res.body)
              .to.be.an('object')
              .haveOwnProperty('parcel')
              .be.an('object')
              .haveOwnProperty('present_location')
              .equals('Kimisagara');
            return done();
          })
          .catch(err => done(err));
      });
      it('should return an error if no presentLocation provided, STATUS [BAD_REQUEST]', done => {
        chai
          .request(server)
          .put(`${url}/2/presentLocation`)
          .set('Authorization', `Bearer ${adminToken}`)
          .then(res => {
            expect(res).to.have.status(BAD_REQUEST);
            expect(res.body)
              .to.be.an('object')
              .haveOwnProperty('message')
              .to.be.a('string')
              .includes('Provide the new value(s)');
            return done();
          })
          .catch(err => done(err));
      });
      it('should return an error if the user access level is not administrator, STATUS [FORBIDDEN]', done => {
        chai
          .request(server)
          .put(`${url}/2/presentLocation`)
          .set('Authorization', `Bearer ${clientToken}`)
          .send({ status: 'transit' })
          .then(res => {
            expect(res).to.have.status(FORBIDDEN);
            expect(res.body)
              .to.be.an('object')
              .haveOwnProperty('message')
              .to.be.a('string')
              .includes("Can't perform this task");
            return done();
          })
          .catch(err => done(err));
      });
    });
  });
});
