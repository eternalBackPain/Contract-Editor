export async function POST(request) {
  try {
    // 1) READ INCOMING REQUEST JSON
    const data = await request.json();
    const { dsl } = data; // "dsl" is a string containing the entire DSL

    // 2) PARSE DSL

    // Split DSL text into lines for parsing
    const lines = dsl.split(/\r?\n/);

    // Initialize JSON structure
    const jsonResult = {
      metadata: {
        title: "",
        version: "",
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        author: "", // Fill in dynamically if provided
      },
      definitions: [],
      clauses: [],
    };

    // 1) Master pattern to grab each block (Definition or Clause) in the order they appear.
    //    - Captures everything from "Define ... }" OR "# ... }"
    const blockRegex =
      /(Define\s+"[^"]+"\s+as\s*{\s*[\s\S]*?\s*})|(#\s+.+?\{\s*[\s\S]*?\s*\})/g;
    // 2) Sub-patterns to extract pieces from each block
    const defineBlockPattern =
      /^Define\s+"([^"]+)"\s+as\s*{\s*([\s\S]*?)\s*}$/m;
    const clauseBlockPattern = /^#\s+(.+?)\s*\{\s*([\s\S]*?)\s*\}$/m;
    // 3) Reference pattern for {{references}}
    const referencePattern = /\{\{([^}]+)\}\}/g;

    const blocks = [...dsl.matchAll(blockRegex)];
    for (let blockMatch of blocks) {
      const blockText = blockMatch[0].trim();

      // A) Definition block
      let defineMatch = blockText.match(defineBlockPattern);
      if (defineMatch) {
        const termName = defineMatch[1].trim();
        const definitionText = defineMatch[2].trim();
        const references = extractReferences(definitionText);

        jsonResult.definitions.push({
          termName: termName,
          definition: definitionText,
          references,
        });
        continue;
      }

      // B) Clause block
      let clauseMatch = blockText.match(clauseBlockPattern);
      if (clauseMatch) {
        const title = clauseMatch[1].trim();
        const clauseBody = clauseMatch[2].trim();
        const autoId = slugify(title);
        const references = extractReferences(clauseBody);

        jsonResult.clauses.push({
          id: autoId,
          title: title,
          content: clauseBody,
          references,
          subclauses: [],
        });
      }
    }

    // Helper to extract references (e.g., {{Reference}})
    function extractReferences(text) {
      const references = [];
      let match;
      while ((match = referencePattern.exec(text)) !== null) {
        references.push(match[1].trim());
      }
      return references;
    }

    //slugify function to generate a simple ID from the clause title
    function slugify(str) {
      return str
        .toLowerCase()
        .replace(/[^\w]+/g, "-") // replace non-alphanumeric with dashes
        .replace(/-+/g, "-") // collapse multiple dashes
        .replace(/^-|-$/g, ""); // remove leading/trailing dashes
    }

    // RETURN DSL JSON RESPONSE
    return new Response(JSON.stringify({ success: true, data: jsonResult }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
