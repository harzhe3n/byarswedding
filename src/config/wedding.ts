/**
 * Everything specific to the wedding lives in this file.
 * Change names, date, time or the venue location here — nothing else needs editing.
 */
export const wedding = {
  groom: 'بیار',
  bride: 'لەنیا',

  /** Exact start time, used by the countdown. Kurdistan time is UTC+3. */
  startsAt: '2026-11-20T14:00:00+03:00',

  /** Text exactly as printed on the invitation card. */
  dayName: 'هەینی',
  dateText: '20/11/2026',
  /** The number drawn inside the small calendar icon. */
  dateDay: '20',
  timeText: '٢ پاش نیوەڕۆ',

  venue: {
    name: 'ماڵی بووکە خان',
    /** Optional address line shown under the venue name in the location section. */
    address: '',

    /**
     * Venue coordinates (from the Google Maps link below), used for the embedded map.
     * In Google Maps, right-click a spot and click the numbers to copy new ones.
     */
    lat: 35.3475716,
    lng: 45.8738429,

    /**
     * Google Maps share link of the venue. The "شوێن لەسەر نەخشە" button opens it.
     * Leave empty to open directions to the coordinates above instead.
     */
    mapsLink: 'https://maps.app.goo.gl/if4h8ov4HtErnVQn9?g_st=it',
  },
} as const

export const mapsDirectionsUrl =
  wedding.venue.mapsLink ||
  `https://www.google.com/maps/dir/?api=1&destination=${wedding.venue.lat},${wedding.venue.lng}`

export const mapsEmbedUrl = `https://maps.google.com/maps?q=${wedding.venue.lat},${wedding.venue.lng}&z=16&output=embed`
