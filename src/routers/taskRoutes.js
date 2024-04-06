const express = require('express')
const router = new express.Router()
const TasksModel = require('../models/tasks')
const auth = require('../middlewares/auth')

router.post('/tasks', auth, async (req,res)=>{
    console.log(req.body)
    const updates = Object.keys(req.body)
    const allowedUpdates = ['Description','Completed']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidUpdate){
        return res.status(400).send({'error':'invalid updates'})
    }
    try{
        const newTask = new TasksModel({
            ...req.body,
            userId: req.user._id
        })
        await newTask.save()
        res.status(201).send('Task added')
    }catch(e){
        console.log(e)
        res.status(400).send('error occured while adding task')
    }
    
})
    

router.get('/tasks', auth, async (req,res)=>{
    const match = {}
    const sort ={}
    if(req.query.Completed){
        match.Completed = req.query.Completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split("_")
        sort[parts[0]] = parts[1] === 'true' ? -1 : 1
    }
    try{
        //const allTasksData =  await TasksModel.find({userId: req.user._id})
        await req.user.populate({
            path:"userTasks",
            match, 
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.userTasks)
    }catch(e){
        console.log("error",e)
        return res.status(500).send(e)
    }
   

})


router.get('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id
    try{
       //const taskById = await TasksModel.findById(_id)
       const taskById = await TasksModel.findOne({_id, userId: req.user._id}) 
       if(!taskById){
            return res.status(404).send("error fetching task")
        }
        res.send(taskById)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }
    
})




router.patch('/tasks/:id', auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['Description','Completed']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidUpdate){
        return res.status(400).send({'error':'invalid updates'})
    }
    
    const _id = req.params.id  
    try{

        const updatedTask = await TasksModel.findOne({ _id , userId: req.user._id})
        if(!updatedTask){
            return res.status(404).send("error updating task")
        }
        updates.forEach((update)=>{
            updatedTask[update] = req.body[update]
        })   

       await  updatedTask.save()

        //const updatedTask = await TasksModel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
       
        res.send(updatedTask)
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }

})


router.delete('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id
    try{
        const deleteTask = await TasksModel.findOneAndDelete({_id, userId: req.user._id})
        if(!deleteTask){
            return res.status(404).send("error deleting task")
        }
        res.send(deleteTask)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }

})

module.exports=router