angular.module('AngularGen')
    .controller('GraphController', function ($scope,$http,$state) {

	//----------------------------GESTION DU MENU DEROULANT----------------------------------------
	var dropdown = document.querySelectorAll('.dropdown');
	var dropdownArray = Array.prototype.slice.call(dropdown,0);
	dropdownArray.forEach(function(el){
		var button = el.querySelector('a[data-toggle="dropdown"]');
		var	menu = el.querySelector('.dropdown-menu');
		var	arrow = button.querySelector('i.icon-arrow');

		button.onclick = function(event) {
			if(!menu.hasClass('show')) {
				menu.classList.add('show');
				menu.classList.remove('hide');
				arrow.classList.add('open');
				arrow.classList.remove('close');
				event.preventDefault();
			}
			else {
				menu.classList.remove('show');
				menu.classList.add('hide');
				arrow.classList.remove('open');
				arrow.classList.add('close');
				event.preventDefault();
			}
		};
	})

	Element.prototype.hasClass = function(className) {
	return this.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
	};
	//---------------------------------------------------------------------------------------------


	//------------------------LECTURE DE LA BDD----------------------------------------------------
	$scope.parent = "Robotique"
  	$scope.getCompSon = function(){
        $http.get(
          '/getCompSonInBDD/'+$scope.parent
          ).then(function successCallBack(response){
            console.log(response)

        },function errorCallBack(error){
            console.log(error);
        })     
  	}
	//---------------------------------------------------------------------------------------------

    });