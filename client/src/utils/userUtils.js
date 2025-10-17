export const getUsernameById = (userId, profiles) => {
    const user = profiles.find((p) => p._id === userId);
    return user ? user.name : 'Unknown User';
};
  