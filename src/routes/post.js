const express = require("express");

const cacheStore = require("../redis");
const postController = require("../controllers/post");

const router = express.Router();

// middleware cache
const cache = (req, res, next) => {
  //  temp bypass
  next();
  
  const postId = req.params.postId || "";

  if (!postId) {
    return cacheStore.get(`posts`, (err, data) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (data !== null) {
        return res.status(200).json(data);
      } else {
        return next();
      }
    });
  }

  cacheStore.get(`posts.${postId}`, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
    if (data !== null) {
      return res.status(200).json(data);
    } else {
      next();
    }
  });
};

router.route("/").get(cache, postController.getPosts);

router
  .route("/:postId")
  .get(cache, postController.getPostById)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;
