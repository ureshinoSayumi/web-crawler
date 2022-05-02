var express = require('express');
var router = express.Router();
const asyncFn = require('../crawle/test')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  // res.send('respond with a resource');
  let a = await asyncFn('https://www.ptt.cc/bbs/Gossiping/index38974.html')
  // let a = asyncFn()
  // .then((res) => {
  //   console.log(res)
  // })
  // .catch((err) => {
  //   console.log(err)
  // })
  // console.log(a)
  console.log('asd')
  res.status(200).json({
    "name": 'wir',
    a
  })
});

module.exports = router;
