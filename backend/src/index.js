const express = require("express");

const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const customers = [];

//Middleware

function varifyIfExistsAccountCpf(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf == cpf);

  if (!customer) {
    return response.status(400).json({ error: "Customers not found!" });
  }
  request.customer = customer;
  return next();
}

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

// app.use(varifyIfExistsAccountCpf) todos os metodos que estão abaixo vai fazer essa validação
app.get("/statement", varifyIfExistsAccountCpf, (request, response) => {
  const { customer } = request;

  return response.json(customer.statement);
});

app.post("/deposit", varifyIfExistsAccountCpf, (request, response) => {
  const { description, amount } = request.body;
  const { customer } = request;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };
  customer.statement.push(statementOperation);

  return response.status(201).send();
});

//add a porta
app.listen(3333);
