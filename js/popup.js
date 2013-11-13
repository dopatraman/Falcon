var TrackerNS = {}

var Tracker = function(data, $target) {
  this.data = data;
  this.target = $target;

  this.model;
  this.view;
  
  this.name;
  this.latency;

  return this;
}
Tracker.prototype.STATICS = {}
Tracker.prototype.STATICS.template = "tracker";
Tracker.prototype.createTemplateObj = function(data) {
  var name = data.Name;
  var lat = data.Latency;
  var desc = data.Description;
  var obj = {
    Name: name,
    Latency: lat + " ms",
    Description: desc
  }

  return obj;
}
Tracker.prototype.createView = function(data) {
  if (typeof(ich) != "undefined") {
    var template = ich[this.STATICS.template];
    if (typeof(template) != "undefined") {
      return template(data);
    }
  }
}
Tracker.prototype.appendToDOM = function(target, view) {
  target.append(view);
}
Tracker.prototype.appendView = function(target) {
  this.appendToDOM(target, this.view);
}
Tracker.prototype.bindHandlers = function(view) {
  view.bind("click", function() {
    if ($(this).hasClass("active")) {
      $(this).find(".trackerInfo").slideUp(300);
      $(this).removeClass("active");
    }
    else {
      $(this).find(".trackerInfo").slideDown(300);
      $(this).addClass("active");
    }
  })
}
Tracker.prototype.init = function() {
  this.model = this.createTemplateObj(this.data);
  this.view = this.createView(this.model);
  this.appendView(this.target);
  this.bindHandlers(this.view);

  return this;
}

/******************************************************************
******************************************************************
******************************************************************
*******************************************************************/


var TrackerController = function() {
  this.list = [];
}
TrackerController.prototype.url = "http://www.zadrozny.co/ghostery/_gen_domain/";
TrackerController.prototype.formUrl = function(domain) {
  return this.url + domain;
}
TrackerController.prototype.fetchTrackers = function(domain, callback) {
  var completeUrl = this.formUrl(domain);
  /*
  var req = new XMLHttpRequest();
  req.open("GET", completeUrl, true);
  req.onload = callback.bind(this);
  req.onerror = function() {
    console.log("Oops! An error occurred.");
  }
  req.send();
  */
  try {
    $.ajax({
      url: completeUrl,
      dataType: "jsonp",
      crossDomain: true,
      complete: function(data) {
        callback(data);
      },
      jsonpCallback: function(data) {
        callback(data);
        return;
      },
      jsonp: function(data) {
        console.log(data);
      }
    });
  }
  catch(err) {
    console.log(err);
  }
}
TrackerController.prototype.populateTrackers = function(trackerDataList, target) {
  if (trackerDataList instanceof Array) {
    var trackerTarget = $(target);
    for (var i = 0; i < trackerDataList.length; i++) {
      var tracker = new Tracker(trackerDataList[i], trackerTarget).init();
      this.list.push(tracker);
    }
  }
}

TrackerNS["Controller"] = new TrackerController();

/***************************************************************
---------------------------TESTING------------------------------
****************************************************************/

var testObjs = [
  {
    Name: "Brightcove",
    Latency: 329,
    Description:"Brightcove is the leading online video hosting platform and online video player solution."
  },
  {
    Name: "Webtrends",
    Latency:189,
    Description:"Webtrends provides web, social, and mobile analytics and other software solutions related to marketing intelligence."
  },
  {
    Name: "Typekit",
    Latency:333,
    Description:"Typekit is a service which allows subscribers to embed fonts into online documents."
  },
  /*{
    Name:"AppNexus",
    Latency:249,
    Description:"AppNexus is a New York City-based company that provides a platform specializing in real-time online advertising."
  },
  {
    Name:"Moat",
    Latency:1415,
    Description:"Moat is a free search engine for display ads. Moat also offers heatmap analytics and resources for creative."
  },
  {
    Name: "DataLogix",
    Latency:104,
    Description:"Datalogix is the big data company connecting digital advertising to offline sales."
  },
  {
    Name: "ChartBeat",
    Latency:87,
    Description:"Chartbeat is a betaworks company that provides realtime analytics to Websites and blogs. It shows visitors, load times, and referring."
  }*/
];

$(document).ready(function() {
  try {
    TrackerNS.Controller.populateTrackers(testObjs, "#target");  
  }
  catch(err) {
    console.log(err);
  }
})
