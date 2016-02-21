var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
           len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

var User = sequelize.define('user', {
    email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync().then(function() {
    console.log("Synchronised");
    
    User.create({
        email: 'example@example.com'
    })
    .then(function() {
        return Todo.create({
            description: 'Stuff'
        });    
    })
        .then(function(todo) {
            User.findById(1).then(function(user) {
            user.addTodo(todo); 
            });
        });
    });
