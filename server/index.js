const express = require("express")
const { ApolloServer } = require("@apollo/server")
const {expressMiddleware}=require("@apollo/server/express4")
const { buildSchema } = require("graphql")
const cors=require("cors")
const bodYParser=require("body-parser")
const bodyParser = require("body-parser")
const { default: axios } = require("axios")


async function startServer(){
    const app=express();
    const server=new ApolloServer({
        typeDefs:`
        type User {
            id:ID!
            name:String!
            username:String!
            email:String!
            phone:String!
            website:String!
        }
            type Todo {
                id:ID!
                title:String!
                completed:Boolean
                user:User
            }
            type Query{
                getTodo:[Todo]
                getAllUser:[User]
                getUser(id: ID!):User
            }
        `,
        resolvers: {
            Todo:{
                user:async(todo)=> (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.id}`)).data,
            },
            Query: {
                getTodo: async () => (await axios.get(`https://jsonplaceholder.typicode.com/todos`)).data,
                getAllUser: async () => (await axios.get(`https://jsonplaceholder.typicode.com/users`)).data,
                getUser: async (parent,{id}) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
            },
        },
    });

    await server.start();
    app.use(bodyParser.json());
    app.use(cors());
    app.use("/graphql",expressMiddleware(server));
    app.listen(8000,()=>console.log("server started 8000"))
}


startServer();