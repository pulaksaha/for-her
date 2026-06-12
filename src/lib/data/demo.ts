import type {
  AnniversaryFilm,
  Memory,
  MemoryRecap,
  MemoryWorld,
  TimelineChapter,
} from "@/types/memory";

export const demoWorld: MemoryWorld = {
  id: "world-demo",
  slug: "our-story",
  name: "Our Story",
  tagline: "A quiet archive of everything we became",
  coverImageUrl:
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80&auto=format&fit=crop",
  memberCount: 2,
  memoryCount: 6,
  createdAt: "2022-06-14T00:00:00Z",
  type: "couple",
};

export const demoMemories: Memory[] = [
  {
    id: "mem-1",
    worldId: demoWorld.id,
    title: "First light in Lisbon",
    occurredAt: "2024-03-18T07:42:00Z",
    location: "Alfama, Lisbon",
    mood: "tender",
    caption:
      "You laughed before the coffee arrived. The city was still waking up.",
    media: [
      {
        id: "m1",
        type: "photo",
        url: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&q=80&auto=format&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&q=80&auto=format&fit=crop",
      },
    ],
    story: {
      id: "s1",
      content:
        "Morning arrived like a whisper — terracotta roofs, distant tram bells, and your hand finding mine without looking. Some cities feel borrowed; Lisbon felt like ours from the first breath.",
      tone: "tender",
      generatedAt: "2024-03-19T10:00:00Z",
      provider: "anthropic",
    },
    isHighlight: true,
    createdAt: "2024-03-18T08:00:00Z",
    updatedAt: "2024-03-18T08:00:00Z",
  },
  {
    id: "mem-2",
    worldId: demoWorld.id,
    title: "Sunday at the lake house",
    occurredAt: "2024-07-07T16:20:00Z",
    location: "Lake Winnipesaukee",
    mood: "joyful",
    caption: "Bare feet, cold water, no agenda.",
    media: [
      {
        id: "m2",
        type: "photo",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80&auto=format&fit=crop",
      },
      {
        id: "m3",
        type: "video",
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80&auto=format&fit=crop",
        durationSeconds: 42,
      },
    ],
    voiceNoteUrl: "/audio/demo-voice.mp3",
    musicTrack: "Golden Hour — Ambient Piano",
    isHighlight: false,
    createdAt: "2024-07-07T18:00:00Z",
    updatedAt: "2024-07-07T18:00:00Z",
  },
  {
    id: "mem-3",
    worldId: demoWorld.id,
    title: "The night we said yes",
    occurredAt: "2023-11-04T21:15:00Z",
    location: "Brooklyn",
    mood: "celebration",
    caption: "Champagne on the fire escape. Stars we didn't plan for.",
    media: [
      {
        id: "m4",
        type: "photo",
        url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200&q=80&auto=format&fit=crop",
      },
    ],
    story: {
      id: "s2",
      content:
        "Time folded in on itself — the clink of glasses, your voice steady and sure, the city humming below like it was holding its breath for us.",
      tone: "celebration",
      generatedAt: "2023-11-05T09:00:00Z",
    },
    isHighlight: true,
    createdAt: "2023-11-04T22:00:00Z",
    updatedAt: "2023-11-04T22:00:00Z",
  },
  {
    id: "mem-5",
    worldId: demoWorld.id,
    title: "The apartment on Hester Street",
    occurredAt: "2022-09-12T18:30:00Z",
    location: "New York",
    mood: "nostalgic",
    caption: "Boxes everywhere. You said it already felt like home.",
    media: [
      {
        id: "m6",
        type: "photo",
        url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&q=80&auto=format&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&q=20&blur=50&auto=format&fit=crop",
      },
    ],
    isHighlight: false,
    createdAt: "2022-09-12T19:00:00Z",
    updatedAt: "2022-09-12T19:00:00Z",
  },
  {
    id: "mem-6",
    worldId: demoWorld.id,
    title: "First snow together",
    occurredAt: "2022-12-21T20:00:00Z",
    location: "Central Park",
    mood: "joyful",
    caption: "Cold hands, shared gloves, unreasonable amounts of hot chocolate.",
    media: [
      {
        id: "m7",
        type: "photo",
        url: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=1200&q=80&auto=format&fit=crop",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=400&q=20&blur=50&auto=format&fit=crop",
      },
    ],
    voiceNoteUrl: "/audio/demo-voice.mp3",
    isHighlight: true,
    createdAt: "2022-12-21T21:00:00Z",
    updatedAt: "2022-12-21T21:00:00Z",
  },
  {
    id: "mem-4",
    worldId: demoWorld.id,
    title: "Rain on the window",
    occurredAt: "2025-01-22T19:00:00Z",
    mood: "quiet",
    caption: "We didn't leave the couch. That was the whole plan.",
    media: [
      {
        id: "m5",
        type: "photo",
        url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&q=80&auto=format&fit=crop",
      },
    ],
    isHighlight: false,
    createdAt: "2025-01-22T20:00:00Z",
    updatedAt: "2025-01-22T20:00:00Z",
  },
];

