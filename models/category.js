const { Schema, model } = require('mongoose')

const categorySchema = new Schema({
  name:{
    type: String,
    required: true
  },
  image: {
    type: String,
    required: 'This field is required.'
  },

},{timestamps:true})

module.exports = model("category", categorySchema)