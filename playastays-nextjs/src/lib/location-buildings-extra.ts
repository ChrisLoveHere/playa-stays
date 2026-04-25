/**
 * Extra buildings / developments — merged into BUILDINGS in location-data.ts.
 * Shape matches BuildingDef (structural). Keep values unique across full BUILDINGS list.
 */
export const BUILDINGS_EXTRA: Array<{
  value: string
  label: string
  city: string
  neighborhood?: string
}> = [
  // ── Playa del Carmen — city-wide (multi-zone / resort corridor) ──
  { value: 'senses-riviera', label: 'Senses Riviera Maya (by Artisan)', city: 'playa-del-carmen' },
  { value: 'paradisus-playa', label: 'Paradisus / Meliá corridor', city: 'playa-del-carmen' },
  { value: 'iberostar-paraiso', label: 'Iberostar Paraíso complex', city: 'playa-del-carmen' },
  { value: 'barcelo-maya', label: 'Barceló Maya Grand Resort area', city: 'playa-del-carmen' },
  { value: 'valentin-imperial', label: 'Valentin Imperial Maya area', city: 'playa-del-carmen' },
  { value: 'grand-palladium-riviera', label: 'Grand Palladium Riviera Maya', city: 'playa-del-carmen' },
  { value: 'ocean-riviera-paradise', label: 'Ocean Riviera Paradise', city: 'playa-del-carmen' },

  // ── Playa del Carmen — Centro / Quinta / Calle 38 ──
  { value: 'one-paralia', label: 'One Paralia', city: 'playa-del-carmen', neighborhood: 'centro' },
  { value: 'habitat-condos', label: 'Habitat Condo Hotel', city: 'playa-del-carmen', neighborhood: 'centro' },
  { value: 'bristol-tower', label: 'The Bristol Tower', city: 'playa-del-carmen', neighborhood: 'centro' },
  { value: 'soul-beach', label: 'Soul Beach / Playa 52 area', city: 'playa-del-carmen', neighborhood: 'playa-mamitas' },
  { value: 'mareazul-pdc', label: 'Mareazul Playa del Carmen', city: 'playa-del-carmen', neighborhood: 'playa-mamitas' },
  { value: 'mareazul-grand', label: 'Mareazul Grand', city: 'playa-del-carmen', neighborhood: 'playa-mamitas' },
  { value: 'the-palm-pdc', label: 'The Palm at Playa', city: 'playa-del-carmen', neighborhood: 'quinta-avenida' },
  { value: 'el-taj-oceanfront', label: 'El Taj Oceanfront / Indigo Beach', city: 'playa-del-carmen', neighborhood: 'quinta-avenida' },
  { value: 'playa-411', label: 'Playa 411', city: 'playa-del-carmen', neighborhood: 'calle-38' },
  { value: '38th-street-condos', label: '38th Street Condos', city: 'playa-del-carmen', neighborhood: 'calle-38' },
  { value: 'papillon-pdc', label: 'Papillon', city: 'playa-del-carmen', neighborhood: 'calle-38' },
  { value: 'klem-38', label: 'KLEM Residences (38)', city: 'playa-del-carmen', neighborhood: 'calle-38' },

  // ── Playa del Carmen — Gonzalo Guerrero / Zazil-Ha ──
  { value: 'double-gg', label: 'Double G', city: 'playa-del-carmen', neighborhood: 'gonzalo-guerrero' },
  { value: 'estrellas-pdc', label: 'Las Estrellas', city: 'playa-del-carmen', neighborhood: 'gonzalo-guerrero' },
  { value: 'turquesa-tower', label: 'Torre Turquesa', city: 'playa-del-carmen', neighborhood: 'zazil-ha' },
  { value: 'sakab-condos', label: 'Sakab condos', city: 'playa-del-carmen', neighborhood: 'zazil-ha' },

  // ── Playa del Carmen — Playacar ──
  { value: 'playa-rose', label: 'Playa Rose', city: 'playa-del-carmen', neighborhood: 'playacar' },
  { value: 'playacar-palace', label: 'Playacar Palace area', city: 'playa-del-carmen', neighborhood: 'playacar-fase-1' },
  { value: 'royal-hideaway-f2', label: 'Royal Hideaway (Fase 2)', city: 'playa-del-carmen', neighborhood: 'playacar-fase-2' },
  { value: 'villa-arqueologica', label: 'Villas near ruin / Fase 1', city: 'playa-del-carmen', neighborhood: 'playacar-fase-1' },

  // ── Playa del Carmen — Colosio / Mision / Ejidal ──
  { value: 'sian-kanan', label: 'Sian Kaan Villages', city: 'playa-del-carmen', neighborhood: 'colosio' },
  { value: 'sian-tulum-pdc', label: 'Sian Kaan (Colosio) condos', city: 'playa-del-carmen', neighborhood: 'colosio' },
  { value: 'savia-residences', label: 'Savia Residences', city: 'playa-del-carmen', neighborhood: 'mision-del-carmen' },
  { value: 'quadra-tower', label: 'Quadra Alea / Alea Tower', city: 'playa-del-carmen', neighborhood: 'ejidal' },

  // ── Playa del Carmen — Corasol / Grand Coral / Punta Estrella ──
  { value: 'corasol-golf-residences', label: 'Corasol Golf & Residences', city: 'playa-del-carmen', neighborhood: 'corasol' },
  { value: 'soho-corasol', label: 'Soho Corasol', city: 'playa-del-carmen', neighborhood: 'corasol' },
  { value: 'mareazul-grand-coral', label: 'Mareazul at Grand Coral', city: 'playa-del-carmen', neighborhood: 'grand-coral' },
  { value: 'mareazul-punta', label: 'Mareazul Punta Estrella', city: 'playa-del-carmen', neighborhood: 'punta-estrella' },

  // ── Playa del Carmen — Mayakoba ──
  { value: 'andaz-mayakoba', label: 'Andaz Mayakoba', city: 'playa-del-carmen', neighborhood: 'mayakoba' },
  { value: 'riviera-maya-mb', label: 'Riviera Maya Residences (Mayakoba)', city: 'playa-del-carmen', neighborhood: 'mayakoba' },

  // ── Playa del Carmen — Xcalacoco / Nicte-Ha / Loltun ──
  { value: 'ocean-22', label: 'Ocean Twenty-Two', city: 'playa-del-carmen', neighborhood: 'xcalacoco' },
  { value: 'tranquility-condos', label: 'Tranquility', city: 'playa-del-carmen', neighborhood: 'xcalacoco' },
  { value: 'mareazul-nicte', label: 'Mareazul Nicte-Ha', city: 'playa-del-carmen', neighborhood: 'nicte-ha' },
  { value: 'mareazul-loltun', label: 'Mareazul Loltún', city: 'playa-del-carmen', neighborhood: 'loltun' },

  // ── Playa del Carmen — La Veleta PDC / Bosque Real / Bali ──
  { value: 'marena-pdc', label: 'Marena (Playa del Carmen)', city: 'playa-del-carmen', neighborhood: 'la-veleta-pdc' },
  { value: 'elements-26', label: 'Elements 26', city: 'playa-del-carmen', neighborhood: 'la-veleta-pdc' },
  { value: 'bambu-426', label: 'Bambú 426', city: 'playa-del-carmen', neighborhood: 'la-veleta-pdc' },
  { value: 'bujama-tower', label: 'Torre Bujama', city: 'playa-del-carmen', neighborhood: 'bosque-real' },
  { value: 'bali-tower', label: 'Torres Bali', city: 'playa-del-carmen', neighborhood: 'bali' },

  // ── Playa del Carmen — Real Ibiza / El Cielo / Selvamar ──
  { value: 'mareazul-real-ibiza', label: 'Mareazul Real Ibiza', city: 'playa-del-carmen', neighborhood: 'real-ibiza' },
  { value: 'mareazul-el-cielo', label: 'Mareazul El Cielo', city: 'playa-del-carmen', neighborhood: 'el-cielo' },

  // ── Tulum — Aldea Zamá ──
  { value: 'central-park-tulum', label: 'Central Park Lagunas', city: 'tulum', neighborhood: 'aldea-zama' },
  { value: 'soko-tulum', label: 'Soko', city: 'tulum', neighborhood: 'aldea-zama' },
  { value: 'nosara-tulum', label: 'Nosara Tulum', city: 'tulum', neighborhood: 'aldea-zama' },
  { value: 'naab-tulum', label: 'NAAB Tulum', city: 'tulum', neighborhood: 'aldea-zama' },
  { value: 'copal-tulum', label: 'Copal Tulum', city: 'tulum', neighborhood: 'aldea-zama' },
  { value: 'mistiq-tulum', label: 'Mistiq Premium', city: 'tulum', neighborhood: 'aldea-zama' },
  { value: 'saan-tulum', label: 'Saán', city: 'tulum', neighborhood: 'aldea-zama' },
  { value: 'watal-tulum', label: 'Watal', city: 'tulum', neighborhood: 'aldea-zama' },
  { value: 'prana-tulum', label: 'Prana Condos', city: 'tulum', neighborhood: 'aldea-zama' },

  // ── Tulum — La Veleta ──
  { value: 'kalamba-tulum', label: 'Kalamba', city: 'tulum', neighborhood: 'la-veleta' },
  { value: 'tuk-tulum', label: 'Tuk Tulum', city: 'tulum', neighborhood: 'la-veleta' },
  { value: 'verdant-tulum', label: 'Verdant', city: 'tulum', neighborhood: 'la-veleta' },
  { value: 'orio-tulum', label: 'Orio', city: 'tulum', neighborhood: 'la-veleta' },
  { value: 'saskab-tulum', label: 'Saskab', city: 'tulum', neighborhood: 'la-veleta' },

  // ── Tulum — Centro / Region 15 ──
  { value: 'urbe-tulum', label: 'URBE Tulum', city: 'tulum', neighborhood: 'tulum-centro' },
  { value: 'tribu-tulum', label: 'Tribu', city: 'tulum', neighborhood: 'region-15' },
  { value: 'banus-tulum', label: 'Banús 15', city: 'tulum', neighborhood: 'region-15' },

  // ── Tulum — Hotel zone / Tankah (city-wide where ambiguous) ──
  { value: 'ahau-tulum', label: 'Ahau Tulum / beach cabañas', city: 'tulum' },
  { value: 'be-tulum-hotel', label: 'Be Tulum', city: 'tulum', neighborhood: 'tulum-hotel-zone' },
  { value: 'nest-tulum', label: 'NEST Tulum', city: 'tulum', neighborhood: 'tulum-hotel-zone' },
  { value: 'casa-malca-area', label: 'Casa Malca / La Valise corridor', city: 'tulum', neighborhood: 'tulum-hotel-zone' },
  { value: 'dreams-tulum-res', label: 'Dreams Tulum residences', city: 'tulum', neighborhood: 'tankah' },

  // ── Puerto Morelos ──
  { value: 'mareas-pm', label: 'Mareas', city: 'puerto-morelos', neighborhood: 'puerto-morelos-centro' },
  { value: 'arenis-pm', label: 'Arenis', city: 'puerto-morelos', neighborhood: 'puerto-morelos-centro' },
  { value: 'fishermens-village', label: "Fisherman's Village", city: 'puerto-morelos', neighborhood: 'puerto-morelos-centro' },
  { value: 'grand-residences-pm', label: 'Grand Residences Riviera Cancún', city: 'puerto-morelos', neighborhood: 'puerto-morelos-beach' },
  { value: 'vidanta-grand-mayan-pm', label: 'Vidanta Grand Mayan (PM corridor)', city: 'puerto-morelos', neighborhood: 'puerto-morelos-beach' },

  // ── Akumal ──
  { value: 'gran-tortuga-akumal', label: 'Gran Tortuga', city: 'akumal', neighborhood: 'half-moon-bay' },
  { value: 'tortuga-ii-half-moon', label: 'Tortuga II / III', city: 'akumal', neighborhood: 'half-moon-bay' },
  { value: 'la-lunita-akumal', label: 'La Lunita', city: 'akumal', neighborhood: 'akumal-bay' },
  { value: 'puerta-del-sol-akumal', label: 'Puerta del Sol Akumal', city: 'akumal', neighborhood: 'jade-bay' },

  // ── Cozumel ──
  { value: 'sunset-beach-coz', label: 'Sunset Beach', city: 'cozumel', neighborhood: 'zona-hotelera-norte' },
  { value: 'el-cid-coz', label: 'El Cozumeleño / El Cid', city: 'cozumel', neighborhood: 'zona-hotelera-norte' },
  { value: 'melia-cozumel-zone', label: 'Meliá Cozumel area', city: 'cozumel', neighborhood: 'zona-hotelera-norte' },
  { value: 'puerta-de-la-guerra', label: 'Puerta de la Guerra', city: 'cozumel', neighborhood: 'cozumel-centro' },

  // ── Isla Mujeres ──
  { value: 'mia-reef-isla', label: 'Mía Reef / Isla Mujeres Palace', city: 'isla-mujeres', neighborhood: 'playa-norte' },
  { value: 'iatsu-isla', label: 'Iatsu', city: 'isla-mujeres', neighborhood: 'isla-centro' },
  { value: 'zib-ha-isla', label: 'Zib-Há', city: 'isla-mujeres', neighborhood: 'salina-chica' },

  // ── Xpu-Ha ──
  { value: 'serenity-camp-xpu', label: 'Serenity Camp / beach clubs', city: 'xpu-ha', neighborhood: 'xpu-ha-beach' },
  { value: 'le-reef-xpu', label: 'Le Reef / Xpu-Ha beach homes', city: 'xpu-ha', neighborhood: 'xpu-ha-beach' },
  { value: 'chemuyil-xpu', label: 'Chemuyil access homes', city: 'xpu-ha', neighborhood: 'xpu-ha-inland' },
]
