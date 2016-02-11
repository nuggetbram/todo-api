var express = require('express');
var app = express();

var PORT = process.env.PORT || 3000;

var todos = [{
    id: 1,
    description: 'Do some stuff.',
    completed: false
}, {
    id: 2,
    description: 'Do some more stuff.',
    completed: false
}, {
    id: 3,
    description: 'Even more stuff!',
    completed: true
}];

app.get('/', function(req, res) {
    res.send('Todo api root');
});

app.get('/todos', function(req, res) {
   res.json(todos); 
});

app.get('/todos/:id', function(req, res) {
    var todoID = parseInt(req.params.id, 10);
    var matchedTodo;
   
    todos.forEach(function(todo) {
       if(todoID === todo.id) {
           matchedTodo = todo;
       } 
    });
    
    if(matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
 
});

app.listen(PORT, function() {
    console.log('Express listening on port: ' + PORT);
});