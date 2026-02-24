import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PremiumLayout } from './components/PremiumLayout';
import { StepPage } from './pages/rb/StepPage';
import { ProofPage } from './pages/ProofPage';
import { Home } from './pages/Home';
import { Builder } from './pages/Builder';
import { Preview } from './pages/Preview';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PremiumLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/proof" element={<ProofPage />} />

          <Route path="/rb/01-problem" element={
            <StepPage
              step={1}
              title="Problem Statement"
              description="Define the exact pain points our AI Resume Builder will solve."
              prompt="Identify the top 3 problems users face when creating resumes today and how an AI-powered solution can automate these. Format as a professional Problem Statement artifact."
              nextPath="/rb/02-market"
            />
          } />
          <Route path="/rb/02-market" element={
            <StepPage
              step={2}
              title="Market Analysis"
              description="Understand the competitive landscape and target audience."
              prompt="Research 3 existing AI Resume builders. List their strengths and weaknesses. Define our unique selling proposition (USP)."
              nextPath="/rb/03-architecture"
            />
          } />
          <Route path="/rb/03-architecture" element={
            <StepPage
              step={3}
              title="Architecture Design"
              description="System design and technology stack selection."
              prompt="Design the high-level system architecture. Include frontend (React), backend (Node/Python), and AI integration (OpenAI/Cloudinary). Create a Mermaid diagram code."
              nextPath="/rb/04-hld"
            />
          } />
          <Route path="/rb/04-hld" element={
            <StepPage
              step={4}
              title="High Level Design (HLD)"
              description="Define modules, APIs, and data flow."
              prompt="Create a detailed HLD. Define API endpoints for resume generation, file storage, and user authentication. Map the data flow from input to final PDF."
              nextPath="/rb/05-lld"
            />
          } />
          <Route path="/rb/05-lld" element={
            <StepPage
              step={5}
              title="Low Level Design (LLD)"
              description="Detailed component logic and database schema."
              prompt="Design the database schema for Resumes, Sections, and Users. Outline the logic for the AI parsing engine and PDF generation service."
              nextPath="/rb/06-build"
            />
          } />
          <Route path="/rb/06-build" element={
            <StepPage
              step={6}
              title="Build Track"
              description="Execute the primary construction of the application."
              prompt="Build the core Resume Editor component. Implement real-time preview and AI content suggestions. Ensure responsive design and premium aesthetics."
              nextPath="/rb/07-test"
            />
          } />
          <Route path="/rb/07-test" element={
            <StepPage
              step={7}
              title="Testing & Quality"
              description="Verify functionality and user experience."
              prompt="Create a test suite for the Resume Generation unit. Verify PDF export across 5 different templates. Perform a UI/UX audit against the Premium Design System."
              nextPath="/rb/08-ship"
            />
          } />
          <Route path="/rb/08-ship" element={
            <StepPage
              step={8}
              title="Shipping & Launch"
              description="Deploy the application and prepare for users."
              prompt="Configure Vercel/Netlify deployment. Set up CI/CD pipelines. Finalize the SEO tags and social preview images for the launch."
              nextPath="/rb/proof"
            />
          } />
          <Route path="/rb/proof" element={<ProofPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
