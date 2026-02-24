
import { useState, useEffect } from 'react';
import { Search, MapPin, ExternalLink, Bookmark } from 'lucide-react';

const JOBS_DATA = [
    { id: '1', title: 'SDE Intern', company: 'Amazon', location: 'Bangalore', mode: 'Hybrid', experience: 'Fresher', skills: ['Java', 'Data Structures', 'Algorithms'], source: 'LinkedIn', postedDaysAgo: 1, salaryRange: '₹40k–₹60k/month', applyUrl: 'https://www.linkedin.com/jobs/view/1' },
    { id: '2', title: 'Graduate Engineer Trainee', company: 'TCS', location: 'Chennai', mode: 'Onsite', experience: '0-1', skills: ['Java', 'SQL', 'Spring Boot'], source: 'Naukri', postedDaysAgo: 3, salaryRange: '3–5 LPA', applyUrl: 'https://www.naukri.com/job/2' },
    { id: '3', title: 'Junior Backend Developer', company: 'Razorpay', location: 'Bangalore', mode: 'Hybrid', experience: '1-3', skills: ['Python', 'PostgreSQL', 'Redis'], source: 'LinkedIn', postedDaysAgo: 0, salaryRange: '10–18 LPA', applyUrl: 'https://www.linkedin.com/jobs/view/3' },
    { id: '4', title: 'Frontend Intern', company: 'Flipkart', location: 'Bangalore', mode: 'Remote', experience: 'Fresher', skills: ['React', 'JavaScript', 'CSS'], source: 'Indeed', postedDaysAgo: 2, salaryRange: '₹25k–₹35k/month', applyUrl: 'https://www.indeed.com/viewjob/4' },
    { id: '5', title: 'QA Intern', company: 'Wipro', location: 'Hyderabad', mode: 'Onsite', experience: 'Fresher', skills: ['Manual Testing', 'Selenium', 'JIRA'], source: 'Naukri', postedDaysAgo: 5, salaryRange: '₹15k–₹25k/month', applyUrl: 'https://www.naukri.com/job/5' },
];

export const JobTracker = () => {
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [jobs, setJobs] = useState(JOBS_DATA);
    const [saved, setSaved] = useState<string[]>(JSON.parse(localStorage.getItem('saved_jobs') || '[]'));

    useEffect(() => {
        const filtered = JOBS_DATA.filter(job =>
            (job.title.toLowerCase().includes(keyword.toLowerCase()) ||
                job.company.toLowerCase().includes(keyword.toLowerCase())) &&
            (location === '' || job.location.toLowerCase() === location.toLowerCase())
        );
        setJobs(filtered);
    }, [keyword, location]);

    const toggleSave = (id: string) => {
        const newSaved = saved.includes(id) ? saved.filter(s => s !== id) : [...saved, id];
        setSaved(newSaved);
        localStorage.setItem('saved_jobs', JSON.stringify(newSaved));
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <header className="mb-10">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Job Notification Tracker</h1>
                <p className="text-gray-600">Precision-matched job discovery delivered daily.</p>
            </header>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Keyword or company..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 appearance-none"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    >
                        <option value="">All Locations</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Remote">Remote</option>
                    </select>
                </div>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                    Search Jobs
                </button>
            </div>

            {/* Jobs Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map(job => (
                    <div key={job.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{job.title}</h3>
                                <p className="text-indigo-600 font-medium text-sm">{job.company}</p>
                            </div>
                            <button
                                onClick={() => toggleSave(job.id)}
                                className={`p-2 rounded-lg transition-colors ${saved.includes(job.id) ? 'bg-amber-50 text-amber-500' : 'bg-gray-50 text-gray-400 hover:text-gray-600'}`}
                            >
                                <Bookmark className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-100">{job.location}</span>
                            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-100">{job.mode}</span>
                            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border border-gray-100">{job.experience}</span>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-gray-900 font-bold text-sm">{job.salaryRange}</span>
                            <a
                                href={job.applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                Apply <ExternalLink className="ml-1 w-3 h-3" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {jobs.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500">No jobs found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};
