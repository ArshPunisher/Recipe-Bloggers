const recipeModel = require('../models/recipes')
const commentsModel = require('../models/comments')
const categoryModel = require('../models/category');

exports.homepage = async (req, res)=>{
  try {
    let limitNumber = 5;
    const categories = await categoryModel.find({}).limit(limitNumber);
    const latest = await recipeModel.find({}).sort({_id: -1}).limit(limitNumber);
    const indian = await recipeModel.find({ 'category': 'Indian' }).limit(limitNumber);
    const american = await recipeModel.find({ 'category': 'American' }).limit(limitNumber);
    const spanish = await recipeModel.find({ 'category': 'Spanish' }).limit(limitNumber);
    const chinese = await recipeModel.find({ 'category': 'Chinese' }).limit(limitNumber);

    const food = { latest, indian, american, spanish, chinese };

    res.render("home", {
      title: "Let's Cook - Home",
      user: req.user,
      categories,
      food
    })
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}

exports.contactpage = async (req, res)=>{
  res.render("contact", {
    title: "Contact Us",
    user: req.user,
  })
}

exports.aboutpage = async (req, res)=>{
  try {
    res.render("about", {
      title: "About",
      user: req.user,
    })
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}

exports.category = async (req, res)=>{
  try {
    let limitNumber = 20;
    const categories = await categoryModel.find({}).limit(limitNumber);
    res.render("category", {
      title: "Explore Categories",
      categories,
      user:req.user
    })
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}

exports.categoryByID = async (req, res)=>{
  try {
    const categoryID = req.params.id;
    const categoriesByID = await recipeModel.find({'category': categoryID})
    console.log("cate",categoriesByID)
    res.render("category", {
      title: "Explore Categories",
      categoriesByID,
      user:req.user
    })
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}

exports.exploreRecipe = async(req, res) => {
  try {
    const recipe = await recipeModel.findById(req.params.id).populate("createdBy");
    const comments = await commentsModel.find({recipeId: req.params.id}).populate("createdBy");
    res.render('recipe', { title: "Let's Cook - Recipe", recipe, user:req.user, comments } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 

exports.userComments = async(req, res) => {
  try {
    await commentsModel.create({
      content: req.body.content,
      recipeId: req.params.id,
      createdBy: req.user._id
    })
    res.redirect(`/recipe/${req.params.id}`);
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await recipeModel.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: "Let's Cook - Search", recipe, user:req.user } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
  
}


exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await recipeModel.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('exploreLatest', { title: "Let's Cook - Explore Latest", recipe, user:req.user } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 



exports.exploreRandom = async(req, res) => {
  try {
    let count = await recipeModel.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await recipeModel.findOne().skip(random).exec();
    res.render('exploreRandom', { title: "Let's Cook - Explore Random", recipe, user:req.user } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 

exports.submit_recipe = async (req, res)=>{
  try {
    res.render("submit", {
      title: "Post recipe",
      user: req.user})
    
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}


exports.submitRecipeOnPost = async(req, res) => {
  try {
    const newRecipe = new recipeModel({
      title: req.body.name,
      description: req.body.description,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: `/uploads/${req.file.filename}`,
      createdBy: req.user._id
    });
    
    await newRecipe.save();

    console.log("success")
    res.redirect('/submit-recipe');
  } catch (error) {
    res.redirect('/')
  }
}
