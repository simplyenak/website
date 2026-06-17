# Simply Enak Website - Frontend

This is the frontend for the Simply Enak website built with Astro.

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Contact Form Configuration
VITE_FORM_ENDPOINT=https://n8n.system.simplyenak.com/webhook/simply-enak-contact-2024-secure-form
VITE_TURNSTILE_SITE_KEY=0x4AAAAAABpeXumlMVzDHFDl

# YouTube API Configuration
VITE_YOUTUBE_API_KEY=***REMOVED***
VITE_YOUTUBE_CHANNEL_ID=your_youtube_channel_id_here
```

### YouTube API Setup

1. Get your YouTube API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the YouTube Data API v3
3. Add your API key to `VITE_YOUTUBE_API_KEY`
4. Add your YouTube channel ID to `VITE_YOUTUBE_CHANNEL_ID`

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
# Deployment trigger
# Frontend Deployment
