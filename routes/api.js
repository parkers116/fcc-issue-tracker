/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

// var expect = require('chai').expect;
const mongoose = require("mongoose");
const issuesSchema = require("../models/issues.js");

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let Issues = mongoose.model("Issues", issuesSchema, req.params.project);
      Issues.find(req.query, (err, data) => {
        if (err) {
          res.send(err);
          return;
        }
        res.json(data);
      });
    })

    .post(function (req, res) {
      let Issues = mongoose.model("Issues", issuesSchema, req.params.project);
      let new_issues = new Issues({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to ? req.body.assigned_to : "",
        status_text: req.body.status_text ? req.body.status_text : "",
      });

      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        res.send("missing inputs");
        return;
      }

      new_issues.save((err, data) => {
        if (err) {
          res.send(err);
          return;
        }

        delete data._doc.__v;

        res.json(data);
      });
    })

    .put(function (req, res) {
      let Issues = mongoose.model("Issues", issuesSchema, req.params.project);
      let isAllEmpty = true;
      let issue_id = req.body._id;
      delete req.body._id;

      Object.keys(req.body).forEach((item) => {
        if (req.body[item] == "") {
          delete req.body[item];
        } else {
          isAllEmpty = false;
        }
      });

      if (isAllEmpty) {
        res.send("no updated field sent");
        return;
      }

      req.body.updated_on = new Date();

      Issues.updateOne({ _id: issue_id }, { $set: req.body }, (err, data) => {
        if (err || !data) {
          res.send(`could not update ${issue_id}`);
          return console.error(err);
        }
        res.send("successfully updated");
      });
    })

    .delete(function (req, res) {
      let Issues = mongoose.model("Issues", issuesSchema, req.params.project);

      if (req.body._id === undefined) {
        res.send("_id error");
        return;
      }

      Issues.deleteOne({ _id: req.body._id }, (err, data) => {
        if (err || !data) {
          res.send(`could not delete ${req.body._id}`);
          return;
        }
        res.send(`deleted ${req.body._id}`);
      });
    });
};
