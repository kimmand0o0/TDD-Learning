const httpMocks = require("node-mocks-http");

const newProduct = require("../data/new-product.json");
const allProducts = require("../data/all-products.json");

const productController = require("../../controller/products");
const productModel = require("../../models/Product");

productModel.create = jest.fn();
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndDelete = jest.fn();

const productId = 1;
const updatedProduct = {
  name: "updated name",
  description: "updated description",
};

// 이 파일 내 전역으로 적용 시키기 위하여 우선 선언
let request, response, next;
// 가장 먼저 작동하여 request, response, next를 만든다
beforeEach(() => {
  request = httpMocks.createRequest();
  response = httpMocks.createResponse();
  next = jest.fn();
});

describe("Product Controller Create", () => {
  // describe 안에서만 작용한다
  beforeEach(() => {
    request.body = newProduct;
  });

  // 타입이 함수가 맞는 지
  it("should have a createProduct function", () => {
    expect(typeof productController.createProduct).toBe("function");
  });

  // Product Model이 호출되는 지
  it("should call productModel.create", async () => {
    await productController.createProduct(request, response, next);

    expect(productModel.create).toBeCalledWith(newProduct);
  });

  // 성공 status와 값이 오고있는 지
  it("should return 201 response code", async () => {
    await productController.createProduct(request, response, next);

    expect(response.statusCode).toBe(201);
    expect(response._isEndCalled()).toBeTruthy();
  });

  // 리턴 값이 올바르게 오고 있는 지
  it("should return json body in response", async () => {
    productModel.create.mockReturnValue(newProduct);

    await productController.createProduct(request, response, next);

    expect(response._getJSONData()).toStrictEqual(newProduct);
  });

  // error가 발생할 시
  it("should handle errors", async () => {
    const errorMessage = { message: "description property missing" };
    const rejectedPromise = Promise.reject(errorMessage);

    productModel.create.mockReturnValue(rejectedPromise);

    await productController.createProduct(request, response, next);

    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("Product Controller Get", () => {
  // 타입이 함수가 맞는 지
  it("should have a getProducts function", () => {
    expect(typeof productController.getProducts).toBe("function");
  });

  // find 매서드가 호출 되는 지
  it("should call ProductModel.find({})", async () => {
    await productController.getProducts(request, response, next);
    expect(productModel.find).toHaveBeenCalledWith({});
  });

  // 성공 status 및 response로 데이터를 전송 하는 지
  it("should return 200 response", async () => {
    await productController.getProducts(request, response, next);
    expect(response.statusCode).toBe(200);
    expect(response._isEndCalled).toBeTruthy();
  });

  // 데이터가 json 데이터 형식으로 알맞게 들어오고 있는 지
  it("should return json body in response", async () => {
    productModel.find.mockReturnValue(allProducts);
    await productController.getProducts(request, response, next);

    expect(response._getJSONData()).toStrictEqual(allProducts);
  });

  // error 발생 시
  it("should handle errors", async () => {
    const errorMessage = { message: "Error finding product data" };
    const rejectedPromise = Promise.reject(errorMessage);

    productModel.find.mockReturnValue(rejectedPromise);

    await productController.getProducts(request, response, next);

    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("Product Controller GetById", () => {
  it("should have a getProductById", () => {
    expect(typeof productController.getProductById).toBe("function");
  });

  it("should call Product.findById", async () => {
    request.params.productId = productId;
    await productController.getProductById(request, response, next);

    expect(productModel.findById).toBeCalledWith(productId);
  });

  it("should return json body and response code 200", async () => {
    request.params.productId = productId;
    productModel.findById.mockReturnValue(newProduct);

    await productController.getProductById(request, response, next);

    expect(response.statusCode).toBe(200);
    expect(response._isEndCalled()).toBeTruthy();
    expect(response._getJSONData()).toStrictEqual(newProduct);
  });

  it("should return 404 when item doesnt exist", async () => {
    productModel.findById.mockReturnValue(null);

    await productController.getProductById(request, response, next);

    expect(response.statusCode).toBe(404);
    expect(response._isEndCalled).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error" };
    const rejectedPromise = Promise.reject(errorMessage);

    productModel.findById.mockReturnValue(rejectedPromise);

    await productController.getProductById(request, response, next);

    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("Product Controller Update", () => {
  it("should have an updateProduct function", () => {
    expect(typeof productController.updateProduct).toBe("function");
  });

  it("should call productModel.findByIdAndUpdate", async () => {
    request.params.productId = productId;
    request.body = updatedProduct;

    await productController.updateProduct(request, response, next);

    expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
      productId,
      updatedProduct,
      { new: true }
    );
  });

  it("should return json body and response code 200", async () => {
    request.params.productId = productId;
    request.body = updatedProduct;

    productModel.findByIdAndUpdate.mockReturnValue(updatedProduct);

    await productController.updateProduct(request, response, next);

    expect(response.statusCode).toBe(200);
    expect(response._isEndCalled()).toBeTruthy();
    expect(response._getJSONData()).toStrictEqual(updatedProduct);
  });

  it("should return 404 when item doesnt exist", async () => {
    productModel.findByIdAndUpdate.mockReturnValue(null);

    await productController.updateProduct(request, response, next);

    expect(response.statusCode).toBe(404);
    expect(response._isEndCalled).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error" };
    const rejectedPromise = Promise.reject(errorMessage);

    productModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);

    await productController.updateProduct(request, response, next);

    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("Product Controller Delete", () => {
  it("should have a deleteProduct function", () => {
    expect(typeof productController.deleteProduct);
  });

  it("should call productModel.findByIdAndDelete", async () => {
    request.params.productId = productId;

    await productController.deleteProduct(request, response, next);

    expect(productModel.findByIdAndDelete).toHaveBeenCalledWith(productId);
  });

  it("should return json body and response code 200", async () => {
    const deletedProduct = {
      name: "deletedProduct",
      description: "it is deleted",
    };
    request.params.productId = productId;

    productModel.findByIdAndDelete.mockReturnValue(deletedProduct);

    await productController.deleteProduct(request, response, next);

    expect(response.statusCode).toBe(200);
    expect(response._isEndCalled()).toBeTruthy();
    expect(response._getJSONData()).toStrictEqual(deletedProduct);
  });

  it("should return 404 when item doesnt exist", async () => {
    productModel.findByIdAndDelete.mockReturnValue(null);

    await productController.deleteProduct(request, response, next);

    expect(response.statusCode).toBe(404);
    expect(response._isEndCalled).toBeTruthy();
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Error" };
    const rejectedPromise = Promise.reject(errorMessage);

    productModel.findByIdAndDelete.mockReturnValue(rejectedPromise);

    await productController.deleteProduct(request, response, next);

    expect(next).toBeCalledWith(errorMessage);
  });
});
