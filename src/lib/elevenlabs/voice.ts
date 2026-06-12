import { env } from "@/lib/env";

export interface VoiceNarrationInput {
  text: string;
  voiceId?: string;
}

const DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Sarah — warm, narrative

export async function generateVoiceNarration(
  input: VoiceNarrationInput,
): Promise<ArrayBuffer | null> {
  if (!env.ELEVENLABS_API_KEY) {
    return null;
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${input.voiceId ?? DEFAULT_VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": env.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: input.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.65,
          similarity_boost: 0.75,
          style: 0.35,
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs error: ${response.statusText}`);
  }

  return response.arrayBuffer();
}
