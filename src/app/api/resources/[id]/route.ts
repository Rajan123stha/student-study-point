import { supabase } from "@/lib/supabase";

// Add this function to prevent field-related errors in the API route
export function sanitizeResourceData(data: any) {
  // Create a clean copy of the data without problematic fields
  const { field_id, fields, ...cleanData } = data;
  return cleanData;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const { data, error } = await supabase
      .from("resources")
      .select("*, fields:field_id(id, name)")
      .eq("id", id)
      .single();
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 404,
      });
    }
    
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // CRITICAL FIX: Explicitly remove fields and field_id to prevent 
    // "Could not find the 'fields' column of 'resources'" error
    const { field, field_id, ...cleanData } = body;
    
    console.log(`API route: Updating resource ${id} with clean data:`, cleanData);
    
    const { data, error } = await supabase
      .from("resources")
      .update(cleanData)
      .eq("id", id)
      .select();
    
    if (error) {
      console.error("Error updating resource:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }
    
    return new Response(JSON.stringify(data[0]), { status: 200 });
  } catch (error) {
    console.error("API route error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const { error } = await supabase
      .from("resources")
      .delete()
      .eq("id", id);
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }
    
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}