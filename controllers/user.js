const createUser = (req, res, next) => {
  res.status(201).json({
    username: "testuser",
  });
};

const getUsers = (req, res, next) => {
  res.json({
    data: [{ username: "testuser" }, { username: "test2" }],
  });
};

const getUserById = (req, res, next) => {
  res.json({
    username: req.params.userId,
  });
};

const updateUser = (req, res, next) => {
  res.json({
    username: req.params.userId,
  });
};
const deleteUser = (req, res, next) => {
    res.status(204);
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
