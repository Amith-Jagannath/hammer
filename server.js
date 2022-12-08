const express = require("express"); //interact with html file
const bodyParser = require("body-parser"); //to get data from user
const mongoose = require("mongoose"); //package to connect to db
const hbs = require("express-handlebars"); //used for hbs file soo as to use js componenets for displaying images
const { handlebars } = require("hbs");
// const cookieParser = require("cookie-parser"); //used to store cookies for user sessions
const sessions = require("express-session");

const oneDay = 1000 * 60 * 60 * 24;
const path = __dirname + "/public/views";
var jsonMerger = require("json-merger");

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
// const path = __dirname;
console.log(path);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
var server_port = process.env.YOUR_PORT || process.env.PORT || 5555;
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

const foodSchema = new mongoose.Schema({
  food_id: {
    type: String,
  },
  name: {
    type: String,
  },
  veg_non: {
    type: String,
  },
  img: {
    type: String,
  },

  fat: {
    type: String,
  },
  carbohydrates: {
    type: String,
  },
  protein: {
    type: String,
  },
  calories: {
    type: String,
  },
  caloriesInVal: {
    type: Number,
  },
});

const DietSchema = new mongoose.Schema({
  customer_id: {
    type: String,
  },

  diet_id: {
    type: Number,
  },
  name: {
    type: String,
  },
  img: {
    type: String,
  },
  calories: {
    type: Number,
  },
});
const WorkoutSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  header: {
    type: String,
  },
  desc1: {
    type: String,
  },
  desc2: {
    type: String,
  },
  images: {
    img1: {
      type: String,
    },
    img2: {
      type: String,
    },
  },
});

var session;
const customerBio = new mongoose.model("customerBio", customerSchema);
const Food = new mongoose.model("Food", foodSchema);
const registerDetail = new mongoose.model("project", customerSchema);
const DietCart = new mongoose.model("Diet", DietSchema);
const TodoList = new mongoose.model("TodoList", TodoSchema);
const Workout = new mongoose.model("Workout", WorkoutSchema);
module.exports = customerBio;
module.exports = TodoList;
module.exports = Food;
module.exports = DietCart;
module.exports = Workout;
app.listen(server_port, function () {
  console.log("Listening on port %d", server_port);
});
app.get("/", function (req, res) {
  res.render("index");
});

// app.post("/register", async function (req, res) {
//   try {
//     const values = req.body;
//     if (!values.email || !values.username || !values.password) {
//       res.render("index", { message: "Fields cannot be empty" });
//     } else {
//       customerBio.findOne({ email: values.email }, async function (err, data) {
//         console.log(data);
//         console.log(Boolean(data));
//         if (Boolean(data))
//           res.render("index", { message: "Email already taken" });
//         else {
//           const entry1 = new customerBio({
//             name: req.body.username,
//             email: req.body.email,
//             password: req.body.password,
//           });
//           await entry1.save();
//           console.log(entry1);
//         }
//       });
//       res.render("index", { message: "Successfull" });
//       // res.status(201).sendFile(path + "/index.html");

