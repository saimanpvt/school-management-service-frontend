import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
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
  BarChart3,
  Globe,
  Lock,
  Clock,
  Smartphone,
  Building2,
  Target,
} from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import styles from './index.module.css';
import { useAuth } from '../lib/auth';
import { getDashboardUrl } from '../lib/utils/routing';

export default function EduConnectLanding() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set()
  );
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is authenticated, redirecting to dashboard');
      const dashboardUrl = getDashboardUrl(user.role, user.userID);
      router.push(dashboardUrl);
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section');
            if (sectionId) {
              setVisibleSections((prev) => new Set(prev).add(sectionId));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Don't render landing page if user is authenticated
  if (isAuthenticated && user) {
    return null;
  }

  // Growth data for charts
  const growthData = [
    { month: 'Jan', schools: 8200, students: 410000 },
    { month: 'Feb', schools: 8600, students: 430000 },
    { month: 'Mar', schools: 8900, students: 445000 },
    { month: 'Apr', schools: 9200, students: 460000 },
    { month: 'May', schools: 9500, students: 475000 },
    { month: 'Jun', schools: 9800, students: 490000 },
  ];

  const featureUsageData = [
    { name: 'Attendance', value: 35, color: '#6366f1' },
    { name: 'Grades', value: 28, color: '#8b5cf6' },
    { name: 'Messages', value: 22, color: '#a78bfa' },
    { name: 'Schedules', value: 15, color: '#c084fc' },
  ];

  const features = [
    {
      icon: Users,
      title: 'Smart User Management',
      desc: 'Manage students, teachers, and staff with AI-powered insights and automation',
    },
    {
      icon: Calendar,
      title: 'Interactive Classes',
      desc: 'Real-time scheduling with automated attendance tracking and notifications',
    },
    {
      icon: Award,
      title: 'Achievement System',
      desc: 'Gamified recognition to motivate and celebrate student success',
    },
    {
      icon: MessageSquare,
      title: 'Instant Communication',
      desc: 'Connect with parents and students through integrated messaging',
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      desc: 'Deep insights into performance metrics and engagement patterns',
    },
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      desc: 'Enterprise-level protection with encrypted data storage',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Principal, Green Valley School',
      text: 'EduConnect transformed our entire workflow. The AI features save us hours every week and students are more engaged than ever.',
      avatar: 'SJ',
    },
    {
      name: 'Mark Stevens',
      role: 'Teacher, Riverside Academy',
      text: 'Finally, a platform that actually understands what educators need. The communication tools are incredible.',
      avatar: 'MS',
    },
    {
      name: 'Jennifer Smith',
      role: 'Parent',
      text: "I love staying connected with my child's progress. The app is intuitive and keeps me informed about everything.",
      avatar: 'JS',
    },
  ];

  return (
    <div className={styles['landing-page']}>
      {/* Background Blobs */}
      <div className={styles['bg-container']}>
        <div className={`${styles['blob']} ${styles['blob-1']}`}></div>
        <div className={`${styles['blob']} ${styles['blob-2']}`}></div>
        <div className={`${styles['blob']} ${styles['blob-3']}`}></div>
      </div>

      {/* Navbar */}
      <nav
        className={`${styles['navbar']} ${
          scrolled ? styles['navbar-scrolled'] : ''
        }`}
      >
        <div className={styles['navbar-container']}>
          <div className={styles['navbar-logo']}>
            <GraduationCap className={styles['logo-icon']} />
            <span className={styles['navbar-logo-text']}>EduConnect</span>
          </div>
          <div className={styles['navbar-actions']}>
            <a href="/login" className={styles['btn-primary']}>
              Login
            </a>
          </div>
          <button
            className={styles['mobile-menu-btn']}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className={styles['mobile-menu']}>
            <div className={styles['mobile-menu-content']}>
              <a href="/login" className={styles['btn-primary']}>
                Login
              </a>
            </div>
          </div>
        )}
      </nav>
      {/* Hero Section */}
      <section className={styles['hero-section']}>
        <div className={styles['hero-badge']}>
          <Zap />
          <span>AI-Powered School Management</span>
        </div>

        <h1 className={styles['hero-title']}>
          Transform Your School Into a{' '}
          <span className={styles['hero-title-highlight']}>
            Digital Powerhouse
          </span>
        </h1>

        <p className={styles['hero-description']}>
          EduConnect brings AI-driven insights, seamless communication, and
          powerful automation to modern education. Join 10,000+ schools
          revolutionizing learning.
        </p>

        <div className={styles['hero-buttons']}>
          <a href="/signup" className={styles['btn-hero-primary']}>
            Start Free Trial <ArrowRight />
          </a>
          <a href="/login" className={styles['btn-hero-secondary']}>
            <Play /> Get Started
          </a>
        </div>

        {/* Stats */}
        <div className={styles['stats-section']}>
          <div className={styles['stat-item']}>
            <div className={styles['stat-value']}>10K+</div>
            <div className={styles['stat-label']}>Active Schools</div>
          </div>
          <div className={styles['stat-item']}>
            <div className={styles['stat-value']}>500K+</div>
            <div className={styles['stat-label']}>Students</div>
          </div>
          <div className={styles['stat-item']}>
            <div className={styles['stat-value']}>99.9%</div>
            <div className={styles['stat-label']}>Uptime</div>
          </div>
          <div className={styles['stat-item']}>
            <div className={styles['stat-value']}>50+</div>
            <div className={styles['stat-label']}>Countries</div>
          </div>
        </div>

        {/* Floating Cards */}
        <div
          className={`${styles['floating-card']} ${styles['floating-card-1']}`}
        >
          <div className={styles['floating-card-content']}>
            <div className={styles['floating-icon']}>
              <CheckCircle />
            </div>
            <div className={styles['floating-text']}>
              <h4 className={styles['floating-text-title']}>Attendance</h4>
              <p className={styles['floating-text-desc']}>98% Today</p>
            </div>
          </div>
        </div>

        <div
          className={`${styles['floating-card']} ${styles['floating-card-2']}`}
        >
          <div className={styles['floating-card-content']}>
            <div className={styles['floating-icon']}>
              <Bell />
            </div>
            <div className={styles['floating-text']}>
              <h4 className={styles['floating-text-title']}>New Message</h4>
              <p className={styles['floating-text-desc']}>From Parent</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className={styles['section']}
        data-section="features"
        ref={(el) => (sectionRefs.current['features'] = el)}
      >
        <div className={styles['section-container']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>
              Everything You Need,{' '}
              <span className={styles['title-highlight']}>
                Nothing You Don't
              </span>
            </h2>
            <p className={styles['section-subtitle']}>
              Powerful features designed specifically for modern educational
              institutions
            </p>
          </div>

          <div
            className={`${styles['features-grid']} ${
              visibleSections.has('features') ? styles['fade-in'] : ''
            }`}
          >
            {features.map((feature, i) => (
              <div key={i} className={styles['feature-card']}>
                <div className={styles['feature-icon']}>
                  <feature.icon />
                </div>
                <h3 className={styles['feature-title']}>{feature.title}</h3>
                <p className={styles['feature-description']}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase Section with Visuals */}
      <section
        className={styles['section']}
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        }}
        data-section="features-showcase"
        ref={(el) => (sectionRefs.current['features-showcase'] = el)}
      >
        <div className={styles['section-container']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>
              See <span className={styles['title-highlight']}>EduConnect</span>{' '}
              in Action
            </h2>
            <p className={styles['section-subtitle']}>
              Explore our powerful features designed to transform your school
              management
            </p>
          </div>

          <div className={styles['features-showcase']}>
            {/* Feature 1: Dashboard */}
            <div
              className={`${styles['feature-showcase-item']} ${
                styles['alternate']
              } ${
                visibleSections.has('features-showcase')
                  ? styles['fade-in']
                  : ''
              }`}
            >
              <div className={styles['feature-showcase-content']}>
                <div className={styles['feature-badge']}>
                  📊 Dashboard Analytics
                </div>
                <h3 className={styles['feature-showcase-title']}>
                  Real-Time Insights & Analytics
                </h3>
                <p className={styles['feature-showcase-desc']}>
                  Get comprehensive insights into student performance,
                  attendance trends, and academic progress with interactive
                  dashboards. Make data-driven decisions with AI-powered
                  analytics.
                </p>
                <ul className={styles['feature-list']}>
                  <li>📈 Performance metrics and trends</li>
                  <li>📊 Interactive data visualizations</li>
                  <li>🎯 AI-powered recommendations</li>
                  <li>⚡ Real-time updates</li>
                </ul>
              </div>
              <div className={styles['feature-showcase-visual']}>
                <div className={styles['dashboard-mockup']}>
                  <div className={styles['mockup-header']}>
                    <div className={styles['mockup-dots']}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className={styles['mockup-title']}>
                      EduConnect Dashboard
                    </div>
                  </div>
                  <div className={styles['mockup-content']}>
                    <div className={styles['mockup-stats']}>
                      <div className={styles['mockup-stat']}>
                        <div className={styles['mockup-stat-icon']}>📚</div>
                        <div className={styles['mockup-stat-value']}>125</div>
                        <div className={styles['mockup-stat-label']}>
                          Students
                        </div>
                      </div>
                      <div className={styles['mockup-stat']}>
                        <div className={styles['mockup-stat-icon']}>✅</div>
                        <div className={styles['mockup-stat-value']}>98%</div>
                        <div className={styles['mockup-stat-label']}>
                          Attendance
                        </div>
                      </div>
                      <div className={styles['mockup-stat']}>
                        <div className={styles['mockup-stat-icon']}>📝</div>
                        <div className={styles['mockup-stat-value']}>85</div>
                        <div className={styles['mockup-stat-label']}>
                          Avg Grade
                        </div>
                      </div>
                    </div>
                    <div className={styles['mockup-chart']}>
                      <div
                        className={styles['chart-bar']}
                        style={{ height: '60%' }}
                      ></div>
                      <div
                        className={styles['chart-bar']}
                        style={{ height: '80%' }}
                      ></div>
                      <div
                        className={styles['chart-bar']}
                        style={{ height: '75%' }}
                      ></div>
                      <div
                        className={styles['chart-bar']}
                        style={{ height: '90%' }}
                      ></div>
                      <div
                        className={styles['chart-bar']}
                        style={{ height: '85%' }}
                      ></div>
                      <div
                        className={styles['chart-bar']}
                        style={{ height: '95%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Attendance Management */}
            <div
              className={`${styles['feature-showcase-item']} ${
                visibleSections.has('features-showcase')
                  ? styles['fade-in']
                  : ''
              }`}
            >
              <div className={styles['feature-showcase-visual']}>
                <div className={styles['attendance-mockup']}>
                  <div className={styles['mockup-header']}>
                    <div className={styles['mockup-dots']}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className={styles['mockup-title']}>
                      Attendance Tracking
                    </div>
                  </div>
                  <div className={styles['mockup-content']}>
                    <div className={styles['attendance-list']}>
                      {[
                        'John Doe',
                        'Sarah Smith',
                        'Mike Johnson',
                        'Emma Wilson',
                      ].map((name, i) => (
                        <div key={i} className={styles['attendance-item']}>
                          <div className={styles['attendance-avatar']}>
                            {name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div className={styles['attendance-info']}>
                            <div className={styles['attendance-name']}>
                              {name}
                            </div>
                            <div className={styles['attendance-status']}>
                              ✅ Present
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles['attendance-summary']}>
                      <div className={styles['summary-item']}>
                        <span className={styles['summary-label']}>
                          Today's Attendance
                        </span>
                        <span className={styles['summary-value']}>98%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles['feature-showcase-content']}>
                <div className={styles['feature-badge']}>
                  📅 Smart Attendance
                </div>
                <h3 className={styles['feature-showcase-title']}>
                  Automated Attendance Tracking
                </h3>
                <p className={styles['feature-showcase-desc']}>
                  Streamline attendance management with real-time tracking,
                  automated notifications, and detailed reports. Save hours
                  every week with our intelligent attendance system.
                </p>
                <ul className={styles['feature-list']}>
                  <li>⚡ Real-time attendance marking</li>
                  <li>📱 Mobile-friendly interface</li>
                  <li>🔔 Automated parent notifications</li>
                  <li>📊 Comprehensive attendance reports</li>
                </ul>
              </div>
            </div>

            {/* Feature 3: Grade Management */}
            <div
              className={`${styles['feature-showcase-item']} ${
                styles['alternate']
              } ${
                visibleSections.has('features-showcase')
                  ? styles['fade-in']
                  : ''
              }`}
            >
              <div className={styles['feature-showcase-content']}>
                <div className={styles['feature-badge']}>
                  📝 Grade Management
                </div>
                <h3 className={styles['feature-showcase-title']}>
                  Complete Grade & Assessment System
                </h3>
                <p className={styles['feature-showcase-desc']}>
                  Manage assignments, exams, and grades effortlessly. Provide
                  detailed feedback, track progress, and generate comprehensive
                  reports with our intuitive grading system.
                </p>
                <ul className={styles['feature-list']}>
                  <li>📋 Assignment management</li>
                  <li>✅ Automated grading tools</li>
                  <li>📊 Performance analytics</li>
                  <li>📧 Instant grade notifications</li>
                </ul>
              </div>
              <div className={styles['feature-showcase-visual']}>
                <div className={styles['grades-mockup']}>
                  <div className={styles['mockup-header']}>
                    <div className={styles['mockup-dots']}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className={styles['mockup-title']}>
                      Grades & Assessments
                    </div>
                  </div>
                  <div className={styles['mockup-content']}>
                    <div className={styles['grades-table']}>
                      <div className={styles['table-header']}>
                        <div>Course</div>
                        <div>Grade</div>
                        <div>Status</div>
                      </div>
                      {[
                        {
                          course: 'Mathematics',
                          grade: 'A',
                          status: 'Excellent',
                        },
                        { course: 'Science', grade: 'A-', status: 'Good' },
                        { course: 'English', grade: 'B+', status: 'Good' },
                        { course: 'History', grade: 'A', status: 'Excellent' },
                      ].map((item, i) => (
                        <div key={i} className={styles['table-row']}>
                          <div>{item.course}</div>
                          <div className={styles['grade-badge']}>
                            {item.grade}
                          </div>
                          <div className={styles['status-badge']}>
                            {item.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: Communication */}
            <div
              className={`${styles['feature-showcase-item']} ${
                visibleSections.has('features-showcase')
                  ? styles['fade-in']
                  : ''
              }`}
            >
              <div className={styles['feature-showcase-visual']}>
                <div className={styles['messages-mockup']}>
                  <div className={styles['mockup-header']}>
                    <div className={styles['mockup-dots']}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className={styles['mockup-title']}>Messages</div>
                  </div>
                  <div className={styles['mockup-content']}>
                    <div className={styles['messages-list']}>
                      {[
                        {
                          sender: 'Mrs. Johnson',
                          message: 'Great progress on the project!',
                          time: '10:30 AM',
                        },
                        {
                          sender: 'Mr. Smith',
                          message: 'Parent meeting scheduled for...',
                          time: '9:15 AM',
                        },
                      ].map((msg, i) => (
                        <div key={i} className={styles['message-item']}>
                          <div className={styles['message-avatar']}>
                            {msg.sender
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div className={styles['message-content']}>
                            <div className={styles['message-sender']}>
                              {msg.sender}
                            </div>
                            <div className={styles['message-text']}>
                              {msg.message}
                            </div>
                            <div className={styles['message-time']}>
                              {msg.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles['message-input']}>
                      <div className={styles['input-field']}>
                        Type a message...
                      </div>
                      <div className={styles['send-button']}>📤</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles['feature-showcase-content']}>
                <div className={styles['feature-badge']}>
                  💬 Instant Communication
                </div>
                <h3 className={styles['feature-showcase-title']}>
                  Seamless Communication Hub
                </h3>
                <p className={styles['feature-showcase-desc']}>
                  Connect teachers, students, and parents instantly. Send
                  messages, announcements, and updates in real-time. Keep
                  everyone informed and engaged.
                </p>
                <ul className={styles['feature-list']}>
                  <li>💌 Instant messaging</li>
                  <li>📢 Announcement system</li>
                  <li>🔔 Push notifications</li>
                  <li>📱 Mobile app support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        className={styles['section']}
        style={{ background: '#f8fafc' }}
        data-section="how-it-works"
        ref={(el) => (sectionRefs.current['how-it-works'] = el)}
      >
        <div className={styles['section-container']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>How It Works</h2>
            <p className={styles['section-subtitle']}>
              Get started in minutes with our simple setup process
            </p>
          </div>

          <div
            className={`${styles['how-it-works-grid']} ${
              visibleSections.has('how-it-works') ? styles['fade-in'] : ''
            }`}
          >
            {[
              {
                step: '1',
                icon: Smartphone,
                title: 'Sign Up',
                desc: 'Create your account in less than 2 minutes. No credit card required.',
              },
              {
                step: '2',
                icon: Building2,
                title: 'Setup School',
                desc: 'Add your school details, teachers, and students to get started.',
              },
              {
                step: '3',
                icon: Zap,
                title: 'Start Managing',
                desc: 'Begin managing classes, attendance, grades, and communication instantly.',
              },
              {
                step: '4',
                icon: Target,
                title: 'Scale & Grow',
                desc: 'Leverage AI insights and analytics to improve student outcomes.',
              },
            ].map((item, i) => (
              <div key={i} className={styles['step-card']}>
                <div className={styles['step-number']}>{item.step}</div>
                <div className={styles['step-icon']}>
                  <item.icon />
                </div>
                <h3 className={styles['step-title']}>{item.title}</h3>
                <p className={styles['step-description']}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics & Growth Section */}
      <section
        className={styles['section']}
        data-section="analytics"
        ref={(el) => (sectionRefs.current['analytics'] = el)}
      >
        <div className={styles['section-container']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>
              Real-Time Analytics & Insights
            </h2>
            <p className={styles['section-subtitle']}>
              Track growth and performance with powerful data visualizations
            </p>
          </div>

          <div
            className={`${styles['analytics-grid']} ${
              visibleSections.has('analytics') ? styles['fade-in'] : ''
            }`}
          >
            <div className={styles['chart-card']}>
              <h3 className={styles['chart-title']}>Platform Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="schools"
                    stroke="#6366f1"
                    strokeWidth={3}
                    name="Schools"
                  />
                  <Line
                    type="monotone"
                    dataKey="students"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    name="Students (000s)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={styles['chart-card']}>
              <h3 className={styles['chart-title']}>Feature Usage</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={featureUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {featureUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        className={styles['section']}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
        data-section="benefits"
        ref={(el) => (sectionRefs.current['benefits'] = el)}
      >
        <div className={styles['section-container']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']} style={{ color: 'white' }}>
              Why Schools Choose EduConnect
            </h2>
            <p
              className={styles['section-subtitle']}
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              Join thousands of institutions transforming education
            </p>
          </div>

          <div
            className={`${styles['benefits-grid']} ${
              visibleSections.has('benefits') ? styles['fade-in'] : ''
            }`}
          >
            {[
              {
                icon: Clock,
                title: 'Save 10+ Hours/Week',
                desc: 'Automate administrative tasks and focus on teaching',
              },
              {
                icon: TrendingUp,
                title: '95% User Satisfaction',
                desc: 'Rated highly by teachers, students, and parents',
              },
              {
                icon: Lock,
                title: 'Enterprise Security',
                desc: 'Bank-grade encryption and GDPR compliance',
              },
              {
                icon: Globe,
                title: '24/7 Support',
                desc: 'Dedicated support team available anytime',
              },
              {
                icon: BarChart3,
                title: 'Data-Driven Insights',
                desc: 'AI-powered analytics to improve outcomes',
              },
              {
                icon: Award,
                title: 'Trusted by Leaders',
                desc: 'Used by top educational institutions globally',
              },
            ].map((benefit, i) => (
              <div key={i} className={styles['benefit-card']}>
                <div className={styles['benefit-icon']}>
                  <benefit.icon />
                </div>
                <h3 className={styles['benefit-title']}>{benefit.title}</h3>
                <p className={styles['benefit-description']}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence Map Section */}
      <section
        className={styles['section']}
        data-section="map"
        ref={(el) => (sectionRefs.current['map'] = el)}
      >
        <div className={styles['section-container']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>Trusted Worldwide</h2>
            <p className={styles['section-subtitle']}>
              Join schools across 50+ countries using EduConnect
            </p>
          </div>

          <div
            className={`${styles['map-container']} ${
              visibleSections.has('map') ? styles['fade-in'] : ''
            }`}
          >
            <div className={styles['map-visualization']}>
              <Globe className={styles['globe-icon']} />
              <div className={styles['map-stats']}>
                <div className={styles['map-stat-item']}>
                  <div className={styles['map-stat-value']}>50+</div>
                  <div className={styles['map-stat-label']}>Countries</div>
                </div>
                <div className={styles['map-stat-item']}>
                  <div className={styles['map-stat-value']}>10,000+</div>
                  <div className={styles['map-stat-label']}>Schools</div>
                </div>
                <div className={styles['map-stat-item']}>
                  <div className={styles['map-stat-value']}>500K+</div>
                  <div className={styles['map-stat-label']}>Students</div>
                </div>
              </div>
              <div className={styles['map-markers']}>
                {[
                  '🇺🇸',
                  '🇬🇧',
                  '🇨🇦',
                  '🇦🇺',
                  '🇩🇪',
                  '🇫🇷',
                  '🇯🇵',
                  '🇸🇬',
                  '🇮🇳',
                  '🇧🇷',
                ].map((flag, i) => (
                  <div
                    key={i}
                    className={styles['map-marker']}
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${10 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  >
                    {flag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles['testimonials-section']}>
        <div className={styles['section-container']}>
          <div className={styles['section-header']}>
            <h2 className={styles['section-title']}>
              Loved by Educators Worldwide
            </h2>
            <p className={styles['section-subtitle']}>
              See what our community has to say
            </p>
          </div>

          <div className={styles['testimonials-container']}>
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className={`${styles['testimonial-card']} ${
                  activeTestimonial === i
                    ? styles['testimonial-active']
                    : styles['testimonial-inactive']
                }`}
              >
                <div className={styles['testimonial-header']}>
                  <div className={styles['testimonial-avatar']}>
                    {testimonial.avatar}
                  </div>
                  <div className={styles['testimonial-info']}>
                    <h4 className={styles['testimonial-name']}>
                      {testimonial.name}
                    </h4>
                    <p className={styles['testimonial-role']}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className={styles['testimonial-text']}>
                  "{testimonial.text}"
                </p>
                <div className={styles['testimonial-stars']}>
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={styles['star-icon']} />
                  ))}
                </div>
              </div>
            ))}

            <div className={styles['testimonial-dots']}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`${styles['testimonial-dot']} ${
                    activeTestimonial === i ? styles['dot-active'] : ''
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles['cta-section']}>
        <div className={styles['section-container']}>
          <h2 className={styles['cta-title']}>
            Ready to Transform Your School?
          </h2>
          <p className={styles['cta-description']}>
            Join 10,000+ schools already using EduConnect. Start your free trial
            today.
          </p>
          <a href="/signup" className={styles['btn-cta']}>
            Start Free Trial <ArrowRight />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles['footer']}>
        <div className={styles['footer-container']}>
          <div className={styles['footer-grid']}>
            <div className={styles['footer-brand']}>
              <div className={styles['footer-logo']}>
                <GraduationCap />
                <span className={styles['footer-logo-text']}>EduConnect</span>
              </div>
              <p className={styles['footer-brand-text']}>
                Empowering education through innovative technology solutions for
                modern schools.
              </p>
              <div className={styles['footer-social']}>
                <a href="#" className={styles['footer-social-link']}>
                  Twitter
                </a>
                <a href="#" className={styles['footer-social-link']}>
                  LinkedIn
                </a>
                <a href="#" className={styles['footer-social-link']}>
                  Facebook
                </a>
              </div>
            </div>

            <div className={styles['footer-column']}>
              <h3 className={styles['footer-column-title']}>Product</h3>
              <ul className={styles['footer-links']}>
                <li>
                  <a href="#" className={styles['footer-link']}>
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className={styles['footer-link']}>
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className={styles['footer-link']}>
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className={styles['footer-link']}>
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles['footer-column']}>
              <h3 className={styles['footer-column-title']}>Company</h3>
              <ul className={styles['footer-links']}>
                <li>
                  <a href="#" className={styles['footer-link']}>
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className={styles['footer-link']}>
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className={styles['footer-link']}>
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className={styles['footer-link']}>
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles['footer-column']}>
              <h3 className={styles['footer-column-title']}>Support</h3>
              <ul className={styles['footer-links']}>
                <li>
                  <a href="#" className={styles['footer-link']}>
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className={styles['footer-link']}>
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className={styles['footer-link']}>
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className={styles['footer-link']}>
                    API Docs
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles['footer-bottom']}>
            <p className={styles['footer-copyright']}>
              © 2025 EduConnect. All rights reserved.
            </p>
            <div className={styles['footer-bottom-links']}>
              <a href="#" className={styles['footer-bottom-link']}>
                Privacy
              </a>
              <a href="#" className={styles['footer-bottom-link']}>
                Terms
              </a>
              <a href="#" className={styles['footer-bottom-link']}>
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
