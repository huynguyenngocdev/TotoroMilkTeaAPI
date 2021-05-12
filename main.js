const fs = require("fs");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const atob = require("atob");
const host = __dirname;
const SECRET = "ngochuy";
// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
server.use(jsonServer.bodyParser);

// server.post("/api/auth", (req, res, next) => {
//   //admin account infor
//   const user = {
//     name: "Nguyen Ngoc Huy",
//     email: "huy.nguyen22@student.passerellesnumeriques.org",
//   };

//   if (req.body.username == "admin" && req.body.password == "admin") {
//     const token = jwt.sign(user, SECRET, {
//       algorithm: "HS256",
//       expiresIn: "3h",
//     });
//     res.json({ access_token: token });
//     next();
//   } else {
//     res.json("Đăng nhập thất bại");
//   }
// });

// server.use((req, res, next) => {
//   if (
//     req.method === "PUT" ||
//     req.method === "POST" ||
//     req.method === "DELETE"
//   ) {
//     //get auth header value
//     //check if bearer is undefined
//     if (
//       req.headers &&
//       req.headers.authorization &&
//       String(req.headers.authorization.split(" ")[0])
//     ) {
//       const token = req.headers.authorization.split(" ")[1];

//       jwt.verify(token, SECRET, (err, authData) => {
//         if (err) {
//           return res.status(403).send({ message: "Token invalid" });
//         } else {
//           return next();
//         }
//       });
//     } else {
//       return res.status(403).send({
//         message: "Unauthorized",
//       });
//     }
//   }
// });

// 'http://totoromilkteaapi.herokuapp.com/';

// put ads
server.use((req, res, next) => {
  if (req.method === "PUT" && req.path === "/api/ads") {
    const date = new Date();
    let updateAt = date.getTime();

    const data = req.body;
    const image = data["image"];
    // process to a image file if it is a new image
    if (image.indexOf(".png") < 0 && image.indexOf(".jpg") < 0) {
      const fileType = image
        .match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0]
        .split("/")[1];
      var endFile = "";
      if (fileType == "jpeg") {
        endFile = "jpg";
      } else if (fileType == "png") {
        endFile = "png";
      }

      const filename = date.getTime() + "." + endFile;
      // create new image ads
      fs.writeFile(
        `image_ads/${filename}`,
        image.split(",")[1],
        "base64",
        function (err) {
          console.log(err);
        }
      );
      // delete old image ads
      let files = fs.readdirSync(`./image_ads`);

      let file = files.filter((image) => {
        return image.indexOf(`${data.updateAt}`) >= 0;
      });

      fs.unlink(`./image_ads/${file}`, function (err) {
        if (err) throw err;
      });

      data.updateAt = updateAt;
      // req.body["oldImage"] = req.body["oldImage"] =

      data.image = `${host}/image_ads/${filename}`;
      req.body = data;
    }

    res.jsonp(req.body);
  }

  // Continue to JSON Server router
  next();
});

// put product
// server.use((req, res, next) => {
//   if (req.method === "PUT" && req.path === `/api/products/${req.body.id}`) {
//     const date = new Date();
//     let updateAt = date.getTime();

//     const data = req.body;
//     const image = data["image"];
//     // process to a image file if it is a new image
//     if (image.indexOf(".png") < 0 && image.indexOf(".jpg") < 0) {
//       const fileType = image
//         .match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0]
//         .split("/")[1];
//       var endFile = "";
//       if (fileType == "jpeg") {
//         endFile = "jpg";
//       } else if (fileType == "png") {
//         endFile = "png";
//       }

//       const filename = date.getTime() + "." + endFile;
//       // create new image ads
//       fs.writeFile(
//         `image_ads/${filename}`,
//         image.split(",")[1],
//         "base64",
//         function (err) {
//           console.log(err);
//         }
//       );
//       // delete old image ads
//       let files = fs.readdirSync(`./image_ads`);

//       let file = files.filter((image) => {
//         return image.indexOf(`${data.updateAt}`) >= 0;
//       });

//       fs.unlink(`./image_ads/${file}`, function (err) {
//         if (err) throw err;
//       });

//       data.updateAt = updateAt;
//       // req.body["oldImage"] = req.body["oldImage"] =

//       data.image = `${host}/image_ads/${filename}`;
//       req.body = data;
//     }

//     res.jsonp(req.body);
//   }

//   // Continue to JSON Server router
//   next();
// });

// // post product
// server.use((req, res, next) => {
//   if (req.method === "POST" && req.path === "/api/products") {
//     const date = new Date();
//     let updateAt = date.getTime();

//     const data = req.body;
//     const image = data["image"];
//     // process to a image file if it is a new image
//     if (image.indexOf(".png") < 0 && image.indexOf(".jpg") < 0) {
//       const fileType = image
//         .match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0]
//         .split("/")[1];
//       var endFile = "";
//       if (fileType == "jpeg") {
//         endFile = "jpg";
//       } else if (fileType == "png") {
//         endFile = "png";
//       }

//       const filename = date.getTime() + "." + endFile;
//       // create new image ads
//       fs.writeFile(
//         `image_ads/${filename}`,
//         image.split(",")[1],
//         "base64",
//         function (err) {
//           console.log(err);
//         }
//       );
//       // delete old image ads
//       let files = fs.readdirSync(`./image_ads`);

//       let file = files.filter((image) => {
//         return image.indexOf(`${data.updateAt}`) >= 0;
//       });

//       fs.unlink(`./image_ads/${file}`, function (err) {
//         if (err) throw err;
//       });

//       data.updateAt = updateAt;
//       // req.body["oldImage"] = req.body["oldImage"] =

//       data.image = `${host}/image_ads/${filename}`;
//       req.body = data;
//     }

//     res.jsonp(req.body);
//   }

//   // Continue to JSON Server router
//   next();
// });

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
