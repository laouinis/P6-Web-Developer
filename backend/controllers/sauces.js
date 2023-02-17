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

exports.findSauces = (req, res, next) => {
  sauces.find()
      .then((sauces) => res.status(200).json(sauces))
      .catch((error) => res.status(400).json({error}));
};

exports.findOneSauces = (req, res, next) => {
  sauces.findOne()
      .then((sauces) => res.status(200).json(sauces))
      .catch((error) => res.status(400).json({error}));
};

exports.modifySauces = (req, res, next) => {
  sauces.updateOne({_id: req.params.id},
    {...req.body, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Sauce updated !'}))
        .catch((error) => res.status(400).json({error}));
};

exports.deleteSauces = (req, res, next) => {
  sauces.deleteOne = ({_id: req.params.id})
      .then(() => res.status(20).json({message: 'Sauce deleted !'}))
      .catch((error) => res.status(400).json({error}));
};
