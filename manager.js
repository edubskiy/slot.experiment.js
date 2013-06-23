/**
 * XSL Manager
 * User: edubskiy
 * Date: 4/2/12
 * Time: 9:22 PM
 */

var Manager = {

    options: {
        url: {
            xml: "experiments.xml",
            xsl: "style.xsl"
        },
        container: 'body'
    },

    // Init options
    Init: function( options ) {
        this.options = $.extend({}, this.options, options);
    },

    SyncLoad: function(xmlDoc) {

        console.log(xmlDoc);

        return $.ajax({
            url: xmlDoc,
            dataType: 'xml',
            async: false
        });
    },

    RenderXSL: function() {

        var xml = null,
            xsl = null;

        console.log(this.options.url.xml);

        this.SyncLoad(this.options.url.xml).done(function( result ) {
            xml = result;
        });

        this.SyncLoad(this.options.url.xsl).done(function( result ) {
            xsl = result;
        });

        var xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsl);

        return xsltProcessor.transformToFragment(xml, document);
    },

    AppendXSL: function(xsl) {
        $(xsl).appendTo(this.options.container);
    }
};