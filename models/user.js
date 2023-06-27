module.exports = (mongoose) => {
    const userSchema = mongoose.Schema({
      username: {
        type: String,
      },
      fullName: {
        type: String,
      },
      email: {
        type: String,
      },
      password: {
        type: String,
      },
      biography: {
        type: String,
      },
      socialNetworks: {
        twitter: {
          type: String,
        },
        instagram: {
          type: String,
        },
      },
    });
  
    return mongoose.model('users', userSchema);
  };