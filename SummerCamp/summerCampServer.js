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

if (process.argv.length != 3) {
    process.stdout.write(`Usage ${process.argv[1]} portNumber`);
    process.exit(1);
}
const portNumber = Number(process.argv[2]);

process.stdout.write(`Web server started and running at http://localhost:${portNumber}\n`)
process.stdout.write(`Stop to shutdown the server: `)

process.stdin.on("readable", function () {
    let input = process.stdin.read();
    if (input !== null) {
      let command = input.trim();
      if (command === "itemsList") {
        process.stdout.write(JSON.stringify(lst) + "\n");
      } else if (command === "stop") {
        process.stdout.write("Shutting down the server\n");
        process.exit(0);
      } else {
        process.stdout.write(`Invalid command: ${input}`)
      }
      process.stdout.write(prompt);
      process.stdin.resume();
    }
  });

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

app.get("/", (request, response) => {
    response.render("index");
});

app.get("/apply", async (request, response) => {
    response.render("application");
});

app.get("/reviewApplication", async (request, response) => {
    response.render("review");
});

app.post("/processApplication", async (request, response) => {
    const {name, email, gpa, background} = request.body;
    const application = {name: name, email: email, gpa: gpa, background: background}
    await submitApp(application)
    response.render("processed", {name: name, email: email, gpa: gpa, background: background})
});

app.post("/processReviewApplication", async (request, response) => {
    let {email} = request.body;
    let res = await lookupEmail(email);
    const {name, junk, gpa, background} = res;
    if(name === "NONE"){
        email = "NONE";
    }
    response.render("processed", {name: name, email: email, gpa: gpa, background: background})
})

app.get("/adminRemove", (request, response) => {
    response.render("remove")
})

app.get("/processAdminRemove", async (request, response) => {
    let result = await clearDoc();

    response.render("processRemove", {number: result.deletedCount})
})

app.get("/adminGPA", (request, response) => {
    response.render("gpa")
})

app.post("/processAdminGPA", async (request, response) => {
    const {gpa} = request.body;
    table = "<table border = '1'><tr><th>Name</th><th>GPA</th></tr>"
    let result = await lookupGPA(gpa);
    result.forEach(x => {table += `<tr><td>${x.name}</td><td>${x.gpa}</td></tr>`})
    table += "</table>";
    
    response.render("processgpa", {table: table});
})
  
app.listen(portNumber)

async function submitApp(app) {
    await client.connect();
    await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(app);
    await client.close();
}

async function lookupEmail(emailProvided) {
    await client.connect();
    let filter = {email: emailProvided};
    const result = await client.db(databaseAndCollection.db)
                        .collection(databaseAndCollection.collection)
                        .findOne(filter);
    await client.close();
    if(result){
        return result;
    }
    return {name: "NONE", email: "NONE", gpa: "NONE", background:"NONE"};
}

async function clearDoc() {
    await client.connect();
    const result = await client.db(databaseAndCollection.db)
        .collection(databaseAndCollection.collection)
        .deleteMany({});
    await client.close();
    return result;
}

async function lookupGPA(gpaGiven) {
    await client.connect();
    let filter = {gpa: {$gte: gpaGiven}};
    const cursor = await client.db(databaseAndCollection.db)
                        .collection(databaseAndCollection.collection)
                        .find(filter);

    if(cursor){
        let result = await cursor.toArray();
        await client.close();
        return result;
    }

    await client.close();
    return [];
}
