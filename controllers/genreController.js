const { body, validationResult } = require('express-validator');

const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');

//display list of all genres
exports.genre_list = (req, res) => {
    Genre.find()
        .sort([['name', 'ascending']])
        .exec(function (err, list_genres) {
            if (err) {
                return next(err);
            }
            //Successful, so render
            res.render('genre_list', {
                title: 'Genre List',
                genre_list: list_genres,
            });
        });
};

//display detail page for a specific genre
exports.genre_detail = (req, res, next) => {
    //WE USE ASYNC.PARALLEL TO QUERY THE GENRE NAME AND ITS ASSOCIATED BOOKS IN PARALLEL,
    //WITH THE CALLBACK RENDERING THE PAGE WHEN (IF) BOTH REQUESTS COMPLETE SUCCESSFULLY
    async.parallel(
        {
            //THE ID IS ACCESSED WITHIN THE CONTROLLER VIA THE REQUEST 
            //PARAMETERS {req.params.id}. IT IS USED IN Genre.findById()
            //TO GET THE CURRENT GENRE. IT IS ALSO USED TO GET ALL Books 
            //OBJECTS THAT HAVE THE GENRE ID IN THEIR genre FIELD:
            //Book.find({ 'genre': req.params.id })

            genre(callback) {
                Genre.findById(req.params.id).exec(callback);
            },
            
            genre_books(callback) {
                Book.find({ genre: req.params.id }).exec(callback);
            },
        },
        (err, results) => {
            if(err) {
                return next(err);
            }
            if(results.genre == null) {
                //No results
                const err = new Error('Genre not found');
                err.status = 404;
                return next(err);
            }
            //Succesful, so render
            res.render('genre_detail', {
                title: 'Genre Detail',
                genre: results.genre,
                genre_books: results.genre_books,
            });
        }
    );
};

//display genre create form on GET
exports.genre_create_get = (req, res, next) => {
    res.render('genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
//THIS CONTROLLER SPECIFIES AN ARRAY OF MIDDLEWARE FUNCTIONS
exports.genre_create_post = [

    // Validate and sanitize the name field:

    //We use .trim() to remove any trailing/leading whitespace,
    //checks that the name field is not empty and then uses .escape()
    //to remove any dangeorus HTML characters
    body("name", "Genre name required").trim().isLength({ min: 1 }).escape(),
  
    //After validation and sanitization, we create a middleware 
    //function to extract any validation errors. We use .isEmpty()
    //to check whether there are any errors in the validation result.
    //If there are then we render the form again, passing in our
    //sanitized genre object and the array of error messages error.array()
    (req, res, next) => {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a genre object with escaped and trimmed data.
      const genre = new Genre({ name: req.body.name });
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("genre_form", {
          title: "Create Genre",
          genre,
          errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid.
        // Check if Genre with same name already exists.
        Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
          if (err) {
            return next(err);
          }
  
          if (found_genre) {
            // Genre exists, redirect to its detail page.
            res.redirect(found_genre.url);
          } else {
            genre.save((err) => {
              if (err) {
                return next(err);
              }
              // Genre saved. Redirect to genre detail page.
              res.redirect(genre.url);
            });
          }
        });
      }
    },
  ];
  

//display genre delete form on GET
exports.genre_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

//handle genre delete form on POST
exports.genre_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

//display genre update form GET
exports.genre_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

//handle genre update on POST
exports.genre_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Genre update POST');
};