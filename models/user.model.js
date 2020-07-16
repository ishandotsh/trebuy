const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		displayName: {
			type: String,
			required: [true, "Display name required"],
		},
		email: {
			type: String,
			required: [true, "Email required"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Password required"],
			minlength: 5,
		},
		imageURL: {
			type: String,
			required: [true, "imageURL required"],
		},
	},
	{ timestamps: true }
);

module.exports = User = mongoose.model("User", UserSchema);
