import { v4 as uuidv4 } from 'uuid';

export type SkillCategory = 'Core CS' | 'Languages' | 'Web' | 'Data' | 'Cloud/DevOps' | 'Testing' | 'Other';

export type CompanySize = 'Startup' | 'Mid-size' | 'Enterprise';

export interface CompanyIntel {
    name: string;
    industry: string;
    size: CompanySize;
    focus: string;
    description: string;
}

export interface RoundInfo {
    order: number;
    title: string;
    description: string;
    focus: string;
    whyItMatters: string;
}

export interface AnalysisResult {
    id: string;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
    role: string;
    company: string;
    jdText: string;
    extractedSkills: Record<SkillCategory, string[]>;
    readinessScore: number; // Deprecated in favor of finalScore, kept for backward compat if needed or just alias baseScore
    baseScore: number; // Store original calculated score
    finalScore: number; // The score displayed to the user
    skillConfidenceMap: Record<string, 'know' | 'practice'>; // User self-assessment
    companyIntel?: CompanyIntel;
    roundFlow?: RoundInfo[];
    plan: { day: number; focus: string; activities: string[] }[];
    checklist: { round: string; items: string[] }[];
    questions: string[];
}

export function updateAnalysis(updatedResult: AnalysisResult) {
    const history = getHistory();
    const index = history.findIndex(item => item.id === updatedResult.id);

    if (index !== -1) {
        updatedResult.updatedAt = new Date().toISOString();
        history[index] = updatedResult;
        localStorage.setItem('job_history', JSON.stringify(history));

        // If this is the most recent one, update the latest score
        if (index === 0) {
            localStorage.setItem('latest_readiness_score', updatedResult.finalScore.toString());
        }
    }
}

const KEYWORDS: Record<Exclude<SkillCategory, 'Other'>, string[]> = {
    'Core CS': ['DSA', 'Data Structures', 'Algorithms', 'OOP', 'Object Oriented', 'DBMS', 'Database Management', 'OS', 'Operating Systems', 'Networks', 'Computer Networks'],
    'Languages': ['Java', 'Python', 'JavaScript', 'TypeScript', 'C\\+\\+', 'C#', 'Golang', 'Go', 'Rust', 'Ruby', 'Swift', 'Kotlin'],
    'Web': ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL', 'HTML', 'CSS', 'Tailwind', 'Redux', 'Vue', 'Angular'],
    'Data': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'NoSQL', 'Cassandra', 'Elasticsearch'],
    'Cloud/DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Jenkins', 'Terraform'],
    'Testing': ['Selenium', 'Cypress', 'Playwright', 'Jest', 'JUnit', 'PyTest', 'Mocha', 'Chai']
};

// Helper to escape special regex characters
function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function extractSkills(text: string): Record<SkillCategory, string[]> {
    const extracted: Record<SkillCategory, string[]> = {
        'Core CS': [],
        'Languages': [],
        'Web': [],
        'Data': [],
        'Cloud/DevOps': [],
        'Testing': [],
        'Other': []
    };

    const lowerText = text.toLowerCase();
    let hasSkills = false;

    Object.entries(KEYWORDS).forEach(([category, skills]) => {
        skills.forEach(skill => {
            let regexPattern = '';
            if (skill === 'C++') regexPattern = 'c\\+\\+';
            else if (skill === 'C#') regexPattern = 'c#';
            else if (skill === 'C') regexPattern = '\\bc\\b';
            else if (skill === 'Go') regexPattern = '\\bgo\\b';
            else regexPattern = escapeRegExp(skill);

            const regex = new RegExp(regexPattern, 'i');
            if (regex.test(lowerText)) {
                extracted[category as SkillCategory].push(skill.replace(/\\/g, ''));
                hasSkills = true;
            }
        });
    });

    // Fallback if no skills detected
    if (!hasSkills) {
        extracted['Other'] = ["Communication", "Problem Solving", "Basic Coding", "Projects"];
    }

    return extracted;
}

