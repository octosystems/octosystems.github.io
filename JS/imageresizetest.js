constants = {
            'api_key': 'd45fd466-51e2-4701-8da8-04351c872236',
            'api_secret': '171e8465-f548-401d-b63b-caf0dc28df5f',
	    'shopify_key' : '3f4995e5b8621d60cc7fba8d6951a327',
	    'shopify_password' : '289f0e2aaf1c839879c32cbde7f0812c'
        }
var getproductcallback  =  function(result) {
	window.octProduct = result; 
	/* if (isproductnecklace() ||  isproductearring() ) {
	        if (result.product.images.length > 0 ) {
		    for (i = 0;i<result.product.images.length; i++) {
			if (result.product.images[i].src.indexOf("_fortrial") !== -1) {
				addbuttontryme();
				assignFileSelect();
				break;			    
			}
		    }
		}
	} */	
	};

var ajaxcall = function() {	
	var producturl = "https://" + constants.shopify_key + ":" + constants.shopify_password + 
			"@octosystems.myshopify.com/admin/products/9515531346.json";
	// $.getJSON(producturl + '').done(
	// function(x){
	// console.log(x.product)
	// });

	$.ajax({
	    url: producturl,
	    crossOrigin: true,
	    // The name of the callback parameter, as specified by the YQL service
	    //jsonp: "getproductcallback",
	 
	    // Tell jQuery we're expecting JSONP
	    
	    dataType: "json",     
		// jsonp: 'callback',
                // jsonpCallback: 'jsonpCallback',
	    // Work with the response
	    success: function( response ) {
		console.log( response ); // server response
	    },
	    error: function(response) {
		console.log( "error :" + response ); // server response
	    }
	});	
 };
ajaxcall();
	
var getProduct = function () {
	//console.log(meta.product.id);
	window.octProduct = {};
	// var authstring = "Basic " + btoa(constants.shopify_key + ":" + constants.shopify_password);
	// var producturl = "https://octosystems.myshopify.com/admin/products/9515531346.json";
	// var ajaxreq = {
		// headers: {"Authorization":  authstring },
		  // url: producturl,
		  // dataType: 'json',
		  // success: getproductcallback
		// };
	// $.ajax(ajaxreq);
		
	var producturl = "https://" + constants.shopify_key + ":" + constants.shopify_password + 
			"@octosystems.myshopify.com/admin/products/9515531346.json";
	$.getJSON(producturl,  getproductcallback); 
	};
 function jsonpCallback(data){
        var result=data;
    }
function imageToDataUri(img, width, height) {

    // create an off-screen canvas
    //var canvas = document.querySelector("#mycanvas");
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');
    // ctx.clearRect(0,0,canvas.width, canvas.height);
    // set its dimension to target size
     canvas.width = width;
     canvas.height = height;
    // draw source image into the off-screen canvas:
    ctx.drawImage(img, 0, 0, width, height);
    // ctx.fillStyle='green';
    // ctx.fillRect(0,0,100,100);
    // encode image to data-uri with base64 version of compressed image
    var res = canvas.toDataURL();

    return res;
}
function loadFile(file, img) {
    setTimeout(function() {
	var reader = new FileReader();

	reader.onload = (function(theFile) {
	    return function(e) {
		if (reader.readyState == FileReader.DONE) {
		    var data_url = e.target.result;
		    img.addEventListener('load', function(){
			    data_url = imageToDataUri(img, img.width/2, img.height/2);
			    var resizedImg = document.querySelector("#fsnPhotoresized");
			    resizedImg.src = data_url;
			    resizedImg.style.display = "block";
		    });
		    img.src = data_url;
		    img.style.display = "block";
		}

	    }
	})(file);
	reader.readAsDataURL(file);
    }, 100);
}

function assignFileSelect() {
    var takePicture = document.querySelector("#myImage"),
        showPicture = document.querySelector("#fsnPhoto");
    if (takePicture && showPicture) {
        // Set events
        takePicture.onchange = function (event) {
            // Get a reference to the taken picture or chosen file
            var files = event.target.files,
                file;
            if (files && files.length > 0) {
                file = files[0];
		loadFile(file, showPicture);
            }
        };
    }
}
	assignFileSelect();
