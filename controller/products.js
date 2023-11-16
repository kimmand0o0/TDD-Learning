const { response } = require("express");
const productModel = require("../models/Product");

exports.createProduct = async (request, response, next) => {
  try {
    const createProduct = await productModel.create(request.body);
    response.status(201).json(createProduct);
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (request, response, next) => {
  try {
    const allProducts = await productModel.find({});
    response.status(200).json(allProducts);
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (request, response, next) => {
  try {
    const product = await productModel.findById(request.params.productId);

    if (product) {
      response.status(200).json(product);
    } else {
      response.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (request, response, next) => {
  try {
    const updateProduct = await productModel.findByIdAndUpdate(
      request.params.productId,
      request.body,
      { new: true }
    );

    if (updateProduct) {
      response.status(200).json(updateProduct);
    } else {
      response.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (request, response, next) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(
      request.params.productId
    );

    if (deletedProduct) {
      response.status(200).json(deletedProduct);
    } else {
      response.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};
