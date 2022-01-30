const express = require("express");

const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const customers = [];

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;
  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf == cpf
  );

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "Customers already exists!" });
  }

  customers.push({ cpf, name, id: uuidv4(), statement: [] });
  return response.status(201).send();
});

app.get("/statement", (request, response) => {
  const { cpf } = request.headers;
  const customer = customers.find((customer) => customer.cpf == cpf);
  if (!customer) {
    return response.status(400).json({ error: "Customers not found!" });
  }
  return response.json(customer.statement);
});

/*

app.put('/courses/:id', (request, response) => {
    const params = request.params;
    return response.json(params.id);
});

app.patch('/courses/:id', (request, response) => {
    return response.json(["corse 1","course 2"]);
});

app.delete('/courses/:id', (request, response) => {
    return response.json(["corse 1","course 2"]);
});
 */

//add a porta
app.listen(3333);
