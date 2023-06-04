require("dotenv").config();
const cors = require("cors");
const sqlite3 = require("sqlite3");
var bodyParser = require("body-parser");
const uuid = require("uuid");
const path = require("path");
const multer = require("multer");

const verifyToken = require("./middleware/auth");
const bcrypt = require("bcrypt");
const http = require("http");
let formidable = require("formidable");
let fs = require("fs");

// const multer = require("multer");
// app.use(multer().none());
var cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());
const upload = multer();

// Socket.IO
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const db = new sqlite3.Database("FedFreight.db");

app.post("/register", (req, res) => {
  const id = uuid.v4();
  const userName = req.body.username;
  const mail = req.body.email;
  const password = req.body.password;
  const role = req.body.role;
  let type = "0";
  if (role == "customer") {
    type = "2";
  } else {
    type = "1";
  }
  if (
    type === "1" &&
    userName != undefined &&
    mail != undefined &&
    password != undefined
  ) {
    db.get(
      "SELECT * FROM Contributor WHERE mail = ?",
      mail,
      async (err, user) => {
        if (user) {
          res.json({ register: false });
        } else {
          const password = req.body.password;
          const salt = await bcrypt.genSalt(10);
          const hash_password = await bcrypt.hash(password, salt);

          db.run(
            "INSERT INTO Contributor(id,userName,phone, mail,address, password) VALUES(?,?,? ,?,?,?)",
            [id, userName, null, mail, null, hash_password],
            function (err) {
              if (err) {
                return console.log(err.message);
              }
            }
          );
          res.json({ register: true });
        }
      }
    );
  } else if (
    type === "2" &&
    userName != undefined &&
    mail != undefined &&
    password != undefined
  ) {
    db.get("SELECT * FROM Customer WHERE mail = ?", mail, async (err, user) => {
      if (user) {
        res.json({ register: false });
      } else {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(password, salt);
        db.run(
          "INSERT INTO Customer(id,userName,phone, mail,address, password) VALUES(?,? ,? ,?,?,?)",
          [id, userName, null, mail, null, hash_password],
          function (err) {
            if (err) {
              return console.log(err.message);
            }
          }
        );
        res.json({ register: true });
      }
    });
  }
});
app.post("/login", async (req, res) => {
  const mail = req.body.email;
  const password = req.body.password;
  if (mail != undefined && password != undefined) {
    db.get(
      `SELECT id,mail, password, userName,userType
     FROM (
       SELECT id,mail, password, userName, 'customer' AS userType
       FROM Customer
       UNION
       SELECT id,mail, password, userName, 'contributor' AS userType
       FROM Contributor
     ) AS users
     WHERE mail = ?`,
      mail,
      async (err, user) => {
        if (err) {
          return console.error(err.message);
        }
        if (!user) {
          res.json({ login: false });
        } else {
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            const token = jwt.sign(
              {
                id: user.id,
                role: user.userType,
              },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "1h",
              }
            );
            res.json({ login: true, token });
          } else {
            res.json({ login: false });
          }
        }
      }
    );
  } else {
    res.json({ readyLogin: false });
  }
});

app.get("/contributorList", (req, res) => {
  db.all("SELECT * FROM Contributor ", async (err, user) => {
    if (err) {
      return console.error(err.message);
    }
    if (!user) {
      res.send({ getContributor: false });
    } else {
      res.json({
        user,
      });
    }
  });
});

app.get("/user/:id", (req, res) => {
  const idUser = req.params.id;

  if (idUser != undefined) {
    db.get(
      `SELECT id,userName,fullName,phone,birthday,mail,address,avatarUrl,userType
      FROM (
        SELECT id,userName,fullName,phone,birthday,mail,address,avatarUrl, 'customer' AS userType
        FROM Customer
        UNION
        SELECT id,userName,fullName,phone,birthday,mail,address,avatarUrl, 'contributor' AS userType
        FROM Contributor
      ) AS users
      WHERE id = ?`,
      idUser,
      async (err, user) => {
        if (err) {
          return console.error(err.message);
        }
        if (!user) {
          res.send({ getUserName: false });
        } else {
          res.send({
            userName: user.userName,
            user: user,
            avatarUrl: user.avatarUrl,
          });
        }
      }
    );
  } else {
    res.send({ getUserName: false });
  }
});

