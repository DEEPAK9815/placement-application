import { Outlet, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Clock } from 'lucide-react';

export const PremiumLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  // Extract step from path /rb/0X-something
  const stepMatch = path.match(/\/rb\/0(\d)-/);
  const currentStep = stepMatch ? parseInt(stepMatch[1]) : 0;

  // Status Calculation Logic
  const stepsComplete = Array.from({ length: 8 }, (_, i) => !!localStorage.getItem(`rb_step_${i + 1}_artifact`)).every(s => s);
  const checklistData = JSON.parse(localStorage.getItem('rb_checklist_status') || '[]');
  const checklistComplete = checklistData.length === 10 && checklistData.every((item: any) => item.completed);
  const linksData = JSON.parse(localStorage.getItem('rb_final_submission') || '{}');
  const linksComplete = !!(linksData.lovable && linksData.github && linksData.deploy);

  const isShipped = stepsComplete && checklistComplete && linksComplete;

  return (
    <div className="kn-layout">
      {/* Top Bar */}
      <header className="kn-top-bar">
        <div className="flex items-center gap-8">
          <Link to="/" className="kn-top-bar-title" style={{ textDecoration: 'none', color: 'inherit' }}>AI Resume Builder</Link>
          <nav className="flex gap-10">
            <Link to="/builder" className={`text-sm font-semibold uppercase tracking-wide hover:text-red-800 transition-colors ${path === '/builder' ? 'text-red-800' : 'text-gray-500'}`}>Builder</Link>
            <Link to="/preview" className={`text-sm font-semibold uppercase tracking-wide hover:text-red-800 transition-colors ${path === '/preview' ? 'text-red-800' : 'text-gray-500'}`}>Preview</Link>
            <Link to="/proof" className={`text-sm font-semibold uppercase tracking-wide hover:text-red-800 transition-colors ${path === '/proof' ? 'text-red-800' : 'text-gray-500'}`}>Proof</Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {currentStep > 0 && !isShipped && (
            <div className="kn-progress-indicator">Project 3 — Step {currentStep} of 8</div>
          )}

          {isShipped && (
            <div className="text-xs font-bold text-green-700 animate-in fade-in">
              Project 3 Shipped Successfully.
            </div>
          )}

          <div className={`kn-status-badge ${isShipped ? 'shipped' : 'in-progress'}`}>
            {isShipped ? 'Shipped' : (currentStep === 8 ? 'Finalizing' : 'Active')}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Proof Footer (only on rb pages) */}
      {path.startsWith('/rb') && (
        <footer className="kn-proof-footer">
          <div className="kn-proof-item">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Design Intent Fixed</span>
          </div>
          <div className="kn-proof-item">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Real-time Sync Active</span>
          </div>
        </footer>
      )}
    </div>
  );
};
