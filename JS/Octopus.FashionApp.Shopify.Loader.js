
var loaderfn = function (pURL) {
  console.log(pURL);
var script = document.createElement("script");
script.src = pURL;
script.defer = true;
script.type = "text/javascript";
document.head.appendChild(script);
};
loaderfn("https://octosystems.github.io/JS/jquery-1.10.2.min.js");
loaderfn("https://octosystems.github.io/JS/jquery.expander.min.js");
loaderfn("https://octosystems.github.io/JS/jquery.dataTables.min.js");
loaderfn("https://octosystems.github.io/JS/bootstrap.min.js");
loaderfn("https://octosystems.github.io/JS/jquery.dataTables.bootstrap.js");
loaderfn("https://octosystems.github.io/JS/ionic.bundle.js"); 
loaderfn("https://octosystems.github.io/JS/fabric.js");    
loaderfn("https://octosystems.github.io/JS/ng-cordova.min.js");
//loaderfn("https://octosystems.github.io/JS/cordova.js");
loaderfn("https://octosystems.github.io/JS/imageapp.js");
loaderfn("https://octosystems.github.io/JS/app.js");     
loaderfn("https://octosystems.github.io/JS/Octopus.FashionApp.Shopify.js");
