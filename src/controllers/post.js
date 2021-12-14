// cache
const cacheStore = require("../redis");
// models
const Post = require("../models/post");

const getPosts = (req, res) => {
  Post.find().then((posts) => {
    const response = {
      data: [...posts],
    };
    cacheStore
      .set("posts", JSON.stringify(response))
      .then(() => {
        return res.status(200).json(response);
      })
      .catch(({ message }) => res.status(500).json({ message }));
  });
};

const getPostById = (req, res) => {
  const postId = req.params.postId || "";
  Post.findById(postId).then((doc) => {
    if (!doc) return res.status(400).json({});
    
    const response = {
      data: [
        {
          ...doc._doc,
        },
      ],
    };
    cacheStore.set(`posts.${postId}`, JSON.stringify(response))
      .then(() => res.status(200).json(response))
      .catch(({ message }) => res.status(500).json({ message }));
  });
};

const updatePost = (req, res) => {
  Post.findByIdAndUpdate(req.params.postId, { ...req.body })
    .then((doc) => {
      Promise.all([
        cacheStore.set(`posts`, ""),
        cacheStore.set(`posts.${req.params.postId}`, ""),
      ]).finally(() => {
        return res.status(200).json({
          data: [
            {
              ...doc._doc,
            },
          ],
        });
      });
    })
    .catch(({ message }) => {
      return res.status(500).json({
        message,
      });
    });
};

const deletePost = (req, res) => {
  Post.findByIdAndDelete(req.params.postId)
    .then(() => {
      Promise.all([
        cacheStore.set(`posts`, ""),
        cacheStore.set(`posts.${req.params.postId}`, ""),
      ]).finally(() => res.status(204).json({}));
    })
    .catch(({ message }) => {
      return res.status(400).json({
        message,
      });
    });
};

module.exports = {
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
