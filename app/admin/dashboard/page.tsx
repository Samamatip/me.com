'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';

type Profile = {
  name: string;
  email: string;
  summary: string;
  picture: string;
  cv?: string;
  background?: string[];
  socials?: {
    name: string;
    url: string;
    icon?: string;
  }[];
  skills?: string[];
  projects?: Project[];
};

type Project = {
  id: string;
  title: string;
  description: string;
  footnote?: string;
  keyFeatures?: string[];
  tags: string[];
  media?: string;
  href?: string;
  source?: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'background' | 'socials'>('profile');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    summary: '',
    picture: '',
    cv: '',
  });

  // Background form
  const [backgroundForm, setBackgroundForm] = useState<string[]>([]);
  const [newParagraph, setNewParagraph] = useState('');

  // Socials form
  const [socialsForm, setSocialsForm] = useState<{ name: string; url: string; icon?: string }[]>([]);
  const [socialForm, setSocialForm] = useState({ name: '', url: '', icon: '' });
  const [editingSocialIndex, setEditingSocialIndex] = useState<number | null>(null);

  // Project form
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    id: '',
    title: '',
    description: '',
    footnote: '',
    keyFeatures: [],
    tags: [],
    media: '',
    href: '',
    source: '',
  });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');

  // Skills form
  const [skillsForm, setSkillsForm] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setProfileForm({
          name: data.name || '',
          email: data.email || '',
          summary: data.summary || '',
          picture: data.picture || '',
          cv: data.cv || '',
        });
        setBackgroundForm(data.background || []);
        setSocialsForm(data.socials || []);
        setSkillsForm(data.skills || []);
      }
    } catch (error) {
      showMessage('error', 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/admin');
      return;
    }
    setToken(storedToken);
    fetchProfile();
  }, [router, fetchProfile]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin');
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileForm),
      });

      if (response.ok) {
        showMessage('success', 'Profile updated successfully!');
        fetchProfile();
      } else {
        showMessage('error', 'Failed to update profile');
      }
    } catch (error) {
      showMessage('error', 'Network error');
    }
  };

  const addOrUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProjectId) {
      // Update existing project
      try {
        const response = await fetch(`/api/profile/projects/${editingProjectId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(projectForm),
        });

        if (response.ok) {
          showMessage('success', 'Project updated successfully!');
          fetchProfile();
          resetProjectForm();
        } else {
          showMessage('error', 'Failed to update project');
        }
      } catch (error) {
        showMessage('error', 'Network error');
      }
    } else {
      // Add new project
      const newProject = {
        ...projectForm,
        id: projectForm.id || Date.now().toString(),
      };

      try {
        const response = await fetch('/api/profile/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newProject),
        });

        if (response.ok) {
          showMessage('success', 'Project added successfully!');
          fetchProfile();
          resetProjectForm();
        } else {
          showMessage('error', 'Failed to add project');
        }
      } catch (error) {
        showMessage('error', 'Network error');
      }
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/profile/projects/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showMessage('success', 'Project deleted successfully!');
        fetchProfile();
      } else {
        showMessage('error', 'Failed to delete project');
      }
    } catch (error) {
      showMessage('error', 'Network error');
    }
  };

  const editProject = (project: Project) => {
    setProjectForm(project);
    setEditingProjectId(project.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetProjectForm = () => {
    setProjectForm({
      id: '',
      title: '',
      description: '',
      tags: [],
      media: '',
      href: '',
      source: '',
      footnote: '',
      keyFeatures: [],
    });
    setEditingProjectId(null);
  };

  const addTagToProject = () => {
    if (newTag.trim()) {
      setProjectForm({
        ...projectForm,
        tags: [...(projectForm.tags || []), newTag.trim()],
      });
      setNewTag('');
    }
  };

  const removeTagFromProject = (tag: string) => {
    setProjectForm({
      ...projectForm,
      tags: (projectForm.tags || []).filter((t) => t !== tag),
    });
  };

  const updateSkills = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile/skills', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ skills: skillsForm }),
      });

      if (response.ok) {
        showMessage('success', 'Skills updated successfully!');
        fetchProfile();
      } else {
        showMessage('error', 'Failed to update skills');
      }
    } catch (error) {
      showMessage('error', 'Network error');
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skillsForm.includes(newSkill.trim())) {
      setSkillsForm([...skillsForm, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkillsForm(skillsForm.filter((s) => s !== skill));
  };

  // Background handlers
  const updateBackground = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile/background', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ background: backgroundForm }),
      });

      if (response.ok) {
        showMessage('success', 'Background updated successfully!');
        fetchProfile();
      } else {
        showMessage('error', 'Failed to update background');
      }
    } catch (error) {
      showMessage('error', 'Network error');
    }
  };

  const addParagraph = () => {
    if (newParagraph.trim()) {
      setBackgroundForm([...backgroundForm, newParagraph.trim()]);
      setNewParagraph('');
    }
  };

  const removeParagraph = (index: number) => {
    setBackgroundForm(backgroundForm.filter((_, i) => i !== index));
  };

  // Socials handlers
  const updateSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile/socials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ socials: socialsForm }),
      });

      if (response.ok) {
        showMessage('success', 'Socials updated successfully!');
        fetchProfile();
      } else {
        showMessage('error', 'Failed to update socials');
      }
    } catch (error) {
      showMessage('error', 'Network error');
    }
  };

  const addOrUpdateSocial = () => {
    if (socialForm.name.trim() && socialForm.url.trim()) {
      if (editingSocialIndex !== null) {
        const updated = [...socialsForm];
        updated[editingSocialIndex] = { ...socialForm };
        setSocialsForm(updated);
        setEditingSocialIndex(null);
      } else {
        setSocialsForm([...socialsForm, { ...socialForm }]);
      }
      setSocialForm({ name: '', url: '', icon: '' });
    }
  };

  const editSocial = (index: number) => {
    const social = socialsForm[index];
    setSocialForm({ 
      name: social.name, 
      url: social.url, 
      icon: social.icon || '' 
    });
    setEditingSocialIndex(index);
  };

  const removeSocial = (index: number) => {
    setSocialsForm(socialsForm.filter((_, i) => i !== index));
  };

  // Project feature handlers
  const addFeatureToProject = () => {
    if (newFeature.trim()) {
      setProjectForm({
        ...projectForm,
        keyFeatures: [...(projectForm.keyFeatures || []), newFeature.trim()],
      });
      setNewFeature('');
    }
  };

  const removeFeatureFromProject = (index: number) => {
    setProjectForm({
      ...projectForm,
      keyFeatures: (projectForm.keyFeatures || []).filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                className="text-sm text-zinc-600 hover:text-[#f04e90] dark:text-zinc-400"
              >
                View Site →
              </a>
              <button
                onClick={handleLogout}
                className="rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-6xl px-6 pt-4"
        >
          <div
            className={`rounded-md p-4 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}
          >
            {message.text}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <div className="flex gap-2 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
          {(['profile', 'background', 'socials', 'projects', 'skills'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium capitalize whitespace-nowrap transition ${
                activeTab === tab
                  ? 'border-b-2 border-[#f04e90] text-[#f04e90]'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Background Tab */}
        {activeTab === 'background' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Add Paragraph Form */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="mb-6 text-xl font-semibold">Add Background Paragraph</h2>
              <div className="flex gap-2">
                <textarea
                  value={newParagraph}
                  onChange={(e) => setNewParagraph(e.target.value)}
                  rows={3}
                  className="flex-1 rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                  placeholder="Enter a new paragraph about your background..."
                />
                <button
                  type="button"
                  onClick={addParagraph}
                  className="self-start rounded-md bg-[#f04e90] px-4 py-2 text-sm font-medium text-white hover:bg-[#d63d7a]"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Background Paragraphs List */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Background Paragraphs</h2>
                <button
                  onClick={updateBackground}
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Save Changes
                </button>
              </div>
              {backgroundForm.length > 0 ? (
                <div className="space-y-3">
                  {backgroundForm.map((paragraph, index) => (
                    <div
                      key={index}
                      className="flex gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                          {paragraph}
                        </p>
                      </div>
                      <button
                        onClick={() => removeParagraph(index)}
                        className="self-start rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400">No background paragraphs yet.</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Socials Tab */}
        {activeTab === 'socials' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Add/Edit Social Form */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="mb-6 text-xl font-semibold">
                {editingSocialIndex !== null ? 'Edit Social Link' : 'Add Social Link'}
              </h2>
              <form onSubmit={(e) => { e.preventDefault(); addOrUpdateSocial(); }} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Platform Name</label>
                    <input
                      type="text"
                      value={socialForm.name}
                      onChange={(e) =>
                        setSocialForm({ ...socialForm, name: e.target.value })
                      }
                      className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                      placeholder="e.g., LinkedIn, GitHub"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">URL</label>
                    <input
                      type="url"
                      value={socialForm.url}
                      onChange={(e) =>
                        setSocialForm({ ...socialForm, url: e.target.value })
                      }
                      className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                      placeholder="https://..."
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Icon (optional)</label>
                    <input
                      type="text"
                      value={socialForm.icon}
                      onChange={(e) =>
                        setSocialForm({ ...socialForm, icon: e.target.value })
                      }
                      className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                      placeholder="icon-name or emoji"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-md bg-[#f04e90] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#d63d7a]"
                  >
                    {editingSocialIndex !== null ? 'Update Social' : 'Add Social'}
                  </button>
                  {editingSocialIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSocialIndex(null);
                        setSocialForm({ name: '', url: '', icon: '' });
                      }}
                      className="rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium dark:bg-zinc-800"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Socials List */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Social Links</h2>
                <button
                  onClick={updateSocials}
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Save Changes
                </button>
              </div>
              {socialsForm.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {socialsForm.map((social, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {social.icon && <span className="mr-2">{social.icon}</span>}
                            {social.name}
                          </h3>
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#f04e90] hover:underline"
                          >
                            {social.url}
                          </a>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editSocial(index)}
                          className="flex-1 rounded-md bg-[#f04e90] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#d63d7a]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeSocial(index)}
                          className="flex-1 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400">No social links yet.</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h2 className="mb-6 text-xl font-semibold">Update Profile</h2>
            <form onSubmit={updateProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Picture URL</label>
                  <input
                    type="url"
                    value={profileForm.picture}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, picture: e.target.value })
                    }
                    className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">CV/Resume URL</label>
                  <input
                    type="url"
                    value={profileForm.cv}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, cv: e.target.value })
                    }
                    className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                    placeholder="https://drive.google.com/... or /assets/cv.pdf"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Summary</label>
                <textarea
                  value={profileForm.summary}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, summary: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                  required
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-[#f04e90] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#d63d7a]"
              >
                Update Profile
              </button>
            </form>
          </motion.div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {/* Add/Edit Project Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {editingProjectId ? 'Edit Project' : 'Add New Project'}
                </h2>
                {editingProjectId && (
                  <button
                    onClick={resetProjectForm}
                    className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <form onSubmit={addOrUpdateProject} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Project ID</label>
                    <input
                      type="text"
                      value={projectForm.id}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, id: e.target.value })
                      }
                      className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                      placeholder="unique-id"
                      disabled={!!editingProjectId}
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Title</label>
                    <input
                      type="text"
                      value={projectForm.title}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, title: e.target.value })
                      }
                      className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, description: e.target.value })
                    }
                    rows={3}
                    className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Tags</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTagToProject())}
                      className="flex-1 rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                      placeholder="Add a tag"
                    />
                    <button
                      type="button"
                      onClick={addTagToProject}
                      className="rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium dark:bg-zinc-800"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {projectForm.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 rounded-md bg-[#f04e90]/10 px-3 py-1 text-sm text-[#f04e90]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTagFromProject(tag)}
                          className="hover:text-[#d63d7a]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Media URL</label>
                    <input
                      type="url"
                      value={projectForm.media}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, media: e.target.value })
                      }
                      className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Live Demo URL</label>
                    <input
                      type="url"
                      value={projectForm.href}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, href: e.target.value })
                      }
                      className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Source Code URL</label>
                  <input
                    type="url"
                    value={projectForm.source}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, source: e.target.value })
                    }
                    className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Footnote (optional)</label>
                  <textarea
                    value={projectForm.footnote}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, footnote: e.target.value })
                    }
                    rows={2}
                    className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                    placeholder="Additional notes or context about the project..."
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Key Features</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeatureToProject())}
                      className="flex-1 rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                      placeholder="Add a key feature"
                    />
                    <button
                      type="button"
                      onClick={addFeatureToProject}
                      className="rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium dark:bg-zinc-800"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {projectForm.keyFeatures?.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                      >
                        <span className="flex-1">• {feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeatureFromProject(index)}
                          className="hover:text-emerald-900 dark:hover:text-emerald-300"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="rounded-md bg-[#f04e90] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#d63d7a]"
                >
                  {editingProjectId ? 'Update Project' : 'Add Project'}
                </button>
              </form>
            </motion.div>

            {/* Projects List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Current Projects</h2>
              {profile?.projects && profile.projects.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {profile.projects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <h3 className="mb-2 font-semibold">{project.title}</h3>
                      <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {project.description}
                      </p>
                      {project.footnote && (
                        <p className="mb-3 text-xs italic text-zinc-500 dark:text-zinc-500">
                          {project.footnote}
                        </p>
                      )}
                      {project.keyFeatures && project.keyFeatures.length > 0 && (
                        <div className="mb-3">
                          <p className="mb-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            Key Features:
                          </p>
                          <ul className="space-y-1">
                            {project.keyFeatures.map((feature, idx) => (
                              <li key={idx} className="text-xs text-zinc-600 dark:text-zinc-400">
                                • {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="mb-3 flex flex-wrap gap-1">
                        {project.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editProject(project)}
                          className="rounded-md bg-[#f04e90] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#d63d7a]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400">No projects yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h2 className="mb-6 text-xl font-semibold">Manage Skills</h2>
            <form onSubmit={updateSkills} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Add Skill</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    className="flex-1 rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f04e90] dark:border-zinc-700"
                    placeholder="e.g., Python, React, AWS"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium dark:bg-zinc-800"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Current Skills</label>
                <div className="flex flex-wrap gap-2">
                  {skillsForm.length > 0 ? (
                    skillsForm.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 rounded-md border border-[#f04e90] bg-[#f04e90]/10 px-3 py-1.5 text-sm font-medium text-[#f04e90]"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-[#d63d7a]"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      No skills added yet.
                    </p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="rounded-md bg-[#f04e90] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#d63d7a]"
              >
                Update Skills
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
