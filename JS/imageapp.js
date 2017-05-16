var constants = {
            'api_key': 'd45fd466-51e2-4701-8da8-04351c872236',
            'api_secret': '171e8465-f548-401d-b63b-caf0dc28df5f'
        }

        window.onload = function() {
            window.Images = [];
            window.Faces = [];
            window.Matches = [];
            window.Averages = [];
            window.modal_on = false;
            window.modal_is_image = false;
            window.modal_is_transform = false;
            window.modal_id = null;
            updateImages();
            updateFaces();
            updateMatches();
            updateAverages();
        }

        $(document).ready(function() {
            if (window.File && window.FileReader && window.FileList && window.Blob) {} else {
                alert('The File APIs are not fully supported in this browser, uploading local files might not function.');
            }

            $('.datatable').dataTable({
                "sPaginationType": "bs_normal"
            });
            $('.datatable').each(function() {
                var datatable = $(this);
                // SEARCH - Add the placeholder for Search and Turn this into in-line form control
                var search_input = datatable.closest('.dataTables_wrapper').find('div[id$=_filter] input');
                search_input.attr('placeholder', 'Search');
                search_input.addClass('form-control input-sm');
                // LENGTH - Inline-Form control
                var length_sel = datatable.closest('.dataTables_wrapper').find('div[id$=_length] select');
                length_sel.addClass('form-control input-sm');
            });

            $(window).resize(function() {
                updateModal();
            });
        });

        function serviceUri()
        {
           return (window.location.protocol != "https:")?"http://www.betafaceapi.com/service.svc":"https://www.betafaceapi.com/service_ssl.svc";
        }

        function getFaceImage(face_uid) {
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

                        doUpdateFace(face_uid, data_url, x, y, width, height, angle, points, tags);
                        //
                        if (window.modal_on && (!window.modal_is_image) && (window.modal_id === face_uid)) {
                            updateModal();
                        }
                    } else {
                        //error
                        console.info(int_response);
                        
                        console.info(string_response);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.info(textStatus);
                }
            });
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

                        console.info(int_response);
                        console.info(string_response);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    //alert("Error in uploadImageImpl:"+textStatus);
                    console.info(textStatus);
                }
            });
        }

        function uploadImageUrl(image_url, detection_flags) {
            if (image_url != null && image_url != '') {
                var msg = '<?xml version="1.0" encoding="utf-8"?><ImageRequestUrl xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
                    '<api_key>' + constants.api_key + '</api_key><api_secret>' + constants.api_secret + '</api_secret>' +
                    '<detection_flags>' + detection_flags + '</detection_flags>' +
                    '<image_url>' + image_url + '</image_url>' +
                    '</ImageRequestUrl>';
                uploadImageImpl(serviceUri()+'/UploadNewImage_Url', msg, image_url, image_url);
            }
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

        function uploadImageData(image_filename, image_data, detection_flags) {
                var base64_data = image_data;
                var msg = '<?xml version="1.0" encoding="utf-8"?><ImageRequestBinary xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
                    '<api_key>' + constants.api_key + '</api_key><api_secret>' + constants.api_secret + '</api_secret>' +
                    '<detection_flags>' + detection_flags + '</detection_flags>' +
                    '<imagefile_data>' + base64_data + '</imagefile_data>' +
                    '<original_filename>' + image_filename + '</original_filename>' +
                    '</ImageRequestBinary>';
                alert("Calling uploadImageImpl"); 
                uploadImageImpl(serviceUri()+'/UploadNewImage_File', msg, image_filename, image_data);
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
                    if (int_response == 1) {
                        //image is in the queue
                        doUpdateImage(image_uid, 'in queue', 0);
                        setTimeout(function() {
                            getImageInfo(image_uid);
                        }, 500);
                    } else if (int_response == 0) {
                        //image processed
                        parseImageInfo(image_uid, xmlDoc);
                    } else {
                        //error
                        doUpdateImage(image_uid, string_response, 0);

                        console.info(int_response);
                        console.info(string_response);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.info(textStatus);
                }
            });
        }

        function parseImageInfo(image_uid, xmlDocRoot) {
            var xmlDoc = $(xmlDocRoot).children("faces");

            doUpdateImage(image_uid, 'ok', $(xmlDoc).children("FaceInfo").length);

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
                doAddFace(face_uid, image_uid, score, x, y, width, height, angle, points, tags, person_name, idx == $(xmlDoc).children("FaceInfo").length);
                //query face image
                doGetFaceImage(face_uid);

            });
        }

        function findTransform(transform_uid) {
            var ret = null;
            for (var i = window.Averages.length - 1; i > -1; i--) {
                if (window.Averages[i].id === transform_uid) {
                    if (window.Averages[i]['data'] != undefined) {
                        ret = window.Averages[i].data;
                    }
                    break;
                }
            }
            return ret;
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

        function parseRecognizeResponse(xmlDocRoot) {
            var recognize_uid = $(xmlDocRoot).children("recognize_uid").text();
            var xmlDoc = $(xmlDocRoot).children("faces_matches");
            $(xmlDoc).children("FaceRecognizeInfo").each(function() {
                for (var i = window.Matches.length - 1; i > -1; i--) {
                    if (window.Matches[i].id === recognize_uid) {
                        var face_uid = $(this).children("face_uid").text();
                        window.Matches[i].face_uid = face_uid;
                        window.Matches[i].data = findFaceImage(face_uid);
                        var matches = [];
                        $(this).children("matches").each(function() {
                            $(this).children("PersonMatchInfo").each(function() {
                                var match_face_uid = $(this).children("face_uid").text();
                                var match_person_name = $(this).children("person_name").text();
                                var match_is_match = $(this).children("is_match").text();
                                var match_confidence = parseFloat($(this).children("confidence").text());
                                var match_face_data = findFaceImage(match_face_uid);
                                var obj = {
                                    face_uid: match_face_uid,
                                    data: match_face_data,
                                    person_name: match_person_name,
                                    is_match: match_is_match,
                                    confidence: match_confidence
                                };
                                matches.push(obj);

                                if (null == match_face_data) {
                                    getFaceImage(match_face_uid);
                                }
                            });
                        });
                        window.Matches[i].matches = matches;
                        updateMatches();
                        break;
                    }
                }
            });
        }

        function getTransformResult(transform_uid) {
            var msg = '<?xml version="1.0" encoding="utf-8"?><TransformResultRequest>' +
                '<api_key>' + constants.api_key + '</api_key><api_secret>' + constants.api_secret + '</api_secret>' +
                '<transform_uid>' + transform_uid + '</transform_uid></TransformResultRequest>';

            $.support.cors = true;
            $.ajax({
                crossDomain: true,
                url: serviceUri()+'/GetTransformResult',
                type: 'post',
                contentType: 'application/xml',
                processData: false,
                data: msg,
                dataType: 'xml',
                success: function(data, textStatus, jqXHR) {
                    var xmlDocRoot = $.parseXML(jqXHR.responseText);
                    var xmlDoc = $(xmlDocRoot).children("BetafaceTransformResponse");
                    var int_response = parseInt($(xmlDoc).children("int_response").text());
                    var string_response = $(xmlDoc).children("string_response").text();
                    var transform_uid = $(xmlDoc).children("transform_uid").text();

                    for (var i = window.Averages.length - 1; i > -1; i--) {
                        if (window.Averages[i].id === transform_uid) {
                            window.Averages[i].status = string_response;
                        }
                    }
                    if (int_response == 1) {
                        //request is in the queue
                        setTimeout(function() {
                            updateAverages();
                        }, 500);
                        setTimeout(function() {
                            getTransformResult(transform_uid);
                        }, 500);
                    } else if (int_response == 0) {
                        //request processed
                        var result_image = $(xmlDoc).children("result_image").text();
                        var data_url = 'data:image/jpeg;base64,' + result_image;
                        doUpdateAverage(transform_uid, data_url);
                    } else {
                        //error
                        setTimeout(function() {
                            updateAverages();
                        }, 500);
                        console.info(int_response);
                        console.info(string_response);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.info(textStatus);
                }
            });
        }

        function averageImpl(faces_average, _faces) {
            var msg = '<?xml version="1.0" encoding="utf-8"?><TransformFacesRequest xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
                '<api_key>' + constants.api_key + '</api_key><api_secret>' + constants.api_secret + '</api_secret>';
            msg += '<action>average</action>';
            msg += '<faces_uids>'+faces_average+'</faces_uids>';
            msg += '</TransformFacesRequest>';
            $.support.cors = true;
            $.ajax({
                crossDomain: true,
                url: serviceUri()+'/TransformFaces',
                type: 'post',
                contentType: 'application/xml',
                processData: false,
                data: msg,
                dataType: 'xml',
                success: function(data, textStatus, jqXHR) {
                    var xmlDocRoot = $.parseXML(jqXHR.responseText);
                    var xmlDoc = $(xmlDocRoot).children("BetafaceTransformRequestResponse");
                    var int_response = parseInt($(xmlDoc).children("int_response").text());
                    var string_response = $(xmlDoc).children("string_response").text();
                    if (int_response == 0) {
                        var transform_uid = $(xmlDoc).children("transform_uid").text();

                        var transform_obj = {
                            id: transform_uid,
                            status: 'Sent',
                            data: null,
                            components: _faces
                        };
                        window.Averages.push(transform_obj);
                        getTransformResult(transform_uid);
                    } else {
                        //error
                        console.info(int_response);
                        console.info(string_response);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.info(textStatus);
                }
            });
        }

        function getRecognizeResult(recognize_uid) {
            var msg = '<?xml version="1.0" encoding="utf-8"?><RecognizeResultRequest>' +
                '<api_key>' + constants.api_key + '</api_key><api_secret>' + constants.api_secret + '</api_secret>' +
                '<recognize_uid>' + recognize_uid + '</recognize_uid></RecognizeResultRequest>';

            $.support.cors = true;
            $.ajax({
                crossDomain: true,
                url: serviceUri()+'/GetRecognizeResult',
                type: 'post',
                contentType: 'application/xml',
                processData: false,
                data: msg,
                dataType: 'xml',
                success: function(data, textStatus, jqXHR) {
                    var xmlDocRoot = $.parseXML(jqXHR.responseText);
                    var xmlDoc = $(xmlDocRoot).children("BetafaceRecognizeResponse");
                    var int_response = parseInt($(xmlDoc).children("int_response").text());
                    var string_response = $(xmlDoc).children("string_response").text();

                    for (var i = window.Matches.length - 1; i > -1; i--) {
                        if (window.Matches[i].id === recognize_uid) {
                            window.Matches[i].status = string_response;
                        }
                    }
                    if (int_response == 1) {
                        //request is in the queue
                        setTimeout(function() {
                            updateMatches();
                        }, 500);
                        setTimeout(function() {
                            getRecognizeResult(recognize_uid);
                        }, 500);
                    } else if (int_response == 0) {
                        //request processed
                        parseRecognizeResponse(xmlDoc);
                    } else {
                        //error
                        setTimeout(function() {
                            updateMatches();
                        }, 500);
                        console.info(int_response);
                        console.info(string_response);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.info(textStatus);
                }
            });
        }

        function recognizeImpl(face_uid, targets) {
            var msg = '<?xml version="1.0" encoding="utf-8"?><RecognizeFacesRequest xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
                '<api_key>' + constants.api_key + '</api_key><api_secret>' + constants.api_secret + '</api_secret>';
            msg += '<faces_uids>' + face_uid + '</faces_uids>';
            msg += '<parameters></parameters><targets>';
            for (var i = 0; i < targets.length; i++) {
                if(i>0)
                {
                  msg += ',';
                }
                msg += targets[i];
            }
            msg += '</targets>';
            msg += '</RecognizeFacesRequest>';

            $.support.cors = true;
            $.ajax({
                crossDomain: true,
                url: serviceUri()+'/RecognizeFaces',
                type: 'post',
                contentType: 'application/xml',
                processData: false,
                data: msg,
                dataType: 'xml',
                success: function(data, textStatus, jqXHR) {
                    var xmlDocRoot = $.parseXML(jqXHR.responseText);
                    var xmlDoc = $(xmlDocRoot).children("BetafaceRecognizeRequestResponse");
                    var int_response = parseInt($(xmlDoc).children("int_response").text());
                    var string_response = $(xmlDoc).children("string_response").text();
                    if (int_response == 0) {
                        var recognize_uid = $(xmlDoc).children("recognize_uid").text();
                        var match_obj = {
                            id: recognize_uid,
                            face_uid: face_uid,
                            status: 'Sent',
                            data: findFaceImage(face_uid),
                            matches: null
                        };
                        window.Matches.push(match_obj);
                        getRecognizeResult(recognize_uid);
                    } else {
                        //error
                        console.info(int_response);
                        console.info(string_response);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.info(textStatus);
                }
            });
        }

        function doRecognizeFaces(face_uid) {
            if (window.Faces.length > 0) {
                var targets = [];
                for (var i = 0; i < window.Faces.length; i++) {
                    targets.push(window.Faces[i].id);
                }
                recognizeImpl(face_uid, targets);
            }
        }

        function doSearch(face_uid) {
            var targets = new Array(document.getElementById("target_face_" + face_uid).value);
            recognizeImpl(face_uid, targets);
        }

        function doSearchCelebrities(face_uid) {
            var targets = [];
            targets.push("all@celebrities.betaface.com");
            recognizeImpl(face_uid, targets);
        }

        function doSearchWikipedia(face_uid) {
            {
            var targets = [];
            targets.push("all@part01.wikipedia.org");
            recognizeImpl(face_uid, targets);
            }
            {
            var targets = [];
            targets.push("all@part02.wikipedia.org");
            recognizeImpl(face_uid, targets);
            }
            {
            var targets = [];
            targets.push("all@part03.wikipedia.org");
            recognizeImpl(face_uid, targets);
            }
            {
            var targets = [];
            targets.push("all@part04.wikipedia.org");
            recognizeImpl(face_uid, targets);
            }
        }

        function doAverage() {
            var count = 0;
            var average_faces = "";
            var _faces = [];
	    $( "input[name='averagecheckbox']" )
		.each(function() {
                var cb = $(this);
                if(cb[0].checked)
                {
                    if(average_faces.length > 0) average_faces += ",";
                    average_faces += cb[0].value;
                    _faces.push(cb[0].value);
                    count++;
                }
            })
            if(count > 1)
            {
                averageImpl(average_faces, _faces);
            }
        }

        function setPersonImpl(face_uid, person_name) {
            var face = findFace(face_uid);

            var msg = '<?xml version="1.0" encoding="utf-8"?><SetPersonRequest xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
                '<api_key>' + constants.api_key + '</api_key><api_secret>' + constants.api_secret + '</api_secret>';
            msg += '<faces_uids>' + face_uid + '</faces_uids>';
            msg += '<person_id>' + person_name + '</person_id>';
            msg += '</SetPersonRequest>';

            $.support.cors = true;
            $.ajax({
                crossDomain: true,
                url: serviceUri()+'/SetPerson',
                type: 'post',
                contentType: 'application/xml',
                processData: false,
                data: msg,
                dataType: 'xml',
                success: function(data, textStatus, jqXHR) {
                    var xmlDocRoot = $.parseXML(jqXHR.responseText);
                    var xmlDoc = $(xmlDocRoot).children("BetafaceResponse");
                    var int_response = parseInt($(xmlDoc).children("int_response").text());
                    var string_response = $(xmlDoc).children("string_response").text();
                    if (int_response == 0) {
                        face.person_name = person_name;
                    } else {
                        //error
                        console.info(int_response);
                        console.info(string_response);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.info(textStatus);
                }
            });
        }

        function doSetPerson(face_uid) {
            setPersonImpl(face_uid, document.getElementById("person_face_" + face_uid).value);
        }

        function doResetPerson(face_uid) {
            setPersonImpl(face_uid, "");
        }

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

        function drawLine(canvas, scale, offsetX, offsetY, pts, ptid1, ptid2) {
            var pt_found = 0;
            var pt1x = 0.0,
                pt1y = 0.0,
                pt2x = 0.0,
                pt2y = 0.0;
            for (var k = 0; k < pts.length; k++) {
                var type = parseInt($(pts[k]).children("type").text());
                if (type == ptid1 || type == ptid2) {
                    var x = offsetX + scale * parseFloat($(pts[k]).children("x").text());
                    var y = offsetY + scale * parseFloat($(pts[k]).children("y").text());
                    if (type == ptid1) {
                        pt1x = x;
                        pt1y = y;
                    } else {
                        pt2x = x;
                        pt2y = y;
                    }
                    pt_found++;
                    if (2 == pt_found) {
                        canvas.add(new fabric.Line([pt1x, pt1y, pt2x, pt2y], {
                            fill: 'lightgreen',
                            stroke: 'lightgreen',
                            strokeWidth: 1,
                            selectable: false,
                            hasControls: false,
                            hasBorders: false,
                            lockMovementX: true,
                            lockMovementY: true,
                            evented: false
                        }));
                        break;
                    }
                }
            }
        }
        
        function drawImageOnFace(imgdata_url, canvas, w, h,x,y) {     
            fabric.Image.fromURL(imgdata_url, function(img) {
             
             //fabric.Image.fromURL(accimg, function(img) {
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
        
        function drawEarRingsOnFace(canvas, scale, offsetX, offsetY, pts) {
         var pt_found = 0;
            var x = 0.0,
                y = 0.0;
            for (var k = 0; k < pts.length; k++) {
                var type = parseInt($(pts[k]).children("type").text());
                if (type == consts.BETAFACE_FEATURE_PRO_CHIN_EARCONN_L || type == consts.BETAFACE_FEATURE_PRO_CHIN_EARCONN_R ) {
                    x = offsetX + scale * parseFloat($(pts[k]).children("x").text());
                    y = offsetY + scale * parseFloat($(pts[k]).children("y").text());
                    drawImageOnFace("http://theclubsap.octosystems.com:81/Images/AdjustedEarring.png", 
                        canvas, -1, 0, x, y);                    
                    pt_found++;
                    if (pt_found == 2) {
                      break;
                    }
                }
            }
        }                                                                    
        
        function drawNecklaceOnFace(canvas, w, h,x,y, face, iscropped) { 
            drawImageOnFace("http://theclubsap.octosystems.com:81/Images/AdjustedNecklace.png", 
                  canvas, w, h,x,y);      
        }
        
        function drawImageOnFaceBkup(canvas, w, h,x,y, face, iscropped) {  
             //var accimg = loadaccfile;
             //fabric.Image.fromURL('./images/AdjustedNecklace.png', function(img) {
             fabric.Image.fromURL("http://theclubsap.octosystems.com:81/Images/AdjustedNecklace.png", function(img) {
             
             //fabric.Image.fromURL(accimg, function(img) {
                        img.left = x;
                        img.top = y+h;
                        if (img.width > w) {
                            img.width=w;
                        } else {
                             img.left = x+((w-img.width)/2);
                        }
                        img.opacity = 0.6;
                        //img.evented = false;
                        canvas.add(img);
                        //img.sendToBack();
                        canvas.renderAll();
                    });
               
        }

        function drawFace(canvas, scale, offsetX, offsetY, face, iscropped) {
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
            
            /*
            var pts = iscropped ? face.cropped_points : face.points;

            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_CHIN_EARCONN_L, consts.BETAFACE_FEATURE_PRO_CHIN_P1_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_CHIN_P1_L, consts.BETAFACE_FEATURE_PRO_CHIN_P2_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_CHIN_P2_L, consts.BETAFACE_FEATURE_PRO_CHIN_P3_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_CHIN_P3_L, consts.BETAFACE_FEATURE_PRO_CHIN_P4_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_CHIN_P4_L, consts.BETAFACE_FEATURE_PRO_CHIN_P5_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_CHIN_P5_L, consts.BETAFACE_FEATURE_PRO_CHIN_B);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_CHIN_B, consts.BETAFACE_FEATURE_PRO_CHIN_P5_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_CHIN_P5_R, consts.BETAFACE_FEATURE_PRO_CHIN_P4_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_CHIN_P4_R, consts.BETAFACE_FEATURE_PRO_CHIN_P3_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_CHIN_P3_R, consts.BETAFACE_FEATURE_PRO_CHIN_P2_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_CHIN_P2_R, consts.BETAFACE_FEATURE_PRO_CHIN_P1_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_CHIN_P1_R, consts.BETAFACE_FEATURE_PRO_CHIN_EARCONN_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_CHIN_EARCONN_L, consts.BETAFACE_FEATURE_PRO_TEMPLE_P4_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_CHIN_EARCONN_R, consts.BETAFACE_FEATURE_PRO_TEMPLE_P4_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_TEMPLE_P4_L, consts.BETAFACE_FEATURE_PRO_TEMPLE_P3_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_TEMPLE_P3_L, consts.BETAFACE_FEATURE_PRO_TEMPLE_P2_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_TEMPLE_P2_L, consts.BETAFACE_FEATURE_PRO_TEMPLE_P1_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_TEMPLE_P1_L, consts.BETAFACE_FEATURE_PRO_TEMPLE_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_TEMPLE_L, consts.BETAFACE_FEATURE_PRO_FOREHEAD_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_FOREHEAD_L, consts.BETAFACE_FEATURE_PRO_FOREHEAD_P1);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_FOREHEAD_P1, consts.BETAFACE_FEATURE_PRO_FOREHEAD_P2);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_FOREHEAD_P2, consts.BETAFACE_FEATURE_PRO_FOREHEAD_M);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_FOREHEAD_M, consts.BETAFACE_FEATURE_PRO_FOREHEAD_P3);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_FOREHEAD_P3, consts.BETAFACE_FEATURE_PRO_FOREHEAD_P4);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_FOREHEAD_P4, consts.BETAFACE_FEATURE_PRO_FOREHEAD_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_FOREHEAD_R, consts.BETAFACE_FEATURE_PRO_TEMPLE_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_TEMPLE_R, consts.BETAFACE_FEATURE_PRO_TEMPLE_P1_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_TEMPLE_P1_R, consts.BETAFACE_FEATURE_PRO_TEMPLE_P2_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_TEMPLE_P2_R, consts.BETAFACE_FEATURE_PRO_TEMPLE_P3_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_TEMPLE_P3_R, consts.BETAFACE_FEATURE_PRO_TEMPLE_P4_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYE_O_R, consts.BETAFACE_FEATURE_PRO_EYE_BO_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYE_BO_R, consts.BETAFACE_FEATURE_PRO_EYE_B_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYE_B_R, consts.BETAFACE_FEATURE_PRO_EYE_BI_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYE_BI_R, consts.BETAFACE_FEATURE_PRO_EYE_I_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYE_I_R, consts.BETAFACE_FEATURE_PRO_EYE_TI_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYE_TI_R, consts.BETAFACE_FEATURE_PRO_EYE_T_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYE_T_R, consts.BETAFACE_FEATURE_PRO_EYE_TO_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYE_TO_R, consts.BETAFACE_FEATURE_PRO_EYE_O_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYE_O_L, consts.BETAFACE_FEATURE_PRO_EYE_TO_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYE_TO_L, consts.BETAFACE_FEATURE_PRO_EYE_T_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYE_T_L, consts.BETAFACE_FEATURE_PRO_EYE_TI_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYE_TI_L, consts.BETAFACE_FEATURE_PRO_EYE_I_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYE_I_L, consts.BETAFACE_FEATURE_PRO_EYE_BI_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYE_BI_L, consts.BETAFACE_FEATURE_PRO_EYE_B_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYE_B_L, consts.BETAFACE_FEATURE_PRO_EYE_BO_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYE_BO_L, consts.BETAFACE_FEATURE_PRO_EYE_O_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYEBROW_I_R, consts.BETAFACE_FEATURE_PRO_EYEBROW_TI_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYEBROW_TI_R, consts.BETAFACE_FEATURE_PRO_EYEBROW_T_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYEBROW_T_R, consts.BETAFACE_FEATURE_PRO_EYEBROW_TO_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYEBROW_TO_R, consts.BETAFACE_FEATURE_PRO_EYEBROW_O_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYEBROW_O_R, consts.BETAFACE_FEATURE_PRO_EYEBROW_BO_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYEBROW_BO_R, consts.BETAFACE_FEATURE_PRO_EYEBROW_B_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYEBROW_B_R, consts.BETAFACE_FEATURE_PRO_EYEBROW_BI_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYEBROW_BI_R, consts.BETAFACE_FEATURE_PRO_EYEBROW_I_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYEBROW_I_L, consts.BETAFACE_FEATURE_PRO_EYEBROW_TI_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYEBROW_TI_L, consts.BETAFACE_FEATURE_PRO_EYEBROW_T_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYEBROW_T_L, consts.BETAFACE_FEATURE_PRO_EYEBROW_TO_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYEBROW_TO_L, consts.BETAFACE_FEATURE_PRO_EYEBROW_O_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYEBROW_O_L, consts.BETAFACE_FEATURE_PRO_EYEBROW_BO_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYEBROW_BO_L, consts.BETAFACE_FEATURE_PRO_EYEBROW_B_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYEBROW_B_L, consts.BETAFACE_FEATURE_PRO_EYEBROW_BI_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_EYEBROW_BI_L, consts.BETAFACE_FEATURE_PRO_EYEBROW_I_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_L, consts.BETAFACE_FEATURE_PRO_MOUTH_TL_P1);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_TL_P1, consts.BETAFACE_FEATURE_PRO_MOUTH_TL);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_TL, consts.BETAFACE_FEATURE_PRO_MOUTH_T);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_T, consts.BETAFACE_FEATURE_PRO_MOUTH_TR);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_TR, consts.BETAFACE_FEATURE_PRO_MOUTH_TR_P1);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_TR_P1, consts.BETAFACE_FEATURE_PRO_MOUTH_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_R, consts.BETAFACE_FEATURE_PRO_MOUTH_BR_P1);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_BR_P1, consts.BETAFACE_FEATURE_PRO_MOUTH_BR);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_BR, consts.BETAFACE_FEATURE_PRO_MOUTH_B);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_B, consts.BETAFACE_FEATURE_PRO_MOUTH_BL);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_BL, consts.BETAFACE_FEATURE_PRO_MOUTH_BL_P1);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_BL_P1, consts.BETAFACE_FEATURE_PRO_MOUTH_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_I_L, consts.BETAFACE_FEATURE_PRO_MOUTH_I_BL);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_I_BL, consts.BETAFACE_FEATURE_PRO_MOUTH_I_B);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_I_B, consts.BETAFACE_FEATURE_PRO_MOUTH_I_BR);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_I_BR, consts.BETAFACE_FEATURE_PRO_MOUTH_I_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_I_R, consts.BETAFACE_FEATURE_PRO_MOUTH_I_TR);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_I_TR, consts.BETAFACE_FEATURE_PRO_MOUTH_I_T);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_I_T, consts.BETAFACE_FEATURE_PRO_MOUTH_I_TL);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_MOUTH_I_TL, consts.BETAFACE_FEATURE_PRO_MOUTH_I_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_NOSE_T_L, consts.BETAFACE_FEATURE_PRO_NOSE_TI_NOSTRIL_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_NOSE_TI_NOSTRIL_L, consts.BETAFACE_FEATURE_PRO_NOSE_TO_NOSTRIL_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_NOSE_TO_NOSTRIL_L, consts.BETAFACE_FEATURE_PRO_NOSE_BO_NOSTRIL_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_NOSE_BO_NOSTRIL_L, consts.BETAFACE_FEATURE_PRO_NOSE_B_NOSTRIL_L);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_NOSE_B_NOSTRIL_L, consts.BETAFACE_FEATURE_PRO_NOSE_B);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_NOSE_B, consts.BETAFACE_FEATURE_PRO_NOSE_B_NOSTRIL_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_NOSE_B_NOSTRIL_R, consts.BETAFACE_FEATURE_PRO_NOSE_BO_NOSTRIL_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_NOSE_BO_NOSTRIL_R, consts.BETAFACE_FEATURE_PRO_NOSE_TO_NOSTRIL_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_NOSE_TO_NOSTRIL_R, consts.BETAFACE_FEATURE_PRO_NOSE_TI_NOSTRIL_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_NOSE_TI_NOSTRIL_R, consts.BETAFACE_FEATURE_PRO_NOSE_T_R);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_NOSE_BRIDGE_T, consts.BETAFACE_FEATURE_PRO_NOSE_BRIDGE_M);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_NOSE_BRIDGE_M, consts.BETAFACE_FEATURE_PRO_NOSE_BRIDGE_B);
            drawLine(canvas, scale, offsetX, offsetY, pts, consts.BETAFACE_FEATURE_PRO_NOSE_BRIDGE_B, consts.BETAFACE_FEATURE_PRO_NOSE_TIP);

            for (var k = 0; k < pts.length; k++) {
                var rad = iscropped ? 3.0 : 2.0;
                var type = parseInt($(pts[k]).children("type").text());
                var x = parseFloat($(pts[k]).children("x").text());
                var y = parseFloat($(pts[k]).children("y").text());
                var name = $(pts[k]).children("name").text();
                var cl = (type >= consts.BETAFACE_FEATURE_FIRST && type <= consts.BETAFACE_FEATURE_LAST) ? 'white' : 'red';
                canvas.add(new fabric.Circle({
                    top: offsetY + y * scale - rad,
                    left: offsetX + x * scale - rad,
                    radius: rad,
                    fill: cl,
                    selectable: false,
                    hasControls: false,
                    hasBorders: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    tooltip: name
                }));
            }
            */
        }

        function showImageTools(e) {
            if (!$('#tooltipDialog').length) {
                $('#myModal').append("<div id='tooltipDialog' style='position: absolute; top: 0; left: 0; color: lightgreen'><h1>" + e.tooltip + "</h1></div>");
            }
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
                        img.top = offsetY;
                        img.evented = false;
                        canvas.add(img);
                        for (var i = 0; i < window.Faces.length; i++) {
                            if (window.Faces[i].image_uid === window.modal_id) {
                                drawFace(canvas, scale, offsetX, offsetY, window.Faces[i], false);
                            }
                        }
                        img.sendToBack();
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
                    $("#imageHeader").text("Face " + window.modal_id);
                    fabric.Image.fromURL(findFaceImage(window.modal_id), function(img) {
                        var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                        var offsetX = Math.max((canvas.width - img.width * scale) / 2.0, 0);
                        var offsetY = Math.max((canvas.height - img.height * scale) / 2.0, 0);
                        img.scale(scale);
                        img.left = offsetX;
                        img.top = offsetY;
                        img.evented = false;
                        canvas.add(img);
                        for (var i = 0; i < window.Faces.length; i++) {
                            if (window.Faces[i].id === window.modal_id) {
                                drawFace(canvas, scale, offsetX, offsetY, window.Faces[i], true);
                                break;
                            }
                        }
                        img.sendToBack();
                        canvas.renderAll();
                    });
                }
            }
        }

        function imageClick(image, image_uid) {
            window.modal_is_image = true;
            window.modal_is_transform = false;
            window.modal_id = image_uid;
            $('#myModal').modal();
        }

        function updateImages() {
            $('#images').html('<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="table_images"></table>');
            $('#table_images').dataTable({
                "sPaginationType": "bs_normal",
                "bLengthChange": false,
                "bFilter": false,
                "bSort": false,
                "bInfo": false,
                "bAutoWidth": false,
                "aaData": window.Images,
                "aoColumns": [{
                    "mData": "data",
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        /*return ['<img onclick="imageClick(this,\'' + row.id + '\')"  class="thumb_c" src="', data, '" title="', escape(row.name), '"/>'].join(''); */
                        return ['<img onclick="imageClick(this,\'' + row.id + '\')" style="width:300px;height:300px;" src="', data, '" title="', escape(row.name), '"/>'].join('');
                    }
                }]
            });
        }

        function faceClick(face, face_uid) {
            window.modal_is_image = false;
            window.modal_is_transform = false;
            window.modal_id = face_uid;
            $('#myModal').modal();
        }

        function transformClick(transform, transform_uid) {
            window.modal_is_image = false;
            window.modal_is_transform = transform_uid;
            window.modal_id = transform_uid;
            $('#myModal').modal();
        }

        function updateFaces() {
            $('#faces').html('<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="table_faces"><thead><tr><th style="width:60px;text-align:center;vertical-align:middle;">Face</th><th style="width:120px;">Position</th><th>Classifiers and measurements</th><th style="width:400px;">Actions</th></tr></thead></table>');
            $('#table_faces').dataTable({
                "sPaginationType": "bs_normal",
                "bLengthChange": false,
                "bFilter": false,
                "bSort": false,
                "bInfo": false,
                "bAutoWidth": false,
                "aaData": window.Faces,
                "aoColumns": [{
                    "mData": "data",
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function(data, type, row) {
                        if (data != null) {
                            return ['<img onclick="faceClick(this,\'' + row.id + '\')" class="thumb_c" src="', data, '" title="', escape(row.id), '"/>'].join('');
                        }
                        return null;
                    }
                }, ]
            });
            $('tr td div#classifiers.expandable').expander({
                slicePoint: 250,
                userCollapseText: '[collapse]'
            });
        }

        function updateMatches() {
            $('#matches').html('<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="table_matches"><thead><tr><th style="width:60px;text-align:center;vertical-align:middle;">Face</th><th>Matches</th></tr></thead></table>');
            $('#table_matches').dataTable({
                "sPaginationType": "bs_normal",
                "bLengthChange": false,
                "bFilter": false,
                "bSort": false,
                "bInfo": false,
                "bAutoWidth": false,
                "aaData": window.Matches,
                "aoColumns": [{
                    "mData": "face_uid",
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function(face_uid, type, row) {
                        if (face_uid != null && row.data != null) {
                            return ['<img class="thumb" style="vertical-align:middle" src="', row.data, '" title="', escape(face_uid), '"/>'].join('');
                        }
                        return null;
                    }
                }, {
                    "mData": "matches",
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function(matches, type, row) {
                        var ret = '';
                        if (matches == null) {
                            return row.status;
                        }
                        if ($(matches).length > 0) {
                            ret += '<table cellpadding="0" cellspacing="0" border="0" style="box-shadow: none;"><tr>';
                            $(matches).each(function() {
                                var conf = '' + ($(this)[0].confidence * 100).toFixed() + '%';
                                var ismatch = ($(this)[0].is_match == 'true');

                                var source_url = "";
                                if($(this)[0].tags != null)
                                {
                                 $(this)[0].tags.each(function() {
                                 if($(this).children("name").text() === "source url")
                                 {
                                   source_url = $(this).children("value").text();
                                 }
                                 })
                                 if(source_url === "" && $(this)[0].person_name.indexOf("@") > 0)
                                 {
                                    source_url += "http://www.google.com/search?q=";
                                    source_url += $(this)[0].person_name.substring(0,$(this)[0].person_name.indexOf("@"));
                                 }
                                }
                                ret += ['<td style="padding:2px; border-top-style: none;"><div style="position:relative;"><p style="position:absolute;margin:0px;bottom:0px;right:7px;font-size:14px;color:', ismatch ? "green" : "red", ';">', conf, '</p><a href="',source_url,'"><img class="', ismatch ? 'thumb_match' : 'thumb_nomatch', '" style="margin: 0px 5px; vertical-align:middle;" src="', $(this)[0].data, '" title="', $(this)[0].person_name, '"/></a></div></td>'].join('');
                            })
                            ret += '</tr></table>';
                        }
                        return ret;
                    }
                }, ]
            });
        }

        function updateAverages() {
            $('#averages').html('<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="table_averages"><thead><tr><th style="width:60px;text-align:center;vertical-align:middle;">Average</th><th>Faces</th></tr></thead></table>');
            $('#table_averages').dataTable({
                "sPaginationType": "bs_normal",
                "bLengthChange": false,
                "bFilter": false,
                "bSort": false,
                "bInfo": false,
                "bAutoWidth": false,
                "aaData": window.Averages,
                "aoColumns": [{
                    "mData": "id",
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function(transform_uid, type, row) {
                        if (row.data != null) {
                            return ['<img onclick="transformClick(this,\'' + transform_uid + '\')" class="thumb_c" src="', row.data, '" title="', escape(transform_uid), '"/>'].join('');
                        }
                        return null;
                    }
                }, {
                    "mData": "components",
                    "bSortable": false,
                    "bSearchable": false,
                    "mRender": function(components, type, row) {
                        var ret = '';
                        if (components == null) {
                            return row.status;
                        }
                        if (components.length > 0) {
                            ret += '<table cellpadding="0" cellspacing="0" border="0" style="box-shadow: none;"><tr>';
                            for (var i = 0; i < components.length; i++) {
                             var face_uid = components[i];
                             var data = findFaceImage(face_uid);

                             if (data != null) {
                                ret += ['<img onclick="faceClick(this,\'' + face_uid + '\')" class="thumb_c" src="', data, '" title="', escape(face_uid), '"/>'].join('');
                             }
                            }
                            ret += '</tr></table>';
                        }
                        return ret;
                    }
                }, ]
            });
        }

        function doAddFace(face_uid, image_uid, score, x, y, width, height, angle, points, tags, person_name, update_faces) {
            setTimeout(function() {
                addFace(face_uid, image_uid, score, x, y, width, height, angle, points, tags, person_name, update_faces);
            }, 500);
        }

        function doUpdateFace(face_uid, face_image_data, x, y, width, height, angle, points, tags) {
            setTimeout(function() {
                updateFace(face_uid, face_image_data, x, y, width, height, angle, points, tags);
            }, 200);
        }

        function doUpdateAverage(transform_uid, image_data) {
            setTimeout(function() {
                updateAverage(transform_uid, image_data);
            }, 200);
        }

        function doAddImage(image_uid, image_filename, image_data) {
            setTimeout(function() {
                addImage(image_uid, image_filename, image_data);
            }, 200);
        }

        function doUpdateImage(image_uid, status, faces) {
            setTimeout(function() {
                updateImage(image_uid, status, faces);
            }, 200);
        }

        function doGetFaceImage(face_uid) {
            setTimeout(function() {
                getFaceImage(face_uid);
            }, 200);
        }

        function addImage(image_uid, filename, image_data) {
            var bfound = false;
            for (var i = window.Images.length - 1; i > -1; i--) {
                if (window.Images[i].id === image_uid) {
                    window.Images[i].filename = filename;
                    window.Images[i].data = image_data;
                    window.Images[i].faces = 0;
                    window.Images[i].status = 'uploaded';
                    bfound = true;
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

            updateImages();
        }

        function updateImage(image_uid, status, faces) {
            var bfound = false;
            for (var i = window.Images.length - 1; i > -1; i--) {
                if (window.Images[i].id === image_uid) {
                    window.Images[i].faces = faces;
                    window.Images[i].status = status;
                    bfound = true;
                    break;
                }
            }
            updateImages();
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
            if (update_faces) {
                updateFaces();
                //
                if (window.modal_on && window.modal_is_image && (window.modal_id === image_uid)) {
                    updateModal();
                }
            }
        }

        function updateFace(face_uid, face_image_data, x, y, width, height, angle, points, tags) {
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

            var update_matches = false;
            for (var i = window.Matches.length - 1; i > -1; i--) {
                if (window.Matches[i].face_uid === face_uid) {
                    window.Matches[i].data = face_image_data;
                    update_matches = true;
                }
                if(window.Matches[i].matches != null){
                for (var j = 0; j < window.Matches[i].matches.length; j++) {
                    if (window.Matches[i].matches[j].face_uid === face_uid) {
                        window.Matches[i].matches[j].data = face_image_data;
                        window.Matches[i].matches[j].tags = tags;
                        update_matches = true;
                    }
                }
                }
            }

            if (update_faces) {
                updateFaces();
            }
            if (update_matches) {
                updateMatches();
            }
        }
        
        function updateAverage(transform_uid, image_data) {
            var update_averages = false;
            for (var i = window.Averages.length - 1; i > -1; i--) {
                if (window.Averages[i].id === transform_uid) {
                    window.Averages[i].data = image_data;
                    update_averages = true;
                    break;
                }
            }
            if (update_averages) {
                updateAverages();

                if (window.modal_on && window.modal_is_transform && (window.modal_id === transform_uid)) {
                    updateModal();
                }
            }
        }

        function getDetectionFlags()
        {
           var res = "cropface,recognition";
                res = res.concat(",classifiers");
                res = res.concat(",propoints");
           return res;
        }

        function loadImage(imagedata) {
            setTimeout(function() {
                  var detection_flags = getDetectionFlags(); 
                  //alert('calling uploadImageData');
                  uploadImageFile('FromGallery', imagedata, detection_flags);                        
            }, 100);
        }


        function loadFile(file) {
            setTimeout(function() {
                var reader = new FileReader();

                reader.onload = (function(theFile) {
                    return function(e) {
                        if (reader.readyState == FileReader.DONE) {
                            var data_url = e.target.result;
                            var detection_flags = getDetectionFlags();
                            uploadImageFile(theFile.name, data_url, detection_flags);
                        }

                    }
                })(file);
                reader.readAsDataURL(file);
            }, 100);
        }

        function loadAccFile(file) {
            setTimeout(function() {
                var reader = new FileReader();

                reader.onload = (function(theFile) {
                    return function(e) {
                        if (reader.readyState == FileReader.DONE) {
                            var data_url = e.target.result;
                            var detection_flags = getDetectionFlags();
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

        function doUploadUrl() {
            var detection_flags = getDetectionFlags();
            uploadImageUrl($("#txtUrl")[0].value, detection_flags);
        }


        $("#txtUrl").keyup(function(event) {
            if (event.keyCode == 13) {
                $("#btnUrl").click();
            }
        });

        $('#myModal').on('show', function() {
            $(this).find('.modal-body').css({
                width: 'auto',
                height: 'auto',
                'max-height': '100%'
            });
        });

 var takePictureTest = function() {
        var options = { 
            quality : 75, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
        alert('taking picture');
        $cordovaCamera.getPicture(options).then(function(imageData) {
            alert(' picture taken');
            loadimage(imageData);
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
            loadimage(imageData);
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }     

       