import { useState, useEffect } from 'react';

export type ProjectStatus = 'Not Started' | 'In Progress' | 'Shipped';

export const useProjectStatus = () => {
    const [status, setStatus] = useState<ProjectStatus>('Not Started');
    const [completion, setCompletion] = useState({
        steps: 0,
        tests: 0,
        links: 0
    });

    useEffect(() => {
        const checkStatus = () => {
            // 1. Check Construction Steps (stored in prp_steps_status)
            // Assuming 8 steps. If not tracked, we might need to rely on feature usage or a manual checklist on Proof page.
            // For now, let's assume we read a manual checklist string from localStorage
            const stepsStored = localStorage.getItem('prp_steps_status');
            const stepsCount = stepsStored ? Object.values(JSON.parse(stepsStored)).filter(Boolean).length : 0;

            // 2. Check Tests (prp_test_checklist)
            const testsStored = localStorage.getItem('prp_test_checklist');
            const testsCount = testsStored ? Object.values(JSON.parse(testsStored)).filter(Boolean).length : 0;

            // 3. Check Links (prp_final_submission)
            const submissionStored = localStorage.getItem('prp_final_submission');
            let linksCount = 0;
            if (submissionStored) {
                const sub = JSON.parse(submissionStored);
                if (sub.lovableUrl) linksCount++;
                if (sub.githubUrl) linksCount++;
                if (sub.deployedUrl) linksCount++;
            }

            setCompletion({
                steps: stepsCount,
                tests: testsCount,
                links: linksCount
            });

            // STRICT RULE: Shipped ONLY IF 8 steps + 10 tests + 3 links
            if (stepsCount >= 8 && testsCount >= 10 && linksCount >= 3) {
                setStatus('Shipped');
            } else if (stepsCount > 0 || testsCount > 0 || linksCount > 0) {
                setStatus('In Progress');
            } else {
                setStatus('Not Started');
            }
        };

        checkStatus();

        // Listen for storage events to update live
        window.addEventListener('storage', checkStatus);
        // Custom event for same-window updates
        window.addEventListener('prp-status-change', checkStatus);

        return () => {
            window.removeEventListener('storage', checkStatus);
            window.removeEventListener('prp-status-change', checkStatus);
        };
    }, []);

    return { status, completion };
};
