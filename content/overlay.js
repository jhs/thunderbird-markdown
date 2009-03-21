var Markdown = {
  init: function(ev) {
    // initialization code
    dump('Markdown initializing\n');

    this.initialized = true;
    this.strings = document.getElementById("markdown-strings");
  },

  onMenuItemCommand: function(e) {
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                  .getService(Components.interfaces.nsIPromptService);
    promptService.alert(window, this.strings.getString("helloMessageTitle"),
                                this.strings.getString("helloMessage"));
  },

  onLoad: function() {
    // According to the bordercolors extension, onload doesn't work so do what they do.
    var composer = document.getElementById('msgcomposeWindow');
    composer.addEventListener('focus', function(e) { Markdown.init(e); }, false);
  },
};

Markdown.onLoad();
