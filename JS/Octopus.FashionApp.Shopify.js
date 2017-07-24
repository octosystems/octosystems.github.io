constants = {
            'api_key': 'd45fd466-51e2-4701-8da8-04351c872236',
            'api_secret': '171e8465-f548-401d-b63b-caf0dc28df5f',
	    'shopify_key' : '3f4995e5b8621d60cc7fba8d6951a327',
	    'shopify_password' : '289f0e2aaf1c839879c32cbde7f0812c',
	    'shopify_url' : 'octosystems.myshopify.com'
	    // 'shopify_key' : '55301a43d07be346b355d03cfe3f1b7e',
	    // 'shopify_password' : '08df5abe64d4282f821c8cb97b269ff7',
	    // 'shopify_url' : 'chic-mela.myshopify.com'        
	    }
	
window.Images = [];
window.Faces = [];
window.Matches = [];
window.Averages = [];
window.modal_on = false;
window.modal_is_image = false;
window.modal_is_transform = false;
window.modal_id = null;

var consts = {
    BETAFACE_FEATURE_FIRST: 256,
    BETAFACE_FEATURE_LAST: 5632,
    BETAFACE_FEATURE_PRO_CHIN_EARCONN_L: 65536,
    BETAFACE_FEATURE_PRO_CHIN_P1_L: 131072,
    BETAFACE_FEATURE_PRO_CHIN_P2_L: 196608,
    BETAFACE_FEATURE_PRO_CHIN_P3_L: 262144,
    BETAFACE_FEATURE_PRO_CHIN_P4_L: 327680,
    BETAFACE_FEATURE_PRO_CHIN_P5_L: 393216,
    BETAFACE_FEATURE_PRO_CHIN_B: 458752,
    BETAFACE_FEATURE_PRO_CHIN_P5_R: 524288,
    BETAFACE_FEATURE_PRO_CHIN_P4_R: 589824,
    BETAFACE_FEATURE_PRO_CHIN_P3_R: 655360,
    BETAFACE_FEATURE_PRO_CHIN_P2_R: 720896,
    BETAFACE_FEATURE_PRO_CHIN_P1_R: 786432,
    BETAFACE_FEATURE_PRO_CHIN_EARCONN_R: 851968,
    BETAFACE_FEATURE_PRO_TEMPLE_P4_R: 917504,
    BETAFACE_FEATURE_PRO_TEMPLE_P3_R: 983040,
    BETAFACE_FEATURE_PRO_TEMPLE_P2_R: 1048576,
    BETAFACE_FEATURE_PRO_TEMPLE_P1_R: 1114112,
    BETAFACE_FEATURE_PRO_TEMPLE_R: 1179648,
    BETAFACE_FEATURE_PRO_FOREHEAD_R: 1245184,
    BETAFACE_FEATURE_PRO_FOREHEAD_P4: 1310720,
    BETAFACE_FEATURE_PRO_FOREHEAD_P3: 1376256,
    BETAFACE_FEATURE_PRO_FOREHEAD_M: 1441792,
    BETAFACE_FEATURE_PRO_FOREHEAD_P2: 1507328,
    BETAFACE_FEATURE_PRO_FOREHEAD_P1: 1572864,
    BETAFACE_FEATURE_PRO_FOREHEAD_L: 1638400,
    BETAFACE_FEATURE_PRO_TEMPLE_L: 1703936,
    BETAFACE_FEATURE_PRO_TEMPLE_P1_L: 1769472,
    BETAFACE_FEATURE_PRO_TEMPLE_P2_L: 1835008,
    BETAFACE_FEATURE_PRO_TEMPLE_P3_L: 1900544,
    BETAFACE_FEATURE_PRO_TEMPLE_P4_L: 1966080,
    BETAFACE_FEATURE_PRO_EYE_O_R: 2031616,
    BETAFACE_FEATURE_PRO_EYE_BO_R: 2097152,
    BETAFACE_FEATURE_PRO_EYE_B_R: 2162688,
    BETAFACE_FEATURE_PRO_EYE_BI_R: 2228224,
    BETAFACE_FEATURE_PRO_EYE_I_R: 2293760,
    BETAFACE_FEATURE_PRO_EYE_TI_R: 2359296,
    BETAFACE_FEATURE_PRO_EYE_T_R: 2424832,
    BETAFACE_FEATURE_PRO_EYE_TO_R: 2490368,
    BETAFACE_FEATURE_PRO_EYE_O_L: 2555904,
    BETAFACE_FEATURE_PRO_EYE_TO_L: 2621440,
    BETAFACE_FEATURE_PRO_EYE_T_L: 2686976,
    BETAFACE_FEATURE_PRO_EYE_TI_L: 2752512,
    BETAFACE_FEATURE_PRO_EYE_I_L: 2818048,
    BETAFACE_FEATURE_PRO_EYE_BI_L: 2883584,
    BETAFACE_FEATURE_PRO_EYE_B_L: 2949120,
    BETAFACE_FEATURE_PRO_EYE_BO_L: 3014656,
    BETAFACE_FEATURE_PRO_EYEBROW_I_R: 3080192,
    BETAFACE_FEATURE_PRO_EYEBROW_TI_R: 3145728,
    BETAFACE_FEATURE_PRO_EYEBROW_T_R: 3211264,
    BETAFACE_FEATURE_PRO_EYEBROW_TO_R: 3276800,
    BETAFACE_FEATURE_PRO_EYEBROW_O_R: 3342336,
    BETAFACE_FEATURE_PRO_EYEBROW_BO_R: 3407872,
    BETAFACE_FEATURE_PRO_EYEBROW_B_R: 3473408,
    BETAFACE_FEATURE_PRO_EYEBROW_BI_R: 3538944,
    BETAFACE_FEATURE_PRO_EYEBROW_I_L: 3604480,
    BETAFACE_FEATURE_PRO_EYEBROW_TI_L: 3670016,
    BETAFACE_FEATURE_PRO_EYEBROW_T_L: 3735552,
    BETAFACE_FEATURE_PRO_EYEBROW_TO_L: 3801088,
    BETAFACE_FEATURE_PRO_EYEBROW_O_L: 3866624,
    BETAFACE_FEATURE_PRO_EYEBROW_BO_L: 3932160,
    BETAFACE_FEATURE_PRO_EYEBROW_B_L: 3997696,
    BETAFACE_FEATURE_PRO_EYEBROW_BI_L: 4063232,
    BETAFACE_FEATURE_PRO_MOUTH_L: 4128768,
    BETAFACE_FEATURE_PRO_MOUTH_TL: 4194304,
    BETAFACE_FEATURE_PRO_MOUTH_T: 4259840,
    BETAFACE_FEATURE_PRO_MOUTH_TR: 4325376,
    BETAFACE_FEATURE_PRO_MOUTH_R: 4390912,
    BETAFACE_FEATURE_PRO_MOUTH_BR: 4456448,
    BETAFACE_FEATURE_PRO_MOUTH_B: 4521984,
    BETAFACE_FEATURE_PRO_MOUTH_BL: 4587520,
    BETAFACE_FEATURE_PRO_NOSE_T_L: 4653056,
    BETAFACE_FEATURE_PRO_NOSE_TI_NOSTRIL_L: 4718592,
    BETAFACE_FEATURE_PRO_NOSE_TO_NOSTRIL_L: 4784128,
    BETAFACE_FEATURE_PRO_NOSE_BO_NOSTRIL_L: 4849664,
    BETAFACE_FEATURE_PRO_NOSE_B_NOSTRIL_L: 4915200,
    BETAFACE_FEATURE_PRO_NOSE_B: 4980736,
    BETAFACE_FEATURE_PRO_NOSE_B_NOSTRIL_R: 5046272,
    BETAFACE_FEATURE_PRO_NOSE_BO_NOSTRIL_R: 5111808,
    BETAFACE_FEATURE_PRO_NOSE_TO_NOSTRIL_R: 5177344,
    BETAFACE_FEATURE_PRO_NOSE_TI_NOSTRIL_R: 5242880,
    BETAFACE_FEATURE_PRO_NOSE_T_R: 5308416,
    BETAFACE_FEATURE_PRO_EYE_IRIS_R: 5373952,
    BETAFACE_FEATURE_PRO_EYE_IRIS_L: 5439488,
    BETAFACE_FEATURE_PRO_NOSE_TIP: 5505024,
    BETAFACE_FEATURE_PRO_CHEEKBONE_L: 5570560,
    BETAFACE_FEATURE_PRO_CHEEKBONE_R: 5636096,
    BETAFACE_FEATURE_PRO_NOSE_BRIDGE_T: 5701632,
    BETAFACE_FEATURE_PRO_NOSE_BRIDGE_M: 5767168,
    BETAFACE_FEATURE_PRO_NOSE_BRIDGE_B: 5832704,
    BETAFACE_FEATURE_PRO_MOUTH_TL_P1: 5898240,
    BETAFACE_FEATURE_PRO_MOUTH_BL_P1: 5963776,
    BETAFACE_FEATURE_PRO_MOUTH_BR_P1: 6029312,
    BETAFACE_FEATURE_PRO_MOUTH_TR_P1: 6094848,
    BETAFACE_FEATURE_PRO_MOUTH_I_L: 6160384,
    BETAFACE_FEATURE_PRO_MOUTH_I_BL: 6225920,
    BETAFACE_FEATURE_PRO_MOUTH_I_B: 6291456,
    BETAFACE_FEATURE_PRO_MOUTH_I_BR: 6356992,
    BETAFACE_FEATURE_PRO_MOUTH_I_R: 6422528,
    BETAFACE_FEATURE_PRO_MOUTH_I_TR: 6488064,
    BETAFACE_FEATURE_PRO_MOUTH_I_T: 6553600,
    BETAFACE_FEATURE_PRO_MOUTH_I_TL: 6619136
};

