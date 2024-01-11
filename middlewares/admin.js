const jwt = require("jsonwebtoken");
function adminMiddleware(req, res, next) {
	const token = req.headers.authorization;
	const authWords = token.split(" ");
	const jwtToken = authWords[1];
	try {
		const decodedValue = jwt.verify(jwtToken, process.env.JWT_SECRET);
		if (decodedValue.username) {
			next();
		} else {
			res.status(404).json({
				message: "Not authenticated!",
			});
		}
	} catch (err) {
		res.json({
			message: "Incorrect inputs",
		});
	}
}

module.exports = adminMiddleware;
