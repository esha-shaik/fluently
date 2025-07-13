# Fluently - Language Translation App

A Next.js project built on React and TailwindCSS that provides real-time language translation using Google's Gemini AI.

## Features

- Real-time text translation between multiple languages
- Auto-language detection
- Pronunciation guides
- Translation history
- Chat interface with translation support
- Phrase collections for learning

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fluently
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Google Gemini API key:
```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Add it to your `.env.local` file

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The page auto-updates as you edit the code in `src`.

## Deployment

The app is deployed on Vercel: [https://fluently-kappa.vercel.app/](https://fluently-kappa.vercel.app/)

For deployment, make sure to:
1. Set the `NEXT_PUBLIC_GEMINI_API_KEY` environment variable in your deployment platform
2. Build the project: `npm run build`
3. Start the production server: `npm start`

## Project Structure

- `src/app/` - Next.js app router pages and layouts
- `src/utilities/` - API utilities and helper functions
- `src/app/globals.css` - Global styles and TailwindCSS configuration

## Technologies Used

- Next.js 14
- React 18
- TailwindCSS
- Google Gemini AI API