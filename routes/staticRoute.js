const express = require('express')
const router = express.Router()
const path = require('path')
const recipeController = require('../controllers/recipeController')

const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName)
    }
  })
  
const upload = multer({ storage: storage })
  

router.get('/', recipeController.homepage )
router.get('/about', recipeController.aboutpage )
router.get('/contact', recipeController.contactpage )
router.get('/recipe/:id', recipeController.exploreRecipe );
router.post('/comments/:id', recipeController.userComments );
router.get('/category', recipeController.category )
router.get('/category/:id', recipeController.categoryByID )
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest', recipeController.exploreLatest);
router.get('/explore-random', recipeController.exploreRandom);
router.get('/submit-recipe', recipeController.submit_recipe);
router.post('/submit-recipe', upload.single('image'), recipeController.submitRecipeOnPost);

module.exports = router;