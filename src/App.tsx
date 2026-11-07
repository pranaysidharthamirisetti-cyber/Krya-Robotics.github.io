import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import Products from './components/Products';
import Solutions from './components/Solutions';
import Fleet from './components/Fleet';
import TechSpecs from './components/TechSpecs';
import RoiDeploy from './components/RoiDeploy';
import Roadmap from './components/Roadmap';
import Careers from './components/Careers';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import RobotField from './components/RobotField';

export default function App() {
  // Scroll-reveal: fade & rise sections into view as the user scrolls
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-slate-50 text-slate-800">
      {/* Interactive background: wandering robots canvas + grid + soft orbs */}
      <RobotField />
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40 z-0" />
      <div className="fixed -top-40 -left-40 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-cyan-400/25 z-0" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-indigo-300/30 z-0" />

      <div className="relative z-10">
        <Header />

        <main>
          <Hero />
          <TrustedBy />
          <div className="reveal">
            <Products />
          </div>
          <div className="reveal">
            <Solutions />
          </div>
          <div className="reveal">
            <Fleet />
          </div>
          <div className="reveal">
            <TechSpecs />
          </div>
          <div className="reveal">
            <RoiDeploy />
          </div>
          <div className="reveal">
            <Roadmap />
          </div>
          <div className="reveal">
            <Careers />
          </div>
          <div className="reveal">
            <Faq />
          </div>
          <div className="reveal">
            <Contact />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
