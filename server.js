const express = require("express"); //interact with html file
const bodyParser = require("body-parser"); //to get data from user
const mongoose = require("mongoose"); //package to connect to db
const hbs = require("express-handlebars"); //used for hbs file soo as to use js componenets for displaying images
const { handlebars } = require("hbs");
// const cookieParser = require("cookie-parser"); //used to store cookies for user sessions
const sessions = require("express-session");
const oneDay = 1000 * 60 * 60 * 24;
// const path = __dirname + "/public/views";

mongoose
  .connect(
    "mongodb+srv://amyth2002:Soorenji%40456@cluster0.bzzlyno.mongodb.net/Hammer?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useCreateIndex:true
    }
  )
  .then(() => {
    console.log("connection sucessfull");
  })
  .catch((e) => {
    console.log(e);
  });
const app = express();
app.set("view engine", "hbs"); //view engine for handlebars page
app.use(express.static(__dirname));
const path = __dirname;
console.log(path);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
var server_port = process.env.YOUR_PORT || process.env.PORT || 1789;
console.log(server_port);

app.use(
  sessions({
    //this the data sent and stored in brower cookie
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});

const TodoSchema = new mongoose.Schema({
  customer_id: {
    type: String,
  },
  desc_id: {
    type: Number,
  },
  description: {
    type: String,
  },
});

var session;
const customerBio = new mongoose.model("customerBio", customerSchema);

const registerDetail = new mongoose.model("project", customerSchema);

const TodoList = new mongoose.model("TodoList", TodoSchema);
module.exports = customerBio;
module.exports = TodoList;
app.listen(server_port, function () {
  console.log("Listening on port %d", server_port);
});
app.get("/", function (req, res) {
  res.render("/index.html");
});

app.post("/register", async function (req, res) {
  try {
    const values = req.body;
    if (!values.email || !values.username || !values.password) {
      res.send("fields cannot be empty");
    } else {
      customerBio.findOne({ email: values.email }, async function (err, data) {
        if (data) res.send("email already exists");
        else {
          const entry1 = new customerBio({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
          });
          await entry1.save();
          console.log(entry1);
        }
      });

      res.status(201).sendFile(path + "/index.html");
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// app.post("/login", async function (req, res) {
//   try {
//     const values = req.body;
//     console.log(values);
//     if (!values.email || !values.password) {
//       res.send("fields cannot be empty");
//     } else {
//       customerBio.find({ email: values.email }, async function (err, data) {
//         if (!data) {
//           res.send("Email not has been registered");
//         } else {
//           console.log(data);
//           console.log(data.password, values.password);
//           if (data.password === values.password) {
//             res.send("Successfully logged in");
//           } else {
//             res.send("Incorrect password");
//           }
//         }
//       });
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(400).send(e);
//   }
// });

app.post("/login", async function (req, res) {
  try {
    const values = req.body;
    session = req.session;
    console.log(values);
    if (!values.email || !values.password) {
      res.send("fields cannot be empty");
    } else {
      data = await customerBio.find({ email: values.email });
      if (!data[0]) {
        res.send("Email not has been registered");
      } else {
        console.log(data);
        console.log(
          data[0].name,
          data[0].email,
          data[0].password,
          values.password
        );
        if (data[0].password === values.password) {
          session.userid = values.email;
          console.log(session.userid);
          res.send("Successfully logged in");
        } else {
          res.send("Incorrect password");
        }
      }
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

app.post("/todo", async function (req, res) {
  console.log("todo");
  if (!session.userid) res.render("Kindly login");

  const user_todo = await TodoList.find({ customer_id: session.userid });
  console.log(user_todo);
  res.render("todo", { info: user_todo });
});

app.post("/addTask", async function (req, res) {
  await TodoList.find().sort({ desc_id: -1 });
  const user = await TodoList.findOne({ customer_id: session.userid }).sort({
    desc_id: -1,
  });
  if (user) {
    c = user.desc_id + 1;
  } else {
    c = 1;
  }

  var taskItem = new TodoList({
    desc_id: c,
    customer_id: session.userid,
    description: req.body.desc,
  });
  console.log(session.userid);
  console.log(req.body.desc);

  await taskItem.save();

  await TodoList.find().sort({ desc_id: -1 });

  const user_todo = await TodoList.find({ customer_id: session.userid });
  res.render("todo", { info: user_todo });
});
// app.post("/addTask", async function (req, res) {
//   const user = await TodoList.find({ customer_id: session.userid });
//   const desc = req.body.desc.trim();
//   if (desc == "") {
//     res.render("todo", { info: user });
//   }
//   const item = new TodoList({
//     customer_id: session.userid,
//     description: req.body.desc,
//   });

//   await item.save();
//   const user_todo = await TodoList.find({ customer_id: session.userid });
//   res.render("todo", { info: user_todo });
// });

app.post("/delete", async function (req, res) {
  // const user = await TodoList.remove({ customer_id: session.userid }, true);
  // await TodoList.deleteOne({ customer_id: session.userid });
  // const user = await TodoList.find({ customer_id: session.userid });
  //

  const resu = await TodoList.deleteOne({
    $and: [{ customer_id: session.userid }, { desc_id: req.body.desc_id }],
  });
  console.log(resu);
  const user = await TodoList.find({ customer_id: session.userid });
  res.render("todo", { info: user });
  console.log(req.body.desc_id);
});

// app.post("/addTask", async function (req, res) {
//   TodoList.findOne({ customer_id: session.userid }, async function (err, data) {
//     if (data) {
//       console.log("if");
//       c = data.unique_id + 1;
//     } else {
//       c = 1;
//     }

//     var taskItem = new TodoList({
//       desc_id: c,
//       customer_id: session.userid,
//       description: req.body.desc,
//     });
//     console.log(session.userid);
//     console.log(req.body.desc);

//     await taskItem.save();
//   })
//     .sort({ desc_id: -1 })
//     .limit(1);
//   const user_todo = await TodoList.find({ customer_id: session.userid });
//   res.render("todo", { info: user_todo });
// });
