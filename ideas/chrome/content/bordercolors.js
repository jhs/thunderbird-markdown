/* ***** BEGIN LICENSE BLOCK *****
 * Version: NPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Netscape Public License
 * Version 1.1 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://www.mozilla.org/NPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 *
 * Original code:
 * Mike Krieger <mikekrieger@gmail.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or 
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the NPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the NPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/* bordercolors.js - Main functions for drawing the border and 
   re-painting it on toggle of the From: identity. Only globals are the 
   current windows' id (since we need to fire the onfocus) and the 
   preferences branch service */
 
/* DEBUG NOTE: alerts() sprinkled throughout attempt to track the progress
   of loading the border */

var borderprefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefService).getBranch("bordercolors.");

var gCurWindow = document.getElementById('msgcomposeWindow');

// onload doesn't work, for some reason - the compose window seems to fire
// four onload events, anyway. focus is fine. It would be nice to be able
// to remove this EventListener upon the first initialization, but Tb's
// Compose window is very erratic in its event handling
gCurWindow.addEventListener("focus", borderInit, true);

//alert("1");

/* borderInit - Initalization upon focus of the compose window */
function borderInit() {
  //alert("2");
  toggleColor();
  addressWidget = document.getElementById('msgIdentity');
  addressWidget.addEventListener("command", toggleColor, true);
}
  

/* toggleColor - Meat of the border toggling */
function toggleColor() {
  //alert("3");
  if(bordercolorsGetPlatform() == 'windows') var toStyle = document.getElementById('msgcomposeWindow');
  else{
    toStyle = document.getElementById('msgheaderstoolbar-box');
  }
  
  var curIdent = document.getElementById("msgIdentity");
  try{
    var curPix = borderprefs.getIntPref("borderwidth") + "px";
  }
  // If the preference hasn't been defined, set it to a default 3px
  catch(e)
  {
    curPix = "3px";
  }
  var curColor = GetColorFromIdentity(curIdent);
  var curString = "border: " + curPix + " solid " + curColor;
  //alert("5");
  toStyle.setAttribute("style",curString);
}


function GetColorFromIdentity(curIdent) {
  //alert("4");
  try{
    return(borderprefs.getCharPref(curIdent.value));
  }
  // no preference? return a default green
  catch(e)
  {
    return("green");
  }
}

// From foxytunes extension
function bordercolorsGetPlatform() {
	var platform = navigator.platform.toLowerCase();
	
	if (platform.indexOf('linux') != -1) {
		return 'linux';
	}

	if (platform.indexOf('mac') != -1) {
		return 'mac';
	}

	return 'windows';
}


