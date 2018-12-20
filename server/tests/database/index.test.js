import chai from 'chai';
import User from '../../models/User';
import Parcel from '../../models/Parcel';
import { newUser } from '../testData';

const { expect } = chai;
let userId;

before('save a dummy user for testing', done => {
  User.save(newUser[2])
    .then(user => {
      userId = user.id;
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

describe('Test the database records manipulation functions', () => {
  describe('Test the findByIdAndUpdate function', () => {
    it('should return an error if no record matching the give ID', done => {
      User.findByIdAndUpdate(90)
        .then(() => done(new Error('returned the data rather than an error')))
        .catch(err => {
          expect(err)
            .to.be.an('object')
            .haveOwnProperty('name')
            .includes('QueryError');
          return done();
        });
    });
    it('should return an updated record with the new values', done => {
      User.findByIdAndUpdate(userId, { isadmin: true })
        .then(user => {
          expect(user)
            .to.be.an('object')
            .contain(newUser[2]);
          return done();
        })
        .catch(err => done(err));
    });
  });
  describe('Test the findByIdAndRemove function', () => {
    it('should return an error if no record matching the give ID', done => {
      User.findByIdAndRemove(90)
        .then(() => done(new Error('returned the data rather than an error')))
        .catch(err => {
          expect(err)
            .to.be.an('object')
            .haveOwnProperty('name')
            .includes('QueryError');
          return done();
        });
    });
    it('should delete the record matching the give ID', done => {
      User.findByIdAndRemove(userId)
        .then(user => {
          expect(user)
            .to.be.an('object')
            .contain(newUser[2]);
          return done();
        })
        .catch(err => done(err));
    });
  });
  describe('Test the save and query functions', () => {
    it('should return an error if given an invalid queryStream', done => {
      User.query('DELETE DHKJ FBKJ')
        .then(() => done(new Error('returned the data rather than an error')))
        .catch(err => {
          expect(err)
            .to.be.an('object')
            .haveOwnProperty('name')
            .includes('error');
          return done();
        });
    });
    it('should not save the data with unknown properties', done => {
      User.save({ ...newUser, religion: 'pentecost' })
        .then(() => done(new Error('returned the data rather than an error')))
        .catch(err => {
          expect(err)
            .to.be.an('object')
            .haveOwnProperty('name')
            .includes('error');
          return done();
        });
    });
  });
});
