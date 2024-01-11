const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const userMiddleware = require("../middlewares/user");
const { User, Course } = require("../db");

router.post("/signup", async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	try {
		const userExist = await User.findOne({
			username,
		});
		if (userExist) {
			return res.status(400).json({
				message: "User already exists!",
			});
		}
		await User.create({
			username,
			password,
		});

		res.json({
			message: "User created successfully!",
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Internal server error",
		});
	}
});

router.post("/signin", async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({
			username,
			password,
		});

		if (!user) {
			return res.status(404).json({
				message: "Invalid credentials!",
			});
		}

		const token = jwt.sign({ username }, process.env.JWT_SECRET);
		res.status(200).json({
			token: token,
		});
	} catch (err) {
		res.status(500).json({
			message: "Internal server error!",
		});
	}
});

router.get("/courses", async (req, res) => {
	try {
		const courses = await Course.find({});
		if (!courses) {
			return res.status(404).json({
				message: "No courses found!",
			});
		}

		res.status(200).json({
			courses,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Internal Server Error!",
		});
	}
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
	const courseId = req.params.courseId;
	const { username } = req.headers;
	try {
		const user = await User.findOne({
			username,
		});
		if (!user) {
			return res.status(404).json({
				message: "user not found!",
			});
		}

		const course = await Course.findOne({
			_id: courseId,
		});
		if (!course) {
			return res.status(404).json({
				message: "Invalid course id!",
			});
		}

		await User.updateOne(
			{
				username: username,
			},
			{
				"$push": {
					purchasedCourses: courseId,
				},
			}
		);

		res.status(200).json({
			message: "Course purchased successfully!",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Internal Server Error!",
		});
	}
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
	const { username } = req.headers;

	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({
				message: "User not found!",
			});
		}
		const courses = await Course.find({
			_id: user.purchasedCourses,
		});
		res.status(200).json({
			courses: courses,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Internal Server error!",
		});
	}
});

module.exports = router;
