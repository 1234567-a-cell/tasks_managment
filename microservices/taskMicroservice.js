const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "exam",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

const taskProtoPath = 'proto/task.proto';
const taskProtoDefinition = protoLoader.loadSync(taskProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const taskProto = grpc.loadPackageDefinition(taskProtoDefinition).task;

const taskService = {
  getTask: (call, callback) => {  

    const taskId = call.request.task_id;
    console.log('Received task ID:', taskId);
    const query = 'SELECT * FROM tasks WHERE id = ?';
    connection.query(query, [taskId], (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      if (results.length === 0) {
        callback(new Error(`Record with id ${taskId} not found`));
        return;
      }
      const task = results[0];

      callback(null, {
        task: {
          id: task.id,
          title: task.title,
          description: task.description,
          status:task.status,
          category:task.category,

        },
      });
    });
  },
  
  searchTasks: (call, callback) => {
    const { query } = call.request;
    const searchQuery = `SELECT * FROM tasks`;
    connection.query(searchQuery, (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      const tasks = results.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status:task.status,
        category:task.category,
      }));
      callback(null, { tasks });
    });
  },
  

  createTask: (call, callback) => {
    const { title, description,status,category } = call.request;
      const query = 'INSERT INTO tasks (title, description,status,category) VALUES (?,?,?,?)';
      connection.query(query, [title, description,status,category], (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      const createdTask = {
        id: results.insertId,
        title,
        description,
        status,
        category,
      };
  
      callback(null, { task: createdTask });
    });
  },
    updateTask: (call, callback) => {
    const task_id = call.request.task_id;
    const { title, description,status,category } = call.request;
    const query = 'UPDATE tasks SET title = ?, description = ?, status = ?, category=? WHERE id = ?';
    connection.query(query, [title, description, status,category, task_id], (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      if (results.affectedRows === 0) {
        const notFoundError = new Error(`Task with ID ${task_id} not found`);
        callback(notFoundError);
        return;
      }
  
      const updatedTask = {
        id: task_id,
        title,
        description,
        status,
        category,
      };
  
      callback(null, { task: updatedTask });
    });
  },
  deleteTask: (call, callback) => {
    const task_id = call.request.task_id;
    const query = 'DELETE FROM tasks WHERE id = ?';
    connection.query(query, [task_id], (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      if (results.affectedRows === 0) {
        const notFoundError = new Error(`Task with ID ${task_id} not found`);
        callback(notFoundError);
        return;
      }
  
      callback(null, { task_id });
    });
  }
};
  
const server = new grpc.Server();
server.addService(taskProto.TaskService.service, taskService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
  
    console.log(`Server is running on port ${port}`);
    server.start();
  });
console.log(`task microservice running on port ${port}`);
