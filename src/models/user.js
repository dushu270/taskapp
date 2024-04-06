const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const TasksModel = require('./tasks')


const userSchema = mongoose.Schema({
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
        unique: true,
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

    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('userTasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'userId'
})

userSchema.statics.findByCredentials = async (email, password) => {
        const findingUser = await User.findOne({email})
        if(!findingUser){
            throw new Error('Unable to login')
        }
    const isMatch = await bcrypt.compare(password, findingUser.password)    
    if(!isMatch){
        throw new Error('Unable to login')
    }

    return findingUser
}


userSchema.methods.generateAuthToken = async function(){
    const token = jwt.sign({_id:this._id.toString()},'thisisatoken')
    this.tokens = this.tokens.concat({token})
    await this.save()
    return token

}

userSchema.methods.toJSON =  function(){
    const userData = this.toObject()
    delete userData.tokens
    delete userData.password
    return userData
}

//hasing plain text password
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})

userSchema.pre('remove', async function(next){
   await TasksModel.deleteMany({userId: this._id})
    next()
})


const User = mongoose.model('Users', userSchema)

module.exports=User