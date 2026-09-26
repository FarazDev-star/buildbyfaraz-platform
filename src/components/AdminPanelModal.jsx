import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  Users, 
  Wrench, 
  Trash2, 
  CheckCircle2, 
  UserPlus, 
  Mail, 
  Crown,
  Sparkles,
  Search,
  Lock,
  Unlock,
  Activity,
  BookOpen,
  Clock,
  Filter,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminPanelModal({ 
  isOpen, 
  onClose, 
  users = [], 
  onUpdateUsers, 
  tools = [], 
  onDeleteTool,
  onOpenUpload,
  inquiries = [],
  activityLogs = [],
  onClearLogs,
  onLogActivity
}) {
  const [activeTab, setActiveTab] = useState('users');
  const [searchUser, setSearchUser] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('editor');
  const [actionNotice, setActionNotice] = useState('');
  const [logFilter, setLogFilter] = useState('all');

  if (!isOpen) return null;

  const showNotification = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 3200);
  };

  const handleToggleUpload = (userId) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    const nextCanUpload = !target.canUpload;

    const updated = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          canUpload: nextCanUpload,
          role: nextCanUpload && u.role === 'user' ? 'editor' : (!nextCanUpload && u.role === 'editor' ? 'user' : u.role)
        };
      }
      return u;
    });
    onUpdateUsers(updated);
    if (onLogActivity) {
      onLogActivity(
        'PERMISSION_CHANGED',
        `${nextCanUpload ? 'Granted' : 'Revoked'} upload permission for ${target.name || target.email}`,
        'permission'
      );
    }
    showNotification(`Upload permission ${nextCanUpload ? 'granted' : 'revoked'} for ${target.name || target.email}`);
  };

  const handleChangeRole = (userId, targetRole) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;

    const updated = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          role: targetRole,
          canUpload: targetRole === 'admin' || targetRole === 'editor'
        };
      }
      return u;
    });
    onUpdateUsers(updated);
    if (onLogActivity) {
      onLogActivity(
        'ROLE_CHANGED',
        `Updated role of ${target.name || target.email} to ${targetRole.toUpperCase()}`,
        'permission'
      );
    }
    showNotification(`User role updated to ${targetRole.toUpperCase()}`);
    confetti({ particleCount: 25, spread: 40 });
  };

  const handleDeleteUser = (userId, email) => {
    if (email === 'admin@gmail.com') {
      alert('Master admin account cannot be deleted.');
      return;
    }
    if (window.confirm(`Delete user ${email}? This action cannot be undone.`)) {
      const filtered = users.filter(u => u.id !== userId);
      onUpdateUsers(filtered);
      if (onLogActivity) {
        onLogActivity(
          'USER_DELETED',
          `Removed user account: ${email}`,
          'admin'
        );
      }
      showNotification('User permanently deleted.');
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.endsWith('@gmail.com')) {
      alert('Please enter a valid @gmail.com address.');
      return;
    }
    const exists = users.find(u => u.email.toLowerCase() === newEmail.trim().toLowerCase());
    if (exists) {
      alert('A user with this email already exists in the database.');
      return;
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: newName.trim() || newEmail.split('@')[0],
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      canUpload: newRole === 'admin' || newRole === 'editor',
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    onUpdateUsers([newUser, ...users]);
    if (onLogActivity) {
      onLogActivity(
        'USER_AUTHORIZED',
        `Created authorized ${newRole.toUpperCase()} account for ${newUser.email}`,
        'admin'
      );
    }
    setNewEmail('');
    setNewName('');
    showNotification(`Authorized ${newRole.toUpperCase()} user added successfully.`);
    confetti({ particleCount: 30, spread: 45 });
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredLogs = activityLogs.filter(log => {
    if (logFilter === 'all') return true;
    return log.type === logFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#0E1114] border border-[#485563]/50 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 sm:py-5 bg-[#12161A] border-b border-[#485563]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#8B5E3C]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#F5F5F5] font-display tracking-tight">
                  BUILDBYFARAZ <span className="text-[#D4AF37]">Admin Console</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#D4AF37] text-[#080808]">
                  ROOT / SUPER ADMIN
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF]">
                Manage team permissions, monitor live user activity audit trail, and control system tools
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#181F25] transition-colors"
            title="Close Admin Console"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-[#080808] border-b border-[#485563]/30 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'users'
                  ? 'bg-[#D4AF37] text-[#080808] shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                  : 'text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#12161A]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>User Permissions ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'activity'
                  ? 'bg-[#D4AF37] text-[#080808] shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                  : 'text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#12161A]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Activity Logs ({activityLogs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tools'
                  ? 'bg-[#D4AF37] text-[#080808] shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                  : 'text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#12161A]'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Tools ({tools.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'inquiries'
                  ? 'bg-[#D4AF37] text-[#080808] shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                  : 'text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#12161A]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Inquiries ({inquiries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'guide'
                  ? 'bg-[#D4AF37] text-[#080808] shadow-[0_0_15px_rgba(212,175,55,0.35)]'
                  : 'text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#12161A]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Admin Guide</span>
            </button>
          </div>

          {actionNotice && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-lg border border-[#D4AF37]/30 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{actionNotice}</span>
            </div>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* TAB 1: USER PERMISSIONS */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Authorize Contributor Form */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#12161A] border border-[#485563]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#F5F5F5]">
                    <UserPlus className="w-4 h-4 text-[#D4AF37]" />
                    <span>Authorize New Contributor or Admin</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#9CA3AF]">
                    Auto-enforces @gmail.com validation
                  </span>
                </div>

                <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name (e.g. Alex Rivera)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="px-3.5 py-2 text-xs rounded-xl bg-[#080808] border border-[#485563]/60 text-[#F5F5F5] placeholder-[#9CA3AF]/60 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="px-3.5 py-2 text-xs rounded-xl bg-[#080808] border border-[#485563]/60 text-[#F5F5F5] placeholder-[#9CA3AF]/60 focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-[#080808] border border-[#485563]/60 text-[#F5F5F5] focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="editor">Editor (Can Upload Tools)</option>
                    <option value="admin">Admin (Full Control)</option>
                    <option value="user">Member (Read & Use Only)</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D] transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Authorize User</span>
                  </button>
                </form>
              </div>

              {/* Search & List */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search users by name, email, or role..."
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#12161A] border border-[#485563]/40 text-[#F5F5F5] placeholder-[#9CA3AF]/60 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div className="text-xs text-[#9CA3AF] font-mono">
                    Total Active Users: <span className="text-[#D4AF37] font-bold">{users.length}</span>
                  </div>
                </div>

                {/* Table */}
                <div className="border border-[#485563]/40 rounded-2xl overflow-x-auto bg-[#12161A]">
                  <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-[#080808] border-b border-[#485563]/40 text-[#9CA3AF] uppercase font-mono text-[10px] tracking-wider">
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Upload Access</th>
                        <th className="py-3 px-4">Role Action</th>
                        <th className="py-3 px-4 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#485563]/20">
                      {filteredUsers.map((u) => {
                        const isMasterAdmin = u.email === 'admin@gmail.com';
                        const isEditor = u.role === 'editor';
                        const isAdmin = u.role === 'admin';
                        return (
                          <tr key={u.id} className="hover:bg-[#181F25] transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-[#F5F5F5] flex items-center gap-1.5">
                                {isAdmin && <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />}
                                <span>{u.name || u.email.split('@')[0]}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-[#9CA3AF] font-mono">{u.email}</span>
                                {u.emailVerified ? (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    <span>VERIFIED</span>
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                    PENDING OTP
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                                isAdmin
                                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                                  : isEditor
                                  ? 'bg-[#8B5E3C]/25 text-[#D4AF37] border border-[#8B5E3C]/40'
                                  : 'bg-[#485563]/20 text-[#9CA3AF] border border-[#485563]/40'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => handleToggleUpload(u.id)}
                                disabled={isMasterAdmin}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                                  u.canUpload
                                    ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#D4AF37]/25'
                                    : 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                                } ${isMasterAdmin ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                title={isMasterAdmin ? 'Master admin always has upload access' : 'Click to toggle upload access'}
                              >
                                {u.canUpload ? (
                                  <>
                                    <Unlock className="w-3 h-3" />
                                    <span>Granted</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3 h-3" />
                                    <span>Restricted</span>
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="py-3.5 px-4">
                              {isMasterAdmin ? (
                                <span className="text-[11px] text-[#D4AF37] font-mono">Master Super Admin</span>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  {u.role !== 'admin' && (
                                    <button
                                      onClick={() => handleChangeRole(u.id, 'admin')}
                                      className="px-2 py-1 rounded text-[10px] font-bold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-[#080808] transition-colors"
                                    >
                                      Make Admin
                                    </button>
                                  )}
                                  {u.role !== 'editor' && (
                                    <button
                                      onClick={() => handleChangeRole(u.id, 'editor')}
                                      className="px-2 py-1 rounded text-[10px] font-medium bg-[#181F25] text-[#F5F5F5] border border-[#485563]/40 hover:border-[#D4AF37] transition-colors"
                                    >
                                      Set Editor
                                    </button>
                                  )}
                                  {u.role !== 'user' && (
                                    <button
                                      onClick={() => handleChangeRole(u.id, 'user')}
                                      className="px-2 py-1 rounded text-[10px] font-medium bg-[#181F25] text-[#9CA3AF] border border-[#485563]/40 hover:text-red-400 hover:border-red-400/40 transition-colors"
                                    >
                                      Demote
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {!isMasterAdmin ? (
                                <button
                                  onClick={() => handleDeleteUser(u.id, u.email)}
                                  className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                  title="Delete user"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span className="text-[10px] text-[#9CA3AF] font-mono">Protected</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE ACTIVITY TRACKER */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#485563]/30">
                <div>
                  <h3 className="text-sm font-bold text-[#F5F5F5] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#D4AF37]" />
                    <span>Real-Time User & System Activity Stream</span>
                  </h3>
                  <p className="text-xs text-[#9CA3AF]">
                    Live audit trail tracking authentic logins, screenshot tool requests, and permission modifications
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-[#080808] p-1 rounded-xl border border-[#485563]/40 text-xs">
                    <Filter className="w-3 h-3 text-[#9CA3AF] ml-1.5" />
                    {['all', 'tool', 'auth', 'permission'].map((filt) => (
                      <button
                        key={filt}
                        onClick={() => setLogFilter(filt)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase transition-all ${
                          logFilter === filt
                            ? 'bg-[#D4AF37] text-[#080808] font-bold'
                            : 'text-[#9CA3AF] hover:text-[#F5F5F5]'
                        }`}
                      >
                        {filt}
                      </button>
                    ))}
                  </div>

                  {onClearLogs && (
                    <button
                      onClick={onClearLogs}
                      className="px-2.5 py-1.5 rounded-xl text-xs text-[#9CA3AF] hover:text-red-400 hover:bg-red-500/10 border border-[#485563]/40 transition-colors"
                      title="Clear activity log history"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {filteredLogs.length === 0 ? (
                <div className="p-10 rounded-2xl bg-[#12161A] border border-[#485563]/30 text-center space-y-2">
                  <Clock className="w-8 h-8 text-[#9CA3AF] mx-auto opacity-50" />
                  <p className="text-xs text-[#9CA3AF]">No events recorded matching the selected filter.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredLogs.map((log) => {
                    const isTool = log.type === 'tool';
                    const isAuth = log.type === 'auth';
                    const isPerm = log.type === 'permission';
                    return (
                      <div 
                        key={log.id} 
                        className="p-3.5 rounded-xl bg-[#12161A] border border-[#485563]/30 hover:border-[#D4AF37]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                            isTool
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                              : isAuth
                              ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                              : isPerm
                              ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30'
                              : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          }`}>
                            {log.action || 'EVENT'}
                          </span>

                          <div>
                            <div className="text-xs font-semibold text-[#F5F5F5]">{log.detail}</div>
                            <div className="text-[10px] text-[#9CA3AF] font-mono mt-0.5">
                              Actor: <span className="text-[#D4AF37]">{log.user}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-[11px] font-mono text-[#9CA3AF] flex-shrink-0 self-end sm:self-center">
                          {log.timestamp}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TOOLS CATALOG */}
          {activeTab === 'tools' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#F5F5F5]">Catalog Management</h3>
                  <p className="text-xs text-[#9CA3AF]">Active tools in production and upcoming pipeline</p>
                </div>
                <button
                  onClick={onOpenUpload}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#D4AF37] text-[#080808] hover:bg-[#C59F2D] transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Add New Tool</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tools.map((t) => (
                  <div 
                    key={t.id}
                    className="p-4 rounded-2xl bg-[#12161A] border border-[#485563]/40 flex items-start justify-between gap-3 hover:border-[#D4AF37]/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#F5F5F5]">{t.title}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#D4AF37]/15 text-[#D4AF37]">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#9CA3AF] mt-1 line-clamp-2">{t.tagline || t.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-[#9CA3AF] font-mono">
                        <span>By: {t.author}</span>
                        <span>•</span>
                        <span>Endpoint: {t.endpoint}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteTool(t.id)}
                      className="p-2 rounded-xl text-[#9CA3AF] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Remove tool from catalog"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F5]">Direct Platform Inquiries</h3>
                <p className="text-xs text-[#9CA3AF]">Messages submitted by visitors through the contact form</p>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#12161A] border border-[#485563]/30 text-center space-y-2">
                  <Mail className="w-8 h-8 text-[#9CA3AF] mx-auto opacity-50" />
                  <p className="text-xs text-[#9CA3AF]">No new messages currently in queue.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#12161A] border border-[#485563]/40 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-bold text-[#F5F5F5]">{inq.name} ({inq.email})</div>
                        <span className="text-[10px] text-[#D4AF37] font-mono">{inq.date || 'Today'}</span>
                      </div>
                      <div className="text-xs text-[#D4AF37] font-semibold">{inq.subject}</div>
                      <p className="text-xs text-[#9CA3AF] bg-[#080808] p-3 rounded-xl border border-[#485563]/20">
                        {inq.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: STEP-BY-STEP ADMIN GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-[#F5F5F5] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                  <span>Faraz's Admin & Permissions Handbook</span>
                </h3>
                <p className="text-xs text-[#9CA3AF]">
                  Complete documentation for managing team access, uploading new tools, and monitoring platform traffic
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Section 1 */}
                <div className="p-4 rounded-2xl bg-[#12161A] border border-[#485563]/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                    <Shield className="w-4 h-4" />
                    <span>1. User Roles & Access Hierarchy</span>
                  </div>
                  <ul className="text-xs text-[#9CA3AF] space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li><strong className="text-[#F5F5F5]">Admin (Super Admin):</strong> Full root privileges. Can open this admin console, grant permissions, delete tools, and promote editors.</li>
                    <li><strong className="text-[#F5F5F5]">Editor:</strong> Authorized team members who have upload permissions to publish tools to the catalog.</li>
                    <li><strong className="text-[#F5F5F5]">Member:</strong> Standard users who can browse, test, and download results from all active utilities.</li>
                  </ul>
                </div>

                {/* Section 2 */}
                <div className="p-4 rounded-2xl bg-[#12161A] border border-[#485563]/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                    <Unlock className="w-4 h-4" />
                    <span>2. Granting Tool Upload Access</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    Under the <strong className="text-[#F5F5F5]">User Permissions</strong> tab, find any registered user and click the 
                    <span className="text-[#D4AF37] font-mono mx-1">Granted / Restricted</span> button to toggle upload access immediately.
                    Alternatively, click <span className="text-[#D4AF37] font-mono mx-1">Set Editor</span> to elevate their account.
                  </p>
                </div>

                {/* Section 3 */}
                <div className="p-4 rounded-2xl bg-[#12161A] border border-[#485563]/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                    <Activity className="w-4 h-4" />
                    <span>3. Live Activity Audit Log</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    The <strong className="text-[#F5F5F5]">Activity Logs</strong> tab automatically records all significant actions including:
                    user sign-ins, WebSnap URL captures, PNG downloads, and admin permission changes.
                  </p>
                </div>

                {/* Section 4 */}
                <div className="p-4 rounded-2xl bg-[#12161A] border border-[#485563]/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                    <Sparkles className="w-4 h-4" />
                    <span>4. Uploading New Tools (One-by-One)</span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    Click the <span className="text-[#D4AF37] font-bold">Upload Tool</span> button in the top navbar or under the Tools tab. 
                    Provide the title, category, description, API endpoint, and tags. The tool will appear in the catalog in real-time.
                  </p>
                </div>
              </div>

              {/* Master Credential Callout */}
              <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-[#F5F5F5]">Master Admin Protection:</span>
                  <p className="text-[#9CA3AF] mt-0.5">
                    The master account (<strong className="text-[#D4AF37]">admin@gmail.com / Faraz</strong>) is permanently protected from deletion or demotion.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#12161A] border-t border-[#485563]/40 flex items-center justify-between text-xs text-[#9CA3AF]">
          <div>Logged in as: <strong className="text-[#D4AF37]">Faraz (Super Admin)</strong></div>
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#181F25] text-[#F5F5F5] hover:bg-[#485563]/40 hover:text-white transition-colors font-medium"
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
}
