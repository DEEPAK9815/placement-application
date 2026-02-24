import { useState, useEffect } from 'react';

export interface ResumeData {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        github: string;
        linkedin: string;
    };
    summary: string;
    education: Array<{
        school: string;
        degree: string;
        date: string;
    }>;
    experience: Array<{
        company: string;
        role: string;
        date: string;
        description: string;
    }>;
    projects: Array<{
        name: string;
        description: string;
        techStack: string[];
        liveUrl: string;
        githubUrl: string;
        isOpen?: boolean; // For collapsible state (UI only, but persisted for convenience)
    }>;
    skills: {
        technical: string[];
        soft: string[];
        tools: string[];
    };
    template: 'classic' | 'modern' | 'minimal';
    colorTheme: string;
}

const sampleData: ResumeData = {
    personalInfo: {
        fullName: "John Doe",
        email: "john@example.com",
        phone: "+1 234 567 890",
        location: "New York, NY",
        github: "github.com/johndoe",
        linkedin: "linkedin.com/in/johndoe"
    },
    summary: "Results-driven software engineer with 5+ years of experience in building scalable web applications. Expert in architectural design and performance optimization across distributed systems.",
    education: [
        { school: "University of Tech", degree: "B.S. Computer Science", date: "2015 - 2019" }
    ],
    experience: [
        { company: "CloudScale", role: "Senior Engineer", date: "2020 - Present", description: "Led development of core API serving 10M+ daily requests. Optimized database queries reducing latency by 45% using PostgreSQL indexing." }
    ],
    projects: [
        {
            name: "EcoTrack",
            description: "Sustainability tracking app used by 10k+ users. Integrated 3 different third-party APIs.",
            techStack: ["React", "Node.js", "PostgreSQL"],
            liveUrl: "ecotrack.app",
            githubUrl: "github.com/johndoe/ecotrack",
            isOpen: false
        }
    ],
    skills: {
        technical: ["TypeScript", "React", "Node.js", "GraphQL", "PostgreSQL"],
        soft: ["Team Leadership", "Problem Solving"],
        tools: ["Git", "Docker", "AWS"]
    },
    template: 'classic',
    colorTheme: 'hsl(168, 60%, 40%)'
};

const STORAGE_KEY = 'resumeBuilderData';

const initialData: ResumeData = {
    personalInfo: { fullName: '', email: '', phone: '', location: '', github: '', linkedin: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: {
        technical: [],
        soft: [],
        tools: []
    },
    template: 'classic',
    colorTheme: 'hsl(168, 60%, 40%)'
};

const getSavedData = (): ResumeData => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Handle migration from old skills structure if necessary
            if (Array.isArray(parsed.skills)) {
                parsed.skills = {
                    technical: parsed.skills,
                    soft: [],
                    tools: []
                };
            }
            // Add missing keys for robustness
            return { ...initialData, ...parsed };
        } catch (e) {
            return initialData;
        }
    }
    return initialData;
};

