
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardLayout } from './pages/DashboardLayout';
import Dashboard from './pages/Dashboard';
import { Practice, Assessments, Resources, Profile } from './pages/DashboardPages';
import { TestChecklist } from './pages/TestChecklist';
import { ShipPage } from './pages/ShipPage';
import { ProofPage } from './pages/ProofPage';
import { JobTracker } from './pages/JobTracker';

// Resume Builder Imports
import { Home as RBHome } from './resume-builder/pages/Home';
import { Builder as RBBuilder } from './resume-builder/pages/Builder';
import { Preview as RBPreview } from './resume-builder/pages/Preview';
import { ProofPage as RBProof } from './resume-builder/pages/ProofPage';
import { StepPage as RBStep } from './resume-builder/pages/rb/StepPage';
import { PremiumLayout } from './resume-builder/components/PremiumLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* PRP Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="practice" element={<Practice />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="resources" element={<Resources />} />
          <Route path="profile" element={<Profile />} />

          {/* Job Tracker inside Dashboard Layout */}
          <Route path="job-tracker" element={<JobTracker />} />
        </Route>

        {/* Global Job Tracker Route (if accessed directly) */}
        <Route path="/job-tracker" element={<DashboardLayout />}>
          <Route index element={<JobTracker />} />
        </Route>

        {/* Resume Builder App */}
        <Route path="/resume-builder" element={<PremiumLayout />}>
          <Route index element={<RBHome />} />
          <Route path="builder" element={<RBBuilder />} />
          <Route path="preview" element={<RBPreview />} />
          <Route path="proof" element={<RBProof />} />
        </Route>

        {/* Resume Builder Steps */}
        <Route path="/rb" element={<PremiumLayout />}>
          <Route path="01-problem" element={<RBStep step={1} title="Problem Statement" description="Define pain points." prompt="Identify top 3 problems..." nextPath="/rb/02-market" />} />
          <Route path="02-market" element={<RBStep step={2} title="Market Analysis" description="Understand landscape." prompt="Research 3 builders..." nextPath="/rb/03-architecture" />} />
          <Route path="03-architecture" element={<RBStep step={3} title="Architecture Design" description="System design." prompt="Design high-level..." nextPath="/rb/04-hld" />} />
          <Route path="04-hld" element={<RBStep step={4} title="High Level Design" description="Define modules." prompt="Create detailed HLD..." nextPath="/rb/05-lld" />} />
          <Route path="05-lld" element={<RBStep step={5} title="Low Level Design" description="Component logic." prompt="Design DB schema..." nextPath="/rb/06-build" />} />
          <Route path="06-build" element={<RBStep step={6} title="Build Track" description="Execute build." prompt="Build core component..." nextPath="/rb/07-test" />} />
          <Route path="07-test" element={<RBStep step={7} title="Testing & Quality" description="Verify function." prompt="Create test suite..." nextPath="/rb/08-ship" />} />
          <Route path="08-ship" element={<RBStep step={8} title="Shipping & Launch" description="Deploy app." prompt="Configure Vercel..." nextPath="/resume-builder/proof" />} />
        </Route>

        {/* Original PRP Routes */}
        <Route path="/prp/07-test" element={<DashboardLayout />}>
          <Route index element={<TestChecklist />} />
        </Route>
        <Route path="/prp/08-ship" element={<DashboardLayout />}>
          <Route index element={<ShipPage />} />
        </Route>
        <Route path="/prp/proof" element={<DashboardLayout />}>
          <Route index element={<ProofPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
