const User = require("./../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc  Register User
// @route Post /register
// @access Public
exports.registerUser = async (req, res) => {
	try {
		const { email, password, passwordCheck, displayName, imageURL } = req.body;

		// ----- validation -----
		if (!displayName)
			return res.status(400).json({
				msg: "Please provide a display name",
			});
		if (!email)
			return res.status(400).json({
				msg: "Please provide an email",
			});
		if (!password)
			return res.status(400).json({
				msg: "Please enter a password",
			});
		if (!passwordCheck)
			return res.status(400).json({
				msg: "Please retype password",
			});

		if (password.length < 5)
			return res
				.status(400)
				.json({ msg: "Password must be at least 5 characters long" });

		if (password !== passwordCheck)
			return res.status(400).json({ msg: "Passwords don't match" });

		const existingUser = await User.findOne({ email });
		if (existingUser)
			return res
				.status(400)
				.json({ msg: "An account already exists with this email" });

		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(password, salt);

		const newUser = new User({
			email,
			passwordHash,
			displayName,
			imageURL,
		});
		const savedUser = await newUser.save();
		res.json({
			displayName: savedUser.displayName,
			imageURL: savedUser.imageURL,
		});
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
};

// @desc  Login User
// @route Post /login
// @access Public

exports.loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password)
			return res.status(400).json({
				msg: "Please fill all fields",
			});

		const user = await User.findOne({ email });
		if (!user)
			return res.status(400).json({
				msg: "Email not registered",
			});

		const isMatch = bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({
				msg: "Wrong email or password",
			});

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
		res.json({
			token,
			user: {
				id: user._id,
				displayName: user.displayName,
			},
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
