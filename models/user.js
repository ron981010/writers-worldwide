module.exports = (mongoose) => {
    const userSchema = mongoose.Schema({
      username: String,
      fullName: String,
      email: String,
      password: String,
      biography: String,
        socialNetworks: [{
          twitter: String,
          instagram: String,
  }]
});

    return mongoose.model('user', userSchema);
  };