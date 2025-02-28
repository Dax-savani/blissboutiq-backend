const asyncHandler = require('express-async-handler');
const Contact = require('../models/contact');


const handleGetContacts = asyncHandler(async (req, res) => {
    try {
        const contacts = await Contact.find({}).sort({ createdAt: -1 });
        res.status(200).json({
            status: 200,
            message: "Contacts fetched successfully",
            data: contacts,
        });
    } catch (error) {
        console.error("Error fetching contacts:", error.message);
        res.status(500).json({
            status: 500,
            message: "Failed to fetch contacts",
            error: error.message,
        });
    }
});


const handleGetSingleContact = asyncHandler(async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.contactId);

        if (contact) {
            res.status(200).json({
                status: 200,
                message: "Contact fetched successfully",
                data: contact,
            });
        } else {
            res.status(404).json({
                status: 404,
                message: "Contact not found",
            });
        }
    } catch (error) {
        console.error("Error fetching contact:", error.message);
        res.status(500).json({
            status: 500,
            message: "Failed to fetch contact",
            error: error.message,
        });
    }
});


const handleCreateContact = asyncHandler(async (req, res) => {
    try {
        const { firstName, lastName, dateOfBirth, phoneNumber, email } = req.body;


        const existingContact = await Contact.findOne({ email });
        if (existingContact) {
            return res.status(400).json({
                status: 400,
                message: "Email already exists",
            });
        }

        const newContact = new Contact({
            firstName,
            lastName,
            dateOfBirth,
            phoneNumber,
            email
        });

        const savedContact = await newContact.save();
        res.status(201).json({
            status: 201,
            message: "Contact created successfully",
            data: savedContact,
        });
    } catch (error) {
        console.error("Error creating contact:", error.message);
        res.status(500).json({
            status: 500,
            message: "Failed to create contact",
            error: error.message,
        });
    }
});


const handleUpdateContact = asyncHandler(async (req, res) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.contactId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedContact) {
            return res.status(404).json({
                status: 404,
                message: "Contact not found",
            });
        }

        res.status(200).json({
            status: 200,
            message: "Contact updated successfully",
            data: updatedContact,
        });
    } catch (error) {
        console.error("Error updating contact:", error.message);
        res.status(500).json({
            status: 500,
            message: "Failed to update contact",
            error: error.message,
        });
    }
});


const handleDeleteContact = asyncHandler(async (req, res) => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.contactId);

        if (!deletedContact) {
            return res.status(404).json({
                status: 404,
                message: "Contact not found",
            });
        }

        res.status(200).json({
            status: 200,
            message: "Contact deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting contact:", error.message);
        res.status(500).json({
            status: 500,
            message: "Failed to delete contact",
            error: error.message,
        });
    }
});

module.exports = {
    handleGetContacts,
    handleGetSingleContact,
    handleCreateContact,
    handleUpdateContact,
    handleDeleteContact
};
