const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


const getAllevents = async (req, res) => {
    const result = await mongodb.getDb().db().collection('events').find();
    result.toArray().then((favorites) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(favorites);
    });
};

module.exports = {
    getAllevents
};