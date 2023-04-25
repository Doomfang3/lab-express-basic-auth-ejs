const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
	{
		userName: {
			type: String,
			unique: true,
			requred: [true, "User Name is required."],
			trim: true,
		},
		passwordHash: {
			type: String,
			requred: [true, "Password is required."],
		},
	},
	{
		timestamps: true,
	}
);

const User = model("User", userSchema);

module.exports = User;
