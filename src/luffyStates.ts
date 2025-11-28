export type LuffyStateType = 'poem' | 'tech' | 'projects' | 'random'

export interface LuffyState {
  id: string
  type: LuffyStateType
  title: string
  description?: string
  projects?: { label: string; url: string }[]
  links?: { label: string; url: string }[]
}

export const luffyStates: LuffyState[] = [
  {
    id: 'poem-intro',
    type: 'poem',
    title: 'I am Tulamia D. Luffy.',
    description:
      "Heya! I’m Luffy! Nice to meet ya—let’s be friends right now! 😄 This website? It’s like my ship: full of adventures, surprises, and dreams—hop on and explore with me, ’cause I’m the guy who’ll be the Pirate King, and this place is where we start our journey together! 🌊",
  },
  {
    id: 'tech-stack',
    type: 'tech',
    title:
      "Yohoho! I’m Luffy, captain of this crazy pirate crew AND this website!",
    description:
      "Yohoho! I’m Luffy, captain of this crazy pirate crew AND this website! 😆\nHere’s how my team sails the tech seas—’cause building this place is just like heading to the Grand Line!\n\n🛳 🟧 TYPO3 – Thousand Sunny\nThat’s our ship! Strong, flexible, always ready for adventure. Built to sail any storm!\n🐶 React – Chopper\nFast, bouncy, transforming all the time to heal bugs and keep things cute and dynamic!\n🧠 Gemini 1.0 – Usopp\nAlways imagining things… sometimes drifts into hallucinations—but hey, creativity is important! 🎨\n💪 Apache – Franky\nSuper sturdy engine room! Powers everything underneath—NEE-SUPER! 🔧\n🍖 PHP – Sanji\nCooking up backend logic with precision, serving delicious code straight to your browser!\n🗺 Documentation – Zoro\nTries to help you find the way… but sometimes still gets lost in folders 🤣. Still, essential for navigation!\n⛏ Composer – Robin\nQuietly builds dependencies and connects everything from the shadows—scholarly and super efficient.\n🎇 Grunt – Brook\nVery old but still alive somehow! Goes “Yohohoho!” every time it runs a task. 🎻💀\n🔥 Vite – Ace (spirit of fire)\nFast, blazing hot development! Lights up your workflow in seconds!\n⚙ Webpack – Jinbe\nReliable, strong, and manages heavy stuff in production—stable like the sea itself!\n🔀 Git – Law (honorary crew)\nCuts through versions like ROOM! Keeps everything under control during rough deployments.\n🐟 MySQL – Fishman Island\nDeep database power below sea-level, storing all the treasure securely!\n🫧 Docker – Bubble Coating\nKeeps our ship safe while we dive into any environment—just wrap it and go underwater! 🌊\n📡 Server & Networking – Nami\nPredicts traffic storms, optimizes routes, keeps everything running smooth and profitable 💰⚡\n⌚ CI/CD – Jinbe + Franky tag team\nStrong and steady automated releases that keep us cruising forward!\n\nSo yeah! This website’s built by MY CREW—the strongest in both seas AND dev world!\nJoin us, let’s create, break limits, and sail toward the future—\n’CAUSE I’M MONKEY D. LUFFY, THE MAN WHO’LL BE THE PIRATE KING… AND THIS IS THE TECH SHIP THAT’LL TAKE US THERE! 🏴‍☠️🔥💻🌊\nLet’s set sail! 🚀",
  },
  {
    id: 'projects',
    type: 'projects',
    title: 'Treasure Map of Projects',
    projects: [
      { label: 'Food Shop Demo', url: 'https://github.com/tulamia311/food-shop' },
      { label: 'Landing Page Demo', url: 'https://github.com/tulamia311/landing-page' },
    ],
  },
  {
    id: 'random-page',
    type: 'random',
    title: 'Where shall we sail next? 🎲',
    links: [
      { label: 'Open a random GitHub repo', url: 'https://github.com/tulamia311' },
      { label: 'Visit main Tulamia site', url: 'https://tulamia.site' },
    ],
  },
]