var octImagelocation = "https://octosystems.github.io/images/";

var addbuttontryme= function() {
	//var divtags = document.getElementsByClassName("product-form__item product-form__item--submit");
	var divtags = document.getElementsByClassName("add");
	if (divtags.length == 0) { return false; }

	var modaldiv = document.createElement("div");
	var htmlstring = '<!-- Trigger/Open The Modal -->' +
	'<!-- The Modal -->'+
	'<div id="myModal" class="fsnmodal">'+
	'  <!-- Modal content -->'+
	'  <div class="fsnmodal-content">'+
	'    <span class="fsnclose" id="spanfsnclose">&times;</span><div>'+
	'    <label style="color:blue"> Choose image...' + 
	'    <input type="file" id="myImage" accept="image/*" style="top:-1000px;position:fixed"/></label>' +
	'    <span id="octStatus" style="display:none" ></span>' +
	'    <img src="about:blank" alt="" id="fsnPhoto" style="width:100%;height:auto; display:none" ></img></div>'+
	'    <div id="canvasContainer" /></div>'+
	  '</div>'+

	'</div>';
	modaldiv.innerHTML = htmlstring;
	document.body.append(modaldiv);

	var divtag=divtags[0];
	var divtag1 = document.createElement("div");
	divtag1.setAttribute("ng-app", "starter");
	var divtag2 = document.createElement("div");
	divtag2.setAttribute("ng-controller", "ExampleController");

	var newbtn = document.createElement("a"); 
	newbtn.appendChild(document.createTextNode("Try before you buy"));
	newbtn.setAttribute("id", "trymefashion");
	newbtn.setAttribute("href", "javascript:void(0)");
	newbtn.visible=true;
	divtag.parentElement.appendChild(newbtn);

	// divtag2.appendChild(newbtn);
	// divtag1.appendChild(divtag2);
	document.body.appendChild(divtag1);
	// Get the modal
	var modal = document.getElementById('myModal');
	// Get the button that opens the modal
	var btn = document.getElementById("trymefashion");
	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("fsnclose")[0];
	// When the user clicks on the button, open the modal 
	btn.onclick = function() {
	    window.modal_on = true;
	    modal.style.display = "block";
	    return false;
	};
	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    window.modal_on = false;
	    modal.style.display = "none";
	};
	
};


