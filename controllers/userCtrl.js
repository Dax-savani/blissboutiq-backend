const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const handleCreateUser = asyncHandler(async (req, res) => {
    const { user_name, email, phone_number } = req.body;
    const userExists = await User.exists({
        $or: [
            { email: email },
            { user_name: user_name },
            { phone_number: phone_number },
        ],
    });
    if (!userExists) {
        const newUser = await User.create(req.body);
        return res.status(201).json(newUser);
    } else {
        const error = new Error("User Already Exist")
        error.status = 400;
        throw error;
    }
});

module.exports = { handleCreateUser };
