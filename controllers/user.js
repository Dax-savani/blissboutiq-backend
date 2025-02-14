const User = require("../models/user");
const {generateToken} = require("../auth/jwt");
const asyncHandler = require("express-async-handler");

const handleCreateUser = asyncHandler(async (req, res) => {
    const {email, phone_number, role} = req.body;

    const userExist = await User.exists({
        $or: [{email: email}, {phone_number: phone_number}]
    })

    if (userExist) throw new Error("User already exist")
    const userRole = role && ["customer", "admin"].includes(role) ? role : "customer";

    const newUser = await User.create({...req.body, role: userRole});

    return res.status(201).json({data: newUser, message: "Register successfully", status: 201});
});

const handleEditAddress = asyncHandler(async (req, res) => {
    const userId = req.user?._id;


    const {address_1, address_2, country, state, city, zipcode} = req.body;

    if (!address_1 && !address_2 && !country && !state && !city && !zipcode) {
        res.status(400);
        throw new Error("At least one address field must be provided");
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                "address_details.address_1": address_1,
                "address_details.address_2": address_2,
                "address_details.country": country,
                "address_details.state": state,
                "address_details.city": city,
                "address_details.zipcode": zipcode,
            },
        },
        {new: true, runValidators: true}
    );

    if (!updatedUser) {
        res.status(404);
        throw new Error("User not found");
    }

    res.status(200).json({
        data: {
            address_details: updatedUser.address_details,
        },
        message: "Address details updated successfully",
        status: 200,
    });
});

const handleLoginCtrl = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    const findUser = await User.findOne({email});

    if (!findUser) throw new Error("User not found.")

    const isMatch = await findUser.isPasswordMatched(password)

    if (!isMatch) throw new Error("Invalid credentials")

    const authToken = generateToken(findUser?._id)
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
        token: authToken,
        message: "Logged in successfully",
        status: 200,
    })

})

const handleGetMe = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        res.status(401);
        throw new Error("Not authorized, token failed");
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    res.status(200).json({
        data: {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            user_name: user.user_name,
            dob: user.dob,
            phone_number: user.phone_number,
            email: user.email,
            address_details: user.address_details,
        },
        message: "User details retrieved successfully",
        status: 200,
    });
});

module.exports = {handleCreateUser, handleLoginCtrl, handleGetMe, handleEditAddress};
