// frontend/src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const FeatureIcon = ({ children }) => (
  <div className="mx-auto bg-indigo-100 text-indigo-600 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-lg transition-transform transform hover:scale-110">
    {children}
  </div>
);

// --- ENHANCED Testimonial Card ---
const TestimonialCard = ({ quote, author, title, avatarUrl }) => (
    <div className="bg-white p-8 rounded-lg shadow-lg h-full flex flex-col border border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <svg className="w-10 h-10 text-indigo-200 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M9.33 6.984h5.336l-2.672 8h-5.336l2.672-8zM22.67 6.984h5.336l-2.672 8h-5.336l2.672-8z" />
        </svg>
        <p className="text-gray-600 italic mb-6 flex-grow text-lg">"{quote}"</p>
        <div className="flex items-center">
            <img className="w-12 h-12 rounded-full mr-4" src={avatarUrl} alt={author} />
            <div>
                <p className="font-bold text-gray-900">{author}</p>
                <p className="text-sm text-gray-500">{title}</p>
            </div>
        </div>
    </div>
);


const LandingPage = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gray-50 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        
        <div className="relative container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12">
            <div className="text-center lg:text-left max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                    Hire <span className="text-indigo-600">Smarter</span>,<br /> Not Harder.
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8">
                    Our AI-powered platform analyzes, ranks, and shortlists candidates in seconds — so you can focus on what really matters: hiring the perfect fit.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                    <Link
                        to="/register"
                        className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg w-full sm:w-auto"
                    >
                        Get Started Free
                    </Link>
                    <Link
                        to="/demo"
                        className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-full border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-transform transform hover:scale-105 w-full sm:w-auto"
                    >
                        Book a Demo
                    </Link>
                </div>
            </div>
            <div className="relative w-full lg:w-1/2 flex justify-center">
                <img
                    src="https://illustrations.popsy.co/gray/work-from-home.svg"
                    alt="AI hiring illustration"
                    className="w-full max-w-md lg:max-w-lg drop-shadow-2xl"
                />
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">The Future of Recruitment is Here</h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="transform hover:-translate-y-2 transition-transform">
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </FeatureIcon>
              <h3 className="text-xl font-bold mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">Go beyond keywords. Our NLP engine understands context and skills to provide an intelligent match score.</p>
            </div>
            <div className="transform hover:-translate-y-2 transition-transform">
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              </FeatureIcon>
              <h3 className="text-xl font-bold mb-2">Automated Shortlisting</h3>
              <p className="text-gray-600">Upload dozens of resumes at once and get an instantly ranked list of the most qualified candidates.</p>
            </div>
            <div className="transform hover:-translate-y-2 transition-transform">
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </FeatureIcon>
              <h3 className="text-xl font-bold mb-2">Continuous Learning</h3>
              <p className="text-gray-600">The AI adapts to your hiring preferences, getting smarter and more accurate with every candidate you approve.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Get Started in 3 Simple Steps</h2>
              <div className="relative">
                  <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 border-t-2 border-dashed border-gray-300"></div>
                  <div className="relative grid md:grid-cols-3 gap-12">
                      <div className="text-center">
                          <div className="relative mb-4">
                              <div className="mx-auto w-16 h-16 bg-white border-4 border-indigo-500 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-500 z-10 relative">1</div>
                          </div>
                          <h3 className="text-xl font-bold mb-2">Upload</h3>
                          <p className="text-gray-600">Provide a job description and upload all candidate resumes at once.</p>
                      </div>
                      <div className="text-center">
                          <div className="relative mb-4">
                              <div className="mx-auto w-16 h-16 bg-white border-4 border-indigo-500 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-500 z-10 relative">2</div>
                          </div>
                          <h3 className="text-xl font-bold mb-2">Analyze & Rank</h3>
                          <p className="text-gray-600">Our AI instantly processes every resume and provides a ranked list based on match score.</p>
                      </div>
                      <div className="text-center">
                          <div className="relative mb-4">
                              <div className="mx-auto w-16 h-16 bg-white border-4 border-indigo-500 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-500 z-10 relative">3</div>
                          </div>
                          <h3 className="text-xl font-bold mb-2">Hire with Confidence</h3>
                          <p className="text-gray-600">Focus your time on the top candidates and make data-driven hiring decisions.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* --- ENHANCED Testimonials Section --- */}
      <section className="py-20 bg-indigo-50">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Trusted by Modern Recruiters</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <TestimonialCard 
                    quote="Smart Resume Match cut our screening time by over 80%. We can now focus on interviewing top-tier talent instead of sifting through endless resumes."
                    author="Priya Sharma"
                    title="Lead Recruiter, Tech Innovators Inc."
                    avatarUrl="https://placehold.co/100x100/E9D5FF/3730A3?text=PS"
                />
                <TestimonialCard 
                    quote="The AI's ability to learn from our feedback is a game-changer. The rankings get more accurate with every job we fill. I can't imagine going back to the old way."
                    author="Arjun Reddy"
                    title="HR Manager, NextGen Solutions"
                    avatarUrl="https://placehold.co/100x100/C7D2FE/3730A3?text=AR"
                />
            </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Revolutionize Your Hiring?</h2>
          <p className="text-indigo-200 mb-8 max-w-2xl mx-auto">Join hundreds of recruiters who are saving time and making better hires with Smart Resume Match.</p>
          <Link
            to="/register"
            className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-lg"
          >
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto text-center">
              <p>&copy; 2025 Smart Resume Match. All rights reserved.</p>
              <p className="text-sm text-gray-400 mt-2">Made with ♥ in Guntur</p>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
