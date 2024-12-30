/************************************
 * 1. Utility Functions
 ************************************/

/**
 * slugify(text) 
 * Creates a slug/ID from the clause title, e.g.:
 *   "No guarantee of work or exclusivity" -> "noGuaranteeOfWorkOrExclusivity"
 */
function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')   // remove punctuation
      .replace(/\s+/g, '')       // remove spaces
      .trim();
  }
  
  /**
   * extractReferences(line)
   * Finds all occurrences of {{someReference}} in a line
   * and replaces them with a placeholder or an object that 
   * can be later turned into <Reference target="..."/>.
   */
  function extractReferences(line) {
    // Regex to match {{...}}
    const referenceRegex = /\{\{([^}]+)\}\}/g;
    const references = [];
    let match;
    
    // For the text output, we'll replace references with a special token,
    // then we store them in 'references' array for later XML conversion.
    let replacedLine = line;
    
    while ((match = referenceRegex.exec(line)) !== null) {
      const refTarget = match[1].trim();
      references.push(refTarget);
    }
    
    // We'll replace them with a special token like `%%REF%%`
    // so we know where to insert XML references later.
    replacedLine = replacedLine.replace(referenceRegex, '%%REF%%');
    
    return { replacedLine, references };
  }
  
  /**
   * createXmlElement(tagName, attributes = {}, content = '')
   * Creates an XML string for a single, simple element (no children).
   */
  function createXmlElement(tagName, attributes = {}, content = '') {
    // Build attributes string
    const attrString = Object.entries(attributes)
      .map(([key, value]) => ` ${key}="${value}"`)
      .join('');
    
    // Escape special characters in content if needed (simplified here).
    // In production, you'd properly escape <, >, & in text nodes.
    return `<${tagName}${attrString}>${content}</${tagName}>`;
  }
  
  /************************************
   * 2. Core Data Structures (AST)
   ************************************/
  
  // We will store the parsed result as:
  // {
  //   type: 'ContractDocument',
  //   blocks: [
  //     {
  //       type: 'Block',
  //       id: 'GeneralConditions',
  //       clauses: [...],
  //       definitions: [...], // top-level definitions in that block
  //       freeText: '...'     // optional, if we allow free text
  //     },
  //     ...
  //   ]
  // }
  
  // A Clause has structure:
  // {
  //   type: 'Clause',
  //   id: 'someID',            // optional
  //   title: 'title text',     // optional
  //   content: 'full text with placeholders for references',
  //   references: [ ... ],
  //   subClauses: [...],
  //   definitions: [...]
  // }
  
  // A SubClause is identical to a Clause, but with type: 'SubClause'.
  
  // A Definition is:
  // {
  //   type: 'Define',
  //   term: 'Contract Authority',
  //   hide: false,
  //   definitionText: '...'
  // }
  
  /************************************
   * 3. Main Parsing Function
   ************************************/
  
  function parseCustomMarkup(input) {
    // Normalize line endings and split
    const lines = input.replace(/\r\n/g, '\n').split('\n');
    
    // The final AST
    const ast = {
      type: 'ContractDocument',
      blocks: []
    };
    
    let currentBlock = null;        // track which block we're in
    let blockStack = [];            // in case of nested blocks (if you allow them; here we assume single-level)
    let clauseStack = [];           // track current clause/subclause
    let currentClause = null;       // reference to the top-level or subclause being processed
    let withinBlock = false;
    
    // Helper function to finalize a clause/subclause and pop from the stack
    function endCurrentClause() {
      if (!clauseStack.length) return;
      clauseStack.pop();
      if (clauseStack.length) {
        currentClause = clauseStack[clauseStack.length - 1];
      } else {
        currentClause = null;
      }
    }
    
    // Helper function to start a new clause or subclause
    function startClause(level, title) {
      const slug = slugify(title);
      const newClause = {
        type: level === 1 ? 'Clause' : 'SubClause',
        id: slug || undefined,
        title: title,
        content: '',
        references: [],
        subClauses: [],
        definitions: []
      };
      
      if (!clauseStack.length) {
        // This is a top-level clause under the current block
        currentBlock.clauses.push(newClause);
      } else {
        // This is a subclause of the current clause
        const parent = clauseStack[clauseStack.length - 1];
        parent.subClauses.push(newClause);
      }
      
      clauseStack.push(newClause);
      currentClause = newClause;
    }
    
    // Walk through lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // 1) Check for block begin
      let blockBeginMatch = line.match(/^@begin\{(.+)\}$/);
      if (blockBeginMatch) {
        withinBlock = true;
        const blockName = blockBeginMatch[1];
        currentBlock = {
          type: 'Block',
          id: blockName,
          clauses: [],
          definitions: []
        };
        ast.blocks.push(currentBlock);
        continue;
      }
      
      // 2) Check for block end
      let blockEndMatch = line.match(/^@end\{(.+)\}$/);
      if (blockEndMatch) {
        // End the current block
        withinBlock = false;
        currentBlock = null;
        // Clear clause stack
        clauseStack = [];
        currentClause = null;
        continue;
      }
      
      // If we’re not inside a block, you can decide to store free text in the AST or ignore
      if (!withinBlock) {
        // For simplicity, ignore free text outside blocks or store it somewhere
        continue;
      }
      
      // 3) Check for definitions (@define{...})
      //    We'll handle the form @define{"Term"} means the definition text.
      let defineMatch = line.match(/^@define\{(.+?)\}\s*(.*)$/);
      if (defineMatch) {
        // e.g. @define{"Contract Authority"} means the relevant ...
        // The define can have optional attributes like hide, so we parse them.
        // For simplicity, let's do a quick parse:
        //
        // @define{"Contract Authority", hide} some definition text
        // => term: "Contract Authority"
        //    hide: true
        //    text: "some definition text"
        //
        // We'll do a naive parse.
        // The group(1) is everything in braces, so we separate by comma.
        // The group(2) is the text after the braces.
        
        const insideBraces = defineMatch[1].trim();
        const definitionText = defineMatch[2] ? defineMatch[2].trim() : '';
        
        // Attempt to extract the term from quotes
        // and see if there's a 'hide' attribute or others
        const paramRegex = /"([^"]+)"/g;
        let termMatch = paramRegex.exec(insideBraces);
        let hide = false;
        let term = termMatch ? termMatch[1] : '';
        
        // Check if the rest of the insideBraces includes 'hide'
        // This is naive: if there's "hide" anywhere, set hide = true
        if (insideBraces.toLowerCase().includes('hide')) {
          hide = true;
        }
        
        const definitionObj = {
          type: 'Define',
          term,
          hide,
          definitionText
        };
        
        // Insert it at the current level: either under a clause or directly under the block
        if (currentClause) {
          currentClause.definitions.push(definitionObj);
        } else {
          currentBlock.definitions.push(definitionObj);
        }
        continue;
      }
      
      // 4) Check for headings (#, ##, ###, etc.)
      //    # => level 1 clause
      //    ## => level 2 subclause
      //    ### => level 3 subclause, etc.
      const headingMatch = line.match(/^(#+)\s+(.*)$/);
      if (headingMatch) {
        const levelSymbols = headingMatch[1]; // e.g. "##"
        const headingText = headingMatch[2].trim();
        const level = levelSymbols.length;    // 1 = Clause, 2 = SubClause, ...
        
        // Before starting a new clause/subclause, end the current one
        // unless the new one is at the same or deeper level.
        // But a simpler approach is to do a “pop” until the top of stack is at level-1.
        while (clauseStack.length > 0 &&
               clauseStack[clauseStack.length - 1].type === 'SubClause' &&
               (clauseStack[clauseStack.length - 1].title.split(' ').length <= level)) {
          endCurrentClause();
        }
        
        // Start a new clause or subclause
        startClause(level, headingText);
        continue;
      }
      
      // 5) Otherwise, it's plain text in the current clause/subclause or block
      //    We handle references in the line as well.
      const { replacedLine, references } = extractReferences(line);
      
      if (currentClause) {
        // Append text to the current clause's content
        currentClause.content += (currentClause.content ? '\n' : '') + replacedLine;
        // Also store references
        currentClause.references.push(...references);
      } else {
        // If no clause is open, maybe store it as free text in the block
        // (depends on your design)
        if (!currentBlock.freeText) currentBlock.freeText = '';
        currentBlock.freeText += (currentBlock.freeText ? '\n' : '') + replacedLine;
      }
    }
    
    return ast;
  }
  
  /************************************
   * 4. Converting AST to XML
   ************************************/
  
  function astToXml(ast) {
    // We expect the root to be { type: 'ContractDocument', blocks: [...] }
    if (ast.type !== 'ContractDocument') {
      throw new Error('AST root must be ContractDocument');
    }
    
    let xmlOutput = '<ContractDocument>';
    
    for (const block of ast.blocks) {
      xmlOutput += blockToXml(block);
    }
    
    xmlOutput += '</ContractDocument>';
    return xmlOutput;
  }
  
  function blockToXml(block) {
    // block = { type: 'Block', id: 'something', clauses: [...], definitions: [...] }
    let xml = `<Block id="${block.id}">`;
    
    // Output top-level clauses
    for (const clause of block.clauses) {
      xml += clauseToXml(clause);
    }
    
    // Output top-level definitions
    for (const def of block.definitions) {
      xml += defineToXml(def);
    }
    
    // If there's free text, you might place it in a specialized element 
    // or skip it if not needed.
    if (block.freeText) {
      // For demonstration, we'll just wrap in <FreeText>
      xml += createXmlElement('FreeText', {}, escapeXml(block.freeText));
    }
    
    xml += '</Block>';
    return xml;
  }
  
  function clauseToXml(clause) {
    // clause = { type: 'Clause' or 'SubClause', id, title, content, references, subClauses, definitions }
    const tagName = clause.type === 'Clause' ? 'Clause' : 'SubClause';
    const idAttr = clause.id ? ` id="${clause.id}"` : '';
    
    let xml = `<${tagName}${idAttr}>`;
    
    // Title
    if (clause.title) {
      xml += createXmlElement('Title', {}, escapeXml(clause.title));
    }
    
    // Content (mixed text + references)
    // For simplicity, we output the content in one <p> or directly as text.
    // Then we can insert <Reference> elements for each '%%REF%%' occurrence.
    xml += textWithReferencesToXml(clause.content, clause.references);
    
    // Subclauses
    for (const subc of clause.subClauses) {
      xml += clauseToXml(subc); // recursive
    }
    
    // Definitions
    for (const def of clause.definitions) {
      xml += defineToXml(def);
    }
    
    xml += `</${tagName}>`;
    return xml;
  }
  
  function textWithReferencesToXml(content, references) {
    // We replaced references with '%%REF%%' placeholders. We can re-inject them:
    const parts = content.split('%%REF%%');
    let xml = '';
    
    // We'll place each text chunk in a simple <Text> and each reference in <Reference>.
    for (let i = 0; i < parts.length; i++) {
      const textChunk = parts[i];
      if (textChunk) {
        xml += createXmlElement('Text', {}, escapeXml(textChunk));
      }
      // If we still have a reference to insert
      if (i < references.length) {
        xml += `<Reference target="${escapeXmlAttr(references[i])}"/>`;
      }
    }
    return xml;
  }
  
  function defineToXml(def) {
    // def = { type: 'Define', term, hide, definitionText }
    const attrs = { term: def.term };
    if (def.hide) {
      attrs.hide = 'true';
    }
    // The definition text can go in the mixed content, or a child <Text> node
    return `<Define term="${escapeXmlAttr(def.term)}"${def.hide ? ' hide="true"' : ''}>` +
             escapeXml(def.definitionText) +
           '</Define>';
  }
  
  /************************************
   * 5. Helpers for Escaping XML
   ************************************/
  function escapeXml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  
  function escapeXmlAttr(text) {
    if (!text) return '';
    return escapeXml(text).replace(/"/g, '&quot;');
  }
  
  /************************************
   * Example Usage
   ************************************/
  
  const exampleInput = `
  @begin{GeneralConditions}
  
  # No guarantee of work or exclusivity
  
  The {{Contract Authority}} is not, by executing this {{MICTA}}:
  
  ## bound to issue any {{Order Proposal}} to the {{Supplier}};
  
  ## bound to engage the {{Supplier}} to supply any goods, services and/or other activities or to enter into any {{Contract}}; or
  
  ## restricted in any way from engaging any other person to supply any goods, services and/or other activities:
  
  ### of any type, including goods, services and/or other activities that are the same as or similar to any {{Supplier's Activities}} or {{ICT Activities}}; or
  
  ### at any location where, or in respect of any project that, the {{Supplier}} may be required to supply goods, services and/or other activities.
  
  # No representation
  
  Clause {{noGuaranteeOfWorkOrExclusivity}} applies even though the {{Contract Authority}} may have provided the {{Supplier}} with a forecast or estimate of the goods, services, {{ICT Activities}} and/or other activities that the {{Contract Authority}} or any {{Eligible Customer}} may require at any time. The {{Supplier}} acknowledges that any forecasts or estimates do not constitute a representation of the goods, services and/or other activities the {{Contract Authority}} or any {{Eligible Customer}} may require in any period.
  
  # Definitions and interpretation
  
  ## Definitions
  
  In this MICTA capitalised terms have the same meaning as in the ICTA (unless they are assigned a different meaning below) and the following terms have the meaning assigned to them below:
  
  @define{"Contract Authority"} means the relevant authority or agency executing this agreement.}
  
  @define{"MICTA"} means the master ICT agreement under which this agreement operates.
  
  @define{"Supplier"} means the entity providing goods, services and/or other activities under this agreement.
  
  @define{"Order Proposal"} means a document proposing specific goods, services and/or other activities for approval and execution under this {{MICTA}}.
  
  @define{"Contract"} means any contract formed under or related to this arrangement, including those executed through an {{Order Proposal}}.
  
  @define{"Supplier's Activities"} means the activities the {{Supplier}} undertakes under this agreement, including but not limited to the provision of goods or services.
  
  @define{"ICT Activities"} means any information, communications, and technology-related activities undertaken under this agreement.
  
  @define{"Eligible Customer"} means any customer eligible to place orders under this agreement in accordance with its terms.
  
  @end{GeneralConditions}
  `;
  
  // 1. Parse into AST
  const ast = parseCustomMarkup(exampleInput);
  
  // 2. Convert AST to XML
  const xmlString = astToXml(ast);
  
  // 3. Print or save the XML
  console.log(xmlString);
  
  /**
   * Now, you can validate `xmlString` against your XSD schema 
   * (e.g., using `libxmljs` in Node.js, or an online XML validator).
   */
  