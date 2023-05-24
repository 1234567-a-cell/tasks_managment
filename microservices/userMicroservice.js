const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const bcrypt = require("bcrypt");
let saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const jwt = require("jsonwebtoken");
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

const userProtoPath = 'proto/user.proto';
const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(userProtoDefinition).user;

const userService = {
  getUser: (call, callback) => {  

    const userId = call.request.user_id;
    console.log('Received user ID:', userId);
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      if (results.length === 0) {
        callback(new Error(`Record with id ${userId} not found`));
        return;
      }
      const user = results[0];

      callback(null, {
        user: {
          id: user.id,
          name: user.name,
          age: user.age,
          email:user.email,
          password:user.password,
          tasks:user.tasks,

        },
      });
    });
  },
  searchUsers: (call, callback) => {
    const { query } = call.request;
    const searchQuery = `SELECT * FROM users`;
    connection.query(searchQuery, (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      const user = results.map(user => ({
        id: user.id,
        name: user.name,
        age: user.age,
        email:user.email,
        password:user.password,
        tasks:user.tasks,
      }));
      callback(null, { user:user });
    });
  },
  

  // createUser: (call, callback) => {
  //   const { name, age,email,password,tasks_id } = call.request;
  //   const hash = bcrypt.hashSync(password, salt);
  //   console.log(tasks_id);
  //     const query = 'INSERT INTO users (name, age,email,password,tasks_id) VALUES (?,?,?,?,?)';
  //     connection.query(query, [name, age,email,hash,tasks_id], (error, results) => {
  //     if (error) {
  //       console.error(error);
  //       callback(error);
  //       return;
  //     }
  //     const createdUser = {
  //       id: results.insertId,
  //       name:name,
  //       age:age,
  //       email:email,
  //       password:hash,
  //       tasks_id:tasks_id,
        
  //     };
  
  //     callback(null, { user: createdUser });
  //   });
  // },
  createUser: (call, callback) => {
    const { name, age, email, password, tasks_id } = call.request;
    const hash = bcrypt.hashSync(password, salt);
  
    const createUserQuery = 'INSERT INTO users (name, age, email, password) VALUES (?, ?, ?, ?)';
    const createUserParams = [name, age, email, hash];
  
    connection.query(createUserQuery, createUserParams, (error, userResult) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
  
      const userId = userResult.insertId;
  
      if (!Array.isArray(tasks_id)) {
        
        const userTasksQuery = 'INSERT INTO user_tasks (id_user, id_tasks) VALUES (?, ?)';
        const userTasksParams = [userId, tasks_id];
  
        connection.query(userTasksQuery, userTasksParams, (tasksError) => {
          if (tasksError) {
            console.error(tasksError);
            callback(tasksError);
            return;
          }
  
          const createdUser = {
            id: userId,
            name: name,
            age: age,
            email: email,
            password: hash,
            tasks_id: [tasks_id],
          };
  
          callback(null, { user: createdUser });
        });
      } else if (tasks_id.length > 0) {
        
        const userTasksQuery = 'INSERT INTO user_tasks (id_user, id_tasks) VALUES ?';
        const userTasksParams = tasks_id.map((taskId) => [userId, taskId]);
  
        connection.query(userTasksQuery, [userTasksParams], (tasksError) => {
          if (tasksError) {
            console.error(tasksError);
            callback(tasksError);
            return;
          }
  
          const createdUser = {
            id: userId,
            name: name,
            age: age,
            email: email,
            password: hash,
            tasks_id: tasks_id,
          };
  
          callback(null, { user: createdUser });
        });
      } else {
        const createdUser = {
          id: userId,
          name: name,
          age: age,
          email: email,
          password: hash,
          tasks_id: [],
        };
  
        callback(null, { user: createdUser });
      }
    });
  },
 
    updateUser: (call, callback) => {
    const user_id = call.request.user_id;
    const { name, age,email,tasks_id} = call.request;
    const query = 'UPDATE users SET name = ?, age = ?, email = ?, tasks_id=? WHERE id = ?';
    connection.query(query, [name, age,email,tasks_id, user_id], (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      if (results.affectedRows === 0) {
        const notFoundError = new Error(`users with ID ${user_id} not found`);
        callback(notFoundError);
        return;
      }
  
      const updatedUser = {
        id: user_id,
        name,
        age,
        email,
        tasks_id,
      };
  
      callback(null, { user: updatedUser });
    });
  },
  deleteUser: (call, callback) => {
    const user_id = call.request.user_id;
    const query = 'DELETE FROM users WHERE id = ?';
    connection.query(query, [user_id], (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      if (results.affectedRows === 0) {
        const notFoundError = new Error(`User with ID ${user_id} not found`);
        callback(notFoundError);
        return;
      }
  
      callback(null, { user_id });
    });
  },
  authUser: (call, callback) => {
    const { email, password } = call.request;
    const query = "SELECT * from users where email = ?";
    connection.query(query, [email], (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      if (results.length == 0) {
        callback({ message: "user not found" });
        return;
      }
      const user = results[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          callback(err);
        } else if (result) {
          const token = jwt.sign({ id: user.id }, "secret", {
            expiresIn: "2h",
          });
          callback(null, { user: user, token: token });
        } else {
          callback({ message: "password dont match" });
        }
      });
    });
  },
};
  
const server = new grpc.Server();
server.addService(userProto.UserService.service, userService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
  
    console.log(`Server is running on port ${port}`);
    server.start();
  });
console.log(`user microservice running on port ${port}`);
