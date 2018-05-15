// Collection of utility functions used across the server

const getUpdatedProps = (body) => {
  const updatedUser = {};
  Object.keys(body).forEach((prop) => {
    if (prop === 'dob') updatedUser[prop] = Date.parse(body[prop]);
    else updatedUser[prop] = body[prop];
  });
  return updatedUser;
};

const isAdmin = (req, res, next) => {
  if (res.locals.isAdmin) next();
  else res.json({ message: 'Forbidden Route. User does not possess admin rights.' });
};

module.exports = { getUpdatedProps, isAdmin };
