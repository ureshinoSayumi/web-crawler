const express = require('express')
// const allData = require('./crawler/app')

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')


const mongoose = require('mongoose');
const dotenv = require('dotenv')
const Post = require('./models/postsModel')

const app = express()
dotenv.config({ path: './config.env'})

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
)
console.log(process.env.PORT)

// // 連接資料庫
mongoose.connect(DB)
    .then(()=>{
        console.log('資料庫連線成功')
    })
    .catch((error)=>{
        console.log(error);
    });
// app.use('/user', user)


app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));




app.get('/ptt', async (req, res) => {
      // let myName = req.params.name
      // let limit = req.query
      // console.log(myName, limit)
      // res.send('test')
      // allData()
    //   res.status(200).json({
    //     'status': 'false',
    //     'message': 'sss'
    // })
    const newPost = await Post.find()
    console.log(newPost)
    res.status(200).json({
        'status': 'true',
        'message': newPost
    })
})
app.post('/ptt', async (req, res) => {
    // let myName = req.params.name
    // let limit = req.query
    // console.log(myName, limit)
    // res.send('test')
    // allData()
  //   res.status(200).json({
  //     'status': 'false',
  //     'message': 'sss'
  // })
  console.log(req.body)
  try {
    const newPost = await Post.create(req.body)
    console.log(newPost)
    res.status(200).json({
        'status': 'true',
        'message': newPost
    })
  } catch (error) {
      console.log(error)
      res.status(200).json({
      'status': 'false',
          'message': 'sss'
      })
  }
})

const port = process.env.PORT || 3005
app.listen(port)
console.log('http://127.0.0.1:3005/');