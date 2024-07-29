const User = require("../models/user");
const {generateToken} = require("../auth/jwt");
const asyncHandler = require("express-async-handler");

const handleCreateUser = asyncHandler(async (req, res) => {
    const {email, phone_number} = req.body;

    const userExist = await User.exists({
        $or: [{email: email}, {phone_number: phone_number}]
    })

    if (userExist) throw new Error("User already exist")


    const newUser = await User.create(req.body);

    return res.status(201).json({data: newUser, message: "Register successfully", status: 201});
});

const handleLoginCtrl = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    const findUser = await User.findOne({email});

    if (!findUser) throw new Error("User not found.")

    const isMatch = await findUser.isPasswordMatched(password)

    if (!isMatch) throw new Error("Invalid credentials")

    const authToken = generateToken(findUser?._id)

    res.cookie("auth", authToken, {
        httpOnly: true,
        secure: true,
        domain: 'http://localhost:3000',
    });

    const user = {
        first_name: findUser?.first_name,
        last_name: findUser?.last_name,
        user_name: findUser?.user_name,
        dob: findUser?.dob,
        phone_number: findUser?.phone_number,
        email: findUser?.email,
        address_details: findUser?.address_details,
    }
    return res.json({
        data: user,
        message: "Logged in successfully",
        status: 200
    })

})

module.exports = {handleCreateUser, handleLoginCtrl};
