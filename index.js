const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const process = require('dotenv').config();

const port = process.parsed.port;
const personUrl = 'mongodb://127.0.0.1:27017/personDB';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mondoDBSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

const ProductModal = mongoose.model('Products', mondoDBSchema);

/*
mongoose
  .connect('mongodb://127.0.0.1:27017/personDB')
  .then(() => console.log('database connected'))
  .catch((error) => console.log('error here', error));
*/

const connectDB = async () => {
  try {
    await mongoose.connect(personUrl);
    console.log('Database is connected');
  } catch (error) {
    console.log(`Here are error : ${error}`);
  }
};

app.get('/', (request, response) => {
  response.status(202).send(`<h1>Default page</h1>`);
});

app.post('/products', async (request, response) => {
  try {
    const titleBody = request.body.title,
      priceBody = request.body.price,
      descriptionBody = request.body.description;

    const newProduct = new ProductModal({
      title: titleBody,
      price: priceBody,
      description: descriptionBody,
    });

    const productData = await newProduct.save();

    response.status(201).send(productData);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

app.get('/products', (request, response) => {});

app.listen(port, async () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
  await connectDB();
});