var getproductcallback  =  function(result) {
	window.octProduct = result; 
	if (isproductnecklace() ||  isproductearring() ) {
	        if (result.product.images.length > 0 ) {
		    for (i = 0;i<result.product.images.length; i++) {
			if (result.product.images[i].src.indexOf("_fortrial") !== -1) {
				addbuttontryme();
				assignFileSelect();
				break;			    
			}
		    }
		}
	}	
	};

var getProduct = function () {
	console.log(meta.product.id);
	window.octProduct = {};
	/* var authstring = "Basic " + btoa(constants.shopify_key + ":" + constants.shopify_password);
	var ajaxreq = {
		headers: {"Authorization":  authstring },
		  url: "/admin/products/" + meta.product.id +".json",
		  dataType: 'json',
		  success: getproductcallback
		};
	$.ajax({
		headers: {"Authorization" :  authstring },
		  url: "/admin/products/" + meta.product.id +".json",
		  dataType: 'json',
		  success: getproductcallback
		});
	*/	
	//var producturl = "https://" + constants.shopify_key + ":" + constants.shopify_password + "@octosystems.myshopify.com/admin/products/" + meta.product.id +".json";
	var producturl = "https://" + constants.shopify_key + ":" + constants.shopify_password + "@" + constants.shopify_url +"/admin/products/" + meta.product.id +".json";
	$.getJSON(producturl,  getproductcallback); 
	};
getProduct();



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

/* (function() {
            $(window).resize(function() {
                updateModal();
            });
})(); */

function serviceUri()
{
   return (window.location.protocol != "https:")?"http://www.betafaceapi.com/service.svc":"https://www.betafaceapi.com/service_ssl.svc";
}

function loadImage(imagedata) {
    setTimeout(function() {
	  var detection_flags = getDetectionFlags(); 
	  //alert('calling uploadImageData');
	  uploadImageFile('FromGallery', imagedata, detection_flags);                        
    }, 100);
}

