# MTG AI Search Frontend

A modern React TypeScript web application that helps users search for Magic: The Gathering cards using natural language.

## Features

- **Smart Search**: Converts everyday language into card searches
- **Two Languages**: Works in both Chinese and English
- **Modern UI**: Beautiful dark theme with Tailwind CSS
- **Responsive Design**: Works on desktop and mobile devices
- **Type Safety**: Built with TypeScript for better development experience
- **Fast Performance**: Built with Vite for fast development and builds

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Deployment**: Render.com (Static Site)

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── SearchSection.tsx
│   ├── ResultsSection.tsx
│   ├── CardComponent.tsx
│   ├── SettingsModal.tsx
│   ├── WelcomeSection.tsx
│   └── LoadingSpinner.tsx
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── api.ts
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind
```

## API Integration

The frontend communicates with the MTG AI Backend API:

- **Base URL**: `https://mtg-ai-backend.onrender.com`
- **Search Endpoint**: `/api/search`
- **Examples Endpoint**: `/api/examples`
- **Models Endpoint**: `/api/models`
- **Validation Endpoint**: `/api/validate-key`

## Features

### Search Functionality

- Natural language card search
- Multiple sorting options (name, set, rarity, etc.)
- Ascending/descending order
- Search examples for both languages

### Card Display

- High-quality card images from Scryfall
- Card details (name, type, text, rarity)
- Mana cost display with symbols
- Direct links to Scryfall

### Settings

- API key management
- Key validation
- Available models display
- Local storage for persistence

### Language Support

- Chinese and English interfaces
- Dynamic language switching
- Localized content and examples

## Deployment

The application is automatically deployed on Render.com when code is pushed to the main branch.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the MTG AI Search tool.
