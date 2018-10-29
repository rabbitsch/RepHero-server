const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const faker = require("faker");
const mongoose = require("mongoose");
const expect = chai.expect;
chai.use(chaiHttp);

const { User } = require("../src/models/user-model");
const { app, runServer, closeServer } = require("../src/server");
const { JWT_SECRET, TEST_DATABASE_URL } = require("../src/config");

function seedLoginData(
  firstnamefaker,
  lastnamefaker,
  usernamefaker,
  passwordfaker
) {
  return User.hashPassword(passwordfaker).then(hash => {
    return User.create({
      firstname: firstnamefaker,
      lastname: lastnamefaker,
      username: usernamefaker,
      password: hash
    });
  });
}

function generateLoginData() {
  return {
    firstnamefaker: faker.name.firstName(),
    lastnamefaker: faker.name.lastName(),
    usernamefaker: faker.internet.userName(),
    passwordfaker: faker.internet.password()
  };
}

function tearDownDb() {
  console.warn("Deleting database");
  return mongoose.connection.dropDatabase();
}

describe("Auth endpoints", function() {
  const {
    firstnamefaker,
    lastnamefaker,
    usernamefaker,
    passwordfaker
  } = generateLoginData();

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedLoginData(
      firstnamefaker,
      lastnamefaker,
      usernamefaker,
      passwordfaker
    );
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe("/api/login", function() {
    it("should reject requests with invalid credentials", function() {
      return chai
        .request(app)
        .post("/api/login")
        .send({ username: "", password: "" })
        .then(res => {
          expect(res).to.have.status(400);
        });
    });
    it("should reject requests with invalid passwords", function() {
      return chai
        .request(app)
        .post("/api/login")
        .send({ username: usernamefaker, password: "invalidpassword" })
        .then(res => {
          expect(res).to.have.status(401);
        });
    });
    it("should return an auth token", function() {
      return chai
        .request(app)
        .post("/api/login")
        .send({ username: usernamefaker, password: passwordfaker })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          const token = res.body.authToken;
          expect(token).to.be.a("string");
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ["HS256"]
          });
        });
    });
  });
});
