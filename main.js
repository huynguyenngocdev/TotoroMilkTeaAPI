const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const atob= require("atob");
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)
server.use(jsonServer.bodyParser)
// Add custom routes before JSON Server router
server.get('/api/echo', (req, res) => {
  return res.json({a: 1})
})

const host= __dirname
// function dataURLtoFile(dataurl, filename) {
 
//   var arr = dataurl.split(','),
//       mime = arr[0].match(/:(.*?);/)[1],
//       bstr = atob(arr[1]), 
//       n = bstr.length, 
//       u8arr = new Uint8Array(n);
      
//   while(n--){
//       u8arr[n] = bstr.charCodeAt(n);
//   }
  
//   return new File([u8arr], filename, {type:mime});
// }

//Usage example:
// var file = dataURLtoFile('data:text/plain;base64,aGVsbG8gd29ybGQ=','hello.txt');
// console.log(file);

server.put('/api/ads',(req,res)=>{
  const data=req.body['img']
  const fileType=data.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0].split('/')[1]
  var endFile=""
  if( fileType=="jpeg"){
    endFile="jpg"
  }
  const date=new Date()
  const filename=date.getTime()+"."+endFile
  require("fs").writeFile(filename, data.split(',')[1], 'base64', function(err) {
    console.log(err);
  });
  res.jsonp({img: `${host} \ ${filename}`})
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
// server.use((req, res, next) => {
//   if (req.method === 'POST') {
//     req.body.createdAt = Date.now(),
//     req.body.updatedAt = Date.now()
//   }
//   // Continue to JSON Server router
//   next()
// })

// router.render = (req, res) => {
//     const header = res.getHeaders()
//     const totalCountHeader = header['x-total-count']
//     if(req.method === 'GET' && totalCountHeader){
//         const queryParams = queryString.parse(req._parsedUrl.query)
//         const result={
//             data: res.locals.data,
//             pagination: {
//                 _page: Number.parseInt(queryParams._page) || 1,
//                 _limit: Number.parseInt(queryParams._limit) || 5,
//                 _total: Number.parseInt(totalCountHeader)
//             }
//         }
//     }
//     res.jsonp({
//       body: res.locals.data
//     })
//   }


// set port
const PORT = process.env.PORT || 4000
// Use default router
server.use('/api',router)
// Start server
server.listen(PORT, () => {
  console.log("TotoroMilkTea website's JSON Server is running")
})