process.stdin.setEncoding("utf8");
const { throws } = require("assert");
const express = require("express");
const fs = require("fs");
const http = require("http");
const path = require("path")
const app = express();
const bodyParser = require("body-parser"); /* To handle post parameters */

app.use(bodyParser.urlencoded({extended:false}));


class Item{
  #cost;

  constructor(name, cost){
    this.name = name;
    this.#cost = cost;
  }

  price() {
    return this.#cost.toFixed(2);
  }
}

process.stdout.write("Web server started and running at http://localhost:5001\n")

if (process.argv.length != 3) {
    process.stdout.write(`Usage ${process.argv[1]} jsonFile`);
    process.exit(1);
}

const file = process.argv[2];
json = fs.readFileSync(file);

const lst = JSON.parse(json).itemsList;
const prompt = 'Type itemsList or stop to shutdown the server\n'
process.stdout.write(prompt)
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

let itemsList = [];
lst.forEach(elm => itemsList.push(new Item(elm.name, elm.cost)))

let itemsTable = "<table border = '1'> <tr> <th>Item</th> <th>Cost</th> </tr>"
itemsList.forEach(elm => itemsTable += "<tr> <td>" + elm.name + "</td> <td>" + elm.price() + "</td> </tr>")
itemsTable += "</table>"

let items = "";
itemsList.forEach(elm => items += "<option value=" + JSON.stringify(elm.name) + ">" + elm.name + "</option>\n")

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

app.get("/", (request, response) => {
    response.render("index");
});
app.get("/catalog", (request, response) => {
    response.render("displayItems", {itemsTable});
});
app.get("/order", (request, response) => {
    response.render("placeOrder", {items});
});
app.post("/order", (request, response) => {
  const {name, email, delivery, itemsSelected} = request.body;

  let orderTable = "<table border = '1'> <tr> <th> Item </th> <th> Cost </th> </tr>";
  total = 0;
  itemsSelected.forEach(elm => {let itm = itemsList.find(itm => itm.name === elm); total += Number(itm.price()); orderTable += "<tr> <td>" + elm + "</td><td>" + itm.price() + "</td></tr>"})
  
  orderTable += "<tr> <td> Total Cost: </td><td>" + total.toFixed(2) + "</td></table>"
  response.render("orderConfirmation", {name, email, delivery, orderTable});
});

app.listen(5001)