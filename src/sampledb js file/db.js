//const mongodb = require('mongodb')
const {MongoClient, ObjectId} =  require('mongodb')
const mongoose=require('mongoose')

// const id = new ObjectId()
// console.log(id)
// console.log(id.getTimestamp())

const connectionURL='mongodb://127.0.0.1:27017'
const database='task-manager'

const client = new MongoClient(connectionURL)
const db= client.db(database)

async function dbConnect(){
try{
    await client.connect()
    console.log("DB connected")
    }catch(err){
    console.log("error occured")  
    }
}

dbConnect()

async function crud(){

    try{
    const result = await db.collection('users').insertOne({
    name:"Sai",
    age:25
    })
    console.log(result)
    }catch(err){
        console.log(err)
    }


    try{
        const result = await db.collection('users').insertMany([
            {Description:"Work", completed: true},
            {Description:"games", completed:false},
            {Description:"Fap", completed:false}
        ])
        
        console.log(result)
        }catch(err){
            console.log(err)
        }



    try{
        const result = await db.collection('users').findOne({name:'Dushu'})
        console.log(result)
        }catch(err){
            console.log(err)
        }    

    try{
        const result = await db.collection('users').find({completed:false}).toArray()
        console.log(result)
        }catch(err){
            console.log(err)
        }    

    try{
        const result = await db.collection('users').updateOne({
            _id: new ObjectId('65e21ccaf5360893d53be257'),
        },{
            $set:{
                name:'S'
            }
        })
      console.log(result)
        
    }catch(err){
        console.log(err)
    }


    try{
        const result = await db.collection('users').updateMany({
            completed:true,
            Description:"Work"
        },{
            $set:{
                points:20,
                completed:false
            }
        })
      console.log(result)
        
    }catch(err){
        console.log(err)
    }

    try{
        const result = await db.collection('users').deleteMany({
            completed:true
        })
      console.log(result)
        
    }catch(err){
        console.log(err)
    }
    


}






crud()





// const updatepromise = db.collection('users').updateOne({
//     _id: new ObjectId('65e21ccaf5360893d53be257'),
// },{
//     $set:{
//         name:'D'
//     }
// })








// updatepromise.then((result)=>{
//     console.log(result)
// }).catch((err)=>{
//     console.log(err)
// })







// const callback= (error, result) => {
//     if (error) {
//       return console.error('Error inserting document:', error);
//     }
//     console.log(result)
//     }

// db.collection('users').insertMany([
//     {Description:"Work", completed: true},
//     {Description:"games", completed:false},
//     {Description:"Fap", completed:false}
// ],callback)

//console.log(result)