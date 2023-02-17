const sauces = require('../models/sauces');

exports.createSauces = (req, res, next) => {
  delete req.body._id;
  const sauce = new sauces({
    ...req.body,
  });
  sauce.save()
      .then(() => res.status(201).json({message: 'Sauce saved !'}))
      .catch((error) => res.status(400).json({error}));
};


