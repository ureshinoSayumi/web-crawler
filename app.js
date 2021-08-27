const request = require('request');
const cheerio = require('cheerio');
var options = { 
  method: 'GET',
  url: 'https://www.ptt.cc/bbs/C_Chat/index.html',
  qs: { search: '爬蟲', tab: 'question' } 
};
let allTitle= []


// 傳統Promise，處理非同步，1. 先建立 Promise function
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
    request(url, function (error, response, body) {
      if (error) throw new Error(error);
      
      const $ = cheerio.load(body)
      // $('.r-ent .title').html()
      // console.log($('.r-ent .title').html())
      $('.r-ent .title').each(function(i) {
        allTitle[i] = { href: '', title: '', value: '' }
        allTitle[i].href = 'https://www.ptt.cc/' + $(this).html().trim().substring(10, 44)
        allTitle[i].title = $(this).text().trim()
        
        resolve(allTitle)
      })
    })
  });
}
// 抓內文
function getValue (obj) {
  return new Promise((resolve, reject) => {
    request(obj.href, function (error, response, body) {
      if (error) throw new Error(error);
      const $ = cheerio.load(body)
      obj.value = $('#main-content').text()
      resolve(allTitle)
    })
  })
}

// 2. 再使用 .then .catch 取得成功或失敗
// getTitle('https://www.ptt.cc/bbs/Soft_Job/index.html')
//   .then((res) => {
    
//   })
//   .catch((res) => {
//     console.error(res)
//   })
// getValue('https://www.ptt.cc/bbs/Soft_Job/M.1629962304.A.B23.html')
//   .then((res2) => {
//   })
// 傳統Promise，處理非同步 




// 3. 或是使用 Async / Await 語法
// await 是屬於一元運算子，它會直接回傳後方表達式的值；但如果是 Promise 時則會 “等待” resovle 的結果並回傳。
// 所以不需要像上面 2. 一樣使用.then
async function asyncFn() {
  let promise = []
  const data1 = await getTitle('https://www.ptt.cc/bbs/Salary/index.html'); // 順序1 先執行

  allTitle.forEach((item) => { 
    promise.push(getValue(item))
  })
  await Promise.all(promise) // Promise.all 順序2 
    // .then(() => {
    //   console.log(allTitle)
    // })
  // const data2 = await getValue('https://www.ptt.cc/bbs/Soft_Job/M.1629962304.A.B23.html');
  console.log(allTitle); // 1 "2, 成功"
}
// asyncFn()
getPage('https://www.ptt.cc/bbs/Salary/index.html')
// 流程 1.先爬標題跟網址 2.再使用該網址爬內文


// https://github.com/cheeriojs/cheerio/wiki/Chinese-README
// https://larrylu.blog/nodejs-request-cheerio-weather-414e33f45c7d
// https://ithelp.ithome.com.tw/users/20107159/ironman/1325