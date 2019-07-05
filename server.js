import express from 'express';
import mongodb from 'mongodb'
import bodyParser from 'body-parser';

import { validate } from './validator';

const app = express();
app.use(bodyParser.json());
const dbUrl = 'mongodb://127.0.0.1:27017/';


mongodb.MongoClient.connect(dbUrl, { useNewUrlParser: true }, function (err, client) {
    console.log("Connected to DB successfully");

    const db = client.db("reactwithredux2");

    // GET ALL MOVIES
    app.get("/api/movies", (req, res) => {

        db.collection('movies').find({}).toArray((err, movies) => {
            res.json({ movies });
        });
    });

    // GET MOVIE BY ID
    app.get('/api/movies/:_id', (req, res) => {
        db.collection('movies').findOne({ _id: new mongodb.ObjectId(req.params._id) }, (err, movie) => {
            res.json({ movie });
        });
    });

    // ADD MOVIE
    app.post('/api/movies', (req, res) => {
        const { errors, isValid } = validate(req.body);
        console.log(errors);
        console.log(isValid);
        if (isValid) {
            const { title, release_year, format, stars } = req.body;
            db.collection('movies').insert({ title, release_year, format, stars }, (err, result) => {
                if (err) {
                    res.status(500).json({ errors: { global: "Something went wrong" } });
                } else {
                    res.json({ movie: result.ops[0] });
                }
            })
        } else {
            res.status(400).json({ errors });
        }
    });

    // UPDATE MOVIE
    app.put('/api/movies/:_id', (req, res) => {
        const { errors, isValid } = validate(req.body);

        if (isValid) {
            const { title, release_year, format, stars } = req.body;
            db.collection('movies').findOneAndUpdate(
                { _id: new mongodb.ObjectId(req.params._id) },
                { $set: { title, release_year, format, stars } },
                { returnOriginal: false },
                (err, result) => {
                    if (err) { res.status(500).json({ errors: { global: err } }); return; }

                    res.json({ movie: result.value });
                }
            );
        } else {
            res.status(400).json({ errors });
        }
    });

    app.delete('/api/movies/:_id', (req, res) => {
        db.collection('movies').deleteOne({ _id: new mongodb.ObjectId(req.params._id) }, (err, r) => {
            if (err) { res.status(500).json({ errors: { global: err } }); return; }

            res.json({});
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            errors: {
                global: "Still working on it. Pleasy try again later when we implement it"
            }
        });
    })

    app.listen(8123, () => console.log('Server is running on localhost:8123'));
});



