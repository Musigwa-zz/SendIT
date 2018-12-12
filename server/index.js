import express from 'express';
import morgan from 'morgan';
import config from 'config';
import startupDebugger from 'debug';
import middleware from './middlewares';

const debug = startupDebugger('sendit:start');
const app = express();

if (!config.has('JWT_KEY') || !config.has('DB_URL')) {
  console.error('Make sure the (JWT_KEY, and DB_URL) are set!');
  process.exit(1);
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (app.get('env') === 'development') app.use(morgan('dev'));

middleware(app);
const server = app.listen(config.get('PORT'), () => {
  // debug(`node-env: ${process.env.NODE_ENV}`);
  // debug(`sendit_jwt: ${config.get('JWT_KEY')}`);
  // debug(`debug: ${config.get('DEBUGGER')}`);
  debug(`server listening on port: ${config.get('PORT')}`);
});

export default server;
