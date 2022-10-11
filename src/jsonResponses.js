const fs = require('fs');

const users = fs.readFileSync(`${__dirname}/../recipes.json`);
const json = JSON.parse(users);

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// get request for user in json
const getUsers = (request, response) => {
  const responseJSON = {
    json,
  };
  respondJSON(request, response, 200, responseJSON);
};

// POST request
const addUser = (request, response, body) => {
  // default message
  const responseJSON = {
    message: 'Name, link, Description, Author, Ingredients, and Method are all required.',
  };

  // checks to see if both the body and age are filled in
  // returns with 400 error code if both are empty
  if (!body.name || !body.link || !body.description || !body.author
    || !body.ingredients || !body.method) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code
  let responseCode = 204;

  // if the user does not exist set code 201 and create an empty user
  if (!users[body.name]) {
    responseCode = 201;
    users[body.name] = {};
  }

  // add fields for the users name and age
  users[body.name].name = body.name;
  users[body.name].link = body.link;
  users[body.name].description = body.description;
  users[body.name].author = body.author;
  users[body.name].ingredients = body.ingredients;
  users[body.name].method = body.method;

  const newData = {
    Name: users[body.name].name,
    url: users[body.name].link,
    Description: users[body.name].description,
    Author: users[body.name].author,
    Ingredients: users[body.name].ingredients,
    Method: users[body.name].method,
  };

  json.push(newData);
  // '{Name: ' + users[body.name].name + ", url: " + users[body.name].link + ', Description:'
  // + users[body.name].description + ', Author: ' + users[body.name].author + ', Ingredients:' +
  // users[body.name].ingredients + ', Method:' + users[body.name].method + '}';

  fs.writeFileSync(`${__dirname}/../recipes.json`, JSON.stringify(json));

  // if the response includes the 201 status code, use this message response
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

// runs if the page could not be found
const notReal = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for could not be located.',
    id: 'not found',
  };

  respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  getUsers,
  addUser,
  notReal,
};
