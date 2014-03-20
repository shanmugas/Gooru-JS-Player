/* handle  resource player based on the unique key of gooruoid  */
var resourcePreview = {
    init: function(data) { 
      EJS.ext = '.template';
      var param = helper.getRequestParam();
      if (typeof(param.session_token) != 'undefined' && param.session_token != '') {
	USER.sessionToken = param.session_token;
      } else if(typeof(data) != 'undefined') {
	USER.sessionToken = data.token;
      }
      $.ajaxSetup({data: {sessionToken: USER.sessionToken}}); 
      $('#gooru-resource-player-base-container').bind('activity.log',function(e, section, options){
		activityLog.init(options);
      });
     $(window).blur(function() {
          resourcePreview.resourcePlayerActivityStop();
     });
      resourcePreview.showResourcePreviewPopupBox(helper.getRequestParam());
      
    },
    showResourcePreview: function (previewValues) {
      previewValues.useScribd = false;
      if (previewValues.documentId != null && previewValues.documentId != '' && previewValues.documentKey != null && previewValues.documentKey != '') {
        previewValues.useScribd = true;
      }
      previewValues.GOORU_REST_ENDPOINT = ('https:' == document.location.protocol ? 'https://' : 'http://') + GOORU_REST_ENDPOINT;
      previewValues.DOC_HOME = DOC_HOME;
      previewValues.DOC_CACHE = DOC_CACHE;
      var resourcePreviewHeader = new EJS({
        url: STATIC_FILE_PATH + '/templates/resources/resourcePreviewHeader.template?buildId='+BUILD_TIME_STAMP
      }).render(previewValues);
      $('div#gooru-resource-player-base-container').css('height', ($(window).height() - 6));
      $('div#gooru-resource-player-base-container').html(resourcePreviewHeader);
      document.title = previewValues.title;
      var previewTemplate = new EJS({
        url: STATIC_FILE_PATH + '/templates/resources/resourcePreview.template'
      }).render(previewValues);
      var resourceMetaData = new EJS({
        url: STATIC_FILE_PATH + '/templates/resources/resourceMetaData.template'
      }).render(previewValues);
      $('#gooru-resource-player-meta-container').html(resourceMetaData);
      var previewHeight = $(window).height();
      with(previewValues) {
	$('#meta-data-description').attr('content', publicMetaData);
        var signedBaseUrl = GOORU_REST_ENDPOINT + '/signed/resource/url/' + gooruOid;
        $('div#gooru-resource-player-container').html(previewTemplate);
	
        switch (type) {
	  case 'video/youtube':
	    var videoId = helper.getYoutubeVideoId(resourceUrl);
	    resourcePlayers.youtubeVideo(videoId, startTime, 'resourcePlayYoutubeplayer-' + gooruOid);
	  break;
	  case 'animation/kmz':
	    mtours.init((signedBaseUrl + '?file=' + resourceUrl), 'resourcePreviewGoogleEarthContainer');
	  break;
	  case 'animation/swf':
	    var fileExtension = resourceUrl.split('.').pop();
	    if (fileExtension == 'flv') {
	      resourcePlayers.flvPlayer('../swf/flowplayer-3.2.11.swf', 'resourcePreviewFlashContainer');
	    }
	    else {
	      resourcePlayers.animation((signedBaseUrl + '?file='+ resourceUrl),  'resourcePreviewFlashContainer');
	    }
	  break;
	  case 'textbook/scribd':
	    if(useScribd){
	      resourcePlayers.pdfReader(documentId, documentKey, startPPT, 'resourcePreviewTextbookScribd');
	    }
	  break;
	  case 'assessment-question':
	    resourcePlayers.questionResource(previewValues,'div.resourcePreviewBoxContentContainer');
	  break;
      }
      var activityLogId = generateGUID();	
      $('div#gooru-resource-player-base-container').data('activity-log-id', activityLogId);
      $('div#gooru-resource-player-base-container').data('gooru-oid',  gooruOid);
      activityLog.triggerActivityLog(activityLogId, 'start', gooruOid, 'resource-player', null, window.location , 'resource-player-Start');
    }
  },
  showResourcePreviewPopupBox : function(param) {
    var gooruOid = param.id;
    var resourceInstanceId = param.resourceInstanceId;
    var url = GOORU_REST_ENDPOINT + '/resource/resourceSource/' + gooruOid + '.json?';
      if (typeof(resourceInstanceId) != 'undefined' && resourceInstanceId != null && resourceInstanceId != '') {
	url = GOORU_REST_ENDPOINT + '/collection/dummy/resourceInstance/'+ resourceInstanceId + '.json';
      }
      $.ajax({
	type : 'GET', 
	url : url,
	dataType : 'jsonp',
	success : function(data) {
	  resourcePreview.renderResourcePreview(data, param);
	},
	error : function(data) {
	  var resourceInfo = new EJS({url: STATIC_FILE_PATH + '/templates/resources/resourcePlayerInfo.template'}).render({message: 'Resource Not Found, Please check the resource Id - ' + param.id, reduceSize: 0});
          $('div#gooru-resource-player-base-container').html(resourceInfo); 
	}
      });
  },
  
  renderResourcePreview: function(data, param) { 
          var resourceInstanceId = param.resourceInstanceId;
          if (data.length == 0) {
	    return;
	  }
	  var previewValues = {
	    resourceUrl : null,
	    type : null,
	    startTime : null,
	    startPPT : null,
	    stopPPT : null,
	    filePath : null,
	    title : null,
	    description : null,
	    resourceSource : null,
	    gooruOid : null,
	    isWebResource : null,
	    resourceExtenstion : null,
	    stopTime : null,
	    resourceUserRating : data.social.contentUserRating,
	    resourceRating : data.social.contentRating,
	    resourceViews : null,
	    isResourceAlreadyAdded : data.social.isContentAlreadySubscribed,
	    documentKey : null,
	    documentId : null,
	    resourcestatus : {},
	    thumbnail : null,
	    resourceInstanceId:resourceInstanceId,
	    narrative:null,
	    category: null,
	    tags: null,
	    standards: [],
	    standardDescriptions: [],
	    resourceLicense:{},
	    siteName:null,
	    publicMetaData:data.publicMetaData,
	    questionType:null,
	    answers:null,
	    questionExplanation:null,
	    questionHints:null,
	    questionImageURL:null,
	    assetURI: null,
	    resourceFormatType:data.resourceFormat.value
	  };
	  previewValues.gooruOid = param.id;
	  if (resourceInstanceId != null && typeof(resourceInstanceId) != 'undefined' && resourceInstanceId != '') {
	      previewValues.gooruOid = data.resource.id;
	      previewValues.resourceUrl = data.resource.nativeurl;
	      previewValues.type = data.resource.type;
	      if (previewValues.type === 'video/youtube') { 
	      previewValues.startPPT = (data.resource.instructornotes.start == null) ? '' : data.resource.instructornotes.start;
	      previewValues.stopPPT = (data.resource.instructornotes.stop == null) ? '' : data.resource.instructornotes.stop;
	      } else { 
	      previewValues.startPPT = (data.resource.instructornotes.start == null || data.resource.instructornotes.start == '') ? 1
	      : data.resource.instructornotes.start;
	      previewValues.stopPPT = (data.resource.instructornotes.stop == null) ? '' : data.resource.instructornotes.stop;
	      }
	      previewValues.assetURI = data.resource.assetURI;
	      previewValues.filePath = data.resource.assetURI + data.resource.resourcefolder;
	      previewValues.title = (data.resource.label == null) ? '' : data.resource.label;
	      previewValues.description = (data.resource.description == null) ? '' : data.resource.description;
	      previewValues.resourceSource = data.source;
	      previewValues.category = (data.resource.category == null) ? '' : data.resource.category;
	      previewValues.tags = (data.resource.tags == null) ? '' : data.resource.tags;
	      previewValues.standards = (typeof(data.resourceTaxonomyData.curriculum) == 'undefined' || data.resourceTaxonomyData.curriculum.curriculumCode == null) ? '' :data.resourceTaxonomyData.curriculum.curriculumCode;
	      previewValues.standardDescriptions = (typeof(data.resourceTaxonomyData.curriculum) == 'undefined' ||data.resourceTaxonomyData.curriculum.curriculumDesc == null) ? '':data.resourceTaxonomyData.curriculum.curriculumDesc;								
	      previewValues.documentId = (data.resource.documentid == null) ? '': data.resource.documentid;
	      previewValues.documentKey = (data.resource.documentkey == null) ? '': data.resource.documentkey;							previewValues.resourcestatus.statusIsBroken = data.resource.resourcestatus.statusIsBroken;
	      previewValues.resourcestatus.statusIsFrameBreaker = data.resource.resourcestatus.statusIsFrameBreaker;
	      previewValues.thumbnail = data.resource.thumbnail;
	      if(typeof data.resource.instructornotes != 'undefined' && data.resource.instructornotes != null) {
	      previewValues.resourceNarrative = data.resource.instructornotes.instruction;
	      }								
	      if(typeof data.resourceSiteName != 'undefined' && data.resourceSiteName != null) {
	      previewValues.siteName = data.resourceSiteName;
	      }	
	    } else {	        
	      previewValues.resourceUrl = data.url;
	      previewValues.type = data.resourceType.name;
	      previewValues.startPPT = (data.start == null || data.start == '') ? 1 : data.start;
	      previewValues.stopPPT = (data.stop == null) ? '' : data.stop;
	      previewValues.filePath = data.assetURI + data.folder;
	      previewValues.thumbnail = data.thumbnail;
	      previewValues.title = (data.title == null) ? '' : data.title;
	      previewValues.category = (data.category == null) ? '' : data.category;
	      previewValues.tags = (data.tags == null) ? '' :data.tags,
	      previewValues.standards = (typeof(data.resourceTaxonomyData.curriculum) == 'undefined' ||data.resourceTaxonomyData.curriculum.curriculumCode == null) ? '' :data.resourceTaxonomyData.curriculum.curriculumCode,
	      previewValues.standardDescriptions = (typeof(data.resourceTaxonomyData.curriculum) == 'undefined' ||data.resourceTaxonomyData.curriculum.curriculumDesc == null) ? '' :data.resourceTaxonomyData.curriculum.curriculumDesc,
	      previewValues.description = (data.description == null) ? '' : data.description;
	      previewValues.resourceSource = data.resourceSource;
	      previewValues.resourcestatus.statusIsBroken = data.brokenStatus;
	      previewValues.resourcestatus.statusIsFrameBreaker = data.hasFrameBreaker;
	      previewValues.siteName= data.siteName;
	      previewValues.assetURI = data.assetURI;
	    }
	      previewValues.resourceLicense = data.license;
	      if (typeof (previewValues.startPPT) === 'string') {
		previewValues.startTime = helper.calculateTime(startPPT);
	      }else if (typeof (previewValues.startPPT) === 'number') {
		previewValues.startTime = previewValues.startPPT;
	      }
	      if (typeof (previewValues.stopPPT) === 'string') {
		previewValues.stopTime = helper.calculateTime(previewValues.stopPPT);
									  
	      } else if (typeof (previewValues.stopPPT) === 'number') {
		previewValues.stopTime = previewValues.stopPPT;
	      }						
	      previewValues.resourceViews = Number(data.resourceViews) + 1;					
	      previewValues.isWebResource = helper.isWebResource(previewValues.resourceUrl, previewValues.type);
	      previewValues.resourceExtenstion = helper.getResourceFileExtenstion(previewValues.resourceUrl);
	      if (previewValues.type == "assessment-question") {
		previewValues.questionType = data.typeName;
		previewValues.answers = data.quizQuestion.answers;
		previewValues.questionExplanation = data.explanation;
		previewValues.questionHints = data.quizQuestion.hints;
		previewValues.questionImageURL = resourcePreview.checkImageURLStatus(data.thumbnails.url);
	      }
	      resourcePreview.showResourcePreview(previewValues);
	      resourcePreview.showResourceCollections(previewValues.gooruOid);						
	      helper.updateResourceViews(previewValues.gooruOid, previewValues.resourceViews);						
	      helper.previewToolTip('.resourceBottomPreviewTooltip', 'bottom');
	      if (previewValues.resourceLicense != null && typeof(previewValues.resourceLicense.name) != 'undefined' &&  previewValues.resourceLicense.name != 'Other' && 			previewValues.resourceLicense.code != ''){
		  helper.previewToolTip('.resourcePreviewTooltipLicense', 'bottom');
	      }
	      helper.previewToolTip('.resourceBottomPreviewTooltipOER', 'bottom');
	      resourcePreview.handleResourcePreviewEvents();
  },
   
showResourceCollections : function(gooruOid) {
  $.ajax({
      type : 'GET',
      url : GOORU_REST_ENDPOINT + '/search/scollection?&pageNum=1&pageSize=5&flt.resourceGooruOIds='+gooruOid+
      '&boostField.hasNoThumbnail=0',
      dataType : 'jsonp',
      success : function(data) {
	  var resourcesCollectionTemplate = new EJS({url : STATIC_FILE_PATH + '/templates/resources/resourceCollections.template'}).render({
						      resourceCollection : data,
						      HOME_URL: HOME_URL,
						      TOKEN : USER.sessionToken
					    });
	  if(data.searchResults.length > 0 && typeof (data.searchResults) != 'undefined') {
	      $('div#gooru-resource-player-learn-more-container').html(resourcesCollectionTemplate);
	      $('div#gooru-resource-player-learn-more-grey').hide();
	      $('div#gooru-resource-player-learn-more').show();
	      $('div.learn-more-image-container').mouseenter(function() { 
		 $(this).find('div.gooru-resource-player-learn-more-content').show();
	      });
	      $('div.learn-more-image-container').mouseleave(function() { 
		$(this).find('div.gooru-resource-player-learn-more-content').hide();
	      });
	  } else { 
	    $('div#gooru-resource-player-learn-more-grey').show();
	    $('div#gooru-resource-player-learn-more').hide();
	  }
      },
      error : function(jqXhr, textStatus, errorThrown) {
	  
      }
  });
},

  handleResourcePreviewEvents: function() { 
    /* handle resource player menu events*/
    $('div#gooru-resource-player-about').click(function() { 
        $('span.resourcePreviewHeaderNavigationArrowLearnMore, span.resourcePreviewHeaderNavigationArrowShare, div#gooru-resource-player-share-container, div#gooru-resource-player-learn-more-container').hide();
        $('div#gooru-resource-player-header-container').find('.gooru-resource-player-menu-share-selected').removeClass('gooru-resource-player-menu-share-selected');
	$('div#gooru-resource-player-header-container').find('.gooru-resource-player-menu-learn-more-selected').removeClass('gooru-resource-player-menu-learn-more-selected');
        $('div#gooru-resource-player-about-header').toggleClass('gooru-resource-player-menu-about-selected');
	$('span.resourcePreviewHeaderNavigationArrowAbout, div#gooru-resource-player-about-container').slideToggle('slow', function() {resetResourcePreviewHeight(); });
    });
    
    $('div#gooru-resource-player-learn-more').click(function() { 
        $('span.resourcePreviewHeaderNavigationArrowAbout, span.resourcePreviewHeaderNavigationArrowShare, div#gooru-resource-player-about-container ,div#gooru-resource-player-share-container').hide();
        $('div#gooru-resource-player-header-container').find('.gooru-resource-player-menu-share-selected').removeClass('gooru-resource-player-menu-share-selected');
	$('div#gooru-resource-player-header-container').find('.gooru-resource-player-menu-about-selected').removeClass('gooru-resource-player-menu-about-selected');
        $('div#gooru-resource-player-learn-more-header').toggleClass('gooru-resource-player-menu-learn-more-selected');
	$('div#gooru-resource-player-learn-more-container').slideToggle('slow', function() {
	  resetResourcePreviewHeight(); 
	});
	$('span.resourcePreviewHeaderNavigationArrowLearnMore').is(':visible') ? $('span.resourcePreviewHeaderNavigationArrowLearnMore').hide() : $('span.resourcePreviewHeaderNavigationArrowLearnMore').css('display', 'block');
    });
    function resetResourcePreviewHeight() {
      var height = $(window).height();
      if($('div.gooru-resource-player-menu-container').is(':visible')) { 
	$('.gooru-resource-player-preview-container, div.resourcePreviewBoxContentContainer, div.gooru-question-play-container').css('height', (height - 165));
      } else { 
	$('.gooru-resource-player-preview-container, div.resourcePreviewBoxContentContainer, div.gooru-question-play-container').css('height', (height - 47));
      }
    }
  },
  resourcePlayerActivityStop: function() { 
	var activityLogId = $('div#gooru-resource-player-base-container').data('activity-log-id');
  	var gooruOid = $('div#gooru-resource-player-base-container').data('gooru-oid');
  	activityLog.triggerActivityLog(activityLogId, 'stop', gooruOid, 'resource-player', null, window.location , 'resource-player-stop');  
  },
  checkImageURLStatus : function(url) {
    var imageURL = "";
    $.ajax({async: false,type:'GET',url:url,complete:function(jqXHR, textStatus) { 
	imageURL = (jqXHR.status == 200) ? url : null;
    }});
    return imageURL;
  },
  questionResourcePlayEvents : function(){
    
  }
};

