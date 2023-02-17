const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const saucesController = require('../controllers/sauces');

router.use('/', auth, saucesController.findSauces);
router.get('/', auth, saucesController.findSauces);
router.get('/:id', auth, saucesController.findOneSauces);
router.post('/', auth, saucesController.createSauces);
router.put('/:id', auth, saucesController.modifySauces);
router.delete('/:id',auth, saucesController.deleteSauces);

module.exports = router;
