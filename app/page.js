'use client';

import { useMemo, useState } from 'react';

const products = [
  { id:'starter', name:'Starter Strandvisset', tag:'Meest gekozen', price:27.50, deposit:50, category:'sets', image:'https://images.unsplash.com/photo-1592919505780-303950717480?auto=format&fit=crop&w=900&q=85', description:'Een complete, gebruiksklare set voor een ontspannen eerste visdag vanaf het strand.', includes:['4,20 m strandhengel','Zeemolen met lijn','Strandsteun','Onderlijn en lood'] },
  { id:'duo', name:'Duo Strandvispakket', tag:'Voordelig samen', price:49.50, deposit:90, category:'sets', image:'https://images.unsplash.com/photo-1498623116890-37e912163d5d?auto=format&fit=crop&w=900&q=85', description:'Twee volledige sets voor vrienden, stellen of ouder en kind.', includes:['2 complete strandvissets','2 strandsteunen','Basis kleinmateriaal','Persoonlijke uitleg'] },
  { id:'family', name:'Familie Visavontuur', tag:'Voor 3 personen', price:72.50, deposit:125, category:'sets', image:'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=85', description:'Alles wat je nodig hebt voor een gezamenlijke middag vissen aan zee.', includes:['3 complete vissets','Ruime viskar','Emmers en kleinmateriaal','Startuitleg voor beginners'] },
  { id:'premium', name:'Premium Zeevisset', tag:'Voor gevorderden', price:34.50, deposit:75, category:'sets', image:'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=85', description:'Een krachtigere set voor wie gericht op platvis, zeebaars of gul wil vissen.', includes:['Premium strandhengel','Robuuste zeemolen','Gevlochten hoofdlijn','Zwaardere strandsteun'] },
  { id:'cart', name:'Strandkar', tag:'Handige extra', price:12.50, deposit:30, category:'extras', image:'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=85', description:'Vervoer hengels, stoelen, emmers en aas eenvoudig over het strand.', includes:['Brede strandwielen','Ruimte voor meerdere sets','Inklapbaar frame','Maximaal 40 kg'] },
  { id:'waders', name:'Waadpak', tag:'Diverse maten', price:17.50, deposit:40, category:'extras', image:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85', description:'Blijf droog bij het inzetten van de lijn of vissen langs de waterlijn.', includes:['Maten 40 t/m 47','Verstelbare bretels','Stevige laarzen','Na gebruik gereinigd'] },
];

const formatMoney = value => new Intl.NumberFormat('nl-NL',{style:'currency',currency:'EUR'}).format(value);

export default function HomePage(){
  const [selected,setSelected]=useState({starter:1});
  const [category,setCategory]=useState('all');
  const [status,setStatus]=useState('');
  const [booking,setBooking]=useState({startdatum:'',einddatum:'',verblijf:''});
  const selectedItems=useMemo(()=>products.filter(p=>(selected[p.id]||0)>0),[selected]);
  const dailyTotal=useMemo(()=>products.reduce((sum,p)=>sum+(selected[p.id]||0)*p.price,0),[selected]);
  const depositTotal=useMemo(()=>products.reduce((sum,p)=>sum+(selected[p.id]||0)*p.deposit,0),[selected]);
  const filtered=products.filter(p=>category==='all'||p.category===category);
  const changeQty=(id,delta)=>setSelected(prev=>({...prev,[id]:Math.max(0,(prev[id]||0)+delta)}));

  async function submitForm(event){
    event.preventDefault(); setStatus('Je aanvraag wordt verstuurd…');
    const form=new FormData(event.currentTarget);
    if(!selectedItems.length){setStatus('Kies eerst minimaal één huurartikel.');return;}
    const payload={naam:form.get('naam'),email:form.get('email'),telefoon:form.get('telefoon'),verblijf:form.get('verblijf'),startdatum:form.get('startdatum'),einddatum:form.get('einddatum'),ervaring:form.get('ervaring'),opmerkingen:form.get('opmerkingen'),items:selectedItems.map(p=>({id:p.id,naam:p.name,aantal:selected[p.id],prijs:p.price})),totaal:dailyTotal,borg:depositTotal};
    try{
      const response=await fetch('/api/aanvragen',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(!response.ok) throw new Error();
      setStatus('Bedankt! Je aanvraag is ontvangen. We bevestigen de beschikbaarheid zo snel mogelijk.'); event.currentTarget.reset();
    }catch{
      const saved=JSON.parse(localStorage.getItem('strandvis-aanvragen')||'[]');
      saved.unshift({...payload,id:crypto.randomUUID(),status:'Nieuw',created_at:new Date().toISOString()});
      localStorage.setItem('strandvis-aanvragen',JSON.stringify(saved));
      setStatus('Bedankt! Je demo-aanvraag is opgeslagen en zichtbaar in het admin-dashboard.');
    }
  }

  return <main>
    <header className="topbar"><span>Lokale verhuur op Ameland</span><span>Persoonlijke uitleg door Joran Kuiper</span><a href="tel:+31652629982">Bel of WhatsApp: +31 6 52629982</a></header>
    <header className="nav"><a className="brand logo-brand" href="#top"><img src="/logo-strandvis.svg" alt="Strandvis Verhuur Ameland"/></a><nav><a href="#aanbod">Verhuuraanbod</a><a href="#pakketten">Waarom huren</a><a href="#uitleg">Strandvissen</a><a href="#contact">Contact</a></nav><a className="button small primary" href="#aanvragen">Aanvraag doen</a></header>

    <section className="hero" id="top"><div className="hero-content"><span className="eyebrow light">VISSEN OP HET AMELANDER STRAND</span><h1>Jouw visavontuur begint aan zee.</h1><p>Professionele strandvisspullen huren zonder alles zelf mee te nemen. Complete sets, praktische uitleg en lokaal ophalen op Ameland.</p><div className="hero-actions"><a className="button primary" href="#aanbod">Bekijk het aanbod <span>→</span></a><a className="button glass" href="#aanvragen">Direct aanvragen</a></div><div className="hero-trust"><div><strong>4,8/5</strong><span>waardering</span></div><div><strong>100%</strong><span>gebruiksklaar</span></div><div><strong>7 dagen</strong><span>per week mogelijk</span></div></div></div><div className="hero-card"><span className="live-dot">Beschikbaar op aanvraag</span><h3>Complete strandvisset</h3><p>Vanaf</p><strong>{formatMoney(27.5)}<small> per dag</small></strong><ul><li>Hengel & molen</li><li>Steun, lood en onderlijn</li><li>Korte persoonlijke uitleg</li></ul><a href="#aanvragen">Reserveer jouw set →</a></div></section>

    <section className="usp-strip"><div><b>✓</b><span><strong>Direct gebruiksklaar</strong><small>Geen eigen materiaal nodig</small></span></div><div><b>✓</b><span><strong>Voor elk niveau</strong><small>Van beginner tot ervaren visser</small></span></div><div><b>✓</b><span><strong>Lokaal op Ameland</strong><small>Ophalen in overleg</small></span></div><div><b>✓</b><span><strong>Persoonlijk advies</strong><small>Tips over materiaal en stekken</small></span></div></section>

    <section className="section sand" id="aanbod"><div className="section-heading"><div><span className="eyebrow">ONS VERHUURAANBOD</span><h2>Kies de set die bij jouw visdag past</h2></div><p>Alle sets worden schoon, gecontroleerd en compleet uitgegeven. Prijzen zijn per dag en exclusief eventueel aas.</p></div><div className="filter-tabs"><button className={category==='all'?'active':''} onClick={()=>setCategory('all')}>Alles</button><button className={category==='sets'?'active':''} onClick={()=>setCategory('sets')}>Complete sets</button><button className={category==='extras'?'active':''} onClick={()=>setCategory('extras')}>Extra materiaal</button></div><div className="cards">{filtered.map(product=><article className="card" key={product.id}><div className="product-image" style={{backgroundImage:`linear-gradient(180deg,transparent 45%,rgba(8,27,34,.82)),url(${product.image})`}}><span>{product.tag}</span><strong>{product.name}</strong></div><div className="card-body"><p>{product.description}</p><ul>{product.includes.map(item=><li key={item}>{item}</li>)}</ul><div className="card-footer"><div><strong>{formatMoney(product.price)}</strong><small> per dag</small></div><div className="qty"><button aria-label="Minder" onClick={()=>changeQty(product.id,-1)}>−</button><span>{selected[product.id]||0}</span><button aria-label="Meer" onClick={()=>changeQty(product.id,1)}>+</button></div></div></div></article>)}</div></section>

    <section className="section split" id="pakketten"><div className="photo-panel"><div className="photo-badge"><strong>Geen gedoe.</strong><span>Alleen vissen.</span></div></div><div className="split-copy"><span className="eyebrow">SLIM HUREN OP VAKANTIE</span><h2>Laat de volle auto thuis</h2><p>Strandhengels zijn lang, molens kwetsbaar en alle losse onderdelen nemen veel ruimte in. Met een huurset staat alles op Ameland voor je klaar.</p><div className="check-list"><div><b>01</b><span><strong>Complete en gecontroleerde sets</strong><small>Alles wordt na iedere verhuur nagekeken.</small></span></div><div><b>02</b><span><strong>Uitleg zonder ingewikkeld vakjargon</strong><small>Ook als je nog nooit vanaf het strand hebt gevist.</small></span></div><div><b>03</b><span><strong>Flexibel ophalen en retourneren</strong><small>We stemmen de tijden persoonlijk met je af.</small></span></div></div><a className="text-link" href="#aanvragen">Plan jouw visdag →</a></div></section>

    <section className="section dark-section" id="uitleg"><div className="section-heading"><div><span className="eyebrow light">STRANDVISSEN OP AMELAND</span><h2>Een unieke manier om het eiland te beleven</h2></div><p>Met kilometers strand, stromend water en wisselende getijden is iedere visdag anders. We helpen je op weg met materiaal dat past bij de omstandigheden.</p></div><div className="info-grid"><article><span>🌊</span><h3>Getij & omstandigheden</h3><p>Het juiste moment hangt af van wind, stroming en getij. Vraag bij je reservering gerust om praktisch advies.</p></article><article><span>🐟</span><h3>Wat kun je vangen?</h3><p>Afhankelijk van het seizoen kun je onder andere schar, bot, wijting en zeebaars tegenkomen.</p></article><article><span>🧭</span><h3>Geschikte strandzones</h3><p>We geven algemene tips over bereikbare zones, rekening houdend met natuur, veiligheid en lokale regels.</p></article></div></section>

    <section className="section request" id="aanvragen">
      <div className="request-intro">
        <span className="eyebrow light">VRIJBLIJVENDE HUURAANVRAAG</span>
        <h2>Reserveer jouw materiaal</h2>
        <p>Kies je materiaal, vul je gegevens in en controleer rechts de samenvatting. Joran neemt daarna persoonlijk contact met je op om de beschikbaarheid en ophaaltijd te bevestigen.</p>
        <div className="request-steps"><span><b>1</b> Kies materiaal</span><span><b>2</b> Vul gegevens in</span><span><b>3</b> Verstuur aanvraag</span></div>
      </div>
      <div className="booking-layout">
        <form className="form booking-form" onSubmit={submitForm}>
          <div className="form-title"><span>Jouw gegevens</span><small>Velden met * zijn verplicht</small></div>
          <div className="grid2"><label>Naam *<input name="naam" required placeholder="Voor- en achternaam"/></label><label>Telefoonnummer *<input name="telefoon" required placeholder="+31 6 12345678"/></label></div>
          <div className="grid2"><label>E-mailadres *<input name="email" type="email" required placeholder="naam@email.nl"/></label><label>Verblijfsadres op Ameland<input name="verblijf" value={booking.verblijf} onChange={e=>setBooking({...booking,verblijf:e.target.value})} placeholder="Vakantiepark, hotel of adres"/></label></div>
          <div className="form-section-title">Huurperiode</div>
          <div className="grid2"><label>Ophaaldatum *<input name="startdatum" type="date" required value={booking.startdatum} onChange={e=>setBooking({...booking,startdatum:e.target.value})}/></label><label>Retourdatum *<input name="einddatum" type="date" required value={booking.einddatum} onChange={e=>setBooking({...booking,einddatum:e.target.value})}/></label></div>
          <div className="grid2"><label>Ervaringsniveau<select name="ervaring"><option>Beginner / eerste keer</option><option>Enige ervaring</option><option>Ervaren zeevisser</option></select></label><label>Gewenste ophaaltijd<input name="ophaaltijd" type="time"/></label></div>
          <label>Vragen of bijzonderheden<textarea name="opmerkingen" rows="4" placeholder="Denk aan maten, aantal personen, aas of gewenste uitleg"></textarea></label>
          <label className="consent"><input type="checkbox" required/> <span>Ik begrijp dat dit een aanvraag is en dat de reservering pas definitief is na bevestiging.</span></label>
          <button className="button primary wide" type="submit">Verstuur huuraanvraag <span>→</span></button>{status&&<p className="status">{status}</p>}
        </form>
        <aside className="booking-summary">
          <div className="summary-head"><div><span>Jouw reservering</span><small>Controleer je selectie</small></div><a href="#aanbod">Wijzig</a></div>
          <div className="summary-items">{selectedItems.length?selectedItems.map(p=><div className="summary-item" key={p.id}><div><strong>{p.name}</strong><small>{selected[p.id]} × {formatMoney(p.price)} per dag</small></div><strong>{formatMoney((selected[p.id]||0)*p.price)}</strong></div>):<div className="summary-empty">Kies hierboven minimaal één huurartikel.</div>}</div>
          <div className="summary-details"><span><small>Ophaaldatum</small><strong>{booking.startdatum||'Nog kiezen'}</strong></span><span><small>Retourdatum</small><strong>{booking.einddatum||'Nog kiezen'}</strong></span><span><small>Verblijfsadres</small><strong>{booking.verblijf||'Niet ingevuld'}</strong></span></div>
          <div className="summary-total"><span><small>Huurprijs</small><strong>{formatMoney(dailyTotal)} <em>per dag</em></strong></span><span><small>Indicatieve borg</small><strong>{formatMoney(depositTotal)}</strong></span></div>
          <p className="summary-note">De definitieve prijs hangt af van het aantal huurdagen. De borg wordt bij correcte en complete retour terugbetaald.</p>
          <div className="summary-contact"><span>Contactpersoon</span><strong>Joran Kuiper</strong><a href="tel:+31652629982">+31 6 52629982</a></div>
        </aside>
      </div>
    </section>

    <section className="section faq"><div><span className="eyebrow">VEELGESTELDE VRAGEN</span><h2>Goed om te weten</h2><p>Staat je vraag er niet tussen? Neem gerust contact op.</p></div><div className="faq-list"><details open><summary>Is de huur direct definitief?</summary><p>Nee. Na je aanvraag controleren we de beschikbaarheid en ontvang je persoonlijk een bevestiging.</p></details><details><summary>Is visaas inbegrepen?</summary><p>Aas is standaard niet inbegrepen. Vermeld bij je aanvraag dat je hier hulp bij wilt, dan bespreken we de mogelijkheden.</p></details><details><summary>Kan ik huren zonder ervaring?</summary><p>Ja. De starter- en familiepakketten zijn juist samengesteld voor beginners en worden met een korte uitleg uitgegeven.</p></details><details><summary>Hoe werkt de borg?</summary><p>De borg wordt vooraf of bij het ophalen voldaan en na complete, schone en onbeschadigde retour terugbetaald.</p></details></div></section>

    <section className="section contact" id="contact"><div><span className="eyebrow light">CONTACT & OPHALEN</span><h2>We helpen je graag aan de juiste set</h2><p>Voor vragen, groepsaanvragen of meerdaagse verhuur kun je bellen, WhatsAppen of mailen. De exacte ophaallocatie wordt bij de bevestiging doorgegeven.</p><div className="contact-actions"><a href="tel:+31652629982">+31 6 52629982</a><a href="mailto:info@strandvisverhuurameland.nl">info@strandvisverhuurameland.nl</a></div></div><div className="contact-card"><span>Contactpersoon</span><strong>Joran Kuiper</strong><p><a href="tel:+31652629982">+31 6 52629982</a></p><hr/><span>Ophaalpunt</span><strong>Nes, Ameland</strong><p>Exacte locatie na bevestiging</p><hr/><span>Bereikbaarheid</span><strong>Dagelijks op afspraak</strong><p>Ook vroege ophaal mogelijk in overleg</p></div></section>

    <footer><div className="footer-main"><a className="brand inverted logo-brand footer-logo" href="#top"><img src="/logo-strandvis.svg" alt="Strandvis Verhuur Ameland"/></a><p>Complete strandvissets en praktische extra's voor een zorgeloze visdag op Ameland.</p></div><div><strong>Navigatie</strong><a href="#aanbod">Verhuuraanbod</a><a href="#aanvragen">Huuraanvraag</a><a href="#contact">Contact</a></div><div><strong>Contact</strong><a href="tel:+31652629982">+31 6 52629982</a><a href="mailto:info@strandvisverhuurameland.nl">E-mail versturen</a><a href="/admin">Admin dashboard</a></div><div className="footer-bottom">© 2026 Strandvis Verhuur Ameland · Huurvoorwaarden · Privacy</div></footer>
  </main>
}
