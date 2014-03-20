/* Copyright 2009 Google Inc. All Rights Reserved. */
/* v1.004 */

/**
 * @fileoverview Play custom March Madness tour
 *
 * @author nitasha
 */

if(typeof google != "undefined") {
	google.load("earth", "1.x")
}

/**
 * namespace for oceans tour
 */
var mtours = mtours || {};


/**
* Initial load method - set the div and start the earth callback
*/
var googleEarthInstances = 0;
var arr_kmzUrlVal = new Array();
var arr_tours = new Array();

mtours.init = function(kmzUrl,divid) {
	arr_kmzUrlVal[googleEarthInstances] = kmzUrl;	
	googleEarthInstances = googleEarthInstances + 1;
	
	google.earth.createInstance(divid, initCallback(googleEarthInstances), failureCallback);	
	
}

function initCallback(googleEarthInstances) {

  return function(instance) {
      
      var index = googleEarthInstances - 1;
      
      var tour = tour || {};
      arr_tours[index] = tour;
      
      tour.instanceId = index;
      tour.ge = instance;
      tour.ge.getWindow().setVisibility(true);
    
      // add a navigation control
      tour.ge.getNavigationControl().setVisibility(tour.ge.VISIBILITY_AUTO);
    
      // add some layers
      tour.ge.getLayerRoot().enableLayerById(tour.ge.LAYER_BORDERS, true);
      tour.ge.getLayerRoot().enableLayerById(tour.ge.LAYER_ROADS, true);
      tour.ge.getLayerRoot().enableLayerById(tour.ge.LAYER_BUILDINGS, true);
       
      
      // create the tour by fetching it out of a KML file
      var href = arr_kmzUrlVal[index];
      mtours.loadTour(href,tour);
  };

}

/**
* Init method for earth - sets up the earth, layers, and call to load tour
* @param {Object} instance of plugin
*/
/*function initCallback(instance) {
  
  jAlert("googleEarthInstances:" + googleEarthInstances);
  
  var tour = tour || {};
  arr_tours[googleEarthInstances] = tour;
  
  tour.instanceId = googleEarthInstances;
  tour.ge = instance;
  tour.ge.getWindow().setVisibility(true);

  // add a navigation control
  tour.ge.getNavigationControl().setVisibility(tour.ge.VISIBILITY_AUTO);

  // add some layers
  tour.ge.getLayerRoot().enableLayerById(tour.ge.LAYER_BORDERS, true);
  tour.ge.getLayerRoot().enableLayerById(tour.ge.LAYER_ROADS, true);
  tour.ge.getLayerRoot().enableLayerById(tour.ge.LAYER_BUILDINGS, true);
   
  
  // create the tour by fetching it out of a KML file
  var href = arr_kmzUrlVal[googleEarthInstances];
  mtours.loadTour(href,tour);
}*/

/**
* Load a specified tour into earth
* @param {url} url of the kmz for the tour
*/
mtours.loadTour = function(url,tour) {
	
  google.earth.fetchKml(tour.ge, url, function(kmlObject) {
  if (!kmlObject) {
    // wrap alerts in API callbacks and event handlers
    // in a setTimeout to prevent deadlock in some browsers
    setTimeout(function() {
      jAlert("That KML file doesn't look right to us. Please check it and then try again!","Hmm...");
      }, 0);
    return;
  }
  // Show the entire KML file in the plugin.
  tour.ge.getFeatures().appendChild(kmlObject);

  var options;
  
  // Walk the DOM looking for a KmlTour
  walkKmlDom(kmlObject, function(contextArgument) {
  
    if (this.getType() == 'KmlTour') {
    	contextArgument.tourContext.tourRef = this;
    	return false; // stop the DOM walk here.
    }
    else if(this.getType() == 'KmlPlacemark') {
	if (this.getAbstractView())
		contextArgument.tourContext.ge.getView().setAbstractView(this.getAbstractView());
    }
    
  }, options, tour);
  
  tour.tp = tour.ge.getTourPlayer();
  tour.tp.setTour(tour.tourRef);
  //tour.tp.play();
  //mtours.jumpTo(8,tour);
  tour.ge.getWindow().focus();

  
  });

 
}


/**
* failure to load the earth
*/
function failureCallback(errorCode) {
}


/**
* Jump to a specified time in the current Tour
* @param {time} where to jump (in seconds)
* @param {play} should it auto-play after jumping to the time 
* @param {display_control} should it bring the tour control up 
*/
mtours.jumpTo = function(time, tour, play, display_control){

  //let's see if we lost the tour entirely by someone closing time slider
  try {
    tour.tp.getDuration();
	} 
  //in which case reload it
  catch(e){
    tour.tp.setTour(tour.tourRef);
  }


  tour.tp.setCurrentTime(time);
  if (typeof display_control == 'undefined') {var display_control = false}
  if (typeof play == 'undefined') {var play = true}
  
  if (display_control) {
    tour.tp.pause(); //causes tour control to show up
  }
  
  if (play){
    tour.tp.play();
  } else {
    tour.tp.pause();
  }
  
}
