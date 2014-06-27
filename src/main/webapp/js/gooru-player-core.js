/* Created by Gooru on 2014
 * Copyright (c) 2014 Gooru. All rights reserved.
 * http://www.goorulearning.org/
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-20089789-1']);
  _gaq.push(['_setDomainName', 'goorulearning.org']);
  _gaq.push(['_trackPageview']);
  (function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
  })();
 
  /* core functions of resource player */
  var resourcePlayers = {
    youtubeVideo: function (videoId, startSeconds, playerContainer) {
      var s1 = new SWFObject(('https:' == document.location.protocol ? 'https://' : 'http://') + 'www.youtube.com/v/' + videoId + '?fs=1&amp;rel=0&amp;enablejsapi=1&amp;version=3&amp;playerapiid=youtubeMovie-' + playerContainer + '&amp;autoplay=1&amp;start=' + startSeconds, 'youtubeMovie-' + playerContainer, '100%', '99%', '8', '#111111');
      s1.addParam('height', '99%');
      s1.addParam('width', '100%');
      s1.addParam('movie', 'http://www.youtube.com/v/' + videoId + '?fs=1&amp;rel=0&amp;enablejsapi=1&amp;version=3&amp;playerapiid=youtubeMovie-' + playerContainer + '&amp;autoplay=1&amp;start=' + startSeconds);
      s1.addParam('allowfullscreen', 'true');
      s1.addParam('allowscriptaccess', 'always');
      s1.addParam('autoplay', '1');
      s1.addParam('class', 'maximise videoPlayerContainer');
      s1.setAttribute('autoplay', '1');
      s1.addParam('wmode', 'transparent');
      s1.write(playerContainer);
    },
    animation: function (resourceUrl, playerContainer) {
      if (resourcePlayers.hasFlashPluginInstall()) {
        var so = new SWFObject(resourceUrl, 'mainmovie', '100%', '100%', '8', '#FFFFFF');
        so.addParam('menu', 'false');
        so.addParam('wmode', 'transparent');
        so.addParam('height', '100%');
        so.addParam('width', '100%');
        so.addParam('allowscriptaccess', 'always');
        so.addParam('class', 'maximise animationContainer');
        so.write(playerContainer);
      } else {
	    var resourceInfo = new EJS({
	    url: '/templates/resources/resourcePlayerInfo.template'
	  }).render({message: '<span class="installFlashSpan">Flash player is needed to display this content....!</span> <a href="http://www.adobe.com/support/flashplayer/downloads.html" target="_blank">Install Plugin</a>', reduceSize: 176});
	  $('div.resourcePreviewBoxContentContainer').html(resourceInfo);
      }
    },
    flvPlayer: function (resourceUrl, playerContainer) {
      flowplayer(playerContainer, resourceUrl);
    },
    questionResource: function (previewValues,targetElement) { 
      if(previewValues.questionType != "" && typeof previewValues.questionType != 'undefined') {
	if (previewValues.questionType == "MC" || previewValues.questionType == "T/F" || previewValues.questionType == 1 || previewValues.questionType == 3) {
	  var resourceInfo = new EJS({
	      url: '/templates/resources/question/resourceQuestionMCQ.template'
	    }).render({data:previewValues});
	}
	if (previewValues.questionType == "FIB" || previewValues.questionType == 4) {
	  var resourceInfo = new EJS({
	      url: '/templates/resources/question/resourceQuestionFIB.template'
	    }).render({data:previewValues});
	}
	if (previewValues.questionType == "OE" || previewValues.questionType == 6) {
	  var resourceInfo = new EJS({
	      url: '/templates/resources/question/resourceQuestionOE.template'
	    }).render({data:previewValues});
	}
	if (previewValues.questionType == 7 || previewValues.questionType == "MA") {
	  var resourceInfo = new EJS({
	      url: '/templates/resources/question/resourceQuestionMA.template'
	    }).render({data:previewValues});
	}
	$(targetElement).html(resourceInfo);
	
	$('input.gooru-answer-container').click(function() {
    if($(this).data("question-type") == "MC" || $(this).data("question-type") == "T/F" || $(this).data("question-type") == '1' || $(this).data("question-type") == '3') {
	$('.multiple-choice-answer-marker-'+$('input[name="gooru-mcq"]:checked').data("radio-option-value")).css("visibility","visible");
	$('input[name="gooru-mcq"]').not(':checked').each(function() {
	  $('.multiple-choice-answer-marker-'+$(this).data("radio-option-value")).css("visibility","hidden");
	});
    } else if ($(this).data("question-type") == "FIB" || $(this).data("question-type") == '4') {
	var fibAnswerArray = [];
	var fibUserAnswer = [];
	var fibAnswerArrayindex = 0;
	var fibUserAnswerindex = 0;
	$('label#fib-answer-list').each(function() {
	  fibAnswerArray[fibAnswerArrayindex] = $(this).data('fib-answer-text-'+fibAnswerArrayindex);
	  fibAnswerArrayindex++;
	});
	$('input.fib-answer').each(function() {
	  fibUserAnswer[fibUserAnswerindex] = $(this).val();
	  fibUserAnswerindex++;
	});
	for(var answer in fibAnswerArray) {
	  if(fibAnswerArray[answer] == fibUserAnswer[answer]) {
	    $("input#answer-"+answer).css({"border":"solid #4E9646 2px","background-color":"#D5E6D2"});
	  } else if (fibAnswerArray[answer] != fibUserAnswer[answer]) {
	    $("input#answer-"+answer).css({"border":"solid #FBB03B 2px","background-color":"#FEE8C7"});
	    $(".gooru-question-fib-answer-slate").show();
	    $("#gooru-fib-marked-answer-list-"+answer).show();
	  }
	}
	$(this).prop("disabled",true);
	$("input.fib-answer").attr("disabled", "disabled");
     } else if($(this).data("question-type") == "OE" || $(this).data("question-type") == '6') {
	if($("textarea#gooru-oe-answer-submit").val().length > 0) {
	  $("div#gooru-oe-submited-answer").text($("textarea#gooru-oe-answer-submit").val());
	  $("div#gooru-oe-submited-answer").show();
	  $("textarea#gooru-oe-answer-submit, input#gooru-oe-save-button,div.gooru-oe-answer-empty-error-message").hide();
	} else {
	  $("div.gooru-oe-answer-empty-error-message").show();
	} 
    } else if($(this).data("question-type") == "7" || $(this).data("question-type") == "MA") {  
	$('div.multiple-choice-answer-marker').css("visibility","visible");
 	$('input.gooru-ma-radio-button').each(function() {
 	  if($('input[name='+$(this).attr("name")+']:checked').val() == $('input[name='+$(this).attr("name")+']').data('mc-is-correct').toString()) { 
 	    $('.multiple-choice-answer-marker-'+$(this).data('radio-option-value')).addClass('question-correct-answer-marker');
	    $('.multiple-choice-answer-marker-'+$(this).data('radio-option-value')).removeClass('question-wrong-answer-marker');
 	  } else {
	    $('.multiple-choice-answer-marker-'+$(this).data('radio-option-value')).addClass('question-wrong-answer-marker');
	    $('.multiple-choice-answer-marker-'+$(this).data('radio-option-value')).removeClass('question-correct-answer-marker');
	  }  
	});
    }
     $("input.gooru-answer-container").addClass("gooru-default-grey-disable-button");
    $("input.gooru-answer-container").removeClass("gooru-default-blue-button");
  });
  
  var i = 0;
  $('#gooru-question-hint-button').click( function() {
    var currentHintCount = parseInt((($(this).val()).substring(7,9)).trim());
    if(currentHintCount == 1){
      $(this).addClass("gooru-question-deactive-button-font");
      $(this).removeClass("gooru-question-active-button-font");
      $(this).attr("disabled","disabled");
    }
    if(currentHintCount != 0) {
      currentHintCount--;
      $(this).val("Hints ("+currentHintCount+" Left)");
    }
    $('.gooru-question-hint-container-'+i).css("display","block");
    i++;
  });
  
  $('#gooru-question-explanation-button').click( function() {
    $('.gooru-question-explanation-container').css("display","block");
    $(this).addClass("gooru-question-deactive-button-font");
    $(this).removeClass("gooru-question-active-button-font");
  });
  
  $("input.gooru-mcq-radio-button").live("click",function() {
    helper.enableCheckAnswerButton();
  });
  $("input.fib-answer , textarea#gooru-oe-answer-submit").keypress(function(){
    ($(this).val().length == 0 ) ? helper.enableCheckAnswerButton() : '';
  });
      }
      $("input.gooru-mcq-radio-button,input.gooru-ma-radio-button").click(function(){
	$("div.multiple-choice-answer-marker").css("visibility","hidden");
      });
      $("input.gooru-ma-radio-button").click(function(){
	var radioElement = 0;
	var checkedRadio = 0;
	$("input.gooru-ma-radio-button").each(function(){
	  radioElement++;
	  ($(this)[0].checked) ? checkedRadio++ : "";
	});
	if(checkedRadio === radioElement/2 ) {  
	    helper.enableCheckAnswerButton();
	  }
      });
    },
    pdfReader: function (documentId, documentKey, startPage, playerContainer) {
      var scribd_doc = scribd.Document.getDoc(documentId, documentKey);
      var oniPaperReady = function (e) {
        scribd_doc.api.setPage(startPage);
      };
      scribd_doc.addParam('jsapi_version', 2);
      scribd_doc.addEventListener('iPaperReady', oniPaperReady);
      this._doc = scribd_doc;
      scribd_doc.write(playerContainer);
    },
    muteAllVideo: function (playerContainer, excludeElementClass) {
      $(playerContainer).each(function () {
        try {
          if (excludeElementClass == null || !$(this).hasClass(excludeElementClass)) {
            $(this).find('.resourceYoutubeplayerContainer').find('embed').get(0).mute();
            $(this).find('.resourceYoutubeplayerContainer').find('embed').get(0).pauseVideo();
          }
        } catch (error) {}
      });
    },
    triggerStopVideo: function (myPlayer, stopTime) {
      if (myPlayer != null) {
        if (stopTime > 0) {
          INTERVAL = setInterval(function () {
            if (myPlayer != null) {
              try {
                if (Math.floor(myPlayer.getCurrentTime()) >= stopTime) {
                  myPlayer.pauseVideo();
                  clearInterval(INTERVAL);
                }
              } catch (err) {
                clearInterval(INTERVAL);
              }
            }
          }, 1000);
        }
      }
    },
    playVideo: function (myPlayer, stopTime) {
      try {
        myPlayer.playVideo();
        resourcePlayers.triggerStopVideo(myPlayer, stopTime);
      } catch (err) {}
    },
    hasFlashPluginInstall: function () {
      var hasFlash = false;
      try {
        var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        if (fo) hasFlash = true;
      } catch (e) {
        if (navigator.mimeTypes['application/x-shockwave-flash'] != undefined) hasFlash = true;
      }
      return hasFlash;
    }
    
  };
