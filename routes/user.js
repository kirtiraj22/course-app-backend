const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middlewares/user");

router.post("signup", () => {});

router.post("signin", () => {});

router.get("courses", () => {});

router.post("courses/:courseId", () => {});

router.get("purchasedCourses", () => {});

module.exports = router;
