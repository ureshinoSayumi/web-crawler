const request = require('request');
const cheerio = require('cheerio');

const j = request.jar();
const cookie = request.cookie('over18=1');
const url = 'https://www.ptt.cc/bbs/Gossiping/index39274.html';
j.setCookie(cookie, url);
const fs = require('fs')

// request.cookie('over18=1')

let allTitle= []
// 抓頁數
function getPage (url) {
  return new Promise((resolve, reject) => {
    request(url, function (error, response, body) {
      if (error) throw new Error(error);
      const $ = cheerio.load(body)
      console.log($('.btn-group-paging').html().trim())


      resolve(allTitle)
    })
  })
}
// 抓標題跟網址
function getTitle(url) {
  return new Promise((resolve, reject)=> {
    request({url: url, jar: j}, function (error, response, body) {
      if (error) throw new Error(error);
      
      const $ = cheerio.load(body)
      $('.r-ent .title').each(function(i) {
        allTitle[i] = { href: '', title: '', value: '', push: [] }
        let href = $(this).html().trim()
        let src
        // 抓網址
        if (href.match(/(?<=href=\").+?(?=\")|(?<=href=\').+?(?=\')/g) == null) {
          src = null
          allTitle[i].href = null
        } else {
          src = href.match(/(?<=href=\").+?(?=\")|(?<=href=\').+?(?=\')/g)[0]
          allTitle[i].href = `https://www.ptt.cc${src}`
        }
        // 抓標題
        allTitle[i].title = $(this).text().trim()
        resolve(allTitle)
      })
    })
  });
}
// 抓內文
function getValue (obj) {
  return new Promise((resolve, reject) => {
    request({url: obj.href, jar: j}, function (error, response, body) {
      if (error) throw new Error(error);
      const $ = cheerio.load(body)
      
      // 抓推文
       $('.push-tag').each(function(i) { 
        obj.push[i] = { pushTag: null, pushUser: null, pushContent: null, pushDate: null }
        obj.push[i].pushTag = $(this).text()
        // obj.push[i].pushTag = $(this).text()
      })
      // 抓用戶名
      $('.push-userid').each(function(i) { // 用迴圈抓有重複class的推文
        obj.push[i].pushUser = $(this).text()
      })
      // 抓推文日期
      $('.push-content').each(function(i) { // 用迴圈抓有重複class的推文
        obj.push[i].pushContent = $(this).text()
      })
      // 抓推文內容
      $('.push-ipdatetime').each(function(i) { // 用迴圈抓有重複class的推文
        obj.push[i].pushDate = $(this).text()
      })
      
      // 文章資訊
      let article = {
        author: $('div.article-metaline:nth-child(1) > span:nth-child(2)').text(),
        title: $('div.article-metaline:nth-child(3) > span:nth-child(2)').text(),
        publishedDate: $('div.article-metaline:nth-child(4) > span:nth-child(2)').text(),
        topic: $('.article-metaline-right > span:nth-child(2)').text(),
        content: $('#main-content').children()
          .remove('.push').remove('.article-metaline').remove('.article-metaline-right').end().text(),
        userMessage:$('.f2').text(),
      };
      obj.value = article

      resolve(allTitle)
    })
  })
}


// 3. 或是使用 Async / Await 語法
async function asyncFn() {
  let promise = []
  await getTitle(url); // 順序1 先抓標題、網址

  // allTitle.forEach((item) => { 
  //   if (item.href !== null) {
  //     promise.push(getValue(item))
  //   }
  // })
  await Promise.all(promise) // 順序2 用網址資訊抓內文

  // allTitle.forEach((item) => {
    // if (item.value !== null) {
      // console.log(item.value)
      // console.log('-------------------------------------------------------------------------')
      // var text = item.value.replace(/<span.*?>/g,"");
      // text = text.replace(/<a.*?>/g,"");
      // text = text.replace(/<div.*?>/g,"");
      // var text = item.value.replace(/<[^<>]+>/g,"");;
      // item.value = text
      // console.log(item.push);
    // }
  // })
    console.log(allTitle); // 1 "2, 成功"
    return allTitle
    // let str = JSON.stringify(allTitle,"","\t")
    // fs.writeFile('data.json',str,function(err){
    //  if (err) {res.status(500).send('Server is error...')}
    // })
}
asyncFn()
// getPage('https://www.ptt.cc/bbs/Salary/index.html')
// 流程 1.先爬標題跟網址 2.再使用該網址爬內文

module.exports = asyncFn;
// https://github.com/cheeriojs/cheerio/wiki/Chinese-README
// https://larrylu.blog/nodejs-request-cheerio-weather-414e33f45c7d
// https://ithelp.ithome.com.tw/users/20107159/ironman/1325