export function calculateScore(
    text: string,
    role: string,
    company: string,
    skills: Record<SkillCategory, string[]>
): number {
    let score = 35; // Base score

    const categoriesPresent = Object.values(skills).filter(list => list.length > 0).length;
    score += Math.min(categoriesPresent * 5, 30);

    if (company.trim().length > 0) score += 10;
    if (role.trim().length > 0) score += 10;
    if (text.length > 800) score += 10;

    return Math.min(score, 100);
}

// Heuristic Rules for Company Intel
function getCompanySize(name: string): CompanySize {
    const enterpriseList = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Apple', 'TCS', 'Infosys', 'Wipro', 'Accenture', 'IBM', 'Oracle', 'Salesforce', 'Adobe', 'Uber', 'Intel', 'Cisco', 'Deloitte', 'PwC', 'KPMG', 'EY'];
    const midSizeList = ['Zoho', 'Freshworks', 'Zerodha', 'Razorpay', 'Swiggy', 'Zomato', 'Cred', 'Meesho', 'Flipkart'];

    const lowerName = name.toLowerCase();

    if (enterpriseList.some(e => lowerName.includes(e.toLowerCase()))) return 'Enterprise';
    if (midSizeList.some(m => lowerName.includes(m.toLowerCase()))) return 'Mid-size';

    return 'Startup'; // Default
}

export function generateCompanyIntel(name: string): CompanyIntel {
    const size = getCompanySize(name);
    let industry = 'Technology';
    let focus = '';
    let description = '';

    if (size === 'Enterprise') {
        focus = 'DSA & Core CS Fundamentals';
        description = 'Large organizations value strong problem-solving skills (DSA) and a solid grasp of computer science fundamentals over specific framework knowledge.';
    } else if (size === 'Mid-size') {
        focus = 'Scalability & System Design';
        description = 'Mid-sized growth companies look for engineers who can build scalable systems and have practical experience with modern stacks.';
    } else {
        focus = 'Product Building & Agility';
        description = 'Startups prioritize valid product-building skills. They need you to be hands-on with the stack and able to ship features quickly.';
    }

    return {
        name,
        industry,
        size,
        focus,
        description
    };
}

export function generateRoundFlow(size: CompanySize, skills: Record<SkillCategory, string[]>): RoundInfo[] {
    const rounds: RoundInfo[] = [];
    const allSkills = Object.values(skills).flat();
    const hasDSA = allSkills.includes('DSA') || allSkills.includes('Data Structures') || allSkills.includes('Algorithms');

    let order = 1;

    // Round 1
    if (size === 'Enterprise' || hasDSA) {
        rounds.push({
            order: order++,
            title: 'Online Coding Assessment',
            description: 'Timed algorithmic challenges on platform like HackerRank/CodeSignal.',
            focus: 'Arrays, Strings, HashMaps, Aptitude',
            whyItMatters: 'Filters candidates based on raw problem-solving speed and accuracy.'
        });
    } else {
        rounds.push({
            order: order++,
            title: 'Practical Screening',
            description: 'Take-home assignment or basic coding checks.',
            focus: 'Basic API creation, simple UI implementation',
            whyItMatters: 'Verifies you can actually write code and follow instructions.'
        });
    }

    // Round 2
    if (size === 'Enterprise') {
        rounds.push({
            order: order++,
            title: 'Technical Round 1 (DSA)',
            description: 'Deep dive into data structures and optimization.',
            focus: 'Trees, Graphs, DP, Time Complexity',
            whyItMatters: 'Tests your ability to write efficient, scalable code.'
        });
    } else {
        rounds.push({
            order: order++,
            title: 'Technical Deep Dive',
            description: 'Discussion on your stack proficiency and past projects.',
            focus: 'Framework internals (e.g., React hooks, Node event loop)',
            whyItMatters: 'Proves you understand the tools you use daily.'
        });
    }

    // Round 3
    if (size === 'Enterprise') {
        rounds.push({
            order: order++,
            title: 'Technical Round 2 (Design/CS)',
            description: 'System design basics (LLD) or OS/DBMS concepts.',
            focus: 'Class design, Database normalization, Schema',
            whyItMatters: 'Ensures you can design maintainable software, not just scripts.'
        });
    } else if (size === 'Mid-size') {
        rounds.push({
            order: order++,
            title: 'System Design / Architecture',
            description: 'Designing a scalable feature or service.',
            focus: 'Load balancing, Caching, API Design',
            whyItMatters: 'Assess if you can build systems that grow with the user base.'
        });
    } else {
        rounds.push({
            order: order++,
            title: 'Machine Coding / Pairing',
            description: 'Live coding a feature with the interviewer.',
            focus: 'Debuggability, Code quality, Communication',
            whyItMatters: 'Simulates what it\'s like to work with you on a real task.'
        });
    }

    // Round 4
    rounds.push({
        order: order++,
        title: 'Managerial / Culture Fit',
        description: 'Behavioral questions and team alignment.',
        focus: 'Ownership, conflicts, motivation',
        whyItMatters: 'Determines if you add value to the team culture.'
    });

    return rounds;
}

