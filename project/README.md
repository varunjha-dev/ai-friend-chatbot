# AI Girlfriend Chat Application 💕

A beautiful, romantic chatbot application built with React, TypeScript, and Firebase. Features personalized conversations, dark mode, conversation history, and rate limiting.

## Features

- 🔐 **Firebase Authentication** - Email/password and Google sign-in
- 💝 **Personalization Form** - Customize your girlfriend's personality and interests
- 🎨 **Beautiful UI** - Cinderella-inspired romantic theme with dark mode
- 💬 **AI Chat** - Powered by Google's Gemini API
- 📱 **Responsive Design** - Works perfectly on mobile and desktop
- 🔄 **Conversation History** - Synced across devices with Firebase
- ⏰ **Rate Limiting** - 10 messages per hour with elegant handling
- 💫 **Animations** - Floating hearts and smooth transitions

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password and Google
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" and click "Web"
   - Copy the config object

### 2. Environment Setup

1. Replace the Firebase config in `src/firebase/firebase.ts` with your actual config
2. Replace the Gemini API key in `src/services/geminiService.ts` with your key:
   - Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 3. Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 4. Firebase Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Deploy to Firebase Hosting
npm run build
firebase deploy
```

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthPage.tsx    # Authentication interface
│   ├── PersonalizationForm.tsx  # User setup form
│   ├── ChatInterface.tsx        # Main chat UI
│   └── FloatingHearts.tsx       # Background animation
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication logic
│   ├── useTheme.ts     # Dark mode toggle
│   └── useRateLimit.ts # Message rate limiting
├── services/           # External services
│   ├── geminiService.ts    # AI chat integration
│   └── firestoreService.ts # Database operations
├── firebase/           # Firebase configuration
└── styles/            # Global styles and themes
```

## Key Technologies

- **React 18** with TypeScript
- **Firebase** (Auth, Firestore, Hosting)
- **Tailwind CSS** for styling
- **Google Gemini API** for AI conversations
- **Vite** for fast development and building

## Features in Detail

### Personalization
- Girlfriend's name, nickname, interests, and personality type
- User's name, nickname, and interests
- Dynamic system instructions based on preferences

### Personality Types
- **Tsundere** - Initially cold but gradually shows warmth
- **Yandere** - Extremely loving and possessive
- **Kuudere** - Cool and aloof but caring inside
- **Dandere** - Quiet and shy but sweet
- **Moekko** - Cute and innocent
- **Otaku** - Passionate about hobbies and interests

### Security
- Firebase Authentication with email/password and Google
- Firestore security rules restrict access to user's own data
- Rate limiting prevents API abuse
- Input validation and error handling

## Customization

### Themes
- Light mode: Soft pinks, purples, and romantic colors
- Dark mode: Dark grays with vibrant accents
- Easily customizable in `tailwind.config.js`

### API Integration
- Replace Gemini API key in `geminiService.ts`
- Modify system instructions for different personalities
- Adjust rate limiting in `useRateLimit.ts`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and personal use. Please respect API usage limits and terms of service.
also
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with 💕 for creating meaningful AI conversations