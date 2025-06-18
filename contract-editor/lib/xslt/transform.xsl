<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <!-- output HTML -->
  <xsl:output method="html" indent="yes" />

  <!-- (a) root: wrap everything in <html><body> -->
  <xsl:template match="/document">
    <html>
      <head>
        <meta charset="UTF-8"/>
      </head>
      <body>
        <xsl:apply-templates/>
      </body>
    </html>
  </xsl:template>

  <!-- (b) blocks → div.block -->
  <xsl:template match="Block">
    <div class="block">
      <xsl:apply-templates/>
    </div>
  </xsl:template>

  <!-- (c) headings → h1–h4 -->
  <xsl:template match="HeadingLevel1">
    <h1><xsl:value-of select="."/></h1>
  </xsl:template>
  <xsl:template match="HeadingLevel2">
    <h2><xsl:value-of select="."/></h2>
  </xsl:template>
  <xsl:template match="HeadingLevel3">
    <h3><xsl:value-of select="."/></h3>
  </xsl:template>
  <xsl:template match="HeadingLevel4">
    <h4><xsl:value-of select="."/></h4>
  </xsl:template>

  <!-- (d) paragraphs → <p> -->
  <xsl:template match="Paragraph">
    <p><xsl:apply-templates/></p>
  </xsl:template>

  <!-- (e) text nodes: normalize whitespace -->
  <xsl:template match="text()">
    <xsl:value-of select="normalize-space(.)"/>
  </xsl:template>

</xsl:stylesheet>
