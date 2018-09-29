var User = require('../models/user');
var config = require('../../config');

//Used to create Authentication token.
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');

function createToken(user){

  var token = jsonwebtoken.sign({
    _id: user._id,
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

  return api;
};