export function generatePlan(skills: Record<SkillCategory, string[]>): { day: number; focus: string; activities: string[] }[] {
    const hasWeb = skills['Web']?.length > 0;
    const hasData = skills['Data']?.length > 0;
    const hasCloud = skills['Cloud/DevOps']?.length > 0;

    const plan = [
        { day: 1, focus: "Foundations & Core CS", activities: ["Review OOP concepts", "Revise OS scheduling & memory management", "Network protocols (HTTP, TCP/IP)"] },
        { day: 2, focus: "Language Mastery", activities: ["Deep dive into primary language syntax", "Standard Library / Collections framework", "Memory management in your language"] },
        { day: 3, focus: "Data Structures & Algorithms", activities: ["Arrays, Linked Lists, Stacks, Queues", "Practice 3 Easy + 2 Medium problems", "Time Complexity Analysis"] },
        { day: 4, focus: "Advanced DSA", activities: ["Trees, Graphs, DP", "Practice 2 Medium + 1 Hard problem", "System Design basics"] },
        { day: 5, focus: "Project & Tech Stack", activities: ["Review your resume projects", "Prepare 'Challenges Faced' stories"] },
        { day: 6, focus: "Mock Interviews", activities: ["Peer mock interview", "Behavioral questions (STAR method)", "Whiteboard practice"] },
        { day: 7, focus: "Final Revision", activities: ["Review weak areas", "Formula sheets", "Cheatsheets", "Rest & Mindset"] }
    ];

    if (hasWeb) {
        plan[4].activities.push("Revise React/Node.js lifecycle & patterns");
        plan[4].focus += " (Web)";
    }
    if (hasData) {
        plan[1].activities.push("SQL Queries & Normalization");
    }
    if (hasCloud) {
        plan[4].activities.push("Docker & CI/CD basics");
    }

    return plan;
}

export function generateChecklist(skills: Record<SkillCategory, string[]>): { round: string; items: string[] }[] {
    const round1 = ["Quantitative Aptitude (Time & Work, Speed)", "Logical Reasoning", "Verbal Ability", "Basic Debugging"];
    const round2 = ["Array/String Manipulation", "HashMaps & Sets", "Object Oriented Design Patterns", "Basic SQL Queries"];
    const round3 = ["Project Architecture Deep Dive", "API Design", "Database Schema Design"];
    const round4 = ["Why this company?", "Strengths & Weaknesses", "Situation handling (Conflict)", "Salary expectations"];

    const allSkills = Object.values(skills).flat();

    if (allSkills.includes("React")) round3.push("React Component Lifecycle & Hooks");
    if (allSkills.includes("Node.js")) round3.push("Event Loop & Async/Await");
    if (allSkills.includes("SQL")) round2.push("Joins, Indexing, Transactions");
    if (allSkills.includes("AWS")) round3.push("Cloud Deployment & Scalability");

    return [
        { round: "Round 1: Aptitude / Basics", items: round1 },
        { round: "Round 2: DSA + Core CS", items: round2 },
        { round: "Round 3: Tech Interview", items: round3 },
        { round: "Round 4: Managerial / HR", items: round4 }
    ];
}

