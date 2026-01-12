<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  version="3.0">

  <xsl:output method="html" html-version="5" indent="yes"/>

  <!-- Root -->
  <xsl:template match="/">
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Preview</title>
      </head>
      <body>
        <main>
          <xsl:apply-templates/>
        </main>
      </body>
    </html>
  </xsl:template>

  <!-- Structural containers -->
  <xsl:template match="document">
    <xsl:apply-templates/>
  </xsl:template>

  <xsl:template match="Block">
    <section>
      <xsl:apply-templates/>
    </section>
  </xsl:template>

  <!-- Heading mappings -->
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

  <!-- Paragraph -->
  <xsl:template match="Paragraph">
    <p><xsl:value-of select="."/></p>
  </xsl:template>

</xsl:stylesheet>