export const demoChapters: TimelineChapter[] = [
  {
    id: "ch-1",
    worldId: demoWorld.id,
    title: "Chapter I",
    subtitle: "Where it began",
    startDate: "2022-01-01",
    endDate: "2022-12-31",
    memoryIds: ["mem-5", "mem-6"],
    coverMemoryId: "mem-6",
  },
  {
    id: "ch-2",
    worldId: demoWorld.id,
    title: "Chapter II",
    subtitle: "Becoming us",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    memoryIds: ["mem-3"],
    coverMemoryId: "mem-3",
  },
  {
    id: "ch-3",
    worldId: demoWorld.id,
    title: "Chapter III",
    subtitle: "The wide world",
    startDate: "2024-01-01",
    memoryIds: ["mem-1", "mem-2"],
    coverMemoryId: "mem-1",
  },
  {
    id: "ch-4",
    worldId: demoWorld.id,
    title: "Now",
    subtitle: "Still writing",
    startDate: "2025-01-01",
    memoryIds: ["mem-4"],
    coverMemoryId: "mem-4",
  },
];

export const demoFilms: AnniversaryFilm[] = [
  {
    id: "film-1",
    worldId: demoWorld.id,
    title: "Three Years — A Love Letter in Motion",
    status: "ready",
    previewUrl:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80",
    durationSeconds: 187,
    createdAt: "2025-02-14T00:00:00Z",
  },
];

export interface DemoVoiceNote {
  id: string;
  memoryId: string;
  title: string;
  excerpt: string;
  durationSeconds: number;
  occurredAt: string;
  url: string;
}

export interface DemoSharingMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "member" | "viewer";
  avatarInitials: string;
}

export const demoVoiceNotes: DemoVoiceNote[] = [
  {
    id: "vn-1",
    memoryId: "mem-2",
    title: "Sunday at the lake house",
    excerpt:
      "I still think about that morning — you laughing before the coffee even arrived.",
    durationSeconds: 42,
    occurredAt: "2024-07-07T16:20:00Z",
    url: "/audio/demo-voice.mp3",
  },
  {
    id: "vn-2",
    memoryId: "mem-1",
    title: "First light in Lisbon",
    excerpt: "The tram sounded like it was far away. You were close.",
    durationSeconds: 28,
    occurredAt: "2024-03-18T07:42:00Z",
    url: "/audio/demo-voice.mp3",
  },
];

export const demoSharing: DemoSharingMember[] = [
  {
    id: "u-1",
    name: "You",
    email: "you@verse.app",
    role: "owner",
    avatarInitials: "Y",
  },
  {
    id: "u-2",
    name: "Partner",
    email: "partner@verse.app",
    role: "member",
    avatarInitials: "P",
  },
];

export const demoRecap: MemoryRecap = {
  id: "recap-1",
  worldId: demoWorld.id,
  period: "season",
  title: "Winter, held close",
  story:
    "This season asked nothing of you but presence — rain on glass, slow mornings, the courage to stay. You answered with tenderness.",
  memoryIds: ["mem-4"],
  generatedAt: "2025-03-01T00:00:00Z",
};
