const { gql } = require('@apollo/server');

const typeDefs = `#graphql
  type User {
    id: Int!
    name: String!
    age : Int!
    email :String!
    tasks_id: Int!
  }

  type Task {
    id: Int!
    title: String!
    description: String!
    status: String!
    category: String!
  }
  type Category {
    id: Int!
    title: String!
  }

  type Query {
    task(id: Int!): Task
    tasks: [Task]
    user(id: Int!): User
    users: [User]
    category(id: Int!): Category
    categories: [Category]
    TasksList(category:Int!): [Task]
  }


  type Mutation {
    createTask(title: String!, description:String!,status:String!,category:String!): Task!
    updateTask(id:Int!, title:String!, description:String!, status:String!,category:String!): Task!
    deleteTask(id:Int!): Task

    createCategory(title: String!): Category!
    updateCategory(id:Int!, title:String!): Category!
    deleteCategory(id:Int!): Category

    createUser(name: String!, age:Int!,email:String!,tasks_id:Int!): User!
    updateUser(id:Int!, name:String!,age:Int!,email:String!tasks_id:Int!): User!
    deleteUser(id:Int!): User
  }
`;

module.exports = typeDefs;
