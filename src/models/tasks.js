const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = mongoose.Schema({
    Description: {
        type: String,
        required: true,
        trim: true
    },
    Completed:{ 
        type: Boolean,
        default:false
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    }

}, {
    timestamps: true
})

taskSchema.pre('save', async function(next){
    console.log("Task")
    next()
})

const Tasks = mongoose.model('Tasks',taskSchema)



module.exports=Tasks