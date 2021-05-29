const fs = require("fs");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const atob = require("atob");
const host = __dirname;
const SECRET = "ngochuy";

const db = require("./db.json");

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get("/api", (req, res) => {
  res.send("Welcome to API of Totoro Milk Tea shop");
});

//authorization
server.post("/api/auth", (req, res) => {
  //admin account infor
  const user = {
    name: "Nguyen Ngoc Huy",
    email: "huy.nguyen22@student.passerellesnumeriques.org",
  };

  if (req.body.username == "admin" && req.body.password == "admin") {
    const token = jwt.sign(user, SECRET, {
      algorithm: "HS384",
      expiresIn: "3h",
    });
    res.jsonp({ access_token: token });
  } else {
    res.json("Không thể truy cập");
  }
});

//check authorization
server.use((req, res, next) => {
  //get auth header value
  //check if bearer is undefined
  if (
    req.headers &&
    req.headers.authorization &&
    String(req.headers.authorization.split(" ")[0])
  ) {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, SECRET, (err, authData) => {
      if (err) {
        return res.send({ message: "Token invalid" });
      } else {
        return next();
      }
    });
  } else {
    return res.send({
      message: "Unauthorized",
    });
  }
});

//get image ads
server.get("/api/get_image/*", (req, res) => {
  //get files list
  const files = fs.readdirSync(`./${req.path.split("/")[3]}`);

  //get file relative path of image
  const filename = req.path.split("/")[3] + "/" + req.path.split("/")[4];

  //find image and return a base64 string
  if (files.findIndex((file) => file == filename.split("/")[1]) >= 0) {
    fs.readFile(`./${filename}`, function (err, data) {
      if (err) throw err; // Fail if the file can't be read.
      let stingBase64 = Buffer.from(data).toString("base64");
      res.jsonp({
        image: `data:image/jpeg;base64,${stingBase64}`,
      });
    });
  } else res.json({ image: "Not Found" });
});

// put ads
server.use((req, res, next) => {
  if (req.method === "PUT" && req.path.indexOf("/api/ads") >= 0) {
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

      data.image = `image_ads/${filename}`;
      req.body = data;
    }

    res.jsonp(req.body);
  }

  // Continue to JSON Server router
  next();
});

// post product
server.use((req, res, next) => {
  if (req.method === "POST" && req.path === "/api/products") {
    const date = new Date();
    let updateAt = date.getTime();

    const data = req.body;
    const image = data["image"];
    // process to get extension of file
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
      // create new image product
      fs.writeFile(
        `image_products/${filename}`,
        image.split(",")[1],
        "base64",
        function (err) {
          console.log(err);
        }
      );

      data.updateAt = updateAt;

      data.image = `image_products/${filename}`;
      req.body = data;
    }
  }
  // Continue to JSON Server router
  next();
});

// put product
server.use((req, res, next) => {
  if (req.method === "PUT" && req.path.indexOf("/api/products/") >= 0) {
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
      } else {
        res.send("Error!");
      }

      const filename = date.getTime() + "." + endFile;
      // create new image products
      fs.writeFile(
        `image_products/${filename}`,
        image.split(",")[1],
        "base64",
        function (err) {
          console.log(err);
        }
      );

      // delete old image products
      let files = fs.readdirSync(`./image_products`);

      let file = files.filter((image) => {
        return image.indexOf(`${data.updateAt}`) >= 0;
      });

      fs.unlink(`./image_products/${file}`, function (err) {
        if (err) throw err;
      });

      data.updateAt = updateAt;

      data.image = `image_products/${filename}`;
      req.body = data;
    }
    res.jsonp(req.body);
  }
  next();
});

// delete image product
server.post("/api/delete_image/*", (req, res) => {
  // get folder
  const folder = req.path.split("/")[3];
  //get all name of image of image_products
  const files = fs.readdirSync(`./${folder}`);
  // get file name
  const filename = req.path.split("/")[4];

  if (files.findIndex((file) => file == filename) >= 0) {
    fs.unlink(`./${folder}/${filename}`, function (err) {
      if (err) throw err;
    });
    res.send("Delete image success");
  } else res.send("Not Found Image In DB");
});

// set port
const PORT = process.env.PORT || 4000;
// Use default router
server.use("/api", router);
// Start server
server.listen(PORT, () => {
  console.log("TotoroMilkTea website's JSON Server is running");
});
