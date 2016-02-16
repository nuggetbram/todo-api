var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');


var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Todo api root');
});

app.get('/todos', function (req, res) {
    var query = req.query;
    var where = {};
    
    if (query.hasOwnProperty('completed') && (query.completed === 'true')) {
        where.completed = true;
    }
    else if(query.hasOwnProperty('completed') && (query.completed === 'false')) {
        where.completed = false;
    }
    
    if(query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
          $like: '%' + query.q + '%'  
        };
    }
    
    db.todo.findAll({where: where}).then(function(todos) {
        res.json(todos);
    }, function(e) {
        res.status(500).send();
    });
    /*var filteredTodos = todos;

    if (queryParams.completed && (queryParams.completed === 'true')) {
        filteredTodos = _.where(todos, {
            completed: true
        });
    } else if (queryParams.completed && (queryParams.completed === 'false')) {
        filteredTodos = _.where(todos, {
            completed: false
        });
    }

    if (queryParams.q && (queryParams.q.length > 0)) {
        filteredTodos = _.filter(filteredTodos, function (todo) {
            if (todo.description.toLowerCase.indexOf(queryParams.q.toLowerCase) === -1) {
                return false;
            }
            return true;
        });
    }



    res.json(filteredTodos);*/
});

app.get('/todos/:id', function (req, res) {
    var todoID = parseInt(req.params.id, 10);
    var matchedTodo = db.todo.findById(todoID)
    .then(function (todo) {
        if(todo) {
            res.json(todo);
        } else {
            res.status(404).send();
        }
    }, function() {
        res.status(400).send();
    });
});

app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body)
    .then(function(todo) {
        res.json(todo.toJSON());                
    }, function(e) {
        res.status(400).json(e);
    });
});

app.delete('/todos/:id', function (req, res) {
    var todoID = parseInt(req.params.id, 10);
    
    where = {
        id: todoID
    };
    
    db.todo.destroy({where: where}).then(function (deletedItems) {
        if(deletedItems === 0) {
            res.status(404).send();
        } else {
            res.status(204).send();
        }
    }, function(e) {
       res.status(500).send(); 
    });
    /*var matchedTodo = _.findWhere(todos, {
        id: todoID
    });

    if (matchedTodo) {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);

    } else {
        res.status(404).send();
    }*/
});

app.put('/todos/:id', function (req, res) {
    var todoID = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};
    
    if (body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }

    if (body.hasOwnProperty('description')) {
        attributes.description = body.description;
    } 

    db.todo.findById(todoID).then(function(todo) {
        if(todo) {
            todo.update(attributes)
                .then(function(todo) {
                    res.json(todo.toJSON());
                }, function(e) {
                    res.status(400).json(e);
                });
        } else {
            res.status(404).send();
        }
    }, function() {
        res.status(500).send();
    });
});

db.sequelize.sync().then(function() {
    app.listen(PORT, function () {
        console.log('Express listening on port: ' + PORT);
    });
});