//       // res.redirect("/index.html", { user: username });
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(400).send(e);
//   }
// });

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
      res.render("index", { message: "fields cannot be empty" });
    } else {
      data = await customerBio.find({ email: values.email });
      if (!data[0]) {
        res.render("index", { message: "Email not has been registered" });
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

          // res.send("Successfully logged in");
          // res.render("/index.html");
          // res.status(201).sendFile(path + "/index.html");
          res.render("index", { message: "Successfully Logged in" });
        } else {
          res.render("index", { message: "Incorrect Password" });
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
  if (session == undefined) res.render("index", { message: "Kindly login" });
  else {
    const user_todo = await TodoList.find({ customer_id: session.userid });
    console.log(user_todo);
    res.render("todo", { info: user_todo });
  }
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

const createworkout = async () => {
  try {
    const result = await Workout.insertMany([
      new Workout({
        name: "chest",
        header: "Chest Workouts",
        image: {
          img1: "https://www.muscleandfitness.com/wp-content/uploads/2019/10/Chris-Bumstead-Shirtless-Hands-On-Hip.jpg?w=800&quality=86&strip=all",
          img2: " https://image.winudf.com/v2/image/Y29tLm1pbmRnYW1lLmJlc3QuY2hlc3QuZXhjZXJzaWNlc19zY3JlZW5fMF8xNTMxOTE4NjIwXzA1NA/screen-0.jpg?fakeurl=1&type=.webp",
        },
        desc1:
          "There are dozens of exercises you could do on chest day (the Bodybuilding.com Exercise Database lists well over 200), but you probably don't want to spend your Monday—aka International Chest Day doing them all. You just want to know the best exercises to build a muscular chest, so we've done the work to compare them for you. Our choices are based on results in the lab, but also the weight room. Serious lifters know that measuring activation from electromyography to pick the best muscle-building exercises is helpful, but far from perfect.",
        desc2:
          "Here are the best chest exercises for muscle growth, plus three complete chest workouts to put those movements into action. Along with growth-focused nutrition and supplementation, this can be your action plan for a bigger chest!",
      }),
      new Workout({
        name: "quad",
        header: "Quads and Hamstring Workouts",
        image: {
          img1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqp_c3PWehmdXPvYbFI6E9LC-buNKq8bAXpQ&usqp=CAU",
          img2: "https://yourgymguides.com/wp-content/uploads/2018/03/5-legs-workout-at-gym-.png",
        },
        desc1:
          " The feelings may be universal, but bodybuilders looking to annihilate legs have countless workout options at their disposal. While most workouts start with some variation of the squat—widely acclaimed as the best lower-body movement—exercise choice, foot position, and advanced training techniques all allow you to emphasize one particular area of the legs over others. That's great if you want to thicken up your quads, fill out your glutes, or beef up your hamstrings because of a weakness—or simply because you want to prioritize an area for a length of time.",
        desc2:
          "While we can provide any number of formulas for advanced leg growth, you're still on your own when it comes to generating the intensity to survive a high-octane workout and withstanding the pain. Nail those last two factors and you'll leave your wheels no choice but to grow.",
      }),
      new Workout({
        name: "abs",
        header: "Core Workouts",
        image: {
          img1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvmc6GFwC53OZ2n0oMwsbA3pGJBhOmNC9NWw&usqp=CAU",
          img2: "https://i.pinimg.com/736x/2b/a7/d2/2ba7d218f7441d98db6b7c3fb4a3b4bb.jpg",
        },
        desc1:
          "Even if you’re not doing moves that focus on the abs directly, their location means that they are worked hard by compound exercises that hit both the upper and lower body. Your core is also key to any exercise in which you have to keep your body stable, such as static holds like the plank or tricky balancing acts like the single-leg Romanian deadlift.",
        desc2:
          "Though each circuit works as quick stand-alone abs blast, you can also tack them on to the end of your main training session to ensure your abs are getting the attention they deserve.",
      }),
      new Workout({
        name: "back",
        header: "Back Workouts",
        image: {
          img1: "https://d3h9ln6psucegz.cloudfront.net/wp-content/uploads/2021/10/Back-Workout.jpg",
          img2: "https://i.pinimg.com/736x/85/62/1e/85621ee33626fa6fb4214be92fbf0292.jpg",
        },
        desc1:
          "When you crack your exercise toolkit open each week on back day, you've got a seemingly endless array of movements available. If you're overwhelmed by the sheer number of row variations, or you draw a total blank when thinking of new exercises to try, consider this list your new back blueprint. We took the science into account--and more. Head-to-head exercise comparison research is a bit limited, and often misleading. So rather than going strictly off of electromyography (EMG) to pick the best muscle-building exercises",
        desc2:
          "Here are the best back exercises for muscle growth, plus three complete back workouts incorporating the movements that you can plug into your split right away.",
      }),
      new Workout({
        name: "shoulder",
        header: "Shoulder Workouts",
        image: {
          img1: "https://www.muscleandfitness.com/wp-content/uploads/2019/06/1109-Dumbbell-Front-Raise-Static-Hold.jpg?quality=86&strip=all",
          img2: "https://i.pinimg.com/736x/77/0b/29/770b2949e6cb998b271db37e690b547b.jpg",
        },
        desc1:
          "Lifting a weight that’s too heavy for you is a mistake regardless of the part of the body you’re working, but it can be truly disastrous when performing a shoulder workout. The shoulders are delicate and complicated joints that are not especially easy to target, and if you do put them under too much pressure before they’re ready you can end up with injuries that put you out of action for months.",
        desc2:
          "Fair warning, though, it’s a challenging session best suited to those with extensive training experience. It also requires a barbell, dumbbells and a weights bench, which means access to a gym for most people. To make sure no-one leaves disappointed, we’ve also included a variety of shoulder workouts below so everyone can develop their deltoids, no matter their ability or equipment.",
      }),
      new Workout({
        name: "arm",
        header: "Arms Workouts",
        image: {
          img1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVa-lpRhDXJT6ISSdIzOzssEz7KX-JdGgvXA&usqp=CAU",
          img2: "https://i0.wp.com/i.pinimg.com/736x/55/c7/f5/55c7f55c9d962b663fe68cb2ce85b9db.jpg?resize=160,120",
        },
        desc1:
          "Tired of your T-shirt sleeves blowing in the wind? Well, clicking on this article is your first rep towards building bigger biceps, triceps and forearms. Each of these arm exercises hits maximum muscle fibres to spark the growth you're after and proves any piece of kit – in the right hands and in the right arm workout – has gun-toting potential to build bigger, thicker arms.",
        desc2:
          "And if you're wondering why exactly it is that you need to know 18 arm exercises, it's because if you want to build arms that really pop, you'll need to hit them from a variety of angles, which is a muscle-building theory that has been confirmed by research conducted by the Department of Health Science and Human Performance at the University of Tampa, Florida.",
      }),
    ]);
  } catch (e) {
    console.log(e);
  }
};
// createworkout();
app.post("/food", async function (req, res) {
  const food = await Food.find({});
  // console.log(food);
  res.render("calorie", { info: food });
});

app.post("/addToDiet", async function (req, res) {
  console.log(req.body);
  // await DietCart.find().sort({ cart_id: -1 });
  if (session == undefined) res.render("index", { message: "Kindly login" });
  else {
    const user = await DietCart.findOne({ customer_id: session.userid }).sort({
      diet_id: -1,
    });
    if (user) {
      c = user.diet_id + 1;
    } else {
      c = 1;
    }

    var cartItem = new DietCart({
      diet_id: c,
      customer_id: session.userid,
      img: req.body.img,
      name: req.body.name,
      calories: req.body.calories,
    });
    console.log(session.userid);
    console.log(req.body.id);

    await cartItem.save();
    // const shoe = await Product.find({ product_id: req.body.id });
    // res.render("expand", { info: shoe });

    const foods = await Food.find({});
    res.render("calorie", { info: foods });
  }
});

app.post("/cart", async function (req, res) {
  if (session == undefined) res.render("index", { message: "Kindly login" });
  else {
    const main = await DietCart.find({ customer_id: session.userid });

    const test = await DietCart.aggregate([
      {
        $project: {
          diet_id: "$diet_id",
          name: "$name",
          img: "$img",
          customer_id: "$customer_id",
          calories: "$calories",
        },
      },
      {
        $group: {
          _id: "$customer_id",
          totalCalories: {
            $sum: "$calories",
          },
        },
      },
    ]);
    var result = jsonMerger.mergeObjects([main, test]);
    console.log(result);
    console.log(main);
    res.render("cart", { info: main });
  }
});

app.post("/register", async function (req, res) {
  try {
    const values = req.body;
    if (!values.email || !values.username || !values.password) {
      res.render("index", { message: "Fields cannot be empty" });
    } else {
      const data = await customerBio.findOne({ email: values.email });

      console.log(Boolean(data));
      if (Boolean(data))
        res.render("index", { message: "Email already taken" });
      else {
        const entry1 = new customerBio({
          name: req.body.username,
          email: req.body.email,
          password: req.body.password,
        });
        await entry1.save();
        console.log(entry1);
      }
    }
    res.render("index", { message: "Successfull" });
    // res.status(201).sendFile(path + "/index.html");

    // res.redirect("/index.html", { user: username });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

app.post("/delete_food", async function (req, res) {
  console.log(session.userid, req.body.id);
  await DietCart.deleteOne({
    $and: [{ customer_id: session.userid }, { diet_id: req.body.id }],
  });
  const result = await DietCart.find({ customer_id: session.userid });
  console.log(result);
  res.render("cart", { info: result });
});
