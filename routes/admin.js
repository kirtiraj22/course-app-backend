const { Router } = require("express");
const adminMiddleware = require("../middlewares/admin");
const jwt = require("jsonwebtoken");
const router = Router();
const { Admin, Course } = require("../db");
const { JWT_SECRET } = require("../config");

router.post("/signup", async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	await Admin.create({
		username: username,
		password: password,
	});

	res.json({
		message: "Admin created successfully",
	});
});

router.post("/signin", async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	const adminExists = await Admin.findOne({
		username,
		password,
	});

	if (!adminExists) {
		return res.status(411).json({
			message: "Incorrect username and password",
		});
	}

	const token = jwt.sign({ username }, JWT_SECRET);
	res.json({
		token: token,
	});
});

router.post("/courses", adminMiddleware, async (req, res) => {
	const title = req.body.title;
	const description = req.body.description;
	const imageLink = req.body.imageLink;
	const price = req.body.price;

	const newCourse = await Course.create({
		title,
		description,
		imageLink,
		price,
	});

	res.json({
		message: "Course created successfully!",
		courseId: newCourse._id,
	});
});

router.get("/courses", adminMiddleware, async (req, res) => {
	const response = await Course.find({});

	res.json({
		course: response,
	});
});

module.exports = router;
