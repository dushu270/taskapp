const express = require('express')
const router = new express.Router()
const UserModel = require('../models/user')
const auth = require('../middlewares/auth')
const TasksModel = require('../models/tasks')

router.get('/users/me', auth ,async (req,res)=>{
    res.status(200).send(req.user)

    
    // try{
    //     const allUsersData  = await UserModel.find({})
    //     res.send(allUsersData)
    // }catch(e){
    //     console.log(e)
    //     return res.status(500).send(e)
    // }
    

})

router.post('/users/login', async(req, res)=>{
    try {
        const loggeduser = await UserModel.findByCredentials(req.body.email, req.body.password)
        const token = await loggeduser.generateAuthToken()
        res.status(200).send({ loggeduser, token})
    } catch (error) {
        console.log(error)
        res.status(400).send()
    }
})


router.post('/users/logout', auth, async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send("Logged out")
    }catch(e){
        res.status(500)
    }

})

router.post('/users/logoutAll', auth, async (req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send("Logged out All sessions")
    }catch(e){
        res.status(500)
    }

})



// router.get('/users/:id', auth, async (req,res)=>{
//     try{
//         const _id = req.params.id
//         const userById = await UserModel.findById(_id)
//         if(!userById){
//             return res.status(404).send("user Not found")
//         }
//         res.send(userById)
//     }catch(e){
//         console.log(e)
//         res.status(500).send(e)
//     }
   
// })

router.post('/users/signup', async (req,res)=>{
    console.log(req.body)

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email', 'age', 'password']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidUpdate){
        return res.status(400).send({'error':'invalid updates'})
    }

    const newUser = new UserModel(req.body)

    try{
        await newUser.save()
        const token = await newUser.generateAuthToken()
        res.status(201).send({newUser, token})
    }catch(e){
        console.log(e)
        res.status(400).send('error occured while adding user')
    }

    // await newUser.save().then(()=>{
    //     res.status(201).send('User added')
    // }).catch((err)=>{
    //     console.log(err)
    //     res.status(400).send('error occured while adding user')
    // })

})

router.patch('/users/me', auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email', 'age', 'password']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidUpdate){
        return res.status(400).send({'error':'invalid updates'})
    }

    try{
        // const updatedUser = await UserModel.findById(req.user._id)
        updates.forEach((update)=>{
            req.user[update] = req.body[update]
    })  
    await req.user.save()  
        
    //const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        // if(!req.user){
        //     return res.status(404).send("No User found to update")
        // }
        res.send(req.user)
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }

})

router.delete('/users/me', auth, async (req,res)=>{
    try{
        // const deleteUser = await UserModel.findByIdAndDelete(req.user._id)
        // if(!deleteUser){
        //     return res.status(404).send("No User found to Delete")
        // }
        // await req.user.populate('userTasks').execPopulate()
        // req.user.userTasks.forEach(async (task)=>{
        //     console.log(task._id)
        //     await TasksModel.findOneAndDelete({_id: task._id})
        // }) 
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        console.log(e)
        res.status(500).send(e)
    }


})


module.exports = router

