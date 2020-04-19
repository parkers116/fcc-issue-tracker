/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

// var expect = require('chai').expect;
const mongoose = require('mongoose');
require('../models/issues.js');

module.exports = function (app) {
  app
    .route('/api/issues/:project')

    .get(function (req, res) {
      console.log(req.body);
    })

    .post(function (req, res) {
      console.log(req.body);
      let Issues = mongoose.model('Issues');
      let new_issues = new Issues({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
      });

      new_issues.save((err, data) => {
        if (err) {
          return console.error(err);
        }

        res.json({ data });
      });
    })

    .put(function (req, res) {
      console.log(req.body);
    })

    .delete(function (req, res) {
      // var project = req.params.project;
      console.log(req.body);
    });
};
