# Systemic Functional Linguistics CBT

An interactive Computer-Based Training (CBT) application that teaches Systemic Functional Linguistics (SFL) and its practical applications in Software Engineering and Generative AI prompt development. The application features a live analysis tool, interactive concepts, and curated resources.

## 🎯 Overview

This CBT application helps software engineers, developers, and AI prompt engineers understand how to apply Systemic Functional Linguistics to improve requirements analysis, documentation clarity, and communication effectiveness in technical contexts.

### Key Features

- **Interactive Learning Modules**: Navigate through SFL concepts with clickable tooltips and detailed explanations
- **Live Text Analyzer**: Real-time SFL analysis of requirements, user stories, and technical documentation
- **AI-Powered Chat**: Contextual conversations about SFL concepts with Gemini AI integration
- **Software Engineering Focus**: Practical applications of SFL theory in development workflows
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Gemini API key from Google AI Studio

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Systemic-Functional-Linguistics-CBT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   Create a `.env` file in the root directory:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to access the application.

## 📚 Understanding SFL in Software Engineering

Systemic Functional Linguistics provides a framework for analyzing how language creates meaning. In software development, this translates to:

### The Three Metafunctions

1. **Ideational Metafunction**: Represents the "what's happening" in your requirements
   - Identifies processes (actions), participants (actors), and circumstances (conditions)
   - Maps to domain models, user flows, and system behaviors

2. **Interpersonal Metafunction**: Captures relationships and obligations in requirements
   - Analyzes mood (statements vs. questions vs. commands)
   - Examines modality (must vs. should vs. may)
   - Reveals assumptions about user-system interactions

3. **Textual Metafunction**: Organizes information for clarity and coherence
   - Theme/Rheme analysis shows information prioritization
   - Cohesion analysis identifies logical flow issues
   - Critical for clear documentation and user stories

## 🛠 Usage

### Interactive Learning

1. **Navigate Concepts**: Use arrow keys or navigation buttons to explore SFL concepts
2. **Click for Details**: Click on highlighted terms to start focused conversations
3. **Analyze Text**: Use the Live Analyzer to examine your own requirements or user stories

### Live Text Analysis

The built-in analyzer provides:
- **SFL Breakdown**: Complete analysis across all three metafunctions
- **Software Engineering Implications**: Practical insights for development
- **Suggested Refinements**: Improved versions of analyzed text
- **Raw JSON Export**: Structured data for further processing

### Chat Interface

- **Topic-Based Conversations**: Click any SFL concept to start a focused discussion
- **File Context**: Upload documents for contextualized analysis
- **Clear Context**: Reset conversations to start fresh

## 🏗 Project Structure

```
├── components/           # React components
│   ├── ChatInterface.tsx    # AI chat functionality
│   ├── InteractiveAnalyzer.tsx # Live text analysis
│   ├── SflConcept.tsx      # Concept presentation
│   └── ...                 # Supporting components
├── services/            # External service integrations
│   └── geminiService.ts    # Google AI integration
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies and scripts
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (via CDN)
- **AI Integration**: Google Gemini AI
- **Deployment**: Static site compatible

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google AI Studio API key | Yes |

## 🎨 Customization

### Themes and Styling

The application uses a custom dark theme with Tailwind CSS. Color scheme:
- Primary: `#e2a32d` (Golden yellow)
- Background: `#212934` (Dark blue-gray)
- Components: `#333e48` (Medium blue-gray)
- Text: `#95aac0` (Light blue-gray)

### Adding New Concepts

To add new SFL concepts:

1. Update the `concepts` array in `App.tsx`
2. Add corresponding tooltip content
3. Update the chat system prompts in `geminiService.ts`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built upon Systemic Functional Linguistics theory by M.A.K. Halliday
- Powered by Google's Gemini AI for intelligent text analysis
- Designed for practical application in software engineering contexts

## 📞 Support

For questions, issues, or contributions:
- Open an issue on GitHub
- Check the live analyzer for immediate SFL insights
- Use the chat interface for concept-specific questions

---

*Transform your technical communication with the power of linguistic analysis.*