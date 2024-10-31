# AI Emoji Generator 🎨

A modern web application that generates custom emojis using AI.

## Features ✨

- Generate custom emojis using AI
- Multiple authentication options (Google, Discord, GitHub, Email)
- Credit-based generation system (3 free credits upon registration)
- Responsive design
- Rate limiting
- Error handling
- Toast notifications

[![Github All Releases](https://img.shields.io/github/downloads/VystroAI/emoji-maker/total.svg)]()

## Prerequisites 📋

Before you begin, ensure you have:

Nothing Except API Keys

- Replicate API Token Go Here: https://replicate.com/account/api-tokens
- Supabase API Token: Go to your API Project Settings and copy your anon public key
- Clerk API Token: Make a new Project and copy the 2 needed api tokens its that easy

## Environment Variables 🔐

Create a `.env` file in the root directory with the following variables:

```env
REPLICATE_API_TOKEN=yourtokenhere
NEXT_PUBLIC_SUPABASE_URL=yourtokenhere  
NEXT_PUBLIC_SUPABASE_ANON_KEY=yourtokenhere
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=yourtokenhere
CLERK_SECRET_KEY=yourtokenhere
```


## Getting Started 🚀

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

And you're all set!



## To-Do List 📝

- [] To Buy Credits
- [] Mobile Support
- [] Better API Security


## Deployment 🚦

1. **Fork** this repository.
2. **Go to Vercel** and select your forked repository for deployment.
3. **Set the root directory** in Vercel’s settings if needed.
4. **Add environment variables** in the Vercel settings.

You're ready to deploy!