app.post("/uploadAvatar", verifyToken, (req, res) => {
  const { filename, mimetype, size } = req.file;

  db.run(
    `INSERT INTO avatars(filename, mimetype, size) VALUES (?, ?, ?)`,
    [filename, mimetype, size],
    function (err) {
      if (err) {
        res.status(500).send("Error saving avatar to database.");
      } else {
        res.status(200).send("Avatar saved to database.");
      }
    }
  );
});
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  const result = users.find((user) => user.userId === userId);
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when connect
  console.log("New client connected " + socket.id);
  // io.emit("Welcome", "hello this is socket server")

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    const IdUser = user?.socketId;

    io.to(IdUser).emit("getMessage", {
      senderId,
      text,
    });
    console.log(text);
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

// # start Conversations
//create conversation
app.post("/conversation", (req, res) => {
  const senderId = req.body.senderId;
  const receiverId = req.body.receiverId;

  // Check if the data already exists in the database
  db.get(
    "SELECT * FROM Conversations WHERE senderId = ? AND receiverId = ?",
    [senderId, receiverId],
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error checking if data exists in database");
        return;
      }

      // If data exists, send a 409 Conflict response
      if (row) {
        res.status(409).send("Data already exists in database");
        return;
      }

      // If data doesn't exist, insert it into the database
      const sql = `INSERT INTO Conversations (senderId, receiverId) VALUES (?, ?)`;
      const values = [senderId, receiverId];
      db.run(sql, values, function (err) {
        if (err) {
          res.status(500).json(err);
        } else {
          const conversation = {
            id: this.lastID,
            senderId: senderId,
            receiverId: receiverId,
          };
          res.status(200).json(conversation);
        }
      });
    }
  );
});

//Get conversation
app.get("/conversation/:userId", (req, res) => {
  console.log(req.params.userId + " userId");
  const userId = req.params.userId;
  const sql =
    "SELECT * FROM Conversations WHERE senderId = ? OR receiverId = ?";
  const values = [userId, userId];
  db.all(sql, values, (err, rows) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(rows);
    }
  });
});
// # End conversation

// # start Messages

// add
app.post("/message", (req, res) => {
  const { conversationId, sender, text } = req.body;
  const sql =
    "INSERT INTO Messages (conversationId, sender, text) VALUES (?, ?, ?)";
  const values = [conversationId, sender, text];

  db.run(sql, values, async (err) => {
    if (err) {
      res.status(500).json(err);
    } else {
      const message = {
        conversationId,
        sender,
        text,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(message);
    }
  });
});

app.post("/image", (req, res) => {
  const { originalname, mimetype, size, conversationId, sender } = req.file;
  const filePath = req.file.path;

  res
    .status(200)
    .json({ message: "File uploaded successfully", file: req.file });
});

// get
app.get("/message/:conversationId", async (req, res) => {
  const sql = `SELECT * FROM Messages WHERE conversationId = ? ORDER BY timestamp ASC`;
  const values = [req.params.conversationId];

  db.all(sql, values, (err, messages) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(messages);
    }
  });
});
// # End Messages

// Update Avatar
// Serve the public folder as a static directory
app.post("/updateInfo", verifyToken, (req, res) => {
  let form = new formidable.IncomingForm();

  // Parse the form data
  form.parse(req, function (error, fields, file) {
    if (error) {
      console.error(error);
      res.status(500).send("Error processing form data");
      return;
    }

    let userId = fields.userId;
    const fullName = fields.fullName;
    const phone = fields.phone;
    const birthday = fields.birthday;
    let newFilename = null;
    let url = null;

    // Check if a file was uploaded
    if (Object.keys(file).length !== 0 && file.constructor === Object) {
      let fileExtension = path.extname(file.avatar.originalFilename);
      newFilename = userId + fileExtension;
      let newpath = path.join(__dirname, "public", "avatarUser", newFilename);
      // Move the uploaded file from the temporary directory to the public folder
      fs.rename(file.avatar.filepath, newpath, function (err) {
        if (err) {
          console.error(err);
          res.status(500).send("Error saving file");
          return;
        }
        url = `http://${req.hostname}:8000/avatarUser/${newFilename}`;
        updateUserInfo();
      });
    } else {
      db.run(
        `UPDATE ${fields.role} SET fullName = ?, phone = ?, birthday = ? WHERE id = ?`,
        [ fullName, phone, birthday, fields.userId],
        function (err) {
          if (err) {
            console.log(err);
            return res.status(500).json("Failed to update user avatar.");
          }
          let response = { fullName: fullName, phone: phone };
          if (url) {
            response.url = url;
          }
          return res.status(200).json(response);
        }
      );
    }

    function updateUserInfo() {
      // Update the user info in the database
      db.run(
        `UPDATE ${fields.role} SET avatarUrl = ?, fullName = ?, phone = ?, birthday = ? WHERE id = ?`,
        [newFilename, fullName, phone, birthday, fields.userId],
        function (err) {
          if (err) {
            console.log(err);
            return res.status(500).json("Failed to update user avatar.");
          }
          let response = { fullName: fullName, phone: phone };
          if (url) {
            response.url = url;
          }
          return res.status(200).json(response);
        }
      );
    }
  });
});


