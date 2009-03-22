var Markdown = {
    init: function(ev) {
        // initialization code
        if(this.initialized) {
            dump('Already initialized!\n');
            return;
        }
        dump('Markdown initializing\n');

        this.composer = window.gMsgCompose;
        this.editor   = this.composer.editor;
        dump('Contents: ' + this.editor.contentsMIMEType + '\n');

        if(this.composer.composeHTML) {
            dump('Nothing to do for HTML mail\n');
            return;
        }

        this.initialized = true;
        this.strings = document.getElementById("markdown-strings");

        var frame = document.getElementById('content-frame');
        var modified = function(ev) {
            dump('modified: ');
            dump(document.getElementById('toggleMarkdown').getAttribute('checked'));
            dump('\n');
        };

        var body = frame.contentDocument.body;
        var events = ['NodeInserted', 'NodeRemoved', 'CharacterDataModified'];
        for(var a in events) {
            body.addEventListener('DOM' + events[a], modified, false);
        }
    },

    doPreview: function(checkbox) {
        debugger;
        var enabled = checkbox.getAttribute('checked');
        if(enabled) {
            dump('Should preview\n');
        }
        else {
            dump('Should NOT preview\n');
        }

        return true; // Allow setting the checkbox to happen.
    },

    /*
    onMenuItemCommand: function(e) {
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
    .getService(Components.interfaces.nsIPromptService);
    promptService.alert(window, this.strings.getString("helloMessageTitle"),
    this.strings.getString("helloMessage"));
    },
    */

    onLoad: function() {
        // According to the bordercolors extension, onload doesn't work so do what they do.
        var composer = document.getElementById('msgcomposeWindow');
        composer.addEventListener('focus', function(e) { Markdown.init(e); }, false);
    },
};

Markdown.onLoad();