function imageToDataUri(img, width, height) {

    // create an off-screen canvas
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

    // set its dimension to target size
    canvas.width = width;
    canvas.height = height;

    // draw source image into the off-screen canvas:
    ctx.drawImage(img, 0, 0, width, height);

    // encode image to data-uri with base64 version of compressed image
    return canvas.toDataURL();
}

function loadFile(file, img) {
    setTimeout(function() {
	var reader = new FileReader();

	reader.onload = (function(theFile) {
	    return function(e) {
		if (reader.readyState == FileReader.DONE) {
		    var data_url = e.target.result;
		    img.src = data_url;
		    //img.style.display = "block";
		    // data_url = imageToDataUri(img, 640, 800);
		    // img.src = data_url;
		    img.style.display = "block";
		    var detection_flags = getDetectionFlags();
		    $("#octStatus").text("Please wait.. Processing the image");
		     $("#octStatus").css("display", "block");
		     deleteCanvascontent();
		    uploadImageFile(theFile.name, data_url, detection_flags);
		}

	    }
	})(file);
	reader.readAsDataURL(file);
    }, 100);
}
function handleSelectedFiles(files) {
    for (var i = 0, f; f = files[i]; i++) {
	// Only process image files.
	if (!(f.type.match('image.*') || f.type.match('video/mp4'))) {
	    continue;
	}

	loadFile(f);
    }
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    handleSelectedFiles(files);
}


function uploadImageFile(image_filename, image_data, detection_flags) {
    var prefix = ';base64,';
    var idx = image_data.indexOf(prefix);
    if (idx >= 0) {
	var base64_data = image_data.substring(idx + prefix.length);
	var msg = '<?xml version="1.0" encoding="utf-8"?><ImageRequestBinary xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
	    '<api_key>' + constants.api_key + '</api_key><api_secret>' + constants.api_secret + '</api_secret>' +
	    '<detection_flags>' + detection_flags + '</detection_flags>' +
	    '<imagefile_data>' + base64_data + '</imagefile_data>' +
	    '<original_filename>' + image_filename + '</original_filename>' +
	    '</ImageRequestBinary>';

	uploadImageImpl(serviceUri()+'/UploadNewImage_File', msg, image_filename, image_data);
    }
}

function uploadImageImpl(url, msg, image_filename, image) {
    $.support.cors = true;
    $.ajax({
	crossDomain: true,
	url: url,
	type: 'post',
	contentType: 'application/xml',
	processData: false,
	data: msg,
	dataType: 'xml',
	success: function(data, textStatus, jqXHR) {
	 
	    var xmlDocRoot = $.parseXML(jqXHR.responseText);
	    var xmlDoc = $(xmlDocRoot).children("BetafaceImageResponse");
	    var int_response = parseInt($(xmlDoc).children("int_response").text());
	    var string_response = $(xmlDoc).children("string_response").text();
	    if (int_response == 0) {
		var image_uid = $(xmlDoc).children("img_uid").text();
		doAddImage(image_uid, image_filename, image);
 	    } else {
		//error
		doUpdateImage(image_uid, string_response, 0);

		console.log(int_response);
		console.log(string_response); 
	    }
	},
	error: function(jqXHR, textStatus, errorThrown) {
	    //alert("Error in uploadImageImpl:"+textStatus);
	    console.log(textStatus);
	}
    });
}

function getDetectionFlags()
{
   var res = "cropface,recognition";
	res = res.concat(",classifiers");
	res = res.concat(",propoints");
   return res;
}

 function isproductearring() {
	return (octProduct.product.tags.indexOf("trialearring") !== -1);
 }
 function isproductnecklace() {
	return (octProduct.product.tags.indexOf("trialnecklace") !== -1);
 }
 
 function drawEarRingsOnFace(canvas, scale, offsetX, offsetY, pts) {
    if (!isproductearring()) return;
    var pt_found = 0;
    var x = 0.0,
	y = 0.0;
    var imageurl = "";
    for (i = 0;i<window.octProduct.product.images.length; i++) {
	if (window.octProduct.product.images[i].src.indexOf("_fortrial") !== -1) {
		imageurl = window.octProduct.product.images[i].src;
		break;			    
		}
	}  
    if (imageurl === "") return;
    for (var k = 0; k < pts.length; k++) {
	var type = parseInt($(pts[k]).children("type").text());
	if (type == consts.BETAFACE_FEATURE_PRO_CHIN_EARCONN_L || type == consts.BETAFACE_FEATURE_PRO_CHIN_EARCONN_R ) {
	    x = offsetX + scale * parseFloat($(pts[k]).children("x").text());
	    y = offsetY + scale * parseFloat($(pts[k]).children("y").text());
	    drawImageOnFace(imageurl, canvas, -1, 0, x, y);                    
	    pt_found++;
	    if (pt_found == 2) {
	      break;
	    }
	}
    }
}                                                                    