var helper = {
  getYoutubeVideoId: function(url) {
    var rgxp = 'youtu(?:\.be|be\.com)/(?:.*v(?:/|=)|(?:.*/)?)([a-zA-Z0-9-_]+)';
    var videoid = url.match(rgxp);
    return (videoid != null) ? videoid[1] : null;
  },
  isWebResource : function(resourceUrl, type) {
    if(typeof type != 'undefined' && type == 'video/youtube' ){
      var urlregex = new RegExp('((http|https):\/\/)?(www\.)?(youtube\.com)(\/)?([a-zA-Z0-9\-\.]+)\/?');
      return urlregex.test(resourceUrl);	
    } else {
      var urlregex = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})(\/\S*)?$/);  
      return urlregex.test(resourceUrl);
    }
  },
  isSignedResource : function(resourceUrl, type) {	  
    if(typeof type != "undefined" && type == "video/youtube" ){
	    var urlregex = new RegExp("((http|https):\/\/)?(www\.)?(youtube\.com)(\/)?([a-zA-Z0-9\-\.]+)\/?");
	    return urlregex.test(resourceUrl);	
    } else {
	    var urlregex = new RegExp("((http|https)\:\/\/)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?"); 
	return urlregex.test(resourceUrl);
    }
  },
  getResourceFileExtenstion : function(resourceUrl) {
    var resourceExtension = resourceUrl.split('.')[resourceUrl.split('.').length - 1];
    return resourceExtension.toLowerCase();
  },
  userSignin: function(options) {
    var param = helper.getRequestParam();
    EJS.ext = '.template';
    if(typeof(param.session_token) != 'undefined' && param.session_token != '' && param.session_token.length == 36) { 
      if(window.location.pathname.split("/")[2] == 'r') {
	resourcePreview.init();
      } else if(window.location.pathname.split("/")[2] == 'c') {
	collectionPlay.init();
      }
      return;
    } 
    if(typeof(param.api_key) == 'undefined' || param.api_key == '') { 
      var resourceInfo = new EJS({url: '/templates/resources/resourcePlayerInfo.template'}).render({message: '<span>Required API Key for play this resource. You do not have API Key, please send request by clicking this link </span> <a href="http://developers.goorulearning.org/request-a-key" target="_blank">Request API Key</a>', reduceSize: 0});
          $('div.gooru-player-base-container').html(resourceInfo);
      return;
       
    } 
    var defaults = { 
      userName: null,
      password: null,
      isGuestUser: true,
      onComplete : function(data) {
      }
    };
    var options = $.extend(defaults, options);
      $.ajax ({
	  type : 'POST',
	  url : GOORU_REST_ENDPOINT + '/v2/account/loginas/anonymous',
	  cache: false,
	  data: {apiKey:param.api_key},
	  dataType:'json',
	  success:function(data){
	    options.onComplete(data);
	  }, 
	error : function(data) {
		var key = data.responseText.split(":");
      var resourceInfo = new EJS({url: '/templates/resources/resourcePlayerInfo.template'}).render({message: key[1] + ' For new API Key, please send request by clicking this link <a href="http://developers.goorulearning.org/request-a-key" target="_blank">Request API Key</a>', reduceSize: 0});

	        $('div.gooru-player-base-container').html(resourceInfo);
	}
      });
  },
  getRequestParam: function() { 
    var searchString = window.location.search.substring(1),params = searchString.split('&'),param = {};
    for (var i = 0; i < params.length; i++) {
      var val = params[i].split('=');
      param[unescape(val[0])] = unescape(val[1]);
    }
    return param;
  },
  calculateTime: function(startVideo) {
      var splitIndex = 0;
      splitArray = startVideo.split(':');
      splitIndex = splitArray.length;
      for (var i = splitIndex - 1, j = 1, answer = 0; i >= 0; i = i - 1, j = j * 60)
      answer += splitArray[i] * j - 0;
      return answer;
  },
  formThumbailName: function(thumbnailName, thumbnailSuffix) {
      var thumbnailFilename = null;
      if (typeof(thumbnailName) != 'undefined' && thumbnailName != null) {
	var fileExtension = thumbnailName.split('.').pop();
	var generatedThumbnailName = thumbnailName.split('.'+fileExtension)[0];
	thumbnailFilename = generatedThumbnailName + thumbnailSuffix + fileExtension;
      }
      return thumbnailFilename;
   },
   previewToolTip:function(element, position) {
    $(element).bt({
      preBuild: function () {
	  var description=$(this).attr('description');
	  var code=$(this).data('code');
	  var html="<div class='code-popup-title'>"+code+"</div><div class='CodePopUpDescription'>"+description+"</div>";
	  if ($(this).hasClass('resourcePreviewLicense')) {
	    var resourceLicenseCode = $(this).attr('licenseCode');
	    var resourceLicenseName = $(this).attr('licenseName');
	    var resourceLicenseUrl =  " ";
	    if (resourceLicenseCode != null && resourceLicenseCode != "") {
	      resourceLicenseName = resourceLicenseName + "(" + resourceLicenseCode  + ")";
	      resourceLicenseUrl = $(this).attr('licenseUrl');
	    }
	    html = "<div><b><div><a href=\'"+resourceLicenseUrl+ "\' target=\'_blank\'>"+resourceLicenseName+"</a></div></b><div>"+description+"</div></div>";
	  }  else if($(this).hasClass('resourcePreviewLicenseTagOER')) {
	      var resourceOERTitle = $(this).attr('oerTitle');
	      html = "<div><b><div><a href=\'http://www.oercommons.org\' target=\'_blank\'>" + resourceOERTitle  + "</a></div></b><div>"+description+"</div></div>";
	  }
	  $('#standardDescToolTip').remove();
	  $(this).append("<div  style='display:none; visibility: visible;'  id='standardDescToolTip'>"+html+"</div>");
      },
      hoverIntentOpts: {
	interval: 300,
	timeout: 300
      },
      contentSelector: '$("#standardDescToolTip").html()',
      positions: [position],
      closeWhenOthersOpen: true,
      clickAnywhereToClose: true,
      spikeGirth: 25,
      spikeLength: 8,
      cornerRadius:8,
      fill: '#ffffff',
      strokeStyle: '#cccccc'
    });
  },
  youtubeImageLink: function(url) {
    return 'http://img.youtube.com/vi/'+ helper.getYoutubeVideoId(url)+'/1.jpg';
  },
  getYoutubeVideoId: function(url) {
    var rgxp = 'youtu(?:\.be|be\.com)/(?:.*v(?:/|=)|(?:.*/)?)([a-zA-Z0-9-_]+)';
    var videoid = url.match(rgxp);
    return (videoid != null) ? videoid[1] : null;
  },
  onErrorDefaultImage: function() {
    $('img.resource-img-slide').unbind('error').error(function () {
	var category = $(this).data('category');
	category = category.toLowerCase();
	var resourceTypeClass = '';
	var resourceUrl = $(this).data('resourceurl');
	var resourceExtension = helper.getResourceFileExtenstion(resourceUrl).toLowerCase();
	var thumbnailUrl = '';
	if (resourceExtension == 'pdf') { 
	  if (helper.isSignedResource(resourceUrl)) { 
	    thumbnailUrl = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'docs.google.com/gview?url='+resourceUrl+'&a=bi&w=80&h=100&pagenumber=1';
	  } else { 
	    var resourceFolder = $(this).data('resourcefolder');
	    var assetURI = $(this).data('asseturi');
	    thumbnailUrl = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'docs.google.com/gview?url='+ assetURI + '/' + resourceFolder + resourceUrl+'&a=bi&w=80&h=100&pagenumber=1';
	  }
	  $(this).attr('src', thumbnailUrl);
	  $(this).unbind('error').error(function () {
	    $(this).parent('.default-image-div').addClass('resource-default-image');
	    $(this).hide();
	    resourceTypeClass = category + '-default-image';
	    $(this).parent('.default-image-div').removeClass(resourceTypeClass).addClass(resourceTypeClass);
	    });
	} else {
	  $(this).parent('.default-image-div').addClass('resource-default-image');
	  $(this).hide();
	  resourceTypeClass = category + '-default-image';
	  $(this).parent('.default-image-div').removeClass(resourceTypeClass).addClass(resourceTypeClass);
	} 
    });
  },
   updateResourceViews: function(gooruOid, resourceViews) {
    $.ajax({
	  type : 'POST',
	  url : GOORU_REST_ENDPOINT + '/resource/update/views/' + gooruOid + '.json',
	  data : {resourceViews : resourceViews},
	  success : function(data) {
	  },
	  error : function(jqXhr, textStatus, errorThrown) {

	  }
    });
  },
  roundedCornerForIE: function() {
    if ($.browser.msie && window.PIE) {
	$('.ie-rounded-corner').each(function() {
	    PIE.attach(this);
	});
    }
  },
  enableCheckAnswerButton : function(){
    $("input.gooru-answer-container").removeClass("gooru-default-grey-disable-button");
    $("input.gooru-answer-container").addClass("gooru-default-blue-button");
    $("input.gooru-answer-container").removeAttr('disabled');
  },
  getSessionIdForEvent: function (contentGooruOid,sessionToken){
    var sessionIdentity = "";
    $.ajax({
      url: GOORU_REST_ENDPOINT +"/v2/session?sessionToken="+sessionToken,
      type:'POST',
      contentType: "application/json",
      data:'{"session":{"resource":{"gooruOid":"'+contentGooruOid+'"},"mode":"test"}}',
      dataType:'json',
      async:false,
      success:function(data){
	 sessionIdentity = data.sessionId;
      }
    });
    return sessionIdentity;
  },
  getTimeInMilliSecond : function (){
    return new Date().getTime();
  },
  getQuestionResourceType:function(id){
    if(id == 1) {
      return "MC";
    } else if(id == 2) {
      return "SA";
    } else if(id == 3) {
      return "T/F";
    } else if(id == 4) {
      return "FIB";
    } else if(id == 5) {
      return "MTF";
    } else if(id == 6) {
      return "OE";
    } else if(id == 7) {
      return "MA";
    }
  },
  isAttemptAnswerCorrect : function (){
    var wrongAnswerElement = $('div.question-wrong-answer-marker');
    var isCorrect = 1;
    for(var wrongVisible = 0 ; wrongAnswerElement.length > wrongVisible ; wrongVisible++){
      if($(wrongAnswerElement[wrongVisible]).css('visibility') == 'visible') {
	  isCorrect = 0;
	break;
      }
    }
    return isCorrect;
  },
  getGooruUidWithToken : function(token) {
    var gooruUid = "";
    $.ajax({
      url:GOORU_REST_ENDPOINT+"/v2/user/token/"+token+"?sessionToken="+token,
      type:"GET",
      dataType:"json",
      async:false,
      success:function(data) {
	gooruUid = data.gooruUId;
      }
    });
    return gooruUid;
  }
}; 

