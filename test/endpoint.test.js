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
  outcomeFaker
) {
  console.log("seeding DB");
  const seedData = [];
  for (let i = 0; i <= i.length; i++) {
    seedData.push({
      id: faker.random.uuid(),
      date: faker.address.date(),
      office: faker.lorem.words(),
      goals: faker.lorem.words(),
      outcome: faker.lorem.words()
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
              "outcome"
            );
          });
          respPost = res.body[0];
        });
    });

    describe("testing POST endpoints", function(done) {
      it("should add a new post", function() {
        return Visit.findOne().then(host => {
          const user1 = preAuthHost(host);

          let authToken = createAuthToken(user1);
          // console.log('>>>>',{newUserid})
        });
        return chai
          .request(app)
          .get("/api/users/whoami")
          .set("Authorization", `Bearer ${authToken}`)
          .then(data => {
            const newDate = faker.date.recent();
            const newOffice = faker.lorem.words();
            const newGoals = faker.lorem.words();
            const newOutcome = faker.lorem.words();

            console.log(data.id, ">>>>>>>>>>>>");

            return chai
              .request(app)
              .post("/api/visits")
              .set("Content-Type", "application/json")
              .set("Authorization", `Bearer ${authToken}`)
              .send({
                user: this.id,
                date: newDate,
                office: newOffice,
                goals: newGoals,
                outcome: newOutcome
              });
          })

          .then(res => {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a("object");
            expect(res.body).to.include.keys(
              "date",
              "office",
              "goals",
              "outcome"
            );
          });
      });
    });

    describe("testing my put endpoint", function() {
      it("should test my put end point", function() {
        const newDate = faker.date.recent();
        const newOffice = faker.random.uuid();
        const newGoals = faker.lorem.words();
        const newOutcome = faker.lorem.words();

        return chai
          .request(app)
          .post("/api/visits")
          .set("Content-Type", "application/json")
          .send({
            id: this.id,
            date: newDate,

            goals: newGoals,
            outcome: newOutcome
          });
        const updatedContent = {
          newDate: faker.date.recent(),

          newGoals: faker.lorem.words(),
          newOutcome: faker.lorem.words()
        };

        return Visit.findOne()
          .then(note => {
            return chai
              .request(app)
              .put(`/api/visits/${id}`)
              .send(updatedContent);
          })
          .then(res => {
            expect(res).to.have.status(204);
            return City.findbyId(updatedContent.id);
          })
          .then(post => {
            expect(post.date).to.equal(updatedContent.date);
            expect(post.office).to.equal(updatedContent.office);
            expect(post.goals).to.equal(updatedContent.goals);
            expect(post.outcome).to.equal(updatedContent.outcome);
          });
      });
    });

    describe("test the delete endpoint", function() {
      it("should test my delete endpoint", function() {
        const newDate = faker.date.recent();
        const newOffice = faker.random.uuid();
        const newGoals = faker.lorem.words();
        const newOutcome = faker.lorem.words();

        return chai
          .request(app)
          .post("/api/visits")
          .set("Content-Type", "application/json")
          .send({
            id: this.id,
            date: newDate,
            office: this.id,
            goals: newGoals,
            outcome: newOutcome
          });
        let post;

        return Visit.findOne()
          .then(_post => {
            post = _post;
            return chai.request(app).delete(`/${id}`);
          })
          .then(res => {
            expect(res).to.have.status(204);
            return Visit.findById(post.id);
          })
          .then(tst => {
            expect(tst).to.be.null;
          });
      });
    });
  });
});
