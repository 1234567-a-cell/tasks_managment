

const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require ('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');


const taskProtoPath = './proto/task.proto';
const userProtoPath = './proto/user.proto';
const categoryProtoPath = './proto/category.proto';
const userTaskProtoPath = './proto/user_tasks.proto';


const resolvers = require('./resolvers');
const typeDefs = require('./schema');
const authentication = require('./auth');


const app = express();
app.use(bodyParser.json());

const taskProtoDefinition = protoLoader.loadSync(taskProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const userProtoDefinition = protoLoader.loadSync(userProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const categoryProtoDefinition = protoLoader.loadSync(categoryProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const userTaskProtoDefinition = protoLoader.loadSync(userTaskProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  
  const taskProto = grpc.loadPackageDefinition(taskProtoDefinition).task;
  const userProto = grpc.loadPackageDefinition(userProtoDefinition).user;
  const categoryProto = grpc.loadPackageDefinition(categoryProtoDefinition).category;
  const userTasksProto = grpc.loadPackageDefinition(userTaskProtoDefinition).user_tasks;


  const clientTasks = new taskProto.TaskService('localhost:50051', grpc.credentials.createInsecure());
  const clientUsers = new userProto.UserService('localhost:50052', grpc.credentials.createInsecure());
  const clientCategory = new categoryProto.CategoryService('localhost:50053', grpc.credentials.createInsecure());
  const clientUserTasks = new userTasksProto.userTasksService('localhost:50054', grpc.credentials.createInsecure());

  
const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
    app.use(
        cors(),
        bodyParser.json(),
        expressMiddleware(server),
      );
  });
  app.post("/login", (req, res) => {
    const data = req.body;
  
    clientUsers.authUser(data, (err, response) => {
      if (err) return res.status(500).send(err);
      res.json(response);
    });
  });

app.get('/tasks',authentication, (req, res) => {
  clientTasks.searchTasks({}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.tasks);
      }
    });
  });
// add task
  app.post('/task',authentication, (req, res) => {
    const {id, title, description,status,category} = req.body;    
    clientTasks.createTask({task_id: id, title: title, description: description,status:status,category:category}, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.task);
      }
    });
  });

  
  app.get('/tasks/:id',authentication, (req, res) => {
    const id = req.params.id;
    clientTasks.getTask({ task_id: id }, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.task);
      }
    });
  });
  app.post('/tasks/update/:id',authentication, (req, res) => {
    const id = req.params.id;
    const { title, description, status, category } = req.body;
    const request = {
      task_id: id,
      title,
      description,
      status,
      category,
    };
    clientTasks.updateTask(request, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.task);
      }
    });
  });
  app.delete('/tasks/delete/:id',authentication, (req, res) => {
    const id = req.params.id;
    const request = {
      task_id: id,
    };
    clientTasks.deleteTask(request, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({ success: true });
      }
    });
  });
  app.post('/users/:id_user/tasks/:id_tasks',authentication, (req, res) => {
    const id_user = req.params.id_user;
    const id_tasks = req.params.id_tasks;
  
    const request = {
      id_user: id_user,
      id_tasks: id_tasks,
    };
  
    clientUserTasks.AddUserTask(request, (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({ success: true });
      }
    });
  });
  
  


//*********Category******* */
app.get('/categories',authentication, (req, res) => {
    clientCategory.searchCategories({}, (err, response) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(response.category);
        }
      });
    });
  // add category
    app.post('/category/add',authentication, (req, res) => {
      const {id, title} = req.body;    
      clientCategory.createCategory({category_id: id, title: title}, (err, response) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(response.category);
        }
      });
    });
  
    
    app.get('/category/:id',authentication, (req, res) => {
      const id = req.params.id_categorie;
      clientCategory.getCategory({ id_categorie: id }, (err, response) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(response.category);
        }
      });
    });
    app.post('/category/update/:id',authentication, (req, res) => {
      const id = req.params.id;
      const { title } = req.body;
      const request = {
        category_id: id,
        title,
       
      };
      clientCategory.updateCategory(request, (err, response) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(response.category);
        }
      });
    });
    app.delete('/category/:id',authentication, (req, res) => {
      const id = req.params.id_categorie;
      const request = {
        category_id: id,
      };
      clientCategory.deleteCategory(request, (err, response) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json({ success: true });
        }
      });
    });
    //*********User******* */
app.get('/users',authentication, (req, res) => {
    clientUsers.searchUsers({}, (err, response) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(response.user);
        }
      });
    });
  // add user
    app.post('/user/add', (req, res) => {
      const {id, name,age,email,password,tasks_id} = req.body;    
      clientUsers.createUser({user_id: id, name,age,email,password,tasks_id}, (err, response) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(response.user);
        }
      });
    });
    // get tasks by category
    app.get('/category/tasks/:id',authentication,(req,res)=>{
      const id=req.params.id;
      clientCategory.getTaskByCategory({category:id},(err,response)=>{
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(response.TasksList);
        }
      });
    });
  
    
    app.get('/user/:id',authentication, (req, res) => {
      const id = req.params.id;
      clientUsers.getUser({ user_id: id }, (err, response) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(response.user);
        }
      });
    });
    app.post('/user/update/:id',authentication, (req, res) => {
      const id = req.params.id;
      const { name,age,email,password,tasks_id } = req.body;
      const request = {
        user_id: id,
        name,
        age,
        email,
        password,
        tasks_id,
       
      };
      clientUsers.updateUser(request, (err, response) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json(response.user);
        }
      });
    });
    app.delete('/user/delete/:id',authentication, (req, res) => {
      const id = req.params.id;
      const request = {
        user_id: id,
      };
      clientUsers.deleteUser(request, (err, response) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.json({ success: true });
        }
      });
    });
    // **************************Tasks for user ********************//
    app.post("/userTask/add",authentication, (req, res) => {
      const data = req.body;
      clientUserTasks.AddUserTask(data, (err, response) => {
        if (err) return res.status(500).send(err);
        res.json(response.user_tasks);
      });
    });
    app.get("/userTasks/:id_user",authentication, (req, res) => {
      const id_user = req.params.id_user;
      clientUserTasks.GetUserTask({ id_user: id_user }, (err, response) => {
        if (err) return res.status(500).send(err);
        res.json(response.user_tasks);
      });
    });
    app.delete("/userTasks/delete/:id_userTask", authentication, (req, res) => {
      const id_userTask = req.params.id_userTask;
      clientUserTasks.DeleteFromUserTask({ id_user_task: id_userTask }, (err, response) => {
        if (err) return res.status(500).send(err);
        res.json(response.res);
      });
    });
    

const port = 3001;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