function onYouTubePlayerReady(playerid) {
  var myPlayer = document.getElementById(playerid);
  var resourceInstanceId = playerid.split('youtubeMovie-resourcePlayYoutubeplayer-')[1];
  var stopTime = $('div#resourcePlayYoutubeplayer-' + resourceInstanceId).data('videostop');
  var fromPreRender = $('div#resourcePlayYoutubeplayer-' + resourceInstanceId).data('fromprerender');
    if(myPlayer != null) {      
      var originalStoptime = myPlayer.getDuration();
      if (Number(stopTime) >= Number(originalStoptime)  || Number(stopTime) <= 0) { 
	stopTime = originalStoptime - 1;
      } 
      resourcePlayers.playVideo(myPlayer, stopTime);
      myPlayer.addEventListener('onStateChange', 'onYouTubeStateChange');
    }
}

function onYouTubeStateChange(playerStatusId) {
  if(playerStatusId === 2 || playerStatusId === 0) { 
	resourcePreview.resourcePlayerActivityStop();	
  }
  if (playerStatusId != 2) {
    var playerid = $('div.currentlyPlayingYoutubeVideoResource').data('playerid');
    if (typeof(playerid) != 'undefined') {
      var stopTime = $('div.currentlyPlayingYoutubeVideoResource').data('videostop');
      var myPlayer = document.getElementById('youtubeMovie-resourcePlayYoutubeplayer-' + playerid);
      resourcePlayers.triggerStopVideo(myPlayer, stopTime);
    }
  }
}

$(document).ready(function () {
  helper.userSignin({onComplete:resourcePreview.init});
  resourcePreview.init();
});

