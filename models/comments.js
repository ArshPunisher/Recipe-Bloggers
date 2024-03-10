const { Schema, model } = require('mongoose')

const commentSchema = new Schema({
  content:{
    type: String,
    required: true
  },
  recipeId: {
    type: Schema.Types.ObjectId,
    ref: 'recipes'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }

},{timestamps:true})

module.exports = model("comments", commentSchema)