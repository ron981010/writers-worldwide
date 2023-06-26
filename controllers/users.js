const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
  const result = await mongodb.getDb().db().collection('users').find();
  result.toArray().then((users) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  });
};

const getSingleUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  
  try {
    const user = await mongodb.getDb().db().collection('users').findOne({ _id: userId });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const authorName = user.fullName;
    const poems = await mongodb
      .getDb()
      .db()
      .collection('poems')
      .find({ author: authorName })
      .toArray();

    const userData = {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      password: user.password,
      biography: user.biography,
      socialNetworks: user.socialNetworks,
      poems: poems,
    };

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createUser = async (req, res) => {
  const user = {
    username: req.body.username,
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    biography: req.body.biography,
    socialNetworks: req.body.socialNetworks
  };
  const response = await mongodb.getDb().db().collection('users').insertOne(user);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the user.');
  }
};

const updateUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const user = {
    username: req.body.username,
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    biography: req.body.biography,
    socialNetworks: req.body.socialNetworks
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('users')
    .replaceOne({ _id: userId }, user);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the user.');
  }
};

const deleteUser= async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db().collection('users').remove({ _id: userId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the user.');
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser
};