var activityLog =  {
  init : function (settings) { 
    $.ajax ({
      type : 'POST',
      url : GOORU_REST_ENDPOINT + '/activity/log/' + settings.eventId + '/' + settings.type,
      data: {contentGooruOid : settings.contentGooruOid, eventName : settings.eventName, parentGooruOid : settings.parentGooruOid, context : settings.context},
      success:function(data){

      }
    });
  },
  triggerActivityLog : function(eventId, type, gooruOid, eventName, parentGooruOid, context, section) { 
    if (typeof(eventId) != 'undefined' &&  typeof(gooruOid) != 'undefined') {
      var options =   {eventId : eventId, type :  type, contentGooruOid : gooruOid, eventName : eventName, parentGooruOid : parentGooruOid, contex:context};
      $('div.gooru-player-base-container').trigger('activity.log', [ section,  options]);
    }
  },
  generateEventLogData : function(eventLoggingData){
    var questionAttemptStatus = "";
    var questionAttemptCount = 0;
    var score = 0;
    if(typeof eventLoggingData.questionAttemptData != 'undefined'){
      questionAttemptCount = eventLoggingData.questionAttemptData.split(",").length - 1;
      questionAttemptStatus = eventLoggingData.questionAttemptData.substr(1);
      score = (eventLoggingData.questionAttemptData.split(',').pop().length > 0) ? eventLoggingData.questionAttemptData.split(',').pop() : 0;
    }
    var questionAttemptSequence = (typeof eventLoggingData.questionAttemptSequence != 'undefined') ? eventLoggingData.questionAttemptSequence.substr(1) : "";
    var timeSpentOnResource = (typeof eventLoggingData.totalTimeSpent) != 'undefined' ? eventLoggingData.totalTimeSpent : 0;
    var explanationTimestamp = (typeof eventLoggingData.questionExplanationTimestamp != 'undefined' ) ? "{\"1\":"+eventLoggingData.questionExplanationTimestamp+"}" : '{}';
    var answerTimestamp = (typeof eventLoggingData.answerTimestamp != 'undefined') ? "{" + eventLoggingData.answerTimestamp.substring(0,eventLoggingData.answerTimestamp.length - 1) + "}" : '{}';
    var hintsUsed = (typeof eventLoggingData.hintTimeStamp != 'undefined') ? "{"+ eventLoggingData.hintTimeStamp.substring(0,eventLoggingData.hintTimeStamp.length - 1) + "}" : '{}';
    var answerText = (typeof eventLoggingData.answerText != 'undefined') ? eventLoggingData.answerText.substring(0,eventLoggingData.answerText.length - 1) : "";
    var answerObject = (typeof eventLoggingData.answerObject != 'undefined') ? "{" + eventLoggingData.answerObject.substring(0,eventLoggingData.answerObject.length - 1) + "}" : "{}";
      var eventContextData = {
	contentGooruId: eventLoggingData.contentGooruId,
	parentGooruId:(typeof eventLoggingData.parentGooruId != 'undefined') ? eventLoggingData.parentGooruId : "",
	parentEventId:eventLoggingData.parentEventId,
	type:eventLoggingData.activityType,
	resourceType: eventLoggingData.resourceType,
	clientSource: 'web',
	path: "",
	pageLocation: "home-search",
	mode:"study"
      };
      var eventSessionData = {
	apiKey:eventLoggingData.apiKey,
	organizationUId:"",
	sessionToken:eventLoggingData.sessionToken,
	sessionId:eventLoggingData.sessionId
      };
      var eventPayLoadObjectData = {
	questionType:(typeof eventLoggingData.questionType != "undefined") ? eventLoggingData.questionType : "",
	totalNoOfCharacter:answerText.length,
	text:answerText,
	attemptStatus:"["+questionAttemptStatus+"]",
	attemptTrySequence:"["+questionAttemptSequence+"]",
	answers:answerTimestamp,
	attemptCount:questionAttemptCount,
	hints:hintsUsed,
	explanation:explanationTimestamp,
	answerObject:answerObject
      };
      var eventData = {
	context : JSON.stringify(eventContextData),
	endTime: eventLoggingData.stopTime,
	eventId : eventLoggingData.eventId,
	eventName: eventLoggingData.eventName,
	metrics:'{"totalTimeSpentInMs":'+ timeSpentOnResource +',"score":'+score+'}',
	payLoadObject:JSON.stringify(eventPayLoadObjectData),
	session:JSON.stringify(eventSessionData),
	startTime:eventLoggingData.startTime,
	user: '{"gooruUId":"'+eventLoggingData.gooruUid+'"}',
	version: '{"logApi":"0.1"}'
      };
      activityLog.pushActivityLogData(eventData);
  },
  pushActivityLogData : function (eventData){
    _et.data.push(JSON.stringify(eventData));
  }
};
var generateGUID = (typeof (window.crypto) != 'undefined' && typeof (window.crypto.getRandomValues) != 'undefined') ?
  function () {
      var buf = new Uint16Array(8);
      window.crypto.getRandomValues(buf);
      var S4 = function (num) {
	      var ret = num.toString(16);
	      while (ret.length < 4) {
		  ret = "0" + ret;
	      }
	      return ret;
	  };
      return (S4(buf[0]) + S4(buf[1]) + "-" + S4(buf[2]) + "-" + S4(buf[3]) + "-" + S4(buf[4]) + "-" + S4(buf[5]) + S4(buf[6]) + S4(buf[7]));
  }:function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	  var r = Math.random() * 16 | 0,
	      v = c == 'x' ? r : (r & 0x3 | 0x8);
	  return v.toString(16);
      });
};
