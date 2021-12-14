// User model
const User = require("../models/user");

const createUser = (req, res, next) => {
  const email = req.body.email || "";

  User.isUserExists("email", email).then((isExists) => {
    if (isExists) {
      return res.status(501).json({
        message: `User with email: ${email} already exists.`,
      });
    }
  });

  User.create(req.body).then((doc) => {
    return res.status(201).json({
      data: [
        {
          ...doc._doc,
        },
      ],
    });
  });
};

const getUsers = (req, res, next) => {
  User.find().then((users) => {
    res.status(200).json({
      data: [...users],
    });
  });
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((doc) => {
      res.json({
        data: [
          {
            ...doc._doc,
          },
        ],
      });
    })
    .catch(({ message }) => {
      return res.status(400).json({
        message,
      });
    });
};

const updateUser = (req, res, next) => {
  const email = req.body.email || "";
  const userId = req.params.userId || "";
  User.isUserExists("email", email).then((isExists) => {
    if (isExists) {
      return res.status(501).json({
        message: `User with email: ${email} already exists.`,
      });
    }
  });

  User.findOneAndUpdate({ _id: userId }, { ...req.body })
    .then((doc) => {
      return res.json({
        data: [
          {
            ...doc._doc,
          },
        ],
      });
    })
    .catch(({ message }) => {
      return res.status(500).json({
        message,
      });
    });
};

const deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .then(() => {
      return res.status(204).json({});
    })
    .catch(({ message }) => {
      return res.status(400).json({
        message,
      });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
