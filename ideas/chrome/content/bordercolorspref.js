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
 
/* bordercolorspref.js - functions for the preferences window.
   Globals are the accountmanager service, and the prefs service.
   Constants are the min and max px values for the width */

var gMozAccountManager = Components.classes["@mozilla.org/messenger/account-manager;1"].getService(Components.interfaces.nsIMsgAccountManager);
var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefService);

var myprefs = prefs.getBranch("bordercolors.");

const MAXWIDTH = 10;

function init() {
  populateListbox();
  populateColorList();
}

function populateColorList() {
  var accounts = gMozAccountManager.accounts;
  for(var account = 0; account < accounts.Count(); account++)
  {
   var curAccount = accounts.QueryElementAt(account, Components.interfaces.nsIMsgAccount);
   
   var accIds = curAccount.identities;
   
   // for every identity in each account, get its
   // info, try and load its preference color, and
   // unhide its respective hbox in the XUL
   for(var id = 0; id < accIds.Count(); id++)
   {
     var curId = accIds.QueryElementAt(id, Components.interfaces.nsIMsgIdentity);
    try
    {
      myprefs.getCharPref(curId.key);
    }
    // no preference?
    catch(e)
    {
      myprefs.setCharPref(curId.key, "#000000");
    }
    // we only need the number of the id
    var curIndex = curId.key.substr(2);
    var curBox = "borderbox" + curIndex; 
    var curText = "Identity" + curIndex;
    var curPicker = "bordercolorpicker" + curIndex;
    document.getElementById(curBox).hidden = false;
    
    // upon request, fetch the name of the account from
    // the preferences to display alongside the ID info
    var serverNames = prefs.getBranch("mail.server.");
    var realServNum = account + 1;
    var curAccPref = "server" + realServNum + ".name";
    try{
      var curAccName = serverNames.getCharPref(curAccPref);
    }
    catch(e)
    {
      curAccName = "";
    }
    document.getElementById(curText).value = curAccName + " - " + curId.identityName;
    document.getElementById(curPicker).color = myprefs.getCharPref(curId.key);
   }
  
  }
}

function populateListbox()
{
  var box = document.getElementById('BorderWidth');
  for(var i = 1; i < MAXWIDTH; i++)
  {
    box.appendItem(i, i);
  }
  try
  {
    var width = myprefs.getIntPref("borderwidth");
    if(width <= MAXWIDTH && width >= 0)
    {
      // -1 because our indices start from zero,
      // but our px's start from one
      box.selectedIndex = width - 1;
    }
  }
  // no pref
  catch(e)
  {
    box.selectedIndex = 2;
  }
    
}

function writePrefs() {
  for(i = 0; i < 20; i++)
  {
    var curPickerToSave = "bordercolorpicker" + i;
    var curIdToSave = "id" + i;    
    myprefs.setCharPref(curIdToSave, document.getElementById(curPickerToSave).color);

  }
  
  myprefs.setIntPref("borderwidth", document.getElementById('BorderWidth').value);
  
}
