//
//  
//  █▀█ █░█ █ █▀▀ █▄▀ ░ ░░█ █▀  version
//  ▀▀█ █▄█ █ █▄▄ █░█ ▄ █▄█ ▄█   1.7.2
//  
//

var _ = (function () {
  
	'use strict';
	var quick = {};

  quick.edit = function (elem, text) {
    if (typeof elem === "string") return document.querySelector(elem).innerHTML = text
    elem.innerHTML = text
  }

  quick.addClass = function(elem, classname) {
    if (!elem) throw new Error("Element parameter is not set!")
    if (!classname) throw new Error("Class parameter is not set!")

    if (typeof elem === "string") return document.querySelector(elem).classList.add(classname)
    elem.classList.add(classname)
  }

  quick.getType = function(elem) {
    return typeof elem
  }

  quick.setCSS = function (elem, prop, value) {
    if (!elem) throw new Error("Element parameter is not set!")
    if (!prop) throw new Error("Property parameter is not set!")
    if (!value) throw new Error("Value parameter is not set!")

    if (typeof elem === "string") return document.querySelector(elem).style.setProperty(prop, value)
    elem.style.setProperty(prop, value)
    
  }

  quick.hide = function(elem) {
    if (typeof elem == "string") return document.querySelector(elem).style.display = "none"
    elem.style.display = "none"
  }

  quick.show = function(elem) {
    if (typeof elem == "string") return document.querySelector(elem).style.removeProperty("display")
  }

  quick.toggle = function(elem) {
    if (typeof elem == "string") {
      var e = document.querySelector(elem)
      if (e.style.display == "none") {
        return e.style.removeProperty("display")
      } else {
        return e.style.display = "none"
      }
    }
    if (elem.style.display == "none") {
      return elem.style.removeProperty("display")
    } else {
      return elem.style.display = "none"
    }
  }
  quick.removeClass = function(elem, classname) {
    if (typeof elem === "string") return document.querySelector(elem).classList.remove(classname)
    elem.classList.remove(classname)
  }
  
	quick.get = function(elem) {
    if (!elem) throw new Error("No query selector provided")
    return document.querySelector(elem)
  }

  quick.loop = function(times, callback) {
    for (var i = 0; i < times; i++){
        callback();
    }
  }

	quick.on = function (elem, event, callback, useCapture) {
		if (!elem) throw new Error('Please provide an element to attach the event to.');
	  if (!event) throw new Error('Please provide an event to listen for.');
  	if (!callback) throw new Error('Please provide a callback to run');
    if (typeof elem === "string") return document.querySelector(elem).addEventListener(event, callback, useCapture || false);

    elem.addEventListener(event, callback, useCapture || false);
    

	};

  quick.redirect = function (url) {
    if (!url) throw new Error("No URL parameter provided")
    document.location.href = url
  }

	return quick;

})();