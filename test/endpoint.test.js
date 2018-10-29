const chai = require("chai");
const mongoose = require("mongoose");
const chaihttp = require("chai-http");
const faker = require("faker");
const jwt = require("jsonwebtoken");

const expect = chai.expect;
const should = chai.should();
mongoose.Promise = global.Promise;

const Visit = require("../src/models/visit");
const config = require("../src/config");

const { closeServer, runServer, app } = require("../src/server");
const { TEST_DATABASE_URL, JWT_SECRET } = require("../src/config");

chai.use(chaihttp);

function tearDownDb() {
  console.log("Deleting database");
  return mongoose.connection.dropDatabase();
}

//Seed Data base
function seedingData(
  idFaker,
  dateFaker,
  officeFaker,
  goalsFaker,
  outcomeFaker,
  nextgoalsFaker
) {
  console.log("seeding DB");
  const seedData = [];
  for (let i = 0; i <= i.length; i++) {
    seedData.push({
      id: faker.random.uuid(),
      date: faker.address.date(),
      office: faker.lorem.words(),
      goals: faker.lorem.words(),
      outcome: faker.lorem.words(),
      nextgoals: faker.lorem.words()
    });
    return Visit.insertMany(seedData);
  }
}

const preAuthHost = function() {
  const genPassword = "Password";
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    username: faker.name.firstName(),
    password: "123Password"
  };
};

const createAuthToken = function(user) {
  console.log("hi! create Token");
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: "HS256"
  });
};

describe("preparing endpoints for tests", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedingData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe("testing my GET endpoints", function() {
    it("should return all posts", function() {
      let res;
      return Visit.find()
        .then(host => {
          const user1 = preAuthHost(host);
          let authToken = createAuthToken(user1);
          return chai
            .request(app)
            .get("/api/visits")
            .set("Authorization", `Bearer ${authToken}`)
            .send(this._id);
        })

        .then(_res => {
          res = _res;
          expect(res).to.have.status(200);
        });
    });

    it("should test posts with correct fields", function() {
      let respPost;
      const newUserid = this._id;
      return Visit.findOne()
        .then(host => {
          const user1 = preAuthHost(host);
          let authToken = createAuthToken(user1);
          // console.log('>>>>',{newUserid})

          return chai
            .request(app)
            .get("/api/visits")
            .set("Authorization", `Bearer ${authToken}`)
            .send({ newUserid });
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          res.body.forEach(data => {
            expect(data).to.include.keys(
              "id",
              "date",
              "office",
              "goals",
              "outcome",
              "nextgoals"
            );
          });
          respPost = res.body[0];
        });
    });
  });
});
