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
        this.previewBox = document.getElementById('markdownPreviewBox');
        this.converter  = new Showdown.converter();
        dump('Contents: ' + this.editor.contentsMIMEType + '\n');

        if(this.composer.composeHTML) {
            dump('Nothing to do for HTML mail\n');
            return;
        }

        this.initialized = true;
        this.strings = document.getElementById("markdown-strings");

        var frame = document.getElementById('content-frame');

        var body = frame.contentDocument.body;
        var events = ['NodeInserted', 'NodeRemoved', 'CharacterDataModified'];
        var th = this;
        for(var a in events) {
            body.addEventListener('DOM' + events[a], function(ev) { th.renderHtml(th, ev); }, false);
        }
    },

    renderHtml: function(th, ev) {
        var enabled = document.getElementById('toggleMarkdown').getAttribute('checked');
        if(!enabled) {
            dump('Preview not enabled\n');
            return;
        }

        var text = this.editor.outputToString('text/plain', this.editor.eNone);
        var html = this.converter.makeHtml(text);
        document.getElementById('markdownPreviewBody').innerHTML = html;
    },

    doPreview: function(checkbox) {
        var enabled = checkbox.getAttribute('checked');
        if(enabled) {
            dump('Should preview\n');
            this.previewBox.style.display = null;
        }
        else {
            dump('Should NOT preview\n');
            this.previewBox.style.display = 'none';
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
