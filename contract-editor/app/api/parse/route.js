export async function POST(request) {
  try {
    // 1) Read the incoming request JSON
    const data = await request.json();
    const { dsl } = data; // "dsl" is a string containing the entire DSL

    // 2) Parse the DSL - TODO

    // Return a JSON response with the parsed DSL
    return new Response(JSON.stringify({ success: true, parsedDSL: dsl }), {
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
