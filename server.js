// server.js
// where your node app starts

// init project
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// Global variables to represent Database
var TODOS = {
  'todo1': { 'task': 'build an API'},
  'todo2': { 'task': '?????'},
  'todo3': { 'task': 'profit!'},
};

var HEROES = [
  {'id': 1, 'name': 'Batman', 'age': 55},
  {'id': 2, 'name': 'Wonder Woman', 'age': 25},
  {'id': 3, 'name': 'Damntrecky', 'age': 30},
];

function abort_if_todo_doesnt_exist(id) {

}

/**
 * @description Get the hero object based on id
 * @param {*} id 
 */
function getHeroByIndex(id) {
  for (let i=0;i<HEROES.length;i++) {
    if (HEROES[i].id == id) return i;
  }
  return -1;
}

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/zinggrid.html');
});

// http://expressjs.com/en/starter/basic-routing.html'

// get list of todos
app.get('/todos', (req, res) => {
  try {
    res.status(200).send(TODOS);
  } catch(e) {
    res.status(500).send('Error fetching /todos');
  }
});
// create todo
app.post('/todos', (req, res) => {
  try {
    let newTodo = req.body;
    let todoID = `todo${TODOS.length}`;
    TODOS[todoID] = newTodo
    res.status(201).send(newTodo);
  } catch(e) {
    res.status(500).send('Error creating /todos');
  }
});
// get a single hero
app.get('/todos/:todoId', (req, res) => {
  try {
    var heroID = req.params.id;
    let heroIndex = getHeroByIndex(heroID);
    if (heroIndex === -1) res.status(404).send(`Hero {} doesn't exist ${heroID}`);
    else {
      res.status(200).send(HEROES[heroIndex]);
    }
  } catch(e) {
    res.status(500).send(`Error getting /heroes/${heroID}`, e);
  }
});
// delete a hero
app.delete('/todos/:todoId', (req, res) => {
  try {
    var heroID = req.params.id;
    let heroIndex = getHeroByIndex(heroID);
    if (heroIndex === -1) res.status(404).send(`Hero {} doesn't exist ${heroID}`);
    else {
      delete HEROES[heroIndex];
      res.sendStatus(204);
    }
  } catch(e) {
    res.status(500).send(`Error getting /todos/${heroID}`, e);
  }
});
// function to update hero with PATCH/PUT
function updateTodo(req, res) {
  try {
    var heroID = req.params.id;
    let updateBody = req.body;
    let heroIndex = getHeroByIndex(heroID);
    if (heroIndex === -1) res.status(404).send(`Hero {} doesn't exist ${heroID}`);
    else {
      let heroObj = HEROES[heroIndex];
      // update all keys but id
      for (key in updateBody) {
        if (key != 'id') heroObj[key] = updateBody[key];
      }
      res.status(201).send(heroObj);
    }
  } catch(e) {
    res.status(500).send(`Error updating /todos/${heroID}`, e);
  }
};
// update a hero field (single cell update)
app.patch('/todos/:todoId', updateTodo);
app.put('/todos/:todoId', updateTodo);

// get a list of heroes
app.get('/heroes', (req, res) => {
  try {
    res.status(200).send(HEROES);
  } catch(e) {
    res.status(500).send('Error fetching /heroes');
  }
});
// create a hero
app.post('/heroes', (req, res) => {
  try {
    let newHero = req.body;
    let heroID = HEROES.length;
    newHero.id = heroID;
    HEROES.push(newHero);
    res.status(201).send(newHero);
  } catch(e) {
    res.status(500).send('Error creating /todos');
  }
});
// get a single hero
app.get('/heroes/:id', (req, res) => {
  try {
    var heroID = req.params.id;
    let heroIndex = getHeroByIndex(heroID);
    if (heroIndex === -1) res.status(404).send(`Hero {} doesn't exist ${heroID}`);
    else {
      res.status(200).send(HEROES[heroIndex]);
    }
  } catch(e) {
    res.status(500).send(`Error getting /heroes/${heroID}`, e);
  }
});
// delete a hero
app.delete('/heroes/:id', (req, res) => {
  try {
    var heroID = req.params.id;
    let heroIndex = getHeroByIndex(heroID);
    if (heroIndex === -1) res.status(404).send(`Hero {} doesn't exist ${heroID}`);
    else {
      delete HEROES[heroIndex];
      res.sendStatus(204);
    }
  } catch(e) {
    res.status(500).send(`Error getting /heroes/${heroID}`, e);
  }
});
// function to update hero with PATCH/PUT
function updateHero(req, res) {
  try {
    var heroID = req.params.id;
    let updateBody = req.body;
    let heroIndex = getHeroByIndex(heroID);
    if (heroIndex === -1) res.status(404).send(`Hero {} doesn't exist ${heroID}`);
    else {
      let heroObj = HEROES[heroIndex];
      // update all keys but id
      for (key in updateBody) {
        if (key != 'id') heroObj[key] = updateBody[key];
      }
      res.status(201).send(heroObj);
    }
  } catch(e) {
    res.status(500).send(`Error updating /heroes/${heroID}`, e);
  }
};
// update a hero field (single cell update)
app.patch('/heroes/:id', updateHero);
app.put('/heroes/:id', updateHero);


// listen for requests :)
const listener = app.listen(process.env.PORT || 8000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
