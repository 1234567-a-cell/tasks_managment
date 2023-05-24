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

const categoryProtoPath = 'proto/category.proto';
const categoryProtoDefinition = protoLoader.loadSync(categoryProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const categoryProto = grpc.loadPackageDefinition(categoryProtoDefinition).category;

const categoryService = {
  getCategory: (call, callback) => {  
    const categoryId = call.request.category_id;
    console.log('Received category ID:', categoryId);
    const query = 'SELECT * FROM category WHERE id_categorie = ?';
    connection.query(query, [categoryId], (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      if (results.length === 0) {
        callback(new Error(`Record with id_categorie ${categoryId} not found`));
        return;
      }
      const category = results[0];
      callback(null, {
        category: {
          id_categorie: category.id_categorie,
          title_categorie: category.title_categorie,
        },
      });
    });
  },
  searchCategories: (call, callback) => {
    const { query } = call.request;
    const searchQuery = `SELECT * FROM category`;
    connection.query(searchQuery, (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      const category = results.map(category => ({
        id: category.id_categorie,
        title: category.title_categorie,
      }));
      callback(null, { category: category });
    });
  },
  
  createCategory: (call, callback) => {
    const { title } = call.request;
      const query = 'INSERT INTO category (title_categorie) VALUES (?)';
      connection.query(query, [title], (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      const createdCategory = {
        id: results.insertId,
        title,
      };
  
      callback(null, { category: createdCategory });
    });
  },
    updateCategory: (call, callback) => {
    const category_id = call.request.category_id;
    const { title} = call.request;
    const query = 'UPDATE category SET title_categorie = ? WHERE id_categorie = ?';
    connection.query(query, [title, category_id], (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      if (results.affectedRows === 0) {
        const notFoundError = new Error(`Category with ID ${category_id} not found`);
        callback(notFoundError);
        return;
      }
  
      const updatedCategory = {
        id: category_id,
        title,
 
      };
  
      callback(null, { category: updatedCategory });
    });
  },
  deleteCategory: (call, callback) => {
    const category_id = call.request.category_id;
    const query = 'DELETE FROM category WHERE id_categorie = ?';
    connection.query(query, [category_id], (error, results) => {
      if (error) {
        console.error(error);
        callback(error);
        return;
      }
      if (results.affectedRows === 0) {
        const notFoundError = new Error(`category with ID ${category_id} not found`);
        callback(notFoundError);
        return;
      }
  
      callback(null, { category_id });
    });
  },
  getTaskByCategory: (call, callback) => {
    const category_id = call.request.category;
    const query = 'SELECT * FROM tasks JOIN category ON (tasks.category=category.id_categorie) WHERE category = ?';
    
    connection.query(query, [category_id], (error, results) => {
      if (error) {
        console.log(error);
        callback(error);
        return;
      }
      console.log(results);
      if (results.length === 0) {
        const error = new Error('Task not found');
        callback(error);
        return;
      }
      const TasksList = results.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        category_data:{
          id:task.id_categorie,
          title:task.title_categorie,
        }

      }));
      // const categoryQuery = 'SELECT id, title FROM category WHERE id = ?';
      // connection.query(categoryQuery, [category_id], (categoryError, categoryResults) => {
      //   if (categoryError) {
      //     console.log(categoryError);
      //     callback(categoryError);
      //     return;
      //   }
      //   if (categoryResults.length === 0) {
      //     const error = new Error('Category not found');
      //     callback(error);
      //     return;
      //   } 
      //   const categoryTitle = categoryResults[0].title;
      //   TasksList.forEach((task) => {
      //     task.category = categoryTitle;
      //   });

        callback(null, { TasksList });
      // });
    });
  }
  
};
  
const server = new grpc.Server();
server.addService(categoryProto.CategoryService.service, categoryService);
const port = 50053;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
  
    console.log(`Server is running on port ${port}`);
    server.start();
  });
console.log(`category microservice running on port ${port}`);
