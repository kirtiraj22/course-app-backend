const { Router } = require("express");
const adminMiddleware = require("../middlewares/admin");
const jwt = require("jsonwebtoken");
const router = Router();
const { Admin, Course } = require("../db");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	try {
		const adminExist = await Admin.findOne({
			username,
		});

		if (adminExist) {
			return res.status(404).json({
				message: "Admin already exists!",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		await Admin.create({
			username: username,
			password: hashedPassword,
		});

		res.json({
			message: "Admin created successfully",
		});
	} catch (err) {
		res.status(500).json({
			message: "Internal Server error!",
		});
	}
});

router.post("/signin", async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	try {
		const admin = await Admin.findOne({
			username,
		});
		if (!admin) {
			return res.status(404).json({
				message: "Admin not found!",
			});
		}

		const checkPassword = await bcrypt.compare(password, admin.password);
		console.log(checkPassword);

		if (!checkPassword) {
			return res.status(401).json({
				message: "Invalid credentials!",
			});
		}

		const token = jwt.sign({ username }, process.env.JWT_SECRET);
		res.json({
			token: token,
		});
	} catch (err) {
		res.status(500).json({
			message: "Internal server error!",
		});
	}
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
