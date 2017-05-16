var trymeclicked=function() {
   alert("Try me clicked");
}

var addbuttontryme= function() {
var divtags = document.getElementsByClassName("product-form__item product-form__item--submit");
if (divtags.length == 0) { return false; }
var divtag=divtags[0];
var newbtn = document.createElement("Button"); 
newbtn.appendChild(document.createTextNode("Try me"));
newbtn.setAttribute("id", "trymefashion");
newbtn.setAttribute("onclick", "trymeclicked();");
newbtn.className="btn";
newbtn.visible=true;
divtag.appendChild(newbtn);
 
};
addbuttontryme();

