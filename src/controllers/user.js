// cache store
const cacheStore = require("../redis");

// models
const User = require("../models/user");
const Post = require("../models/post");

const createUser = (req, res) => {
  const email = req.body.email || "";

  User.isUserExists("email", email).then((isExists) => {
    if (isExists) {
      return res.status(501).json({
        message: `User with email: ${email} already exists.`,
      });
    }
  });

  User.create(req.body).then((doc) => {
    const response = {
      data: [
        {
          ...doc._doc,
        },
      ],
    };
    try {
      cacheStore.set("users", null);
      cacheStore.set(`user.${doc._doc._id}`, JSON.stringify(response));
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }

    return res.status(201).json(response);
  });
};

const getUsers = (req, res) => {
  User.find().then((users) => {
    const response = {
      data: [...users],
    };

    try {
      cacheStore.set("users", JSON.stringify(response));
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }

    return res.status(200).json(response);
  });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((doc) => {
      const response = {
        data: [
          {
            ...doc._doc,
          },
        ],
      };

      try {
        cacheStore.set(`user.${doc._doc._id}`, JSON.stringify(response));
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }

      res.status(200).json(response);
    })
    .catch(({ message }) => {
      return res.status(400).json({
        message,
      });
    });
};

const updateUser = (req, res) => {
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
      try {
        cacheStore.set("users", null);
        cacheStore.set(`user.${doc._doc._id}`, null);
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }

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

const deleteUser = (req, res) => {
  User.deleteOne({ _id: req.params.userId })
    .then(() => {
      try {
        cacheStore.set("users", null);
        cacheStore.set(`user.${doc._doc._id}`, null);
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }

      return res.status(204).json({});
    })
    .catch(({ message }) => {
      return res.status(400).json({
        message,
      });
    });
};

const createPost = (req, res) => {
  const userId = req.params.userId;

  Post.create({
    user: userId,
    ...req.body,
  }).then((doc) => {
    try {
      cacheStore.set(`user.${userId}.posts`, null);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }

    return res.status(201).json({
      data: [
        {
          ...doc._doc,
        },
      ],
    });
  });
};

const getPosts = (req, res) => {
  const userId = req.params.userId;
  Post.find({ user: userId }).then((posts) => {
    const response = {
      data: posts.map(({ title, content, createdAt }) => ({
        title,
        content,
        createdAt,
      })),
    };
    try {
      cacheStore.set(`user.${userId}.posts`, JSON.stringify(response));
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }

    return res.status(200).json(response);
  });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createPost,
  getPosts,
};