// Create Order
app.post("/orderInitial", (req, res) => {
  const customerId = req.body.customerId;
  const contributorId = req.body.contributorId;
  const time = req.body.time
  let userName

  try {
    const sql = `SELECT userName FROM Customer WHERE id = ?`
    db.all(sql, customerId, (err, rows) => {
      if (err) {
        console.log(err);
        return err
      } else {
        userName = rows[0]?.userName
        console.log(userName);
      }
    })
  } catch (error) {
    console.error(`Failed to search for user name by ID: ${error}`);
    throw error;
  }

  // Check if the data already exists in the database
  db.get(
    "SELECT * FROM Orders WHERE customerId = ? AND contributorId = ?",
    [customerId, contributorId],
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error checking if data exists in database");
        return;
      }

      // If data exists, send a 409 Conflict response
      if (row) {
        res.status(409).send("Data already exists in database");
        return;
      }

      // If data doesn't exist, insert it into the database
      const sql = `INSERT INTO Orders (customerId, contributorId,customerName,time) VALUES (?, ?,?,?)`;
      const values = [customerId, contributorId,userName,time];
      db.run(sql, values, function (err) {
        if (err) {
          res.status(500).json(err);
        } else {
          const productInitial = {
            id: this.lastID,
            customerId: customerId,
            contributorId: contributorId,
          };
          res.status(200).json(productInitial);
        }
      });
    }
  );
});

//Get Order
app.get("/OrderInitial/:userId", (req, res) => {
  console.log(req.params.userId + " userId");
  const userId = req.params.userId;

  const sql = "SELECT * FROM Orders WHERE customerId = ? OR contributorId = ?";
  const values = [userId, userId];
  db.all(sql, values, (err, rows) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(rows);
    }
  });
});

// Save product information
app.post("/saveProductInfo", (req, res) => {
  const {
    senderNameVN,
    senderNameHQ,
    phoneVN,
    phoneHQ,
    senderAddress,
    receiverAddress,
    shipBranch,
    note,
    productDetail,
    orderId,
  } = req.body;
  console.log(req.body);
  const productDetailJson = JSON.stringify(productDetail);

  // Check if the data already exists in the database
  db.get(
    "SELECT * FROM ProductInfo WHERE orderId = ?",
    [orderId],
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error checking if data exists in database");
        return;
      }

      // If data exists, send a 409 Conflict response
      if (row) {
        res.status(409).send("Data already exists in database");
        return;
      }

      // If data doesn't exist, insert it into the database
      const sql = `INSERT INTO ProductInfo(senderNameVN, receiverNameHQ,phoneVN,phoneHQ,senderAddress,receiverAddress,shipBranch,product,orderId,note) VALUES (?,?,?,?,?,?,?,?,?,?)`;
      const values = [
        senderNameVN,
        senderNameHQ,
        phoneVN,
        phoneHQ,
        senderAddress,
        receiverAddress,
        shipBranch,
        productDetailJson,
        orderId,
        note,
      ];
      db.run(sql, values, function (err) {
        if (err) {
          console.error(err);
          res.status(500).json(err);
        } else {
          res.status(200).json("Saved");
        }
      });
    }
  );
});

app.get('/getOrder',(req,res)=>{

  db.all('SELECT * FROM Orders', (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching orders from database');
    }
    return res.status(200).json(rows);
  })
})

app.get('/getOrderDetail/:orderId',(req,res)=>{
  const orderId = req.params.orderId;
  db.all(
    "SELECT * FROM ProductInfo WHERE orderId = ?",
    [orderId],
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error checking if data exists in database");
        return;
      }
      if(row) {
        res.status(200).json(row);
        return;
      }

      
    }
  );
})



server.listen(8000, () => {
  console.log("Server running on 8000");
});
