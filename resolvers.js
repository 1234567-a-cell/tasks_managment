const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const taskProtoPath = './proto/task.proto';
const userProtoPath = './proto/user.proto';
const categoryProtoPath = './proto/category.proto';

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
const taskProto = grpc.loadPackageDefinition(taskProtoDefinition).task;
const userProto = grpc.loadPackageDefinition(userProtoDefinition).user;
const categoryProto = grpc.loadPackageDefinition(categoryProtoDefinition).category;

const resolvers = {
Query: {
task: (_, { id }) => {
const client = new taskProto.TaskService('localhost:50051',
grpc.credentials.createInsecure());
return new Promise((resolve, reject) => {
client.getTask({ task_id: id }, (err, response) => {
if (err) {
reject(err);
} else {
resolve(response.task);
}
});
});
},
tasks: () => {
  const client = new taskProto.TaskService('localhost:50051',
grpc.credentials.createInsecure());
return new Promise((resolve, reject) => {
client.searchTasks({}, (err, response) => {
if (err) {
reject(err);
} else {
resolve(response.tasks);
}
});
});
},user: (_, { id }) => {
    const client = new userProto.UserService('localhost:50052',
    grpc.credentials.createInsecure());
    return new Promise((resolve, reject) => {
    client.getUser({ user_id: id }, (err, response) => {
    if (err) {
    reject(err);
    } else {
    resolve(response.user);
    }
    });
    });
    },
    users: () => {
    const client = new userProto.UserService('localhost:50052',
    grpc.credentials.createInsecure());
    return new Promise((resolve, reject) => {
    client.searchUsers({}, (err, response) => {
    if (err) {
    reject(err);
    } else {
    resolve(response.user);
    }
    });
    });
    },category: (_, { id }) => {
        const client = new categoryProto.CategoryService('localhost:50053',
        grpc.credentials.createInsecure());
        return new Promise((resolve, reject) => {
        client.getCategory({ category_id: id }, (err, response) => {
        if (err) {
        reject(err);
        } else {
        resolve(response.category);
        }
        });
        });
        },
        categories: () => {
          const client = new categoryProto.CategoryService('localhost:50053',
        grpc.credentials.createInsecure());
        return new Promise((resolve, reject) => {
        client.searchCategories({}, (err, response) => {
        if (err) {
        reject(err);
        } else {
        resolve(response.categories);
        }
        });
        });
        },
        TasksList:(_,{category}) => {
          const client = new categoryProto.CategoryService('localhost:50053',
        grpc.credentials.createInsecure());
        return new Promise((resolve, reject) => {
          client.getTaskByCategory({category: category}, (err, response) => {
          if (err) {
          reject(err);
          } else {
          resolve(response.TasksList);
          }
          });
          });
        }
    },
    Mutation: {
      createTask: (_, {title, description,status,category} ) => {
        return new Promise((resolve, reject) => {
          const client = new taskProto.TaskService('localhost:50051',
          grpc.credentials.createInsecure());
          client.createTask({title: title, description: description,status:status,category:category}, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response.task);
            }
          });
        });
      },
      updateTask: (_, { id, title, description, status,category }) => {
        return new Promise((resolve, reject) => {
          const client = new taskProto.TaskService('localhost:50051', grpc.credentials.createInsecure());
          const request = { task_id: id, title, description, status,category };
          client.updateTask(request, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response.task);
            }
          });
        });
      },
      deleteTask: (_, { id }) => {
        return new Promise((resolve, reject) => {
          const client = new taskProto.TaskService('localhost:50051', grpc.credentials.createInsecure());
          const request = { task_id: id };
          client.deleteTask(request, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response.task);
            }
          });
        });
      },



      createCategory: (_, {title} ) => {
        return new Promise((resolve, reject) => {
          const client = new categoryProto.CategoryService('localhost:50053',
          grpc.credentials.createInsecure());
          client.createCategory({title: title}, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response.category);
            }
          });
        });
      },
      updateCategory: (_, { id, title}) => {
        return new Promise((resolve, reject) => {
          const client = new categoryProto.CategoryService('localhost:50053', grpc.credentials.createInsecure());
          const request = { category_id: id, title };
          client.updateCategory(request, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response.category);
            }
          });
        });
      },
      deleteCategory: (_, { id }) => {
        return new Promise((resolve, reject) => {
          const client = new categoryProto.CategoryService('localhost:50053', grpc.credentials.createInsecure());
          const request = { category_id: id };
          client.deleteCategory(request, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response.category);
            }
          });
        });
      },
      
      
      // **************************************************************************//

      createUser: (_, {name, age,email,tasks_id} ) => {
        return new Promise((resolve, reject) => {
          const client = new userProto.UserService('localhost:50052',
          grpc.credentials.createInsecure());
          client.createUser({name: name, age: age,email:email,tasks_id:tasks_id}, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response.user);
            }
          });
        });
      },
      updateUser: (_, { id, name,age,email,tasks_id}) => {
        return new Promise((resolve, reject) => {
          const client = new userProto.UserService('localhost:50052', grpc.credentials.createInsecure());
          const request = { user_id: id, name,age,email,tasks_id };
          client.updateUser(request, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response.user);
            }
          });
        });
      },
      deleteUser: (_, { id }) => {
        return new Promise((resolve, reject) => {
          const client = new userProto.UserService('localhost:50052', grpc.credentials.createInsecure());
          const request = { user_id: id };
          client.deleteUser(request, (err, response) => {
            if (err) {
              reject(err);
            } else {
              resolve(response.user);
            }
          });
        });
      },
    }
    };
    module.exports = resolvers;