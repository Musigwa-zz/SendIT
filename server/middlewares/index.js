import routes from '../routes';

export default app => {
  /** ********* Headers configuration *********************************** */
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
      );
      return res.status(200).json({});
    }
    next();
  });

  /** ********* RESTful APIs' endpoints ********************************** */

  app.use('/api/v1', routes);

  /** ********* Error handling ******************************************* */

  app.use((req, res) => res.status(404).json({
    message: `invalid url: "${req.url}"`
  }));
};

/** ****************** END *********************************************** */
