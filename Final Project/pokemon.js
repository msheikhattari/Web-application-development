const path = require("path");
const express = require("express");
const app = express();
require("dotenv").config({ path: path.resolve(__dirname, '.env') }) 
const bodyParser = require("body-parser");
process.stdin.setEncoding("utf8");
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(bodyParser.urlencoded({extended:false}));

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const databaseAndCollection = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION};
const uri = `mongodb+srv://${userName}:${password}@cluster0.xzc4opc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

app.get("/", (request, response) => {
    response.render("index");
});

app.get("/pokePicker", async (request, response) => {
    response.render("pokePicker");
});

app.get("/pokeViewer", async (request, response) => {
    response.render("pokeViewer");
});

app.post("/processPokePicker", async (request, response) => {
    const {name} = request.body;
    const poke = {name: name, id: Math.floor(Math.random() * 905) + 1};
    await submitPoke(poke)
    response.render("processPokePicker");
})

app.post("/processPokeViewer", async (request, response) => {
    let {name} = request.body;
    let res = await lookupName(name);
    let pokemon;
    let img;
    if(res.id != "NONE"){
        json = await fetch(`https://pokeapi.co/api/v2/pokemon/${res.id}`).then(x => x.json());
        pokemon = json.name;
        img = `<img src = ${json.sprites?.front_default}>`;
    }else{
        pokemon = "None :(";
        img = "";
    }
    response.render("processPokeViewer", {name, pokemon, img})
})

async function submitPoke(poke) {
    await client.connect();
    await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(poke);
    await client.close();
}

async function lookupName(nameProvided) {
    await client.connect();
    let filter = {name: nameProvided};
    const result = await client.db(databaseAndCollection.db)
                        .collection(databaseAndCollection.collection)
                        .findOne(filter);
    await client.close();
    if(result){
        return result;
    }
    return {name: nameProvided, id:"NONE"};
}

app.listen(4000)