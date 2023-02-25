const Sauces = require('../models/sauces');
const fs = require('fs');

exports.createSauces = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauces({
    ...sauceObject,
    _userId: req.auth.userId,
    imageUrl: `${ req.protocol }://${ req.get('host') }/images/${ req.file.filename }`
  });
  sauce.save()
    .then(() => {res.status(201).json({ message: 'Object saved !' })})
    .catch((error) => res.status(400).json({ error }));
};

exports.findSauces = (req, res) => {
  Sauces.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.findOneSauce = (req, res) => {
  Sauces.findOne({_id: req.params.id})
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauces = (req, res) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${ req.protocol }://${ req.get('host') }/images/${ req.file.filename }`
  } : { ...req.body };
  delete sauceObject._userId;
  Sauces.findOne({_id: req.params.id})
    .then((sauces) => {
      if (sauces.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized !' });
      } else {
        Sauces.updateOne({ _id: req.params.id },
          { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modified !' }))
          .catch((error) => res.status(401).json({ error }));
      };
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauces = (req, res) => {
  Sauces.findOne({_id: req.params.id})
    .then((sauces) => {
      if (sauces.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized !' });
      } else {
        const filename = sauces.imageUrl.split('/images')[ 1 ];
        fs.unlink(`images/${ filename }`, () => {
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Object deleted !' }); })
            .catch((error) => res.status(401).json({ error }));
        });
      };
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.likeDislike = (req, res) => {
  Sauces.findOne({_id: req.params.id})
    .then(sauces => {
      const likeType = req.body.like;
      const userId = req.auth.userId;
      switch (likeType) {
        case 1:
          if (!sauces.usersLiked.includes(userId)) {
            sauces.usersLiked.push(userId);
            ++sauces.likes;
          }
          break;
        case 0:
          if (sauces.usersDisliked.includes(userId)) {
            sauces.usersDisliked.splice(sauces.usersDisliked.indexOf(userId), 1);
            --sauces.dislikes;
          } else if (sauces.usersLiked.includes(userId)) {
            sauces.usersLiked.splice(sauces.usersLiked.indexOf(userId), 1);
            --sauces.likes;
          }
          break;
        case -1:
          if (!sauces.usersDisliked.includes(userId)) {
            sauces.usersDisliked.push(userId);
            ++sauces.dislikes;
          }
          break;
        default:
          res.status(401).json({ message: 'Dislike value incorrect !' });
          break;
      }
      sauces.save()
        .then(() => { res.status(200).json({ message: 'Post saved !' }); })
        .catch(error => { res.status(400).json({ error }); });
    })
    .catch(error => res.status(404).json({ error }));
};
