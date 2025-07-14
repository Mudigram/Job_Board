import { useEffect, useRef, useState } from 'react';
import { supabase } from './lib/supabase';
import { ChevronsUp, Info, Mail } from 'lucide-react';
import { Moon, Sun } from "lucide-react";
import { Analytics } from "@vercel/analytics/next"

// Job type definition
type Job = {
  id: string;
  timestamp: string;
  company_name: string;
  company_email?: string;
  job_title: string;
  job_description?: string;
  country: string;
  work_mode: 'Remote' | 'Onsite' | 'Hybrid';
  state?: string;
  salary?: string;
  start_timeframe?: string;
  job_type?: string;
  source?: string;
};

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [visibleInternship, setVisibleInternship] = useState(3);
  const [visibleSiwes, setVisibleSiwes] = useState(3);
  const [visibleFullTime, setVisibleFullTime] = useState(3);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [fetchError, setFetchError] = useState('');


  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const { data, error } = await supabase.from('jobs').select('*').order('timestamp', { ascending: false });
      if (error) {
        console.error('❌ Error fetching jobs:', error);
        setFetchError('Failed to load jobs. Please try again later.');
      } else {
        setJobs(data);
        setFetchError('');
      }

      setLoading(false);
    }

    fetchJobs();
    const handleScroll = () => setShowScrollTop(window.scrollY > 200);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
      if (e.key === 'Tab' && showModal && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal]);

  const filteredJobs = jobs.filter((job) => {
    const matchSearch = job.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) || job.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) || job.state?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMode = selectedMode ? job.work_mode === selectedMode : true;
    return matchSearch && matchMode;
  });

  const internshipJobs = filteredJobs.filter((job) => job.job_type?.toLowerCase() === 'internship');
  const siwesJobs = filteredJobs.filter((job) => job.job_type?.toLowerCase() === 'siwes');
  const fullTimeJobs = filteredJobs.filter((job) => !job.job_type || job.job_type === null || job.job_type === '');

  const renderSkeletons = (count: number) => (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 mx-auto text-center">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white dark:bg-[#1f1f1f] rounded-xl border border-[#E0E0E0] dark:border-[#333333] p-5 animate-pulse space-y-4">
          <div className="h-4 bg-[#E0E0E0] dark:bg-[#444444] rounded w-3/4"></div>
          <div className="h-4 bg-[#E0E0E0] dark:bg-[#444444] rounded w-1/2"></div>
          <div className="h-3 bg-[#E0E0E0] dark:bg-[#444444] rounded w-full"></div>
          <div className="h-3 bg-[#E0E0E0] dark:bg-[#444444] rounded w-full"></div>
          <div className="h-3 bg-[#E0E0E0] dark:bg-[#444444] rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );


  const renderJobSection = (title: string, jobList: Job[], visibleCount: number, setVisibleCount: React.Dispatch<React.SetStateAction<number>>) => (
    <div className="mb-12 w-full max-w-7xl mx-auto px-4 text-center">
      <h2 className="text-2xl font-heading text-[#333] dark:text-white mb-4 text-center">{title}</h2>
      <hr className="border-[#E0E0E0] dark:border-[#444444] mb-6" />
      {loading ? renderSkeletons(3) : jobList.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-[#777777] dark:text-gray-400">
          <Info className="mb-2 w-5 h-5 text-[#4A90E2]" />
          <p className="text-sm">No jobs found for this category or filter.</p>
        </div>

      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {jobList.slice(0, visibleCount).map((job) => (
            <div key={job.id} onClick={() => { setSelectedJob(job); setShowModal(true); }} className="cursor-pointer bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#E0E0E0] dark:border-[#333] p-5 space-y-2 hover:shadow-md hover:scale-[1.015] transition-all duration-200 ease-in-out">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-[#333] dark:text-white">{job.job_title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${job.job_type?.toLowerCase() === 'internship' ? 'bg-blue-100 text-blue-800' : job.job_type?.toLowerCase() === 'siwes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{job.job_type || 'Full Time'}</span>
              </div>
              <p className="text-[#555] dark:text-gray-300">{job.company_name}</p>
              <p className="text-sm text-[#777777] dark:text-gray-400">📍 {job.state || 'N/A'}, {job.country}</p>
              <p className="text-sm text-[#777777] dark:text-gray-400">💼 <strong>Mode:</strong> {job.work_mode}</p>
              <p className="text-sm text-[#777777] dark:text-gray-400">💰 <strong>Salary:</strong> {job.salary || 'Not Specified'}</p>
            </div>
          ))}
        </div>
      )}
      {jobList.length > visibleCount && !loading && (
        <div className="text-center mt-6">
          <button onClick={() => setVisibleCount((prev) => prev + 6)} className="px-5 py-2 text-sm font-medium rounded bg-[#4A90E2] text-white hover:bg-[#3B7DC6] transition-colors">View More</button>
        </div>
      )}
    </div>
  );


  return (
    <div className={`${darkMode ? 'dark' : ''} overflow-x-hidden`}>
      <div className="min-h-screen bg-[#F8F8F8] dark:bg-[#121212] px-4 md:px-10 py-8 font-sans relative transition-colors duration-300 w-full max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-heading text-[#333333] dark:text-white text-center mx-auto ${loading && 'opacity-50 animate-pulse'}`}>🔥 Latest Job Openings</h1>


          <button onClick={() => setDarkMode(!darkMode)} className=" absolute right-4 top-4 text-m px-1 py-1 bg-[#4A90E2] text-white rounded hover:bg-[#3B7DC6]">{darkMode ? <Sun className="text-yellow-400" size={15} /> : <Moon className="text-white-800" size={15} />}</button>
        </div>

        <div className="sticky top-0 z-20 bg-[#F8F8F8] dark:bg-[#121212] py-3 px-4 shadow md:shadow-none transition-colors">
          <div className="container mx-auto flex flex-col md:flex-row gap-3 md:gap-4 justify-center px-4">

            <input type="text" placeholder="Search by title, company or state..." className="p-3 rounded border border-[#E0E0E0] dark:border-[#333] focus:outline-none focus:ring-2 focus:ring-[#4A90E2] bg-white dark:bg-[#1f1f1f] text-[#333333] dark:text-white w-full md:w-[300px]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="p-3 rounded border border-[#E0E0E0] dark:border-[#333] focus:outline-none focus:ring-2 focus:ring-[#4A90E2] bg-white dark:bg-[#1f1f1f] text-[#333333] dark:text-white w-full md:w-[200px]" value={selectedMode} onChange={(e) => setSelectedMode(e.target.value)}>
              <option value="">All Modes</option>
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
            </select>

          </div>
        </div>

        {fetchError && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-6 text-center max-w-2xl mx-auto">
            {fetchError}
          </div>
        )}


        {renderJobSection('🔵 Internship', internshipJobs, visibleInternship, setVisibleInternship)}
        {renderJobSection('🟢 SIWES', siwesJobs, visibleSiwes, setVisibleSiwes)}
        {renderJobSection('🔴 Full Time / Unspecified', fullTimeJobs, visibleFullTime, setVisibleFullTime)}

        {showScrollTop && <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 bg-[#4A90E2] text-white px-2 py-1 rounded-full shadow-lg hover:bg-[#3B7DC6] transition-all z-50"><ChevronsUp /></button>}


        {/* Modal */}

        {showModal && selectedJob && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4 py-10">
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="job-title"
              tabIndex={-1}
              className="bg-white dark:bg-[#1f1f1f] max-w-xl w-full rounded-lg shadow-lg p-6 relative transform transition-all duration-300 scale-95 animate-fadeInUp overflow-y-auto max-h-[90vh] focus:outline-none"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 text-l" aria-label="Close">X</button>
              <h3 id="job-title" className="text-xl font-bold text-[#333] dark:text-white mb-2">{selectedJob.job_title}</h3>
              <p className="text-[#555] dark:text-gray-300 mb-1"><strong>Company:</strong> {selectedJob.company_name}</p>
              <p className="text-[#777777] dark:text-gray-400 mb-1"><strong>Work Mode:</strong> {selectedJob.work_mode}</p>
              <p className="text-[#777777] dark:text-gray-400 mb-1"><strong>Location:</strong> {selectedJob.state || 'N/A'}, {selectedJob.country}</p>
              <p className="text-[#777777] dark:text-gray-400 mb-1"><strong>Salary:</strong> {selectedJob.salary || 'Not Specified'}</p>
              <p className="text-[#777777] dark:text-gray-400 mb-1"><strong>Start:</strong> {selectedJob.start_timeframe}</p>
              <p className="text-[#777777] dark:text-gray-400 mb-1"><strong>Type:</strong> {selectedJob.job_type || 'Full Time'}</p>

              {/* Job Description */}
              {selectedJob.job_description && (
                <p className="bg-[#F8F8F8] dark:bg-[#2a2a2a] p-3 mt-3 rounded text-sm text-[#444] dark:text-gray-300 whitespace-pre-wrap">
                  {selectedJob.job_description}
                </p>
              )}

              {/* Visible Recruiter Email */}
              {selectedJob.company_email && (
                <p className="text-[#777777] dark:text-gray-400 mt-4 text-sm">
                  <strong>Recruiter Email:</strong> {selectedJob.company_email}
                </p>
              )}

              {/* Mail Button */}
              {selectedJob.company_email && (
                <a
                  href={`mailto:${selectedJob.company_email}?subject=Application for ${selectedJob.job_title}`}
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-[#4A90E2] text-white text-sm font-medium rounded hover:bg-[#3B7DC6] transition-colors"
                >
                  <Mail className="w-4 h-4" /> Send Email to Recruiter
                </a>
              )}
            </div>
          </div>
        )}
        {showAboutModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowAboutModal(false)}
          >
            <div
              className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-xl max-w-md w-full text-left relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAboutModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
              >
                ✖
              </button>
              <h2 className="text-xl font-bold text-[#333] dark:text-white mb-3">About This Project</h2>
              <p className="text-[#555] dark:text-gray-300 text-sm">
                This project was built by <strong>Mudi</strong> to streamline public job board access using
                React, Supabase, and modern frontend tools.
                <br />
                View more of my work:
                <a
                  href="https://github.com/Mudigram"
                  className="text-[#4A90E2] hover:underline ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Profile
                </a>
              </p>
            </div>
          </div>
        )}

      </div>
      <Analytics />

      {/* Footer */}
      <footer className="w-full px-4 py-8 bg-[#F8F8F8] dark:bg-[#1a1a1a] border-t border-[#E5E7EB] dark:border-[#333] text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-[#555] dark:text-gray-300">
            Built with ❤️ by{" "}
            <a
              href="https://mudigram.github.io/Portfolio_Website/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4A90E2] hover:underline font-medium"
            >
              Mudi
            </a>
          </p>
          <p className="text-sm text-[#555] dark:text-gray-300"> View source on GitHub. Learn more about this project.</p>

          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => setShowAboutModal(true)}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-[#4A90E2] hover:bg-[#3B7DC6] text-white rounded-md transition-colors"
            >
              <Info size={16} />
              About
            </button>

            <a
              href="https://github.com/Mudigram"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-[#4A90E2] hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.832 2.807 1.303 3.492.997.108-.776.418-1.303.762-1.603-2.665-.304-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.513 11.513 0 013.003-.404c1.02.005 2.048.137 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.654 1.653.242 2.873.119 3.176.77.84 1.235 1.91 1.235 3.221 0 4.61-2.807 5.624-5.48 5.921.43.37.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.297 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
