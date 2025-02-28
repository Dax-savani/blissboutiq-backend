const router = require('express').Router();
const {
    handleGetContacts,
    handleGetSingleContact,
    handleCreateContact,
    handleUpdateContact,
    handleDeleteContact
} = require('../controllers/contact');

router.get('/', handleGetContacts);
router.get('/:contactId', handleGetSingleContact);
router.post('/', handleCreateContact);
router.put('/:contactId', handleUpdateContact);
router.delete('/:contactId', handleDeleteContact);

module.exports = router;
