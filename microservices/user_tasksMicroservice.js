const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
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

const userTasksProtoPath = 'proto/user_tasks.proto';
const userTasksProtoDefinition = protoLoader.loadSync(userTasksProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userTasksProto = grpc.loadPackageDefinition(userTasksProtoDefinition).user_tasks;

const userTasksService = {
    AddUserTask: (call, callback) => {
    const { id_user, id_tasks } = call.request;
    const queryCheck =
      "SELECT  * from user_tasks where id_user = ? and id_tasks = ?";
    connection.query(queryCheck, [id_user, id_tasks], (error, res) => {
      if (res.length === 0) {
        const query =
          "INSERT INTO user_tasks (id_user, id_tasks) VALUES (?,?)";
        connection.query(
          query,
          [id_user, id_tasks],
          (err, results) => {
            if (err) return callback(new Error(err));
            const user_tasks = {
              id: results.insertId,
              id_user: id_user,
              id_tasks: id_tasks,
            };
            callback(null, {  user_tasks });
          }
        );
      } else {
        const query = "DELETE FROM user_tasks where id_user = ? and id_tasks = ?";
        connection.query(query, [id_user, id_tasks], (err, results) => {
          if (err) return callback(new Error(err));
          const user_tasks = {
            id: results.insertId,
            id_user: id_user,
            id_tasks: id_tasks,
            
          };
          callback(null, {  user_tasks });
        });
      }
    });
  },
  GetUserTask: (call, callback) => {
    const id_user = call.request.id_user;
    const query =
      "SELECT * from user_tasks LEFT JOIN tasks ON (user_tasks.id_tasks=tasks.id) where user_tasks.id_user = " +
      id_user;
    connection.query(query, (err, results) => {
      if (err) {
        return callback(new Error(err));
      }
      const user_tasks = results.map((user_tasks) => ({
        id_user_task: user_tasks.id_user_task,
        id_user: user_tasks.id_user,
        id_tasks: user_tasks.id_tasks,
        task: {
          id: user_tasks.id_tasks,
          title: user_tasks.title,
          description: user_tasks.description,
          status:user_tasks.status,
        },
      }));
      callback(null, { user_tasks: user_tasks });
    });
  },
  DeleteFromUserTask: (call, callback) => {
    const id_userTask = call.request.id_user_task;
    console.log(id_userTask);
    const query = "DELETE FROM user_tasks where id_user_task = ?";

    connection.query(query, [id_userTask], (err, results) => {
      if (err) {
        return callback(new Error(err));
      }
      if (results.affectedRows == 0) {
        callback(null, { res: "id not found" });
      } else {
        callback(null, { res: "deleted" });
      }
    });
  },
};

const server = new grpc.Server();

server.addService(userTasksProto.userTasksService.service, userTasksService);

const port = 50054;

server.bindAsync(
  `0.0.0.0:${port}`,
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Failed to bind server:", err);
      return;
    }

    console.log(`Server is running on port ${port}`);
    server.start();
  }
);
console.log(`User tasks microservice running on port ${port}`);