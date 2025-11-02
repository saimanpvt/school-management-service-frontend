import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Calendar,
  Users,
  MessageSquare,
  Award,
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
  Bell,
  Star,
  ArrowRight,
  Play,
  Menu,
  X,
} from "lucide-react";
import styles from "./index.module.css";

export default function EduConnectLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Users, title: "Smart User Management", desc: "Manage students, teachers, and staff with AI-powered insights and automation" },
    { icon: Calendar, title: "Interactive Classes", desc: "Real-time scheduling with automated attendance tracking and notifications" },
    { icon: Award, title: "Achievement System", desc: "Gamified recognition to motivate and celebrate student success" },
    { icon: MessageSquare, title: "Instant Communication", desc: "Connect with parents and students through integrated messaging" },
    { icon: TrendingUp, title: "Analytics Dashboard", desc: "Deep insights into performance metrics and engagement patterns" },
    { icon: Shield, title: "Bank-Grade Security", desc: "Enterprise-level protection with encrypted data storage" },
  ];

  const testimonials = [
    { name: "Dr. Sarah Johnson", role: "Principal, Green Valley School", text: "EduConnect transformed our entire workflow. The AI features save us hours every week and students are more engaged than ever.", avatar: "SJ" },
    { name: "Mark Stevens", role: "Teacher, Riverside Academy", text: "Finally, a platform that actually understands what educators need. The communication tools are incredible.", avatar: "MS" },
    { name: "Jennifer Smith", role: "Parent", text: "I love staying connected with my child's progress. The app is intuitive and keeps me informed about everything.", avatar: "JS" },
  ];

  return (
    <div className={styles["landing-page"]}>
      {/* Background Blobs */}
      <div className={styles["bg-container"]}>
        <div className={`${styles["blob"]} ${styles["blob-1"]}`}></div>
        <div className={`${styles["blob"]} ${styles["blob-2"]}`}></div>
        <div className={`${styles["blob"]} ${styles["blob-3"]}`}></div>
      </div>

      {/* Navbar */}
      <nav className={`${styles["navbar"]} ${scrolled ? styles["navbar-scrolled"] : ""}`}>
        <div className={styles["navbar-container"]}>
          <div className={styles["navbar-logo"]}>
            <GraduationCap className={styles["logo-icon"]} />
            <span className={styles["navbar-logo-text"]}>EduConnect</span>
          </div>
          <div className={styles["navbar-actions"]}>
            <button className={styles["btn-primary"]}>Login</button>
            <button className={styles["btn-primary"]}>Sign Up</button>
          </div>
          <button className={styles["mobile-menu-btn"]} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>Ī
        {mobileMenuOpen && (
          <div className={styles["mobile-menu"]}>
            <div className={styles["mobile-menu-content"]}>
              <button className={styles["btn-primary"]}>Login</button>
              <button className={styles["btn-primary"]}>Sign Up</button>
            </div>
          </div>
        )}
      </nav>
      {/* Hero Section */}
      <section className={styles["hero-section"]}>
        <div className={styles["hero-badge"]}>
          <Zap />
          <span>AI-Powered School Management</span>
        </div>

        <h1 className={styles["hero-title"]}>
          Transform Your School Into a <span className={styles["hero-title-highlight"]}>Digital Powerhouse</span>
        </h1>

        <p className={styles["hero-description"]}>
          EduConnect brings AI-driven insights, seamless communication, and powerful automation to modern education. Join 10,000+ schools revolutionizing learning.
        </p>

        <div className={styles["hero-buttons"]}>
          <button className={styles["btn-hero-primary"]}>
            Start Free Trial <ArrowRight />
          </button>
          <button className={styles["btn-hero-secondary"]}>
            <Play /> Watch Demo
          </button>
        </div>

        {/* Stats */}
        <div className={styles["stats-section"]}>
          <div className={styles["stat-item"]}>
            <div className={styles["stat-value"]}>10K+</div>
            <div className={styles["stat-label"]}>Active Schools</div>
          </div>
          <div className={styles["stat-item"]}>
            <div className={styles["stat-value"]}>500K+</div>
            <div className={styles["stat-label"]}>Students</div>
          </div>
          <div className={styles["stat-item"]}>
            <div className={styles["stat-value"]}>99.9%</div>
            <div className={styles["stat-label"]}>Uptime</div>
          </div>
          <div className={styles["stat-item"]}>
            <div className={styles["stat-value"]}>50+</div>
            <div className={styles["stat-label"]}>Countries</div>
          </div>
        </div>

        {/* Floating Cards */}
        <div className={`${styles["floating-card"]} ${styles["floating-card-1"]}`}>
          <div className={styles["floating-card-content"]}>
            <div className={styles["floating-icon"]}><CheckCircle /></div>
            <div className={styles["floating-text"]}>
              <h4 className={styles["floating-text-title"]}>Attendance</h4>
              <p className={styles["floating-text-desc"]}>98% Today</p>
            </div>
          </div>
        </div>

        <div className={`${styles["floating-card"]} ${styles["floating-card-2"]}`}>
          <div className={styles["floating-card-content"]}>
            <div className={styles["floating-icon"]}><Bell /></div>
            <div className={styles["floating-text"]}>
              <h4 className={styles["floating-text-title"]}>New Message</h4>
              <p className={styles["floating-text-desc"]}>From Parent</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles["section"]}>
        <div className={styles["section-container"]}>
          <div className={styles["section-header"]}>
            <h2 className={styles["section-title"]}>
              Everything You Need, <span className={styles["title-highlight"]}>Nothing You Don't</span>
            </h2>
            <p className={styles["section-subtitle"]}>
              Powerful features designed specifically for modern educational institutions
            </p>
          </div>

          <div className={styles["features-grid"]}>
            {features.map((feature, i) => (
              <div key={i} className={styles["feature-card"]}>
                <div className={styles["feature-icon"]}><feature.icon /></div>
                <h3 className={styles["feature-title"]}>{feature.title}</h3>
                <p className={styles["feature-description"]}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles["testimonials-section"]}>
        <div className={styles["section-container"]}>
          <div className={styles["section-header"]}>
            <h2 className={styles["section-title"]}>Loved by Educators Worldwide</h2>
            <p className={styles["section-subtitle"]}>See what our community has to say</p>
          </div>

          <div className={styles["testimonials-container"]}>
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className={`${styles["testimonial-card"]} ${activeTestimonial === i
                  ? styles["testimonial-active"]
                  : styles["testimonial-inactive"]
                  }`}
              >
                <div className={styles["testimonial-header"]}>
                  <div className={styles["testimonial-avatar"]}>
                    {testimonial.avatar}
                  </div>
                  <div className={styles["testimonial-info"]}>
                    <h4 className={styles["testimonial-name"]}>
                      {testimonial.name}
                    </h4>
                    <p className={styles["testimonial-role"]}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className={styles["testimonial-text"]}>
                  "{testimonial.text}"
                </p>
                <div className={styles["testimonial-stars"]}>
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={styles["star-icon"]} />
                  ))}
                </div>
              </div>
            ))}

            <div className={styles["testimonial-dots"]}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`${styles["testimonial-dot"]} ${activeTestimonial === i ? styles["dot-active"] : ""
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles["cta-section"]}>
        <div className={styles["section-container"]}>
          <h2 className={styles["cta-title"]}>Ready to Transform Your School?</h2>
          <p className={styles["cta-description"]}>
            Join 10,000+ schools already using EduConnect. Start your free trial today.
          </p>
          <button className={styles["btn-cta"]}>
            Start Free Trial <ArrowRight />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles["footer"]}>
        <div className={styles["footer-container"]}>
          <div className={styles["footer-grid"]}>
            <div className={styles["footer-brand"]}>
              <div className={styles["footer-logo"]}>
                <GraduationCap />
                <span className={styles["footer-logo-text"]}>EduConnect</span>
              </div>
              <p className={styles["footer-brand-text"]}>
                Empowering education through innovative technology solutions for modern schools.
              </p>
              <div className={styles["footer-social"]}>
                <a href="#" className={styles["footer-social-link"]}>Twitter</a>
                <a href="#" className={styles["footer-social-link"]}>LinkedIn</a>
                <a href="#" className={styles["footer-social-link"]}>Facebook</a>
              </div>
            </div>

            <div className={styles["footer-column"]}>
              <h3 className={styles["footer-column-title"]}>Product</h3>
              <ul className={styles["footer-links"]}>
                <li><a href="#" className={styles["footer-link"]}>Features</a></li>
                <li><a href="#" className={styles["footer-link"]}>Pricing</a></li>
                <li><a href="#" className={styles["footer-link"]}>Security</a></li>
                <li><a href="#" className={styles["footer-link"]}>Roadmap</a></li>
              </ul>
            </div>

            <div className={styles["footer-column"]}>
              <h3 className={styles["footer-column-title"]}>Company</h3>
              <ul className={styles["footer-links"]}>
                <li><a href="#" className={styles["footer-link"]}>About</a></li>
                <li><a href="#" className={styles["footer-link"]}>Blog</a></li>
                <li><a href="#" className={styles["footer-link"]}>Careers</a></li>
                <li><a href="#" className={styles["footer-link"]}>Press</a></li>
              </ul>
            </div>

            <div className={styles["footer-column"]}>
              <h3 className={styles["footer-column-title"]}>Support</h3>
              <ul className={styles["footer-links"]}>
                <li><a href="#" className={styles["footer-link"]}>Help Center</a></li>
                <li><a href="#" className={styles["footer-link"]}>Contact</a></li>
                <li><a href="#" className={styles["footer-link"]}>Status</a></li>
                <li><a href="#" className={styles["footer-link"]}>API Docs</a></li>
              </ul>
            </div>
          </div>

          <div className={styles["footer-bottom"]}>
            <p className={styles["footer-copyright"]}>
              © 2025 EduConnect. All rights reserved.
            </p>
            <div className={styles["footer-bottom-links"]}>
              <a href="#" className={styles["footer-bottom-link"]}>Privacy</a>
              <a href="#" className={styles["footer-bottom-link"]}>Terms</a>
              <a href="#" className={styles["footer-bottom-link"]}>Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
