const request = require("supertest");
const app = require("../../server");
const newProduct = require("../data/new-product.json");

let firstProduct = {};

it("POST /api/products", async () => {
  const response = await request(app).post("/api/products").send(newProduct);

  // 성공 status
  expect(response.statusCode).toBe(201);
  // 성공 response가 맞는 지
  expect(response.body.name).toBe(newProduct.name);
  expect(response.body.description).toBe(newProduct.description);
});

it("should return 500 on POST /api/products", async () => {
  const response = await request(app)
    .post("/api/products")
    .send({ name: "Missing description property" });

  // 실패 status
  expect(response.statusCode).toBe(500);
  // 적절한 error message가 확인 되는 지
  expect(response.body).toStrictEqual({
    message:
      "Product validation failed: description: Path `description` is required.",
  });
});

it("GET /api/products", async () => {
  const response = await request(app).get("/api/products");

  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBeTruthy();
  expect(response.body[0].name).toBeDefined();
  expect(response.body[0].description).toBeDefined();
  firstProduct = response.body[0];
});

it("GET /api/products/:productId", async () => {
  const response = await request(app).get(`/api/products/${firstProduct._id}`);

  expect(response.statusCode).toBe(200);
  expect(response.body.name).toBe(firstProduct.name);
  expect(response.body.description).toBe(firstProduct.description);
});

it("GET id doesnt exist /api/products/:productId", async () => {
  const response = await request(app).get(
    `/api/products/655511487ac4ffa071ad5011`
  );

  expect(response.statusCode).toBe(404);
});

it("PUT /api/products/:productId", async () => {
  const updatedProduct = {
    name: "updated name",
    description: "updated description",
  };

  const response = await request(app)
    .put(`/api/products/${firstProduct._id}`)
    .send(updatedProduct);

  expect(response.statusCode).toBe(200);
  expect(response.body.name).toBe(updatedProduct.name);
  expect(response.body.description).toBe(updatedProduct.description);

  firstProduct = response.body;
});

it("PUT id doesnt exist /api/products/:productId", async () => {
  const response = await request(app).put(
    `/api/products/655511487ac4ffa071ad5011`
  );

  expect(response.statusCode).toBe(404);
});

it("DELETE /api/products/:productId", async () => {
  const response = await request(app).delete(
    `/api/products/${firstProduct._id}`
  );

  expect(response.statusCode).toBe(200);
  expect(response.body.name).toBe(firstProduct.name);
  expect(response.body.description).toBe(firstProduct.description);
});

it("DELETE id doesnt exist /api/products/:productId", async () => {
  const response = await request(app).delete(
    `/api/products/655511487ac4ffa071ad5011`
  );

  expect(response.statusCode).toBe(404);
});
