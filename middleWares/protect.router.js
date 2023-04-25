const isLoggedIn = (req, res, next) => {
	if (!req.session.userName) {
		return res.redirect("/auth/login");
	}
	next();
};

const isLoggedOut = (req, res, next) => {
	if (req.session.userName) {
		return res.redirect("/profile");
	}
	next();
};

module.exports = {
	isLoggedIn,
	isLoggedOut,
};
