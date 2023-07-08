const express = require('express');
const bodyParser = require('body-parser')
const {EventEmitter} = require('events');

const app = express();

app.use(bodyParser.json());

const tasks = [];

const eventEmitter = new EventEmitter();

// Add a new task
app.post('/tasks', (req, res) => {
  const task = req.body;
  tasks.push(task);
  eventEmitter.emit('taskAdded', task);
  res.status(201).json(task);
});

// update a task
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const updatedTask = req.body;

  const task = tasks.find(task => task.id === id);
  if(task) {
    task.title = updatedTask.title;
    task.description = updatedTask.description;
    eventEmitter.emit('taskUpdated', task);
    res.json(task);
  }else{
    res.status(404).json({message: 'Task not found'});;
  }
});

// Delete a task
app.delete('tasks/:id', (req, res) => {
  const id = req.params.id;
  const index = tasks.find(task => task.id === id);
  if(index !== -1){
    const deletedTask = task.splice(index, 1);
    eventEmitter.emit('taskDeleted', deletedTask);
    res.sendStatus(204);
  }else{
    res.staus(404).json({message : "Task not found"});;
  }
});


// Event Handlers
eventEmitter.on('taskAdded', (task) => {
  // Perfom necessary action on task added
  console.log('Task added', task);
})

eventEmitter.on('taskUpdated', (task) => {
  // Perform necessary actions when a task is updated
  console.log('Task updated:', task);
});

eventEmitter.on('taskDeleted', (task) => {
  // Perform necessary actions when a task is deleted
  console.log('Task deleted:', task);
});


app.listen(3000, () => {
  console.log('server working at 3000');
});