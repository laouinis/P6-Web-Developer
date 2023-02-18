const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const saucesController = require('../controllers/sauces');

router.use('/', saucesController.findSauces);
router.get('/', saucesController.findSauces);
router.get('/:id', saucesController.findOneSauce);
router.post('/', saucesController.createSauces);
router.put('/:id', saucesController.modifySauces);
router.delete('/:id', saucesController.deleteSauces);

// router.use('/', auth, saucesController.findSauces);
// router.get('/', auth, saucesController.findSauces);
// router.get('/:id', auth, saucesController.findOneSauce);
// router.post('/', auth, saucesController.createSauces);
// router.put('/:id', auth, saucesController.modifySauces);
// router.delete('/:id', auth, saucesController.deleteSauces);

module.exports = router;
