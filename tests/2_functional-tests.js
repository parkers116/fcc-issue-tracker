/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  suite("POST /api/issues/{project} => object with issue data", function () {
    test("Every field filled in", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Every field filled in"
          );
          assert.equal(res.body.assigned_to, "Chai and Mocha");
          assert.equal(res.body.status_text, "In QA");
          assert.exists(res.body.created_on);
          assert.exists(res.body.updated_on);
          assert.exists(res.body.open);
          assert.exists(res.body._id);
          done();
        });
    });

    test("Required fields filled in", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Required fields filled in",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(
            res.body.created_by,
            "Functional Test - Required fields filled in"
          );
          assert.property(res.body, "assigned_to");
          assert.property(res.body, "status_text");
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          assert.property(res.body, "open");
          assert.property(res.body, "_id");
          done();
        });
    });

    test("Missing required fields", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          created_by: "Functional Test - Missing required fields",
          assigned_to: "Chai and Mocha",
          status_text: "In QA",
        })
        .end(function (err, res) {
          assert.equal(res.text, "missing inputs");
          done();
        });
    });
  });

  suite("PUT /api/issues/{project} => text", function () {
    test("No body", function (done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .end(function (err, res) {
          assert.equal(res.text, "no updated field sent");
          done();
        });
    });

    test("One field to update", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA",
        })
        .end(function (err, res) {
          chai
            .request(server)
            .put("/api/issues/test")
            .send({ _id: res.body._id, issue_text: "modified issue_text" })
            .end(function (err, res) {
              assert.equal(res.text, "successfully updated");
              done();
            });
        });
    });

    test("Multiple fields to update", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA",
        })
        .end(function (err, res) {
          chai
            .request(server)
            .put("/api/issues/test")
            .send({
              _id: res.body._id,
              issue_title: "modified issue_title",
              issue_text: "modified issue_text",
              created_by: "modified created_by",
              assigned_to: "modified assigned_to",
              status_text: "modified status_text",
            })
            .end(function (err, res) {
              assert.equal(res.text, "successfully updated");
              done();
            });
        });
    });
  });

  suite(
    "GET /api/issues/{project} => Array of objects with issue data",
    function () {
      test("No filter", function (done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "updated_on");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "_id");
            done();
          });
      });

      test("One filter", function (done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({ open: false })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "updated_on");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "_id");
            assert.isFalse(res.body[0].open);
            done();
          });
      });

      test("Multiple filters (test for multiple fields you know will be in the db for a return)", function (done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({ open: false, issue_title: "testing issue" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "updated_on");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "_id");

            assert.isFalse(res.body[0].open);
            assert.equal(res.body[0].issue_title, "testing issue");
            done();
          });
      });
    }
  );

  suite("DELETE /api/issues/{project} => text", function () {
    test("No _id", function (done) {
      chai
        .request(server)
        .delete("/api/issues/test")
        .end(function (err, res) {
          assert.equal(res.text, "_id error");
          done();
        });
    });

    test("Valid _id", function (done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA",
        })
        .end(function (err, res) {
          let id = res.body._id;
          chai
            .request(server)
            .delete("/api/issues/test")
            .send({
              _id: res.body._id,
            })
            .end(function (err, res) {
              assert.equal(res.text, `deleted ${id}`);
              done();
            });
        });
    });
  });
});