export function generateQuestions(skills: Record<SkillCategory, string[]>): string[] {
    const questions: string[] = [];
    const flatSkills = Object.values(skills).flat();

    if (questions.length === 0) {
        questions.push("Tell me about yourself.");
        questions.push("Explain one challenging project you worked on.");
        questions.push("What are ACID properties in databases?");
        questions.push("Explain the difference between Process and Thread.");
    }

    if (flatSkills.includes("React")) {
        questions.push("Explain Virtual DOM and how it works.");
        questions.push("What is the difference between useMemo and useCallback?");
    }
    if (flatSkills.includes("Node.js")) {
        questions.push("How does Node.js handle concurrency?");
        questions.push("Explain Middleware in Express.");
    }
    if (flatSkills.includes("Java")) {
        questions.push("Explain the difference between Interface and Abstract Class.");
        questions.push("How does Garbage Collection work in Java?");
    }
    if (flatSkills.includes("Python")) {
        questions.push("Explain Python decorators.");
        questions.push("What is the GIL (Global Interpreter Lock)?");
    }
    if (flatSkills.includes("SQL")) {
        questions.push("Explain Indexing and when to use it.");
        questions.push("What is the difference between INNER and OUTER JOIN?");
    }
    if (flatSkills.includes("DSA")) {
        questions.push("How would you optimize search in a sorted dataset?");
        questions.push("Detect a cycle in a linked list.");
    }

    const generic = [
        "Explain the CAP theorem.",
        "What happens when you type a URL in the browser?",
        "Explain Polymorphism with a real-world example.",
        "How do you handle API security?",
        "Explain SOLID principles.",
        "What is Dependency Injection?"
    ];

    let i = 0;
    while (questions.length < 10 && i < generic.length) {
        if (!questions.includes(generic[i])) {
            questions.push(generic[i]);
        }
        i++;
    }

    return questions.slice(0, 10);
}

export function analyzeJobDescription(text: string, role: string, company: string): AnalysisResult {
    const extractedSkills = extractSkills(text);
    const score = calculateScore(text, role, company, extractedSkills);
    const plan = generatePlan(extractedSkills);
    const checklist = generateChecklist(extractedSkills);
    const questions = generateQuestions(extractedSkills);
    const companyIntel = generateCompanyIntel(company);
    const roundFlow = generateRoundFlow(companyIntel.size, extractedSkills);

    const now = new Date().toISOString();

    const result: AnalysisResult = {
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
        role: role || "",
        company: company || "",
        jdText: text,
        extractedSkills,
        readinessScore: score, // alias
        baseScore: score,
        finalScore: score,
        skillConfidenceMap: {},
        companyIntel,
        roundFlow,
        plan,
        checklist,
        questions
    };

    saveAnalysis(result);
    return result;
}

export function saveAnalysis(result: AnalysisResult) {
    const history = getHistory();
    history.unshift(result);
    if (history.length > 50) history.pop();
    localStorage.setItem('job_history', JSON.stringify(history));
    localStorage.setItem('latest_readiness_score', result.finalScore.toString());
}

export function getHistory(): AnalysisResult[] {
    try {
        const stored = localStorage.getItem('job_history');
        if (!stored) return [];
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) return [];
        // Filter out malformed entries (must have id and scores)
        return parsed.filter((item: any) => item && item.id && (typeof item.baseScore === 'number' || typeof item.readinessScore === 'number'));
    } catch (e) {
        console.error("Failed to parse history", e);
        return [];
    }
}
