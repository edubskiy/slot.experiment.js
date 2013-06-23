<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" encoding="utf-8"/>

    <xsl:template name="title">
        <title><xsl:value-of select="//name" /></title>
    </xsl:template>

    <xsl:template name="css">
        <link rel="stylesheet" href="style.css"/>
    </xsl:template>

    <xsl:template name="config">
        <div id="config">
            <label>Config: </label>
            <span><xsl:value-of select="//name" /></span>
        </div>
    </xsl:template>

    <xsl:template name="version">
        <div id="version">
            <label>Version: </label>
            <span><xsl:value-of select="//version" /></span>
        </div>
    </xsl:template>

    <xsl:template name="tags">
        <div id="tags">
            <label>Tags: </label>
            <span>[<xsl:value-of select="//tags" />]</span>
        </div>
    </xsl:template>

    <xsl:template name="info-panel">
        <section class="configurations-info">
            <div id="configurations-info-panel">
                <xsl:call-template name="config"/>
                <xsl:call-template name="version"/>
                <xsl:call-template name="tags"/>
            </div>
        </section>
    </xsl:template>

    <xsl:template name="slot">
        <xsl:attribute name="data-slots">
            <xsl:for-each select="slot">
                <xsl:value-of select="."/>
                <xsl:if test="position() != last()">
                    <xsl:text>,</xsl:text>
                </xsl:if>
            </xsl:for-each>
        </xsl:attribute>
    </xsl:template>

    <xsl:template match="/">
        <html>
            <head>
                <xsl:call-template name="title"/>
                <xsl:call-template name="css"/>
            </head>
            <body>
                <xsl:call-template name="info-panel" />

                <xsl:for-each select="//list/entry[not(dimension=preceding-sibling::entry/dimension)]" >

                    <!-- DIMENSIONS SECTION -->

                    <xsl:variable name="dimensionId" select="dimension" />
                    <xsl:variable name="dimensionName" select="//list/dimension[@id=$dimensionId]/name" />
                    <xsl:variable name="totalSlots" select="//list/dimension[@id=$dimensionId]/slots" />

                    <section class="dimension">
                        <xsl:attribute name="data-total-slots">
                            <xsl:value-of select="$totalSlots" />
                        </xsl:attribute>

                        <!--SET DIMENTSION ID -->
                        <xsl:attribute name="id">dim-<xsl:value-of select="$dimensionId" /></xsl:attribute>

                        <!--SET DIMENTSION NAME -->
                        <h1><xsl:value-of select="$dimensionName"/></h1>

                        <div class="dimension-info"></div>

                        <div class="dimension-data">
                            <ul class="dimemsion-slots-row"></ul>
                            <!-- and canvas -->
                        </div>

                        <!-- EXPERIMENTS SECTION -->
                        <div class="experiments">
                            <xsl:for-each select="../entry[dimension = $dimensionId]">
                                <xsl:variable name="experimentId" select="experiment" />
                                <xsl:variable name="experimentName" select="//list/experiment[@id=$experimentId]" />

                                <div class="experiment">
                                    <xsl:attribute name="id">exp-<xsl:value-of select="$experimentId" /></xsl:attribute>
                                    <xsl:attribute name="data-name"><xsl:value-of select="$experimentName" /></xsl:attribute>
                                    <xsl:call-template name="slot" />
                                </div>
                            </xsl:for-each>
                        </div>

                    </section>
                </xsl:for-each>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>