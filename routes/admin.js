const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin, User } = require("../db");
const { Course } = require("../db");
const jwt = require("jsonwebtoken");

const { JWT_SERCET } = require("../config");

// Admin Route
router.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  //check if already exist(assume not exist in database )
  const isUserExist = await Admin.exists({ username: username });
  if (isUserExist) {
    res.status(404).json({ message: "Admin already exist." });
  } else {
    Admin.create({
      username: username,
      password: password,
    });
    res.json({ message: "Admin created successfully" });
  }
});

router.post("/signin", async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  const user = await Admin.findOne({
    username,
    password,
  });

  if (user) {
    const token = jwt.sign({ username }, JWT_SERCET);

    res.json({
      token,
    });
  } else {
    res.json({
      msg: "Wrong username or password",
    });
  }
});

router.post("/courses", adminMiddleware, async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageLink = req.body.imageLink;


  const newCourse = await Course.create({
    title: title,
    description: description,
    price: price,
    imageLink: imageLink,
  });

  res.json({
    message: "Course created successfully",
    courseId: newCourse._id,
  });
});

router.get("/courses", adminMiddleware, async (req, res) => {
  const allCourse = await Course.find({});
  res.json({
    course: allCourse,
  });
});

module.exports = router;
