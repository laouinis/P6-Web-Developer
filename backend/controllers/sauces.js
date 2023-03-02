const Sauces = require('../models/sauces');
const fs = require('fs');

/**
 * Create a new sauce object 
 * @param {*} req The HTTP request object
 * @param {*} res The HTTP response object
 */
exports.createSauces = (req, res) => {
  // Parse the request body and remove unwanted properties
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  // Create a new sauce with the userId and tje image URL
  const sauce = new Sauces({
    ...sauceObject,
    _userId: req.auth.userId,
    imageUrl: `${ req.protocol }://${ req.get('host') }/images/${ req.file.filename }`
  });
  // Save the sauce to the data base and return response
  sauce.save()
    .then(() => {res.status(201).json({ message: 'Object saved !' })})
    .catch((error) => res.status(400).json({ error }));
};

/**
 * Find all sauces
 * @param {*} req The HTTP request object
 * @param {*} res The HTTP response object
 */
exports.findSauces = (req, res) => {
  Sauces.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

/**
 * Find one sauce object by its Id
 * @param {*} req The HTTP request object
 * @param {*} res The HTTP response object
 */
exports.findOneSauce = (req, res) => {
  Sauces.findOne({_id: req.params.id})
    // Find one sauce with the given Id and return it in the response
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

/**
 * Modify one sauce
 * @param {*} req The HTTP request object
 * @param {*} res The HTTP response object
 */
exports.modifySauces = (req, res) => {

  // Create a sauce object from the request body
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${ req.protocol }://${ req.get('host') }/images/${ req.file.filename }`
  } : { ...req.body };

  // Delete the _userId property from the sauce object
  delete sauceObject._userId;

  // Find the sauce with the given Id
  // Check if the authenticated user is the owner
  Sauces.findOne({_id: req.params.id})
    .then((sauces) => {
      if (sauces.userId != req.auth.userId) {
        
        // Return a 401 error if the user is not authorized to modify the sauce
        res.status(401).json({ message: 'Not authorized !' });
      } else {

        // Update the sauce in the database with the modified properties
        Sauces.updateOne({ _id: req.params.id },
          { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modified !' }))
          .catch((error) => res.status(401).json({ error }));
      };
    })
    .catch((error) => res.status(400).json({ error }));
};

/**
 * Delete a sauce
 * @param {*} req The HTTP request object
 * @param {*} res The HTTP response object
 */
exports.deleteSauces = (req, res) => {

  // Find the sauce with the given Id
  // Check if the authentified user is th owner
  Sauces.findOne({_id: req.params.id})
    .then((sauces) => {
      if (sauces.userId != req.auth.userId) {
        
        // Return a 401 error if the user is not authorized to delete the sauce
        res.status(401).json({ message: 'Not authorized !' });
      } else {

        // Delete the image associated with the sauce and delete the sauce
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

/**
 * Update the like / dislike of the sauce
 * @param {*} req The HTTP request object
 * @param {*} res The HTTP response object
 */
exports.likeDislike = (req, res) => {
  Sauces.findOne({_id: req.params.id})
    .then(sauces => {
      const likeType = req.body.like;
      const userId = req.auth.userId;
      switch (likeType) {

        // Like and increment the user like
        case 1:
          if (!sauces.usersLiked.includes(userId)) {
            sauces.usersLiked.push(userId);
            ++sauces.likes;
          }
          break;

        // Change the user like / dislike
        case 0:
          if (sauces.usersDisliked.includes(userId)) {
            sauces.usersDisliked.splice(sauces.usersDisliked.indexOf(userId), 1);
            --sauces.dislikes;
          } else if (sauces.usersLiked.includes(userId)) {
            sauces.usersLiked.splice(sauces.usersLiked.indexOf(userId), 1);
            --sauces.likes;
          }
          break;

        // Dislike and increment the user dislike
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
