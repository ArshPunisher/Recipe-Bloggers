const { Schema, model, default: mongoose } = require('mongoose')

const recipeSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true,
  },
  ingredients: {
    type: Array,
    required: 'This field is required.'
  },
  category: {
    type: String,
    enum: ['Indian', 'American', 'Chinese', 'Mexican', 'Thai', 'Spanish', 'Italian', 'French', 'Others'],
    required: 'This field is required.'
  },
  image: {
    type: String,
    required: 'This field is required.'
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  }

},{timestamps:true})

recipeSchema.index({ title: 'text', description: 'text' });

module.exports = model("recipes", recipeSchema)