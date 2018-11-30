import routes from '../routes';

export default server => {
  /** ********* Headers configuration *********************************** */
  server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin,X-Requested-With,Content-Type,Accept,Authorization'
    );
    res.header('Access-Control-Expose-Header', 'X-Total-Count');
    next();
  });

  /** ********* RESTful APIs' endpoints ********************************** */

  server.use('/api/v1', routes);

  /** ********* Error handling ******************************************* */

  server.use((req, res) => res.status(404).json({
    message: `invalid url: "${req.url}"`
  }));
};

/** ****************** END *********************************************** */