export const useResumeData = () => {
    const [data, setData] = useState<ResumeData>(getSavedData());

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    const loadSample = () => setData(sampleData);

    const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
        setData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value }
        }));
    };

    const updateSummary = (value: string) => setData(prev => ({ ...prev, summary: value }));

    const updateTemplate = (template: ResumeData['template']) => setData(prev => ({ ...prev, template }));

    const updateColorTheme = (color: string) => setData(prev => ({ ...prev, colorTheme: color }));

    const addEducation = () => {
        setData(prev => ({
            ...prev,
            education: [...prev.education, { school: '', degree: '', date: '' }]
        }));
    };

    const addExperience = () => {
        setData(prev => ({
            ...prev,
            experience: [...prev.experience, { company: '', role: '', date: '', description: '' }]
        }));
    };

    const addProject = () => {
        setData(prev => ({
            ...prev,
            projects: [...prev.projects, {
                name: '',
                description: '',
                techStack: [],
                liveUrl: '',
                githubUrl: '',
                isOpen: true
            }]
        }));
    };

    const removeSectionItem = (section: 'education' | 'experience' | 'projects', index: number) => {
        setData(prev => {
            const newList = [...prev[section]];
            newList.splice(index, 1);
            return { ...prev, [section]: newList };
        });
    };

    const updateEducation = (index: number, field: keyof ResumeData['education'][0], value: string) => {
        setData(prev => {
            const newList = [...prev.education];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, education: newList };
        });
    };

    const updateExperience = (index: number, field: keyof ResumeData['experience'][0], value: string) => {
        setData(prev => {
            const newList = [...prev.experience];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, experience: newList };
        });
    };

    const updateProject = (index: number, field: keyof ResumeData['projects'][0], value: any) => {
        setData(prev => {
            const newList = [...prev.projects];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, projects: newList };
        });
    };

    const toggleProjectOpen = (index: number) => {
        setData(prev => {
            const newList = [...prev.projects];
            newList[index] = { ...newList[index], isOpen: !newList[index].isOpen };
            return { ...prev, projects: newList };
        });
    };

    const updateSkillCategory = (category: keyof ResumeData['skills'], skills: string[]) => {
        setData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: skills
            }
        }));
    };

    const addSkill = (category: keyof ResumeData['skills'], skill: string) => {
        if (!skill.trim()) return;
        setData(prev => {
            if (prev.skills[category].includes(skill.trim())) return prev;
            return {
                ...prev,
                skills: {
                    ...prev.skills,
                    [category]: [...prev.skills[category], skill.trim()]
                }
            };
        });
    };

    const removeSkill = (category: keyof ResumeData['skills'], skill: string) => {
        setData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: prev.skills[category].filter(s => s !== skill)
            }
        }));
    };

    const suggestSkills = async () => {
        // Mock loading for 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(prev => ({
            ...prev,
            skills: {
                technical: Array.from(new Set([...prev.skills.technical, "TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"])),
                soft: Array.from(new Set([...prev.skills.soft, "Team Leadership", "Problem Solving"])),
                tools: Array.from(new Set([...prev.skills.tools, "Git", "Docker", "AWS"]))
            }
        }));
    };

    // Deterministic ATS Scoring per new requirements
    const calculateScore = () => {
        let score = 0;
        const suggestions: string[] = [];

        // 1. Name (+10)
        if (data.personalInfo.fullName) {
            score += 10;
        } else {
            suggestions.push("Add your full name (+10 points)");
        }

        // 2. Email (+10)
        if (data.personalInfo.email) {
            score += 10;
        } else {
            suggestions.push("Provide an email address (+10 points)");
        }

        // 3. Summary > 50 chars (+10)
        if (data.summary.length > 50) {
            score += 10;
        } else {
            suggestions.push("Write a summary of at least 50 characters (+10 points)");
        }

        // 4. Experience with bullets (+15)
        const activeExp = data.experience.filter(exp => exp.company);
        const hasExp = activeExp.length > 0;
        const hasBullets = activeExp.some(exp =>
            exp.description.includes('•') ||
            exp.description.includes('-') ||
            exp.description.includes('\n')
        );

        if (hasExp && hasBullets) {
            score += 15;
        } else if (!hasExp) {
            suggestions.push("Add at least one experience entry (+15 points)");
        } else {
            suggestions.push("Use bullet points in your experience description (+5 points)");
            score += 10; // Partial score for having experience but no bullets
        }

        // 5. Education (+10)
        if (data.education.some(edu => edu.school)) {
            score += 10;
        } else {
            suggestions.push("Add your educational background (+10 points)");
        }

        // 6. Skills >= 5 (+10)
        const totalSkills = data.skills.technical.length + data.skills.soft.length + data.skills.tools.length;
        if (totalSkills >= 5) {
            score += 10;
        } else {
            suggestions.push("Add at least 5 skills across categories (+10 points)");
        }

        // 7. Projects (+10)
        if (data.projects.some(p => p.name)) {
            score += 10;
        } else {
            suggestions.push("Add a project title to showcase your work (+10 points)");
        }

        // 8. Phone (+5)
        if (data.personalInfo.phone) {
            score += 5;
        } else {
            suggestions.push("Add your phone number (+5 points)");
        }

        // 9. LinkedIn (+5)
        if (data.personalInfo.linkedin) {
            score += 5;
        } else {
            suggestions.push("Add your LinkedIn profile link (+5 points)");
        }

        // 10. GitHub (+5)
        if (data.personalInfo.github) {
            score += 5;
        } else {
            suggestions.push("Add your GitHub profile link (+5 points)");
        }

        // 11. Action Verbs in Summary (+10)
        const ACTION_VERBS = ['built', 'led', 'designed', 'implemented', 'developed', 'created', 'optimized', 'managed', 'developed', 'improved'];
        const hasActionVerbs = ACTION_VERBS.some(verb => data.summary.toLowerCase().includes(verb));
        if (hasActionVerbs) {
            score += 10;
        } else if (data.summary.length > 0) {
            suggestions.push("Use strong action verbs (built, led, designed) in your summary (+10 points)");
        }

        return {
            score: Math.min(100, score),
            suggestions: suggestions.slice(0, 4)
        };
    };

    const { score, suggestions } = calculateScore();

    return {
        data,
        score,
        suggestions,
        loadSample,
        updatePersonalInfo,
        updateSummary,
        updateTemplate,
        updateColorTheme,
        addEducation,
        addExperience,
        addProject,
        removeSectionItem,
        updateEducation,
        updateExperience,
        updateProject,
        toggleProjectOpen,
        updateSkillCategory,
        addSkill,
        removeSkill,
        suggestSkills
    };
};
