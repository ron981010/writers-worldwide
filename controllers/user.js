const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const db = require('../models');
const User = db.user;
const passwordUtil = require('../util/passwordComplexityCheck');

module.exports.getAllUsers = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('users').find();
    const users = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.getSingleUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
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

module.exports.createUser = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      res.status(400).json({ message: 'Content can not be empty!' });
      return;
    }

    const password = req.body.password;
    const passwordCheck = passwordUtil.passwordPass(password);
    if (passwordCheck.error) {
      res.status(400).json({ message: passwordCheck.error });
      return;
    }

    const user = new User(req.body);
    user
      .save()
      .then((data) => {
        res.status(201).send(data);
      })
      .catch((err) => {
        res.status(500).send({ message: err.message || 'Some error occurred while creating the user.' });
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const password = req.body.password;
    const passwordCheck = passwordUtil.passwordPass(password);
    if (passwordCheck.error) {
      res.status(400).json({ error: passwordCheck.error });
      return;
    }

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
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('users').remove({ _id: userId }, true);
    console.log(response);
    if (response.deletedCount > 0) {
      res.status(200).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the user.');
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

