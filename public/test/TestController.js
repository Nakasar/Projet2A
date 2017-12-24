//cette page permet d'afficher les données que l'utilisateur vient d'entrer dans la base de donnée

angular.module('AngularGen')
    .controller('TestController', function ($scope,$http,$mdMedia,$state) {

        $scope.test2 = "Bienvenue sur la page test"
        $http({
        	method:'GET',
        	url:'getData',
        	params:{id:1}
        }).then(function successCallBack(response){
        	console.log(response)

        },function errorCallBack(error){
        	console.log(error)

        })

        $http({
        	method:'POST',
        	url:'postData',
        	data:{id:1}
        })

        $scope.isXS = $mdMedia('xs')
        console.log($mdMedia('xs'))


        $scope.testWatch={} //''
        $scope.testbis = ''
      
        $scope.$watch('testbis',function(){
        	console.log($scope.testbis)

        },true) //pas de true avec ''



       $scope.modify= function(){
        //TODO
      }


    });