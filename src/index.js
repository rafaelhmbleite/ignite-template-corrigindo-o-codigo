const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];


function checkExistsRepository(request, response, next){
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id);
  if (!repository){
    return response.status(404).json({error:"repository not found"});
  }
  request.repository = repository;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checkExistsRepository,(request, response) => {
  const { repository } = request;
  const { title, url, techs} = request.body;
  if (title){
    repository.title = title;
  };
  if (url){
    repository.url = url;
  };
  if (techs){
    repository.techs = techs;
  };
  return response.json(repository);
});

app.delete("/repositories/:id", checkExistsRepository,(request, response) => {
  const { repository } = request;
  const index = repositories.findIndex(rep => rep === repository);
  repositories.splice(index, 1);
  return response.status(204).json();
});

app.post("/repositories/:id/like", checkExistsRepository, (request, response) => {
  const { repository } = request;
  repository.likes += 1;
  return response.status(201).json(repository);
});

module.exports = app;
