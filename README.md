# Idea2App 💡

"From Idea to Software Blueprint. Think it. Specify it. Build it."

**Idea2App** is an AI-powered SDLC (Software Development Life Cycle) planning assistant. It transforms a simple software idea written in natural language into a comprehensive, structured software development blueprint.

Built as an AI-assisted SDLC project, this application aids product managers, architects, and developers in generating project-specific requirements, database schemas, and a full Software Requirements Specification (SRS) document.

---

## 🚀 What Idea2App Does

- **Analyzes** your natural language software idea.
- **Identifies** Target Users and defines User Roles.
- **Extracts** functional and non-functional requirements.
- **Generates** realistic User Stories and Use Cases.
- **Designs** Database Entities and their Relationships.
- **Recommends** a Technology Stack.
- **Plans** a Development Roadmap timeline.
- **Builds & Exports** a fully structured, professional Software Requirements Specification (SRS) document ready for printing or saving as a PDF.

---

## 🛠 How to Run It

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Quickstart
1. Navigate to the project directory:
   \`\`\`bash
   cd idea2app
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables & AI Integration

Idea2App uses Google's Gemini AI to analyze ideas and generate strictly structured JSON blueprints.

To enable **live AI generation**, create a \`.env\` file in the root of your project:
\`\`\`env
AI_API_KEY=your_gemini_api_key_here
\`\`\`

**How it works:**
The application sends the user's idea, chosen platform, and complexity scale to a Next.js server-side API route (\`/api/generate\`). The backend securely communicates with the AI using a highly structured system prompt, guaranteeing a consistent JSON output. This JSON is validated, transformed, and securely delivered back to the frontend.

---

## 🎬 Demo Mode (Fallback)

If you are presenting the application and do not have an active \`AI_API_KEY\`, Idea2App will seamlessly fall back into **Demo Mode**.

- **What happens:** The server detects the missing key, simulates a realistic network delay (to maintain the loading experience), and instantly generates a highly-detailed, predefined blueprint for an app called "TutorConnect".
- **Why it matters:** Your live presentations will never fail due to API rate limits or missing credentials. Simply click the "Try Demo" button on the home page or submit any idea without an API key to see the magic happen.

---

## 📂 Project Structure

Idea2App uses a clean, modern Next.js 14 App Router architecture:

\`\`\`
idea2app/
├── src/
│   ├── app/
│   │   ├── about/             # About page explaining Idea2App
│   │   ├── api/generate/      # Secure server-side AI integration route
│   │   ├── new/               # Project creation interface (prompts user)
│   │   ├── project/[id]/      # Blueprint Dashboard visualization
│   │   │   └── srs/           # Full SRS Document view with PDF export
│   │   ├── projects/          # Saved projects list
│   │   ├── layout.tsx         # Global layout with Navbar
│   │   └── page.tsx           # Premium Landing page
│   ├── components/
│   │   ├── layout/            # Navbar components
│   │   └── ui/                # Reusable UI components (Buttons, Cards, Toasts)
│   ├── lib/
│   │   ├── demo.ts            # Hardcoded demo blueprint generator
│   │   ├── storage.ts         # LocalStorage persistence wrapper
│   │   └── utils.ts           # Tailwind class merging utility
│   └── types/
│       └── index.ts           # Global TypeScript interfaces
\`\`\`

---

## 💾 Project Storage
All generated blueprints are stored locally in your browser's \`localStorage\`. This ensures your project data remains private and persists between sessions without requiring complex external database setups. You can view, open, and delete your past blueprints from the "Projects" page.
