import Database from '..';
import migrationDebugger from 'debug';
import createFunc from './createFunc';
import createTrig from './createTrig';
import createTables from './createTables';
import createAdmin from './createAdmin';

const debug = migrationDebugger('sendit:migrate');

(() => {
  const db = new Database(null, 'users');
  createTables(db, debug);
  setTimeout(() => createFunc(db, debug), 1000);
  setTimeout(() => createTrig(db, debug), 1000);
  setTimeout(() => createAdmin(db, debug), 1000);
})();
