export interface RadioTrack {
  file: string;
  title: string;
  planet: string;
  composer: string;
  year: string;
  note?: string;
  license: string;
  source?: string;
}

export const FALLBACK_PLAYLIST: RadioTrack[] = [
  {
    file: "01_mars.mp3",
    title: "Mars, the Bringer of War",
    planet: "mars",
    composer: "Gustav Holst",
    year: "1914–16",
    license: "Public domain",
  },
  {
    file: "02_venus.mp3",
    title: "Venus, the Bringer of Peace",
    planet: "venus",
    composer: "Gustav Holst",
    year: "1914–16",
    license: "Public domain",
  },
  {
    file: "03_mercury.mp3",
    title: "Mercury, the Winged Messenger",
    planet: "mercury",
    composer: "Gustav Holst",
    year: "1914–16",
    license: "Public domain",
  },
  {
    file: "04_jupiter.mp3",
    title: "Jupiter, the Bringer of Jollity",
    planet: "jupiter",
    composer: "Gustav Holst",
    year: "1914–16",
    license: "Public domain",
  },
  {
    file: "05_uranus.mp3",
    title: "Uranus, the Magician",
    planet: "uranus",
    composer: "Gustav Holst",
    year: "1914–16",
    license: "Public domain",
  },
];

export const RADIO_BASE = "/assets/audio/";