function drawNecklaceOnFace(canvas, w, h,x,y, face, iscropped) { 
/*     drawImageOnFace(octImagelocation + "AdjustedNecklace.png", 
	  canvas, w, h,x,y); 
	  */
	if (!isproductnecklace()) return;  
    for (i = 0;i<window.octProduct.product.images.length; i++) {
	if (window.octProduct.product.images[i].src.indexOf("_fortrial") !== -1) {
		
		drawImageOnFace(window.octProduct.product.images[i].src, 
			canvas,  w, h,x,y);
			
		break;			    
		}
	}  
      
}

function drawFace(canvas, scale, offsetX, offsetY, face, iscropped) {
    //iscropped = false;
    var pts = iscropped ? face.cropped_points : face.points;
    if (iscropped) {
	var w = 0.7 * face.cropped_width * scale;
	var h = 0.6 * face.cropped_height * scale;
	var x = offsetX + face.cropped_x * scale - w / 2;
	var y = offsetY + face.cropped_y * scale - h / 2;
	var a = -face.cropped_angle;
	var rc = new fabric.Rect({
	    top: y,
	    left: x,
	    width: w,
	    height: h,
	    angle: a,
	    stroke: 'lightgreen',
	    strokeWidth: 2,
	    fill: 'transparent',
	    selectable: false,
	    hasControls: false,
	    hasBorders: false,
	    lockMovementX: true,
	    lockMovementY: true
	});
       // rc.evented = false;
	//canvas.add(rc);  
	drawNecklaceOnFace(canvas, w, h, x, y, face, iscropped);
	drawEarRingsOnFace(canvas, scale, offsetX, offsetY, pts);
    } else {
	var w = 1.1 * face.width * scale;
	var h = 1.35 * face.height * scale;
	var x = offsetX + face.x * scale - w / 2;
	var y = offsetY + face.y * scale - h / 2;
	var a = -face.angle;
	var rc = new fabric.Rect({
	    top: y,
	    left: x,
	    width: w,
	    height: h,
	    angle: a,
	    stroke: 'lightgreen',
	    strokeWidth: 2,
	    fill: 'transparent',
	    selectable: false,
	    hasControls: false,
	    hasBorders: false,
	    lockMovementX: true,
	    lockMovementY: true
	});
       //rc.evented = false;
       // canvas.add(rc);
	drawNecklaceOnFace(canvas, w, h, x, y, face, iscropped);
	drawEarRingsOnFace(canvas, scale, offsetX, offsetY, pts);
    }
}
       
function drawImageOnFace(imgdata_url, canvas, w, h,x,y) {     
    fabric.Image.fromURL(imgdata_url, function(img) {
     		img.left = x;
		img.top = y+h;
		if (w < 0 ) {
		  // no change in width
		} else if (img.width > w) {
		    img.width=w;
		    // if image width greather than the width to draw, make the image width to the reqd width
		} else {                                                                                      
		     // if reqd width greather than the image width, make the image to be in center
		     img.left = x+((w-img.width)/2);
		}
		img.opacity = 1;
		//img.evented = false;
		canvas.add(img);
		//img.sendToBack();
		canvas.renderAll();
	    });
}

function showImageTools(e) {
    // if (!$('#tooltipDialog').length) {
	// $('#myModal').append("<div id='tooltipDialog' style='position: absolute; top: 0; left: 0; color: lightgreen'><h1>" + e.tooltip + "</h1></div>");
    // }
    moveImageTools(e);
}

function moveImageTools(e) {
    var w = $('#tooltipDialog').width();
    var h = $('#tooltipDialog').height();
    var coords = getObjPosition(e);
    console.log('coords', coords);
    var top = coords.bottom - h - 1;
    var left = coords.right - w - 1;
    $('#tooltipDialog').show();
    $('#tooltipDialog').css({
	top: top,
	left: left
    });
}

function getObjPosition(e) {
    var rect = e.getBoundingRect();
    var offset = __canvas.calcOffset();
    var bottom = offset._offset.top + rect.top + rect.height;
    var right = offset._offset.left + rect.left + rect.width;
    var left = offset._offset.left + rect.left;
    var top = offset._offset.top + rect.top;
    return {
	left: left,
	top: top,
	right: right,
	bottom: bottom
    };
}

