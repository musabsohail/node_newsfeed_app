const mongoose = require("mongoose");
const validator = require("validator");

const schemaTypes = mongoose.Schema.Types;

const postSchema = mongoose.Schema({
  user: schemaTypes.ObjectId,
  title: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
