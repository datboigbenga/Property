const createTokenUser = (user) => {
  return {name:user.firstname, userId: user._id, role: user.role };
};

module.exports = createTokenUser;
