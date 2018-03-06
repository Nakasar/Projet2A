//var MongoClient = require("mongodb").MongoClient;
var mongoose = require('mongoose');
mongoose.Promise = global.Promise; //règle problème d'un depreciation warning sur les promesses


//------------------------------GESTION DES MOTS DE PASSE--------------------------------------------------------------
bcrypt = require('bcrypt');
SALT_WORK_FACTOR = 10;
//---------------------------------------------------------------------------------------------------------------------



//-------------------UTILISATEUR, DONNES PERSO-------------------------------------------------------------------------
var utilisateurSchema = mongoose.Schema({ //structure de a genre de classe
    nom: String,
    prenom : String,
    promo : String, //année complete 2016
    adresse_email : {type: String, required: true, index: {unique: true}}, //POUR LA GESTION DU MDP
    password: {type: String, required: true},
    adresse: {
        voie: String,
        ville: String,
    },
    tel : String,
    entreprise : {
        nom : String,
        adresse : {
            voie : String,
            ville : String,
        } 
    },
    langue: Array,
    competence : Array, //liste des compétences
});
//-------------------------------------------------------------------------------------------------------------------

var db = mongoose.connection;


//------------------------------HASHAGE DU MOT DE PASSE AVANT ENREGISTREMENT-----------------------------------------
utilisateurSchema.pre('save', function(next) {
    var user = this;

// only hash the password if it has been modified (or is new)
if (!user.isModified('password')) return next();

// generate a salt
bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
});


});

//-------------------------------------------------------------------------------------------------------------------


//---------------------------METHODE DE COMPARAISON DE MOT DE PASSE--------------------------------------------------
mongoose.comparePassword = function(user, candidatePassword, cb) {
    bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
//-------------------------------------------------------------------------------------------------------------------


//---------------------------------------AJOUT UTILISATEUR BDD-------------------------------------------------------------------
mongoose.promiseAddUserToBDD = function(data){
    return new Promise(function(resolve,reject){
        db.collection('utilisateurs').findOne({adresse_email : data[5]}, function(err,user){ //une adresse email est unique
            if (err){
                return reject(err);
            }
            
            else if (user==null){
                var Utilisateur = mongoose.model('utilisateurs', utilisateurSchema);
                var util = new Utilisateur({

                    nom : data[0],

                    prenom : data[1],

                    adresse : {
                        voie : data[2],
                        ville : data[3],
                    },

                    promo : data[4],

                    adresse_email : data[5],

                    password: data[12],

                    tel : data[6],

                    entreprise : {
                        nom : data[7],
                        adresse : {
                            voie : data[8],
                            ville : data[9],
                        } 
                    },
                    langue: data[10],
                    competence : data[11],
                });
                util.save(function(err, utilisateur) {
                    if (err){
                        throw err;
                    }
                    mongoose.disconnect();
                });
                return resolve(user);
                
            }
            
            else{
                return reject("user Already in BDD"); //TO DO : gérer le cas où l'email existe déjà
            } 
        });
    })
};
//-------------------------------------------------------------------------------------------------------------------


//----------------------------------------MODIFICATION UTILISATEUR---------------------------------------------------
mongoose.updateUser = function(id,data){
    return new Promise(function(resolve,reject){
        db.collection('utilisateurs').update({id: id},data);
    })
};
//-------------------------------------------------------------------------------------------------------------------


//-------------------RECHERCHE PAR MOT CLE---------------------------------------------------------------------------
db.collection('utilisateurs').dropIndexes(); //on indexe les données 
db.collection('utilisateurs').createIndex({'$**':'text'});

mongoose.searchInBDD = function(research){
    //console.log("on est dans bdd, recherche en cours");
    return new Promise(function(resolve,reject){ //promesse
        db.collection('utilisateurs').find({$text : {$search: research}}).toArray(function(err,items){
            if (err) {
                return reject(err);
            }
            return resolve(items); //on rempli la promesse avec les items trouvés dans la BDD
        })
    })
};
//-------------------------------------------------------------------------------------------------------------------


//---------------------------TESTE LA CONNEXION D'UN UTILISATEUR-----------------------------------------------------
mongoose.assertConnexion= function(mail,mdp){
    return new Promise(function(resolve,reject){
        db.collection('utilisateurs').findOne({adresse_email : mail}, function(err,user){
            if (err){
                return reject(err);
            }

            else if (user==null){
                return reject(err);
            }
            mongoose.comparePassword(user,mdp,function(err,isMatch){
                if (err){
                    return reject(err);
                }
                return resolve(isMatch);
            })
        })
    })
};
//-------------------------------------------------------------------------------------------------------------------

//-------------------COMPETENCES-------------------------------------------------------------------------------------
var competenceSchema = mongoose.Schema({ 
    nom_comp: String,
    commentaire : String,
    url_utile : String, 
    parent : mongoose.model('competence',competenceSchema),
});
//-------------------------------------------------------------------------------------------------------------------

var Competences = mongoose.model('competence',competenceSchema);
var racine = new Competences({
    nom_comp : "racine"
});

//-----

var robotique = new Competences({
    nom_comp : "robotique",
    commentaire : "",
    url_utile : "", 
});

var ros = new Competences({
    nom_comp : "ROS",
    commentaire : "",
    url_utile : "",
    parent : robotique,
});

var arduino = new Competences({
    nom_comp : "Arduino",
    commentaire : "",
    url_utile : "",
    parent : robotique,
});

//-------

var jeu_video = new Competences({
    nom_comp : "Jeux Vidéos",
    commentaire : "",
    url_utile : "", 
});

var moteur_de_jeu = new Competences({
    nom_comp : "Moteur de jeu",
    commentaire : "",
    url_utile : "",
    parent : jeu_video
});

var unity = new Competences({
    nom_comp : "Unity",
    commentaire : "",
    url_utile : "",
    parent : moteur_de_jeu,
}); 





//---------------------------------------AJOUT COMPETENCE BDD-------------------------------------------------------------------
mongoose.promiseAddCompetencesToBDD = function(data){
    return new Promise(function(resolve,reject){
        db.collection('competences').findOne({nom_comp : data[0]}, function(err,comp){ //une competences est unique
            if (err){
                return reject(err);
            }
            
            else if (comp==null){
                var Competences = mongoose.model('competences', competenceSchema);
                var comp = new Competences({

                    nom_comp : data[0],

                    commentaire : data[1],


                    url_utile : data[4],

                    parent : data[5],

                });
                util.save(function(err, competence) {
                    if (err){
                        throw err;
                    }
                    mongoose.disconnect();
                });
                return resolve(comp);
                
            }
            
            else{
                return reject("Skill Already in BDD"); //TO DO : gérer le cas où l'email existe déjà
            } 
        });
    })
};
//-------------------------------------------------------------------------------------------------------------------


mongoose.connect('mongodb://localhost/projet2A',{useMongoClient : true}); //useMongoClient regle le problème du Warning
module.exports = mongoose;