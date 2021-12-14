// cache
const cache = require("../redis");
// models
const Post = require("../models/post");

const getPosts = (req, res) => {
  Post.find().then((posts) => {
    return res.status(200).json({
      data: [...posts],
    });
  });
};

const getPostById = (req, res) => {
  const postId = req.params.postId || "";
  Post.findById(postId).then((doc) =>
    res.status(200).json({
      data: [
        {
          ...doc._doc,
        },
      ],
    })
  );
};

const updatePost = (req, res) => {
  Post.findByIdAndUpdate(req.params.postId, { ...req.body })
    .then((doc) => {
      return res.status(200).json({
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

const deletePost = (req, res) => {
  Post.findByIdAndDelete(req.params.id)
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
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
