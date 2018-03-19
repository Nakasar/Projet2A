
var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var o = require('./services');
var fs = require('fs');

var bdd = require('./bdd');

router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
})



//--------------- AJOUT A BDD--------------------------
router.post('/addUserToBDD',function(req,res){
  //console.log("on est dans server.js, methode appelée");
  //console.log(req.body);
  //bdd.addUserToBDD(req.body);
  var promise = bdd.promiseAddUserToBDD(req.body);
  promise.then(function(result){
    res.json(result);
  });
})
//-----------------------------------------------------


//--------------- MISE A JOUR UTILISATEUR--------------
router.post('/updateUserInBDD',function(req,res){
  var promise = bdd.updateUser(req.body[0],req.body[1]);
  promise.then(function(result){
    res.json(result);
  });
})
//-----------------------------------------------------

//-----------RECHERCHE PAR MOT CLE---------------------
router.get('/researchBDD/:id',function(req,res){
  //console.log(req.params.id);
  var promise = bdd.searchInBDD(req.params.id);
  promise.then(function(result){
    //console.log(result);
    res.json(result);
  });
  
})
//----------------------------------------------------

router.get('/connexion/:id1/:id2',function(req,res){
  var promise = bdd.assertConnexion(req.params.id1,req.params.id2);
  promise.then(function(result){
    res.json(result);
  });
})



router.get('/getCompSonInBDD/:id',function(req,res){
  //console.log(req.params.id);
  var promise = bdd.getSon(req.params.id);
  promise.then(function(result){
    var response = [];
    for (var i=0; i<result.length; i++){
      if (result[i].is_leaf){
         var comp = {label: result[i].nom_comp, state: 'leaf', children: []};
      }
      else{
        var comp = {label: result[i].nom_comp, state: 'expanded', children: []};
      }
     
      response.push(comp);
    };
    res.json(response);
  });
})

router.get('/getLeafInBDD/:id',function(req,res){
  var promise = bdd.getLeaf(req.params.id);
  promise.then(function(result){
    res.json(result);
  })
})



//var t = test();

module.exports = router;

