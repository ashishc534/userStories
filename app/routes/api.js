var User = require('../models/user');
var config = require('../../config');
var Story = require('../models/story');

//Used to create Authentication token.
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');

function createToken(user){

  var token = jsonwebtoken.sign({
    id: user._id,
    username: user.username,
    name: user.name
  },secretKey,{
    expiresIn: '1440m'
  });

  return token;
}

module.exports = function(app,express){

  var api = express.Router();

  api.post('/signup',function(req,res){

    var user = new User({

      name: req.body.name,
      username: req.body.username,
      password: req.body.password
    });

    user.save(function(err){

      if(err){
        return res.send(err);
      }
      res.json({message: 'User has been created successfully!!'});
    });
  });

  api.get('/users',function(req,res){

    User.find({},function(err,users){

      if(err){
        res.send(err);
        return;
      }

      console.log(users);
      res.json(users);
    });
  });

  api.post('/login',function(req,res){

    User.findOne({username: req.body.username}).select('password').exec(function(err,user){

      if(err)
        throw err;

      if(!user)
        return res.json({message: "User does not exist"});

      var validPassword = user.comparePassword(req.body.password);

      if(!validPassword)
        res.send({message: "Invalid Password"});

      else {
          //Create Token
          var token = createToken(user);

          res.json({

            success: true,
            message: "Authentication Successfull!",
            token: token
          });
      }
    });
  });

  api.use('/',function(req,res,next){

    var token = req.body.token || req.params.token || req.headers['x-access-token'];

    if(!token)
    return res.status(403).send({message: "No Token Provided"});

    jsonwebtoken.verify(token,secretKey,function(err,details){

      if(err)
      return res.status(403).send({message: "Invalid Token, Authentication Failed!"});

      req.details = details;
      next();
    });
  });

  //Functions below this can only be accessed only if they can pass the middleware!!

  //HTTP requests chaining. Use api.route('Your route') and Don't use ; and just chain methods using . ex:(.get() .post())

  api.route('/')

     api.post('/',function(req,res){

       var story = new Story({

         creator: req.details.id,
         content: req.body.content
       });

       story.save(function(err){

         if(err)
         return res.send(err);

         res.json({message: "New Story Created!"});
       });
     })

    api.get('/',function(req,res){

      Story.find({creator: req.details.id},function(err,stories){

        if(err)
        return res.send(err);

        res.json(stories);
      });
    });
  return api;
};
