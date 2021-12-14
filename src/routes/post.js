const express = require("express");

const cacheStore = require("../redis");
const postController = require("../controllers/post");

const router = express.Router();

// middleware cache
const cache = (req, res, next) => {
  const postId = req.params.postId || "";

  if (postId) {
    return cacheStore
      .get(`posts.${postId}`)
      .then((data) => {
        if (data) {
          return res.status(200).json(JSON.parse(data));
        } else {
          next();
        }
      })
      .catch(({ message }) => {
        return res.status(500).json({
          message,
        });
      });
  }

  return cacheStore
    .get(`posts`)
    .then((data) => {
      if (data) {
        return res.status(200).json(JSON.parse(data));
      } else {
        next();
      }
    })
    .catch(({ message }) => {
      return res.status(500).json({
        message,
      });
    });
};

router.route("/").get(cache, postController.getPosts);

router
  .route("/:postId")
  .get(cache, postController.getPostById)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;
