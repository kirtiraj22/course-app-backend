const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
	const token = req.headers.authorization;
	const authWords = token.split(" ");
	const jwtToken = authWords[1];

	try {
		const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

		if (decoded.username) {
			next();
		} else {
			return res.status(404).json({
				message: "User doesn't exist!",
			});
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Internal server error!",
		});
	}
}

module.exports = userMiddleware;
