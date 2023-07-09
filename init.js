function init(mongoose) {
    // Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/iboxDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));
 
}

module.exports = init;