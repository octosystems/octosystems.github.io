var trymeclicked=function() {
   alert("Try me clicked");
}

var addbuttontryme= function() {
var divtags = document.getElementsByClassName("product-form__item product-form__item--submit");
if (divtags.length == 0) { return false; }
var divtag=divtags[0];
var divtag1 = document.createElement("div");
divtag1.setAttribute("ng-app", "starter");
var divtag2 = document.createElement("div");
divtag2.setAttribute("ng-controller", "ExampleController");
var newbtn = document.createElement("Button"); 
newbtn.appendChild(document.createTextNode("Try me"));
newbtn.setAttribute("id", "trymefashion");
newbtn.setAttribute("ng-click", "takePicture()");
newbtn.setAttribute("id", "trymefashion");
newbtn.visible=true;
divtag2.appendChild(newbtn);
divtag1.appendChild(divtag2);
divtag.appendChild(divtag1);
 
};
addbuttontryme();

