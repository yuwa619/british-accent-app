# Known Limitations

- Real Azure, OpenAI, and ElevenLabs provider calls require configured keys and still need live QA.
- This repository cannot prove live Supabase/provider readiness unless real environment variables are supplied locally or in a Vercel preview.
- Azure short-audio compatibility with browser `webm` recordings may require transcoding before production.
- Pitch and intensity feedback is lightweight browser guidance, not scientific acoustic analysis.
- Mock mode data is session/local only and is not persistent.
- There is no native mobile app.
- Roleplay is turn-based, not realtime voice streaming.
- There is no live avatar or realtime WebSocket conversation.
- Full self-serve account deletion is not automated; the MVP creates reviewed deletion requests.
- Automated data export is not implemented.
- Stripe live billing is disabled by default and webhook handling is not launch-ready.
- There is no human coaching marketplace.
- Feedback is educational guidance, not a clinical, legal, immigration, employment, or interview outcome guarantee.
- Supabase, provider, analytics, Sentry, and Stripe live environments need separate QA before beta users are invited.
