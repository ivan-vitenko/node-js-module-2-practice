const express = require('express');
const { query, validationResult } = require('express-validator');
const got = require('got');
const router = express.Router();
require('dotenv').config();

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// });

const validator = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  next();
};

// define the home page route
router.get(
  '/',
  [query('lat').isNumeric(), query('lon').isNumeric()],
  validator,
  async (req, res, next) => {
    const { lat, lon } = req.query;
    const apiKey = process.env.API_KEY;

    try {
      const response = await got(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          searchParams: {
            lat,
            lon,
            appid: apiKey,
          },
        },
      );

      const { weather, wind, name } = JSON.parse(response.body);

      res.json({ weather, wind, name });
      //
    } catch (e) {
      next(e);
    }
  },
);

// define the about route
// router.get('/about', function (req, res) {
//   res.send('About birds');
// });

module.exports = router;
