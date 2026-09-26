import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import ToolDetailPage from './pages/ToolDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import TypingFastPage from './pages/TypingFastPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import SecurityPage from './pages/SecurityPage';
import UploadToolModal from './components/UploadToolModal';
import AdminPanelModal from './components/AdminPanelModal';
import Footer from './components/Footer';
import { INITIAL_TOOLS } from './data/initialTools';

const DEFAULT_USERS = [
  { id: 'usr_admin', username: 'faraz', email: 'admin@gmail.com', password: 'admin', name: 'Faraz', role: 'admin', canUpload: true, emailVerified: true, joinedDate: '2025-01-01' },
  { id: 'usr_editor', username: 'alex_editor', email: 'editor@gmail.com', password: 'editor', name: 'Alex Rivera', role: 'editor', canUpload: true, emailVerified: true, joinedDate: '2025-02-15' },
  { id: 'usr_member', username: 'sam_member', email: 'member@gmail.com', password: 'member', name: 'Sam Member', role: 'user', canUpload: false, emailVerified: true, joinedDate: '2025-03-01' },
];

const INITIAL_LOGS = [
  {
    id: 'act_init_1',
    timestamp: 'Just now',
    date: new Date().toISOString().split('T')[0],
    user: 'Faraz (Super Admin)',
    action: 'SYSTEM_BOOT',
    detail: 'BUILDBYFARAZ Security Engine initialized with Authenticator OTP verification',
    type: 'admin'
  },
  {
    id: 'act_init_2',
    timestamp: '5m ago',
    date: new Date().toISOString().split('T')[0],
    user: 'Faraz',
    action: 'EMAIL_VERIFIED',
    detail: 'Real @gmail.com authenticated for admin@gmail.com',
    type: 'auth'
  },
  {
    id: 'act_init_3',
    timestamp: '15m ago',
    date: new Date().toISOString().split('T')[0],
    user: 'Alex Rivera',
    action: 'PERMISSION_GRANTED',
    detail: 'Tool upload access active for Alex Rivera (Editor)',
    type: 'permission'
  }
];

