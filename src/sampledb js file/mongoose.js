const mongoose = require('mongoose')
const validator = require('validator')
const { count } = require('../models/user')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',  {
    useNewUrlParser: true,
    useCreateIndex: true
})

const User = mongoose.model('User',{
    name:{
        type: String,
        required: true
    },
    age: {
        type:Number,
        default:0,
        min: 18
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("not email")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(validator.isLength(value,0,6)){
                throw new Error("Too short")
            }
            if(validator.contains(value,'password')){
                throw new Error("Contins password in the passowrd")
            }
        }

    }
})

const Tasks = mongoose.model('Tasks',{
    Description: {
        type: String,
        required: true,
        trim: true
    },
    Completed:{
        type: Boolean,
        default:false
    }

})

// const me = new User({
//     name: "dushu",
//     age: 45,
//     email: "dushu270@gmail.com",
//     password:"  12v24zvdds   "
// })

// me.save().then(()=> {
//     console.log("data saved",me)
// }).catch((error)=>{
//     console.log(error)
// })

// const task = new Tasks({
//     Description: "   code practice    for    the day   ",
//     Completed: true
// })

// task.save().then(()=>{
//     console.log("task added",task)
// }).catch((err)=>{
//   console.log(error)
// })


const updateAgeAndCount = async (id, age)=>{
    const ageUpdate = await User.findByIdAndUpdate(id,{age})
    const Count = await User.countDocuments({age})
    return Count
}

updateAgeAndCount('65eb538d29495348bc57c7e3',59).then((result)=>{
    console.log("age",result)
}).catch((e)=>{
    console.log(e)
})


const deleteTaskAndCount = async (id, Completed)=>{
    const deleteTask = await Tasks.findByIdAndDelete(id)
    const Count = await Tasks.countDocuments({Completed})
    return Count
}

deleteTaskAndCount('65ec03a73005b199dfc1349d',false).then((result)=>{
    console.log("false",result)

}).catch((e)=>{
    console.log(e)
})

// Tasks.findOneAndDelete({_id: '65eb5481e8c7f017840ca81b'}).then((result)=>{
//     console.log(result)
//     return Tasks.countDocuments({Completed:false})
// }).then((tasks)=>{
//     console.log(tasks)
// }).catch((e)=>{
//     console.log(e)
// })