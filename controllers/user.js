const User = require("../models/user");
const {generateToken} = require("../auth/jwt");
const asyncHandler = require("express-async-handler");

const handleCreateUser = asyncHandler(async (req, res) => {
    const {email, phone_number, user_name} = req.body;

    const userExist = await User.exists({
        $or: [{email: email}, {user_name: user_name}, {phone_number: phone_number}]
    })
    if (!userExist) {
        const newUser = await User.create(req.body);
        return res.status(201).json(newUser);
    } else {
        const error = new Error("User Already Exist");
        error.status = 400;
        throw error;
    }
});

const handleLoginCtrl = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    //check user exist or not
    const findUser = await User.findOne({email});
    if (findUser && await findUser.isPasswordMatched(password)) {
        // const resUser = {...findUser,token: generateToken(findUser?._id)};
        // return res.json(resUser);
        return res.json({
            first_name: findUser?.first_name,
            last_name: findUser?.last_name,
            user_name: findUser?.user_name,
            dob: findUser?.dob,
            phone_number: findUser?.phone_number,
            email: findUser?.email,
            password: findUser?.password,
            address_details: findUser?.address_details,
            token: generateToken(findUser?._id)
        })
    } else {
        throw new Error('Invalid Credentials')
    }
})

module.exports = {handleCreateUser, handleLoginCtrl};
