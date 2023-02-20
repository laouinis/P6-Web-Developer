const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config');
const controllersSauces = require('../controllers/sauces');

router.get('/', auth, controllersSauces.findSauces);
router.get('/:id', auth, controllersSauces.findOneSauce);
router.post('/', auth, multer, controllersSauces.createSauces);
router.put('/:id', auth, multer, controllersSauces.modifySauces);
router.delete('/:id', auth, controllersSauces.deleteSauces);
router.post('/:id/like', auth, controllersSauces.likeDislike);

module.exports = router;
