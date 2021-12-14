const express = require("express");

const cacheStore = require("../redis");
const userController = require("../controllers/user");

const router = express.Router();

// middleware cache
const usersCache = (req, res, next) => {
  cacheStore
    .get(`users`)
    .then((data) => {
      if (data) {
        return res.status(200).json(JSON.parse(data));
      } else {
        return next();
      }
    })
    .catch((err) =>
      res.status(500).json({
        message: err.message,
      })
    );
};

const userDataCache = (req, res, next) => {
  const userId = req.params.userId;

  cacheStore
    .get(`user.${userId}`)
    .then((data) => {
      if (data) {
        return res.status(200).json(JSON.parse(data));
      } else {
        next();
      }
    })
    .catch((err) =>
      res.status(500).json({
        message: err.message,
      })
    );
};

const userPostCache = (req, res, next) => {
  const userId = req.params.userId;

  cacheStore
    .get(`user.${userId}.posts`)
    .then((data) => {
      if (data) {
        return res.status(200).json(JSON.parse(data));
      } else {
        next();
      }
    })
    .catch((err) =>
      res.status(500).json({
        message: err.message,
      })
    );
};

router
  .route("/")
  .post(userController.createUser)
  .get(usersCache, userController.getUsers);

router
  .route("/:userId")
  .get(userDataCache, userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router
  .route("/:userId/post")
  .post(userController.createPost)
  .get(userPostCache, userController.getPosts);

module.exports = router;
