var loadcss = function (pURL) {
  console.log(pURL);
var csslink = document.createElement("link");
csslink.setAttribute("href", pURL)
csslink.setAttribute("rel", "stylesheet")
document.getElementsByTagName("head")[0].appendChild(csslink);
};
 
    function loadJsFilesSequentially(scriptsCollection, startIndex, librariesLoadedCallback) {
     if (scriptsCollection[startIndex]) {
       var fileref = document.createElement('script');
       fileref.setAttribute("type","text/javascript");
       fileref.setAttribute("src", scriptsCollection[startIndex]);
       fileref.onload = function(){
         startIndex = startIndex + 1;
         loadJsFilesSequentially(scriptsCollection, startIndex, librariesLoadedCallback)
       };
 
       document.getElementsByTagName("head")[0].appendChild(fileref)
     }
     else {
       librariesLoadedCallback();
     }
   }
 var LoadAllJS = function () {
   // An array of scripts you want to load in order
   var scriptLibrary = [];
   var mBaseLocation = "file:///C:/Development/octosystems.github.io/octosystems.github.io/octosystems.github.io";
   if (window.location.href.indexOf("testjs") === -1) {
       mBaseLocation = "https://octosystems.github.io";
   }   
   loadcss(mBaseLocation + "/CSS/modalwindow.css");
   
	scriptLibrary.push("https://octosystems.github.io/JS/jquery-1.10.2.min.js");
	scriptLibrary.push("https://octosystems.github.io/JS/fabric.js");    
	scriptLibrary.push(mBaseLocation + "/JS/Octopus.FashionApp.Shopify.js");

/*scriptLibrary.push("https://octosystems.github.io/JS/jquery.expander.min.js");
scriptLibrary.push("https://octosystems.github.io/JS/jquery.dataTables.min.js");
scriptLibrary.push("https://octosystems.github.io/JS/bootstrap.min.js");
scriptLibrary.push("https://octosystems.github.io/JS/jquery.dataTables.bootstrap.js");
scriptLibrary.push("https://octosystems.github.io/JS/ionic.bundle.js"); 
scriptLibrary.push("https://octosystems.github.io/JS/ng-cordova.min.js");
//scriptLibrary.push("https://octosystems.github.io/JS/cordova.js");
scriptLibrary.push("https://octosystems.github.io/JS/imageapp.js");
scriptLibrary.push("https://octosystems.github.io/JS/app.js");     */ 

//scriptLibrary.push("https://octosystems.github.io/JS/Octopus.FashionApp.Shopify.js");

   
 
   // Pass the array of scripts you want loaded in order and a callback function to invoke when its done
   loadJsFilesSequentially(scriptLibrary, 0, function(){
       // application is "ready to be executed"
       console.log("Loading completed");
   });
};
LoadAllJS();

// loaderfn("https://octosystems.github.io/JS/jquery-1.10.2.min.js");
// loaderfn("https://octosystems.github.io/JS/jquery.expander.min.js");
// loaderfn("https://octosystems.github.io/JS/jquery.dataTables.min.js");
// loaderfn("https://octosystems.github.io/JS/bootstrap.min.js");
// loaderfn("https://octosystems.github.io/JS/jquery.dataTables.bootstrap.js");
// loaderfn("https://octosystems.github.io/JS/ionic.bundle.js"); 
//loaderfn("https://octosystems.github.io/JS/fabric.js");    
// loaderfn("https://octosystems.github.io/JS/ng-cordova.min.js");
//loaderfn("https://octosystems.github.io/JS/cordova.js");
// loaderfn("https://octosystems.github.io/JS/imageapp.js");
// loaderfn("https://octosystems.github.io/JS/app.js");     
// loaderfn("https://octosystems.github.io/JS/Octopus.FashionApp.Shopify.js");