function deleteCanvascontent() {
	var _con = $("#canvasContainer");
	while (_con[0].firstChild) {
	    _con[0].removeChild(_con[0].firstChild);
	}
}
function updateModal() {
    if (window.modal_on) {
	var _con = $("#canvasContainer");
	while (_con[0].firstChild) {
	    _con[0].removeChild(_con[0].firstChild);
	}
	var e_canvas = document.createElement('canvas');
	e_canvas.id = "imageCanvas";
	e_canvas.width = 600;
	e_canvas.height = 500;
	e_canvas.style.position = "absolute";
	_con[0].appendChild(e_canvas);

	var canvas = this.__canvas = new fabric.Canvas('imageCanvas', {
	    renderOnAddRemove: false,
	    selection: false,
	    hoverCursor: 'default',
	    width: _con.width(),
	    height: _con.height()
	});

	canvas.on("after:render", function() {
	    canvas.calcOffset()
	});

	canvas.observe('mouse:over', function(e) {
	    showImageTools(e.target);
	});

	canvas.observe('mouse:out', function(e) {
	    $('#tooltipDialog').remove();
	});

	canvas.on('object:over', function(e) {
	    observe.renderAll.bind(canvas);
	});

	canvas.clear();
	canvas.renderAll();

	if (window.modal_is_image) {
	    $("#imageHeader").text("Image " + window.modal_id);

	    fabric.Image.fromURL(findImage(window.modal_id), function(img) {
		var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
		var offsetX = Math.max((canvas.width - img.width * scale) / 2.0, 0);
		var offsetY = Math.max((canvas.height - img.height * scale) / 2.0, 0);
		img.scale(scale);
		img.left = offsetX;
		//img.top = offsetY;
		img.top = 0;
		img.evented = false;
		canvas.add(img);
		for (var i = 0; i < window.Faces.length; i++) {
		    if (window.Faces[i].image_uid === window.modal_id) {
			//drawFace(canvas, scale, offsetX, offsetY, window.Faces[i], false);
			drawFace(canvas, scale, offsetX, 0, window.Faces[i], false);
		    }
		}img.sendToBack();
		canvas.renderAll();
	    });
       } else if (window.modal_is_transform) {
	    $("#imageHeader").text("Image " + window.modal_id);

	    fabric.Image.fromURL(findTransform(window.modal_id), function(img) {
		var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
		var offsetX = Math.max((canvas.width - img.width * scale) / 2.0, 0);
		var offsetY = Math.max((canvas.height - img.height * scale) / 2.0, 0);
		img.scale(scale);
		img.left = offsetX;
		img.top = offsetY;
		img.evented = false;
		canvas.add(img);
		img.sendToBack();
		canvas.renderAll();
	    });
	} else {
	    console.log("updatemodal for face " + window.modal_id);
	    $("#imageHeader").text("Face " + window.modal_id);
	    fabric.Image.fromURL(findFaceImage(window.modal_id), function(img) {
		var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
		var offsetX = Math.max((canvas.width - img.width * scale) / 2.0, 0);
		//var offsetY = Math.max((canvas.height - img.height * scale) / 2.0, 0);
		offsetY = 0;
		img.scale(scale);
		img.left = offsetX;
		img.top = offsetY;
		img.evented = false;
		console.log("updatemodal - updating canvas with face image " + window.modal_id);
		canvas.add(img);
		for (var i = 0; i < window.Faces.length; i++) {
		    if (window.Faces[i].id === window.modal_id) {
		        console.log("updatemodal - Calling drawface");
			drawFace(canvas, scale, offsetX, offsetY, window.Faces[i], true);
			break;
		    }
		}
		img.sendToBack();
		canvas.renderAll();
		$("#octStatus").css("display", "none");
		$("#fsnPhoto").css("display", "none");
		$("#octStatus").text("");
		
	    });
	}
    }
}
function getImageInfo(image_uid) {
    var msg = '<?xml version="1.0" encoding="utf-8"?><ImageInfoRequestUid>' +
	'<api_key>' + constants.api_key + '</api_key><api_secret>' + constants.api_secret + '</api_secret>' +
	'<img_uid>' + image_uid + '</img_uid></ImageInfoRequestUid>';

    $.support.cors = true;
    $.ajax({
	crossDomain: true,
	url: serviceUri()+'/GetImageInfo',
	type: 'post',
	contentType: 'application/xml',
	processData: false,
	data: msg,
	dataType: 'xml',
	success: function(data, textStatus, jqXHR) {
	    var xmlDocRoot = $.parseXML(jqXHR.responseText);
	    var xmlDoc = $(xmlDocRoot).children("BetafaceImageInfoResponse");
	    var int_response = parseInt($(xmlDoc).children("int_response").text());
	    var string_response = $(xmlDoc).children("string_response").text();
	    console.log("get image info success " + int_response.toString());
	    if (int_response == 1) {
		//image is in the queue
		doUpdateImage(image_uid, 'in queue', 0);
		setTimeout(function() {
		    getImageInfo(image_uid);
		}, 500);
	    } else if (int_response == 0) {
		//image processed
		console.log("Calling parseImageInfo image uid is " + image_uid);
		parseImageInfo(image_uid, xmlDoc);
	    } else {
		//error
		console.log("Calling doUpdateImage image uid is " + image_uid);
		doUpdateImage(image_uid, string_response, 0);

		console.log(int_response);
		console.log(string_response);
	    }
	},
	error: function(jqXHR, textStatus, errorThrown) {
	    console.log(textStatus);
	}
    });
}

