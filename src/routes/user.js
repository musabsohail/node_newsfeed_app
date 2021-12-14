const express = require("express");

const cacheStore = require("../redis");
const userController = require("../controllers/user");

const router = express.Router();

// middleware cache
const usersCache = (req, res, next) => {
  cacheStore.get(`users`, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    if (data !== null) {
      return res.status(200).json(JSON(data));
    } else {
      return next();
    }
  });
};

const userDataCache = (req, res, next) => {
  const userId = req.params.userId;

  cacheStore.get(`user.${userId}`, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
    if (data !== null) {
      return res.status(200).json(JSON(data));
    } else {
      next();
    }
  });
};

const userPostCache = (req, res, next) => {
  const userId = req.params.userId;

  // console.log(cacheStore);

  cacheStore.get(`user.${userId}.posts`, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
    if (data !== null) {
      // console.log("Cache return");
      return res.status(200).json(JSON(data));
    } else {
      next();
    }
  });
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
