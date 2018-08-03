var express = require('express');
var router = express.Router();
var fs = require('fs');
var csrf = require('csurf');
var axios = require('axios');
// var csrfProtection = csrf();
// router.use(csrfProtection);


/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'VTS | Home' });
// });

/* GET edit page. */
router.get('/manage', function (req, res, next) {
  res.render('location', { title: 'VTS | Manage Volunteers' });
});

router.get('/stats', function (req, res, next) {
  res.render('stats', { title: 'VTS | Stats' });
});

module.exports = router;