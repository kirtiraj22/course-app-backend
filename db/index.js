const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL);

const AdminSchema = new mongoose.Schema({
	username: String,
	password: String,
});

const UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	purchasedCourses: [
		{
			// we will have ObjectId's of courses
			type: mongoose.Schema.Types.ObjectId,
			// we are referring to the Course schema
			ref: "Course",
		},
	],
});

const CourseSchema = new mongoose.Schema({
	title: String,
	description: String,
	imageLink: String,
	price: Number,
});

const Admin = mongoose.model("Admin", AdminSchema);
const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course", CourseSchema);

module.exports = {
	Admin,
	User,
	Course,
};
