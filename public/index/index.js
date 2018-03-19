'use strict';

angular.module('AngularGen')
.controller('IndexController', function ($scope,$state,$http,$mdPanel){


    	/*$scope.varGlobal = ''
      $scope.name ="Nom"
      $scope.surname="Prenom"
      $scope.mel=""
      $scope.prom=0
      $scope.tel=""
      $scope.ad={}
      $scope.ad.id1="Rue"
      $scope.ad.id2="Ville"
      $scope.ent={}
      $scope.ent.id1="nom"
      $scope.ent.id2="rue"
      $scope.ent.id3="ville"
      $scope.lang={}
      $scope.comp={}*/
    
  	$scope.openTest = function(){
  		  $state.go('test')
  	}

  	$scope.openGraph = function(){
  		  $state.go('graph')
  	}

    $scope.openAdvanced = function(){
        $state.go('advanced-search')
    }

    $scope.openFormulaire = function(){
        $state.go('formulaire')
    }

    $scope.openConnexion = function(){
        $state.go('connexion')
    }

  	$scope.recherche=""

    $scope.objetRecherche=''
    $scope.liste=[]

  	$scope.search = function(){
        $http.get(
          '/researchBDD/'+$scope.recherche
          ).then(function successCallBack(response){
            //console.log(response)
            $scope.liste = response;
            $state.go('advanced-search');

        },function errorCallBack(error){
            console.log(error);
        })     
  	}

    $scope.sons = [];

    $scope.getSons = function(parent){
      $http.get(
        '/getCompSonInBDD/'+parent
        ).then(function successCallBack(response){
          var comp = {label: parent, state : '', children : []};
          var data = response.data;
          if (data.length === 0){
            comp.state = 'leaf';
            return 0;
          }
          else {
            comp.state = 'expanded';
            for(var i=0;i<data.length; i++){
              comp.children.push(data[i]);
              $scope.getSons(data[i].label);
            };
          };
          $scope.sons.push(comp);
          
      },function errorCallBack(error){
            console.log(error);
        });

    };


  $scope.test = $scope.getSons('Racine');

  $scope.res = [];
    

});