export default function App() {
  // Page Routing State: 'home' | 'tools' | 'tool_detail' | 'about' | 'contact' | 'login' | 'signup'
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const path = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
      if (path === 'tools') return 'tools';
      if (path.startsWith('tools/') || path.startsWith('tool/')) {
        return 'tool_detail';
      }
      if (['about', 'contact', 'typingfast'].includes(path)) return path;

      const params = new URLSearchParams(window.location.search);
      if (params.get('tool')) return 'tool_detail';
      if (params.get('page')) return params.get('page');
    } catch (e) {}
    return 'home';
  });

  // User Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bbf_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading current user:', e);
    }
    // Default to Faraz (Super Admin) for seamless immediate owner access
    return {
      id: 'usr_admin',
      name: 'Faraz',
      username: 'faraz',
      email: 'admin@gmail.com',
      role: 'admin',
      canUpload: true,
      emailVerified: true
    };
  });

  // Users Database State (for RBAC & Admin Permissions Management)
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('bbf_users_db');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading users db:', e);
    }
    return DEFAULT_USERS;
  });

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bbf_users_db', JSON.stringify(users));
    } catch (e) {
      console.warn(e);
    }
  }, [users]);

  // Activity Logs Audit Stream (Real-Time tracking for Faraz Admin Panel)
  const [activityLogs, setActivityLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('bbf_activity_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading activity logs:', e);
    }
    return INITIAL_LOGS;
  });

  // Sync activity logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bbf_activity_logs', JSON.stringify(activityLogs));
    } catch (e) {
      console.warn(e);
    }
  }, [activityLogs]);

  // Central Activity Logger
  const logActivity = (actionOrObj, detailArg, typeArg = 'tool', userArg = null) => {
    let action, detail, type, user;
    if (typeof actionOrObj === 'object' && actionOrObj !== null) {
      action = actionOrObj.action || 'ACTIVITY';
      detail = actionOrObj.target 
        ? `${actionOrObj.action}: ${actionOrObj.target}` 
        : (actionOrObj.detail || 'User action');
      type = actionOrObj.type || 'tool';
      user = actionOrObj.user || currentUser?.name || currentUser?.email || 'Guest Member';
    } else {
      action = actionOrObj;
      detail = detailArg;
      type = typeArg;
      user = userArg || currentUser?.name || currentUser?.email || 'Guest Member';
    }

    const newLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      action,
      detail,
      type, // 'auth' | 'tool' | 'permission' | 'admin'
      user,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date().toISOString().split('T')[0]
    };

    setActivityLogs(prev => [newLog, ...prev.slice(0, 149)]);
  };

  // Tools State (Unified 8 tools: 5 Live + 3 Pipeline + any community uploaded tools)
  const [tools, setTools] = useState(() => {
    try {
      const saved = localStorage.getItem('bbf_tools_v11');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const coreIds = new Set([
            'tool-websnap', 'tool-speechster', 'tool-typingfast', 'tool-videodl', 'tool-driveup',
            'tool-tempster', 'tool-pixelster', 'tool-cinesearch',
            'websnap', 'speechster', 'typingfast', 'videodl', 'driveup',
            'tempster', 'pixelster', 'cinesearch'
          ]);
          const userUploaded = parsed.filter(t => t && t.id && !coreIds.has(t.id));
          return [...INITIAL_TOOLS, ...userUploaded];
        }
      }
    } catch (e) {
      console.warn('Error reading tools:', e);
    }
    return INITIAL_TOOLS;
  });

  // Sync tools to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bbf_tools_v11', JSON.stringify(tools));
    } catch (e) {
      console.warn('Error saving tools:', e);
    }
  }, [tools]);

  // Contact Inquiries Queue
  const [inquiries, setInquiries] = useState(() => {
    try {
      const saved = localStorage.getItem('bbf_inquiries');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return [
      { name: 'David Miller', email: 'david.dev@gmail.com', subject: 'Request Upload / Contributor Access', message: 'Hi Faraz! I built an image compression tool and would love to publish it to BUILDBYFARAZ.', date: 'Today' }
    ];
  });

  // Sync inquiries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bbf_inquiries', JSON.stringify(inquiries));
    } catch (e) {
      console.warn(e);
    }
  }, [inquiries]);

  // Modal States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Active Tool Selection across pages
  const [selectedToolId, setSelectedToolId] = useState(() => {
    try {
      const path = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
      if (path.startsWith('tools/') || path.startsWith('tool/')) {
        const parts = path.split('/');
        if (parts[1]) return parts[1];
      }
      const params = new URLSearchParams(window.location.search);
      const t = params.get('tool');
      if (t) return t;
    } catch (e) {}
    return 'videodl';
  });

  // Handle URL navigation and popstate
  useEffect(() => {
    const handlePopState = () => {
      try {
        const path = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
        if (path === 'tools') {
          setCurrentPage('tools');
          return;
        }
        if (path.startsWith('tools/') || path.startsWith('tool/')) {
          const parts = path.split('/');
          setCurrentPage('tool_detail');
          if (parts[1]) setSelectedToolId(parts[1]);
          return;
        }
        if (['about', 'contact', 'typingfast'].includes(path)) {
          setCurrentPage(path);
          return;
        }

        const params = new URLSearchParams(window.location.search);
        const toolParam = params.get('tool');
        const pageParam = params.get('page');

        if (toolParam) {
          setCurrentPage('tool_detail');
          setSelectedToolId(toolParam);
        } else if (pageParam) {
          setCurrentPage(pageParam);
        } else {
          setCurrentPage('home');
        }
      } catch (e) {}
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle Page Navigation with smooth scroll & optional target tool
  const handleNavigate = (page, toolId = null) => {
    setCurrentPage(page);
    if (toolId) setSelectedToolId(toolId);

    try {
      if (page === 'tool_detail' && toolId) {
        window.history.pushState({}, '', `/?tool=${toolId}`);
      } else if (page === 'tools') {
        window.history.pushState({}, '', `/?page=tools`);
      } else if (page === 'home') {
        window.history.pushState({}, '', `/`);
      } else {
        window.history.pushState({}, '', `/?page=${page}`);
      }
    } catch (e) {}

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('bbf_current_user', JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
    logActivity('LOGIN_SUCCESS', `User ${user.name || user.email} signed into platform`, 'auth', user.name || user.email);
    handleNavigate('tools');
  };

  const handleLogout = () => {
    const actor = currentUser?.name || currentUser?.email || 'User';
    logActivity('LOGOUT', `User ${actor} signed out`, 'auth', actor);
    setCurrentUser(null);
    localStorage.removeItem('bbf_current_user');
  };

  // Add Tool Handler with immediate site-wide synchronization
  const handleAddTool = (newTool) => {
    setTools((prev) => [newTool, ...prev]);
    setSelectedToolId(newTool.id);
    handleNavigate('tool_detail', newTool.id);
    logActivity('TOOL_UPLOADED', `New tool added to catalog: ${newTool.title} by ${newTool.author}`, 'admin');
  };

  // Delete Tool Handler (Admin only)
  const handleDeleteTool = (toolId) => {
    const targetTool = tools.find(t => t.id === toolId);
    if (window.confirm('Are you sure you want to remove this tool from the catalog?')) {
      setTools((prev) => prev.filter(t => t.id !== toolId));
      logActivity('TOOL_DELETED', `Tool removed from catalog: ${targetTool?.title || toolId}`, 'admin');
    }
  };

  // Request Access Handler
  const handleRequestAccess = (userEmail) => {
    const newReq = {
      name: userEmail,
      email: userEmail,
      subject: 'Request Upload / Contributor Access',
      message: `User ${userEmail} clicked "Request Access" to upload tools to the catalog.`,
      date: new Date().toLocaleDateString()
    };
    setInquiries(prev => [newReq, ...prev]);
    logActivity('ACCESS_REQUEST', `User ${userEmail} requested tool contributor upload access`, 'permission', userEmail);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] relative flex flex-col justify-between">
      {/* Subtle Noise Texture Overlay */}
      <div className="noise-overlay" />

      {/* Floating Island Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        totalToolsCount={tools.length}
      />

      {/* Main Multi-Page Content Area */}
      <main className="pt-24 flex-grow">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenUpload={() => setIsUploadOpen(true)}
            featuredTools={tools}
          />
        )}

        {currentPage === 'tools' && (
          <ToolsPage
            tools={tools}
            onOpenUploadModal={() => setIsUploadOpen(true)}
            currentUser={currentUser}
            onLogActivity={logActivity}
          />
        )}

        {currentPage === 'tool_detail' && (
          <ToolDetailPage
            toolId={selectedToolId}
            tools={tools}
            onBack={() => handleNavigate('tools')}
            currentUser={currentUser}
            onLogActivity={logActivity}
          />
        )}

        {currentPage === 'typingfast' && (
          <TypingFastPage
            onNavigate={handleNavigate}
            onLogActivity={logActivity}
            currentUser={currentUser}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'contact' && (
          <ContactPage 
            onMessageSubmitted={(newMsg) => {
              setInquiries(prev => [newMsg, ...prev]);
              logActivity('INQUIRY_SUBMITTED', `New contact message from ${newMsg.name} (${newMsg.email})`, 'admin', newMsg.name);
            }}
          />
        )}

        {currentPage === 'terms' && (
          <TermsPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'privacy' && (
          <PrivacyPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'security' && (
          <SecurityPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'login' && (
          <AuthPage
            initialMode="login"
            onLoginSuccess={handleLoginSuccess}
            onNavigate={handleNavigate}
            onLogActivity={logActivity}
          />
        )}

        {currentPage === 'signup' && (
          <AuthPage
            initialMode="signup"
            onLoginSuccess={handleLoginSuccess}
            onNavigate={handleNavigate}
            onLogActivity={logActivity}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenUpload={() => setIsUploadOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Upload Tool Modal */}
      <UploadToolModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddTool={handleAddTool}
        currentUser={currentUser}
        onRequestAccess={handleRequestAccess}
        onNavigate={handleNavigate}
      />

      {/* Admin Panel Console Modal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        users={users}
        onUpdateUsers={setUsers}
        tools={tools}
        onDeleteTool={handleDeleteTool}
        onOpenUpload={() => {
          setIsAdminOpen(false);
          setIsUploadOpen(true);
        }}
        inquiries={inquiries}
        activityLogs={activityLogs}
        onClearLogs={() => setActivityLogs([])}
        onLogActivity={logActivity}
      />
    </div>
  );
}
