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
    name: name,
    latency: lat + " ms",
    description: desc
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
  
  var req = new XMLHttpRequest();
  req.open("GET", completeUrl, true);
  //req.onload = callback.bind(this);
  var rh = function(req) {
      if (req.readyState == 4) {
        callback.bind(this, req);
      }
  }
  req.onreadystatechange = rh.bind(this, req);
  req.onerror = function() {
    console.log("Oops! An error occurred.");
  }
  req.send();
  
  /*
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
  */
}
TrackerController.prototype.populateTrackers = function(trackerObj, target) {
  var trackerDataList = trackerObj.trackers;
  if (trackerDataList instanceof Array) {
    var trackerTarget = $(target);
    for (var i = 0; i < trackerDataList.length; i++) {
      var tracker = new Tracker(trackerDataList[i], trackerTarget).init();
      this.list.push(tracker);
    }
  }
  
  if (trackerObj.aggregate !== undefined) {
      $("#domainName").text(trackerObj.aggregate.Name);
      $("#totalLatency").text(trackerObj.aggregate.Latency);
  }
}

TrackerNS["Controller"] = new TrackerController();

/***************************************************************
---------------------------TESTING------------------------------
****************************************************************/

var testObjs = [
  {
    name: "Brightcove",
    domain: "www.brightcove.com",
    latency: 329,
    Description:"Brightcove is the leading online video hosting platform and online video player solution."
  },
  {
    name: "Webtrends",
    domain: "www.webtrends.com",
    latency:189,
    description:"Webtrends provides web, social, and mobile analytics and other software solutions related to marketing intelligence."
  },
  {
    name: "Typekit",
    domain: "www.typekit.com",
    latency:333,
    description:"Typekit is a service which allows subscribers to embed fonts into online documents."
  }
];

var testTrackerObj = {
    aggregate: {
        name: "New York Times",
        domain: "www.nytimes.com",
        latency: 100
    },
    trackers: testObjs
}

$(document).ready(function() {
  try {
    TrackerNS.Controller.populateTrackers(testTrackerObj, "#target");  
  }
  catch(err) {
    console.log(err);
  }
})
