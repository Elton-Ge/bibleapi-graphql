import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import {MongoClient} from 'mongodb';
import graphqlHTTP from 'express-graphql';

import parser from './parser';
import schema from '../schema';
import queryMapper from '../db/queryMapper';

dotenv.config();

const app = express();


const db = process.env.MONGODB_DATABASE;
const user = process.env.MONGODB_USERNAME;
const pass = process.env.MONGODB_PASSWORD;
const devEnv = process.env.NODE_ENV;
const mongoDbUrl = devEnv === 'development' ? 'mongodb://localhost:27017/bibleapi' :
    `mongodb+srv://${user}:${pass}@cluster0.eycqi.mongodb.net/${db}?retryWrites=true&w=majority`
MongoClient.connect(mongoDbUrl, (error, mongoPool) => {

    if (error) {
        console.error(error);
        return;
    }

    // Enable CORS with various options
    // https://github.com/expressjs/cors
    app.use(cors());

    app.use('/graphql', graphqlHTTP({
        schema,
        graphiql: true,
        context: {parser, queryMapper, mongoPool}
    }));

    const nodePort = process.env.NODE_PORT || 3333;

    app.listen(nodePort, () => {
        console.info(`GraphQL server is listening on port ${nodePort}`);
    });

});
