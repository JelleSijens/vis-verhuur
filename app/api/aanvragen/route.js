import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '../../../lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.naam || !body.email || !body.telefoon || !body.startdatum || !body.einddatum) {
      return NextResponse.json({ error: 'Niet alle verplichte velden zijn ingevuld.' }, { status: 400 });
    }
    const supabase = getSupabaseAdminClient();
    if (!supabase) return NextResponse.json({ error: 'Supabase is nog niet gekoppeld.' }, { status: 503 });
    const { error } = await supabase.from('aanvragen').insert({
      naam: body.naam, email: body.email, telefoon: body.telefoon, verblijf: body.verblijf,
      startdatum: body.startdatum, einddatum: body.einddatum, ervaring: body.ervaring,
      opmerkingen: body.opmerkingen, items: body.items, totaal: body.totaal, status: 'Nieuw'
    });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
