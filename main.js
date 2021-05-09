const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const atob = require("atob");
const { send } = require("process");
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Add custom routes before JSON Server router

const host = __dirname;
// 'http://totoromilkteaapi.herokuapp.com/';

server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === "PUT" && req.path === "/api/ads") {
    // require("fs").unlink(

    // );
    const date = new Date();
    let updateAt = date.getTime();

    const data = req.body;
    const image = data["image"];
    const fileType = image.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0].split("/")[1];
    var endFile = "";
    if (fileType == "jpeg") {
      endFile = "jpg";
    } else if (fileType == "png") {
      endFile = "png";
    }

    const filename = date.getTime() + "." + endFile;
    // create new image ads
    require("fs").writeFile(
      `image_ads/${filename}`,
      image.split(",")[1],
      "base64",
      function (err) {
        console.log(err);
      }
    );
    // delete old image ads
    let files = require("fs").readdirSync(`./image_ads`);

    let file = files.filter((image)=>{
      return image.indexOf(`${data.updateAt}`) >= 0;
    });

    require("fs").unlink(`./image_ads/${file}`, function (err) {
      if (err) throw err;
    });

    data.updateAt = updateAt
    // req.body["oldImage"] = req.body["oldImage"] =  

    data.image = `${host}/image_ads/${filename}`;

    req.body = data;
    res.jsonp(req.body);
  }

  // Continue to JSON Server router
  next();
});

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
const PORT = process.env.PORT || 4000;
// Use default router
server.use("/api", router);
// Start server
server.listen(PORT, () => {
  console.log("TotoroMilkTea website's JSON Server is running");
});
