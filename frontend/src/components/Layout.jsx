
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const timeout = setTimeout(() => {
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);

      return () => clearTimeout(timeout);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, hash]);

  return null;
}

export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Orders24 home">
      <img
        src="/images/header-logo.png"
        alt="Orders24"
        className="brand-logo"
      />
    </Link>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { pathname } = useLocation();
  const brand = 'Orders24';

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <>
      <ScrollManager />

      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header className="site-header">
        <div className="container header-inner">
          <Brand />

          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen((previous) => !previous)}
          >
            {open ? 'Close' : 'Menu'}
          </button>

          <nav
            id="primary-nav"
            className={`nav ${open ? 'is-open' : ''}`}
            aria-label="Primary"
          >
            <NavLink to="/features">Features</NavLink>
            <Link to="/#switch">Switch</Link>
            <Link to="/#savings">Savings</Link>
            <NavLink to="/contact">Contact</NavLink>
            <Link to="/book-a-demo" className="btn btn-primary btn-sm">
              Book a demo
            </Link>
          </nav>
        </div>
      </header>

      <main id="main">
        <Outlet context={{ brand }} />
      </main>

      <footer className="site-footer">
        <div className="container company-footer">
          <div className="company-details">
            <h2>Aadvik Techie Views Private Limited</h2>

            <p>
              S No 14/9, Sholapur Road, Near Mile No 6,
              Pune New Bazar, Pune City, Maharashtra, 411001
            </p>

            <p>CIN: U62099PN2025PTC244061</p>

            <p>
              Email:{' '}
              <a href="mailto:info@aadviktechie.in">
                info@aadviktechie.in
              </a>
            </p>

            <p>
              Website:{' '}
              <a
                href="https://aadviktechie.in"
                target="_blank"
                rel="noreferrer"
              >
                aadviktechie.in
              </a>
            </p>
          </div>

          <div className="footer-brand-social">
            <img
              src="/images/footer-logo.png"
              alt="Aadvik Techie Views logo"
              className="footer-company-logo"
            />

            <div className="company-social">
              <h3>Connect with us</h3>

              <a
                href="https://in.linkedin.com/company/aadvik-techie-views-private-limited"
                target="_blank"
                rel="noreferrer"
                aria-label="Aadvik Techie Views on LinkedIn"
                className="social-link"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05a3.75 3.75 0 0 1 3.37-1.85c3.6 0 4.26 2.37 4.26 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"
                  />
                </svg>
                LinkedIn
              </a>

              <a
                href="https://www.instagram.com/aadvik_techie_views_pvt_ltd/"
                target="_blank"
                rel="noreferrer"
                aria-label="Aadvik Techie Views on Instagram"
                className="social-link"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2.2A2.8 2.8 0 0 0 4.2 7v10A2.8 2.8 0 0 0 7 19.8h10a2.8 2.8 0 0 0 2.8-2.8V7A2.8 2.8 0 0 0 17 4.2H7Zm5 2.3a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Zm0 2.2a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Zm5.7-3.2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Z"
                  />
                </svg>
                Instagram
              </a>
            </div>
          </div>

          <p className="company-copyright">
            © {new Date().getFullYear()} Aadvik Techie Views Private Limited.
            All rights reserved.
          </p>
        </div>
      </footer>

      {showScrollTop && (
        <button
          type="button"
          className="scroll-top"
          onClick={scrollToTop}
          aria-label="Scroll to top of page"
          title="Scroll to top"
        >
          <span aria-hidden="true">↑</span>
          Back to top
        </button>
      )}
    </>
  );
}
