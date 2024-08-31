'use strict';

import { MongoClient } from 'mongodb';
import { database } from './config.js';
var _db;

class Database {
  constructor() {
    this.connect = function (app, callback) {
      MongoClient.connect(database.url, database.options, function (err, client) {
        if (err) {
          console.log('Error connecting to MongoDB:', err);
          callback(err);
        } else {
          const db = client.db(database.name);
          _db = db;
          app.locals.db = db;
          console.log('Connected to MongoDB');

          // Initialize collections
          db.listCollections({ name: 'highscore' }).next((err, collinfo) => {
            if (!collinfo) {
              db.createCollection('highscore', (err, res) => {
                if (err) throw err;
                console.log('Highscore collection created!');

                // Create indexes
                db.collection('highscore').createIndex({ score: -1 }, (err, result) => {
                  if (err) throw err;
                  console.log('Index on score created:', result);
                });

                // Seed initial data
                seedHighscores(db);
              });
            } else {
              // Seed initial data if collection already exists
              seedHighscores(db);
            }
          });

          db.listCollections({ name: 'users' }).next((err, collinfo) => {
            if (!collinfo) {
              db.createCollection('users', (err, res) => {
                if (err) throw err;
                console.log('Users collection created!');
              });
            }
          });

          callback(null, db);
        }
      });
    };

    this.getDb = function (app, callback) {
      if (!_db) {
        this.connect(app, function (err) {
          if (err) {
            console.log('Failed to connect to database server');
          } else {
            console.log('Connected to database server successfully');
          }
          callback(err, _db);
        });
      } else {
        callback(null, _db);
      }
    };
  }
}

function seedHighscores(db) {
  db.collection('highscore').countDocuments((err, count) => {
    if (err) throw err;
    if (count === 0) {
      const initialHighscores = [
        { name: 'Player1', cloud: 'AWS', zone: 'us-east-1', host: 'host1', score: 1000, level: 5, timestamp: new Date() },
        { name: 'Player2', cloud: 'GCP', zone: 'us-central1', host: 'host2', score: 900, level: 4, timestamp: new Date() },
        { name: 'Player3', cloud: 'Azure', zone: 'eastus', host: 'host3', score: 800, level: 3, timestamp: new Date() }
      ];
      db.collection('highscore').insertMany(initialHighscores, (err, result) => {
        if (err) throw err;
        console.log('Initial highscores seeded:', result.insertedCount);
      });
    }
  });
}

export default new Database();