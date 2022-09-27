const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "must provide title"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "must provide description"],
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        select: false
    },
    status : {
        type: String,
        enum : ['todo', 'ongoing', 'completed'],
        default: 'todo'
    },
    deadlineDate : {
        type: Date,
        required : [true, "must provide deadline date"]
    },
    taskType : {
        type: String,
        required : [true, "must provide task type"],
        enum: {
			values: ['group', 'personal'],
			message: 'taskType is either: group or personal',
		},
    },
    groupEmail : [String]
},
    { timestamps: true },

)

module.exports = mongoose.model("Task", TaskSchema)