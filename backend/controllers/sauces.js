const sauces = require('../models/sauces');
const fs = require('fs');

// exports.createSauces = (req, res, next) => {
//   delete req.body._id;
//   const sauce = new sauces({
//     ...req.body,
//   });
//   sauce.save()
//       .then(() => res.status(201).json({message: 'Sauce saved !'}))
//       .catch((error) => res.status(400).json({error}));
// };

exports.createSauces = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new sauces({
    ...sauceObject,
    _userId: req.auth.userId,
    imageUrl: `${req.protocol}:://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => {res.status(201).json({message: 'Object saved !'})})
    .catch((error) => res.status(400).json({error}));
};

exports.findSauces = (req, res, next) => {
  sauces.find()
      .then((sauces) => res.status(200).json(sauces))
      .catch((error) => res.status(400).json({error}));
};

exports.findOneSauce = (req, res, next) => {
  sauces.findOne()
      .then((sauces) => res.status(200).json(sauces))
      .catch((error) => res.status(400).json({error}));
};

// exports.modifySauces = (req, res, next) => {
//   sauces.updateOne({_id: req.params.id},
//     {...req.body, _id: req.params.id})
//         .then(() => res.status(200).json({message: 'Sauce updated !'}))
//         .catch((error) => res.status(400).json({error}));
// };

exports.modifySauces = (req, res, next) =>{
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
  delete sauceObject._userId;
  sauces.findOne({_id: req.params.id})
      .then((sauces) => {
        if(sauces.userId != req.auth.userId) {
          res.status(401).json({message: 'Not authorized !'});
        } else {
          sauces.updateOne({_id: req.params.id},
            {...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message: 'Sauce modified !'}))
              .catch((error) => res.status(401).json({error}));
        };
      })
      .catch((error) => res.status(400).json({error}));
};

// exports.deleteSauces = (req, res, next) => {
//   sauces.deleteOne = ({_id: req.params.id})
//       .then(() => res.status(20).json({message: 'Sauce deleted !'}))
//       .catch((error) => res.status(400).json({error}));
// };

exports.deleteSauces = (req, res, next) => {
  sauces.findOne({_id: req.params.id})
      .then(sauces => {
        if(sauce.userId != req.auth.userId) {
          res.status(401).json({message: 'Not authorized !'});
        } else {
          const filename = sauces.imageUrl.split('/images')[1];
          fs.unlink('images/${filename}', () => {
            sauces.deleteOne({_id: req.params.id})
                .then(() => {rmSync.status(200).json({message: 'Object deleted'})})
                .catch((error) => res.status(401).json({error}));
          });
        };
      });
};
