// cache store
const cacheStore = require("../redis");

// models
const User = require("../models/user");
const Post = require("../models/post");

const createUser = async (req, res) => {
  const email = req.body.email || "";

  const isDuplicateEmail = await User.isUserEmail("email", email);
  if (isDuplicateEmail) {
    return res.status(500).json({
      message: `User with email: ${email} already exists.`,
    });
  }

  User.create(req.body).then((doc) => {
    const response = {
      data: [
        {
          ...doc._doc,
        },
      ],
    };
    Promise.all([
      cacheStore.set("users", ""),
      cacheStore.set(`user.${doc._doc._id}`, JSON.stringify(response)),
    ])
      .finally(() => {
        return res.status(201).json(response);
      })
      .catch((error) =>
        res.status(500).json({
          message: error.message,
        })
      );
  });
};

const getUsers = (req, res) => {
  User.find().then((users) => {
    const response = {
      data: [...users],
    };

    cacheStore
      .set("users", JSON.stringify(response))
      .then(() => {
        return res.status(200).json(response);
      })
      .catch((error) =>
        res.status(500).json({
          message: error.message,
        })
      );
  });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((doc) => {
      if (!doc) return res.status(200).json({});

      const response = {
        data: [
          {
            ...doc._doc,
          },
        ],
      };

      cacheStore
        .set(`user.${doc._doc._id}`, JSON.stringify(response))
        .then(() => {
          return res.status(200).json(response);
        })
        .catch((error) =>
          res.status(500).json({
            message: error.message,
          })
        );
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
      Promise.all([
        cacheStore.set("users", ""),
        cacheStore.set(`user.${doc._doc._id}`, ""),
      ])
        .then(() => {
          return res.json({
            data: [
              {
                ...doc._doc,
              },
            ],
          });
        })
        .catch((error) =>
          res.status(500).json({
            message: error.message,
          })
        );
    })
    .catch(({ message }) => {
      return res.status(500).json({
        message,
      });
    });
};

const deleteUser = (req, res) => {
  const userId = req.params.userId;
  User.deleteOne({ _id: userId })
    .then(() => {
      Promise.all([
        cacheStore.set("users", ""),
        cacheStore.set(`user.${userId}`, ""),
      ])
        .then(() => {
          return res.status(204).json({});
        })
        .catch((error) =>
          res.status(500).json({
            message: error.message,
          })
        );
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
    cacheStore
      .set(`user.${userId}.posts`, "")
      .then(() => {
        return res.status(201).json({
          data: [
            {
              ...doc._doc,
            },
          ],
        });
      })
      .catch((error) =>
        res.status(500).json({
          message: error.message,
        })
      );
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
    cacheStore
      .set(`user.${userId}.posts`, JSON.stringify(response))
      .then(() => {
        return res.status(200).json(response);
      })
      .catch((error) =>
        res.status(500).json({
          message: error.message,
        })
      );
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
