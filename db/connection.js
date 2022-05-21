const MongoClient = require('mongodb').MongoClient
require('dotenv').config();

class connection {
    static async open(){
        if(this.db) {
            return this.db
        }
        try {
            this.db = await MongoClient.connect(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
            return this.db
        } catch (err){
            console.log(err)
        }
    }
}

connection.url = process.env.MONGO_URI;
connection.db = null;

module.exports = {connection};