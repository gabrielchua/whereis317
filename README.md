# Bus Arrival Times Web App

A modern web application that shows real-time bus arrival information using LTA's DataMall API.

## Features

- Real-time bus arrival information
- Modern, responsive UI
- Auto-refresh every 30 seconds
- Secure API key handling

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your LTA API key:
   ```
   LTA_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment on Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the environment variable `LTA_API_KEY` in your Vercel project settings
4. Deploy!

## Environment Variables

- `LTA_API_KEY`: Your LTA DataMall API key (required)

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- LTA DataMall API 