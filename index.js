const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const process = require('dotenv').config();

const port = process.parsed.port;
const personUrl = 'mongodb://127.0.0.1:27017/personDB';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// the validation or schema
const mondoDBSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
  },
  description: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

const ProductModal = mongoose.model('Products', mondoDBSchema);

// the default function for mongoose server connection
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

// product post to the mongoDB
app.post('/products', async (request, response) => {
  try {
    const titleBody = request.body.title,
      priceBody = request.body.price,
      ratingBody = request.body.rating,
      descriptionBody = request.body.description;

    const newProduct = new ProductModal({
      title: titleBody,
      price: priceBody,
      rating: ratingBody,
      description: descriptionBody,
    });

    const productData = await newProduct.save();

    response.status(201).send(productData);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

// get product and using query operator
app.get('/products', async (request, response) => {
  try {
    const price = request.query.price;
    const rating = request.query.rating;
    let getProduct;
    if (price && rating) {
      getProduct = await ProductModal.find({
        $or: [{ price: { $lt: price } }, { rating: { $lt: rating } }],
      });
    } else {
      getProduct = await ProductModal.find();
    }

    if (getProduct) {
      response.status(200).send({
        success: true,
        message: 'return all product',
        data: getProduct,
      });
    } else {
      response.status(404).send({ message: 'products not found' });
    }
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

// find product with id
app.get('/products/:id', async (request, response) => {
  try {
    const id = request.params.id;
    const getProduct = await ProductModal.findOne({
      _id: id,
    }).select({
      title: 1,
      _id: 0,
      price: 1,
    });
    if (getProduct) {
      response
        .status(200)
        .send({ message: 'return single product', data: getProduct });
    } else {
      response
        .status(500)
        .send({ success: false, message: 'product not found' });
    }
  } catch (error) {
    response.status(500).send({ message: error.message });
  }
});

// here are our server listen
app.listen(port, async () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
  await connectDB();
});
