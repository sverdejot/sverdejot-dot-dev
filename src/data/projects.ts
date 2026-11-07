export type Lang = { name: string; color: 'orange' | 'red' | 'yellow' | 'green' | 'blue' | 'aqua' | 'purple' };

export type Project = {
  name: string;
  description: string;
  url: string;
  homepage?: string;
  langs: Lang[];
  since: string;
};

const go: Lang = { name: 'Go', color: 'aqua' };

/** Pinned repositories on github.com/sverdejot, newest activity first. */
export const featured: Project[] = [
  {
    name: 'beacon',
    description: 'Real-time European traffic through MQTT.',
    url: 'https://github.com/sverdejot/beacon',
    homepage: 'https://beacon.sverdejot.dev',
    langs: [go, { name: 'Kotlin', color: 'purple' }, { name: 'Astro', color: 'orange' }],
    since: '2026 →',
  },
  {
    name: 'homelab',
    description: 'A K8s cluster powered by K3s, NixOS and four Raspberry Pi 5.',
    url: 'https://github.com/sverdejot/homelab',
    langs: [{ name: 'Nix', color: 'blue' }, { name: 'Pkl', color: 'yellow' }],
    since: '2024 →',
  },
  {
    name: 'geemail',
    description: 'TUI tool to aggressively reduce unread Gmail messages.',
    url: 'https://github.com/sverdejot/geemail',
    langs: [go],
    since: '2024 →',
  },
  {
    name: 'tinykbd',
    description: 'A single-key macro keyboard, controlled with Go and TinyGo.',
    url: 'https://github.com/sverdejot/tinykbd',
    langs: [go, { name: 'TinyGo', color: 'red' }],
    since: '2025',
  },
  {
    name: 'expense-tracker',
    description: 'Expense tracking with DDD, Clean Architecture, CQRS and a proper DevOps lifecycle.',
    url: 'https://github.com/sverdejot/expense-tracker',
    langs: [{ name: 'C#', color: 'green' }],
    since: '2023',
  },
  {
    name: 'dotfiles',
    description: 'Source of truth for my day-to-day tooling.',
    url: 'https://github.com/sverdejot/dotfiles',
    langs: [{ name: 'Shell', color: 'green' }, { name: 'Lua', color: 'blue' }],
    since: '2023 →',
  },
];

/** Older experiments, shown as a plain list on /projects. */
export const archive: Project[] = [
  {
    name: 'web-poc',
    description: 'NestJS CRUD with DDD, ready to move from a modular monolith to microservices.',
    url: 'https://github.com/sverdejot/web-poc',
    langs: [{ name: 'TypeScript', color: 'blue' }],
    since: '2023',
  },
  {
    name: 'cnter',
    description: 'It increments a counter. With DDD and Clean Architecture, obviously.',
    url: 'https://github.com/sverdejot/cnter',
    langs: [{ name: 'Python', color: 'yellow' }],
    since: '2022',
  },
  {
    name: 'lifegame-led',
    description: "Conway's Game of Life with NumPy on a 32×32 LED matrix.",
    url: 'https://github.com/sverdejot/lifegame-led',
    langs: [{ name: 'Python', color: 'yellow' }],
    since: '2022',
  },
  {
    name: 'aws-face-recognition-app',
    description: 'Face recognition login on Lambda, DynamoDB, Rekognition, Cognito and Amplify. All IaC, all serverless.',
    url: 'https://github.com/sverdejot/aws-face-recognition-app',
    langs: [{ name: 'Python', color: 'yellow' }, { name: 'Angular', color: 'red' }],
    since: '2022',
  },
];
