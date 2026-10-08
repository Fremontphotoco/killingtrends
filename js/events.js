// ---------------------------------------------------------------------------
// KILLING TRENDS — EVENTS. Edit ONLY this file to change what's on sale.
// The homepage "current transmissions" section shows the FIRST event here;
// the Transmissions page (/tickets/) lists all of them.
//
// Fields:
//   title      event name
//   date       e.g. 'FRI OCT 23 — 9PM–2AM'
//   venue      where
//   desc       one-line description
//   img        flyer file name inside /assets/ (just the name, no path)
//   poshSlug   last part of the Posh event URL (posh.vip/e/<slug>)
//   embed      true = inline Posh checkout on /tickets/; false = button to posh.vip
//   soldOut    true when sold out
//   page       optional extra link shown on the homepage, e.g. 'afterdark/'
// ---------------------------------------------------------------------------
window.KT_EVENTS = [
  {
    title: 'Afterdark in the Art Park',
    date: 'FRI OCT 23 — 9PM–2AM',
    venue: 'SECRET DOWNTOWN LAS VEGAS ART PARK — LOCATION REVEALED DAY OF SHOW',
    desc: 'Lee Reynolds, Brett Rubin & Wizdumb. BYOB. Limited capacity — 100 tickets.',
    img: 'event-afterdark-red.jpg',
    poshSlug: 'after-dark-in-the-art-park-with-lee-reynolds',
    embed: true,
    soldOut: false,
    page: 'afterdark/'
  }
];