function doUpdateImage(image_uid, status, faces) {
    setTimeout(function() {
	updateImage(image_uid, status, faces);
    }, 200);
}


function parseImageInfo(image_uid, xmlDocRoot) {
    var xmlDoc = $(xmlDocRoot).children("faces");
    console.log("parseImageInfo calling doUpdateImage");
    doUpdateImage(image_uid, 'ok', $(xmlDoc).children("FaceInfo").length);
    if ($(xmlDoc).children("FaceInfo") && $(xmlDoc).children("FaceInfo").length ) {
       if ($(xmlDoc).children("FaceInfo").length == 0) {
          console.log("parseimageinfo faceinfo length 0 ");
	  $("#octStatus").text("No faces found");
       }
       
    } else {
       console.log("parseimageinfo no faceinfo found");
       $("#octStatus").text("No faces found");
    }
    var idx = 0;
    $(xmlDoc).children("FaceInfo").each(function() {
	var face_uid = $(this).children("uid").text();
	var image_uid = $(this).children("image_uid").text();
	//
	var score = parseFloat($(this).children("score").text());
	//
	var x = parseFloat($(this).children("x").text());
	var y = parseFloat($(this).children("y").text());
	var width = parseFloat($(this).children("width").text());
	var height = parseFloat($(this).children("height").text());
	var angle = parseFloat($(this).children("angle").text());
	//
	var points = $(this).children("points").children();
	var tags = $(this).children("tags").children();
	//
	var person_name = $(this).children("person_name").text();

	idx += 1;
	console.log("parseImageInfo calling doAddFace");
	doAddFace(face_uid, image_uid, score, x, y, width, height, angle, points, tags, person_name, idx == $(xmlDoc).children("FaceInfo").length);
	//query face image
	console.log("parseImageInfo calling doGetFaceImage");
	doGetFaceImage(face_uid);

    });
}

function doAddFace(face_uid, image_uid, score, x, y, width, height, angle, points, tags, person_name, update_faces) {
    setTimeout(function() {
	addFace(face_uid, image_uid, score, x, y, width, height, angle, points, tags, person_name, update_faces);
    }, 500);
}


function addFace(face_uid, image_uid, score, x, y, width, height, angle, points, tags, person_name, update_faces) {
    var bfound = false;
    for (var i = window.Faces.length - 1; i > -1; i--) {
	if (window.Faces[i].id === face_uid) {
	    window.Faces[i].image_uid = image_uid;
	    window.Faces[i].score = score;
	    window.Faces[i].x = x;
	    window.Faces[i].y = y;
	    window.Faces[i].width = width;
	    window.Faces[i].height = height;
	    window.Faces[i].angle = angle;
	    window.Faces[i].points = points;
	    window.Faces[i].tags = tags;
	    window.Faces[i].person_name = person_name;
	    bfound = true;
	    break;
	}
    }
    if (!bfound) {
	// add face to the storage
	var obj = {
	    id: face_uid,
	    image_uid: image_uid,
	    score: score,
	    x: x,
	    y: y,
	    width: width,
	    height: height,
	    angle: angle,
	    points: points,
	    tags: tags,
	    person_name: person_name,
	    data: null,
	    cropped_x: null,
	    cropped_y: null,
	    cropped_width: null,
	    cropped_height: null,
	    cropped_angle: null,
	    cropped_points: null
	};
	window.Faces.push(obj);
    }
    /* if (update_faces) {
	//
	if (window.modal_on && window.modal_is_image && (window.modal_id === image_uid)) {
	    updateModal();
	}
    } */
}

function doGetFaceImage(face_uid) {
    setTimeout(function() {
	getFaceImage(face_uid);
    }, 200);
}
function updateImage(image_uid, status, faces) {
    var bfound = false;
    console.log("updateimage called image_uid is " + image_uid);
    for (var i = window.Images.length - 1; i > -1; i--) {
	if (window.Images[i].id === image_uid) {
	    window.Images[i].faces = faces;
	    window.Images[i].status = status;
	    bfound = true;
	    break;
	}
    }

}

