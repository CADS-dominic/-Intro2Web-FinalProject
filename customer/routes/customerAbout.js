var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

  const info = [
      {
          name: 'Tran Nguyen Trung',
          age: '21',
          phone: '0915871099',
          avt: "../public/images/avatar.jpg",
      },

      {
        name: 'Vu Duc Quang Huy',
        age: '21',
        phone: '0999999999',
        avt: "../public/images/avatar.jpg",
      },

      {
        name: 'Tran Bao Phu',
        age: '21',
        phone: '0973572130',
        avt: "../public/images/avatar.jpg",
    }
  ]

  const init = {
    info,
  }

  res.render('customerAbout.ejs', init);

});

module.exports = router;
