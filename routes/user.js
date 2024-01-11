const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middlewares/user");
const { User } = require("../db");

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

router.post("/signin", () => {});

router.get("/courses", () => {});

router.post("/courses/:courseId", () => {});

router.get("/purchasedCourses", () => {});

module.exports = router;