function getFaceImage(face_uid) {
    console.log("getFaceImage called face_uid is " + face_uid);
    var msg = '<?xml version="1.0" encoding="utf-8"?><FaceRequestId><api_key>' + constants.api_key + '</api_key><api_secret>' + constants.api_secret + '</api_secret>' +
	'<face_uid>' + face_uid + '</face_uid></FaceRequestId>';

    $.support.cors = true;
    $.ajax({
	crossDomain: true,
	url: serviceUri() + '/GetFaceImage',
	type: 'post',
	contentType: 'application/xml',
	processData: false,
	data: msg,
	dataType: 'xml',
	success: function(data, textStatus, jqXHR) {
	    
	    var xmlDocRoot = $.parseXML(jqXHR.responseText);
	    var xmlDoc = $(xmlDocRoot).children("BetafaceFaceImageResponse");
	    var int_response = parseInt($(xmlDoc).children("int_response").text());
	    var string_response = $(xmlDoc).children("string_response").text();
	    console.log("getFaceImage AJAX call success. response is " + int_response.toString());
	    if (int_response == 0) {
		var face_uid = $(xmlDoc).children("uid").text();
		//
		var face_image = $(xmlDoc).children("face_image").text();
		var data_url = 'data:image/jpeg;base64,' + face_image;
		//
		var x = parseFloat($(xmlDoc).children("face_info").children("x").text());
		var y = parseFloat($(xmlDoc).children("face_info").children("y").text());
		var width = parseFloat($(xmlDoc).children("face_info").children("width").text());
		var height = parseFloat($(xmlDoc).children("face_info").children("height").text());
		var angle = parseFloat($(xmlDoc).children("face_info").children("angle").text());
		//
		var points = $(xmlDoc).children("face_info").children("points").children();
		//
		var tags = $(xmlDoc).children("face_info").children("tags").children();
		window.modal_id = face_uid;
		console.log("from getFaceImage AJAX call, calling  success. doUpdateFace " +face_uid);
		doUpdateFace(face_uid, data_url, x, y, width, height, angle, points, tags);
	    } else {
		//error
		console.log(int_response);
		
		console.log(string_response);
	    }
	},
	error: function(jqXHR, textStatus, errorThrown) {
	    console.log(textStatus);
	}
    });
}

function findImage(image_uid) {
    var ret = null;
    for (var i = window.Images.length - 1; i > -1; i--) {
	if (window.Images[i].id === image_uid) {
	    if (window.Images[i]['data'] != undefined) {
		ret = window.Images[i].data;
	    }
	    break;
	}
    }
    return ret;
}

function findFaceImage(face_uid) {
    var ret = null;
    for (var i = window.Faces.length - 1; i > -1; i--) {
	if (window.Faces[i].id === face_uid) {
	    if (window.Faces[i]['data'] != undefined) {
		ret = window.Faces[i].data;
	    }
	    break;
	}
    }
    return ret;
}

function findFace(face_uid) {
    var ret = null;
    for (var i = window.Faces.length - 1; i > -1; i--) {
	if (window.Faces[i].id === face_uid) {
	    if (window.Faces[i]['data'] != undefined) {
		ret = window.Faces[i];
	    }
	    break;
	}
    }
    return ret;
}
/* 
$('#myModal').on('shown.bs.modal', function() {
    window.modal_on = true;
    updateModal();
})

$('#myModal').on('hidden.bs.modal', function() {
    window.modal_on = false;
}) */

function addImage(image_uid, filename, image_data) {
    var bfound = false;
    for (var i = window.Images.length - 1; i > -1; i--) {
	if (window.Images[i].id === image_uid) {
	    window.Images[i].filename = filename;
	    window.Images[i].data = image_data;
	    window.Images[i].faces = 0;
	    window.Images[i].status = 'uploaded';
	    bfound = true;
	    getImageInfo(image_uid);
	    break;
	}
    }
    if (!bfound) {
	// add image to the storage
	var obj = {
	    id: image_uid,
	    name: filename,
	    data: image_data,
	    faces: 0,
	    status: 'uploaded'
	};
	window.Images.push(obj);

	//query info
	getImageInfo(image_uid);
    }
 
}

function doAddImage(image_uid, image_filename, image_data) {
    setTimeout(function() {
	addImage(image_uid, image_filename, image_data);
    }, 200);
}


function doUpdateFace(face_uid, face_image_data, x, y, width, height, angle, points, tags) {
    setTimeout(function() {
	updateFace(face_uid, face_image_data, x, y, width, height, angle, points, tags);
    }, 200);
}


function updateFace(face_uid, face_image_data, x, y, width, height, angle, points, tags) {
    console.log("UpdateFace called " +face_uid);
    var update_faces = false;
    for (var i = window.Faces.length - 1; i > -1; i--) {
	if (window.Faces[i].id === face_uid) {
	    window.Faces[i].data = face_image_data;
	    window.Faces[i].cropped_x = x;
	    window.Faces[i].cropped_y = y;
	    window.Faces[i].cropped_width = width;
	    window.Faces[i].cropped_height = height;
	    window.Faces[i].cropped_angle = angle;
	    window.Faces[i].cropped_points = points;
	    update_faces = true;
	    break;
	}
    }
    console.log("Calling updatemodal from updateFace function " +face_uid);
	updateModal();		

} 
