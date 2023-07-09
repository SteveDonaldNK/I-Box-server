function init(mongoose) {
    // Connect to MongoDB using the provided connection URL
    mongoose
      .connect(
        `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.soor9qp.mongodb.net/i-boxDB`,
        { useNewUrlParser: true, useUnifiedTopology: true }
      )
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
      });
  }
  
  module.exports = init;
  