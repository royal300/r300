import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Film,
  CheckCircle2,
  Eye,
  RefreshCw,
  Globe,
  Instagram,
  Facebook,
  ArrowLeft,
  X,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { cldImage, cldVideo } from "@/lib/cloudinary";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "ROYAL300 — Admin Panel" },
      { name: "description", content: "ROYAL300 Agency Content & Client Management" },
    ],
  }),
  component: AdminPage,
});

interface ClientItem {
  id: number;
  slug: string;
  no: string;
  name: string;
  client_title: string;
  copy: string;
  full_description: string;
  hero_image: string;
  links: { website?: string; instagram?: string; facebook?: string };
  services_provided: string[];
  display_order: number;
  is_active: boolean;
  media_count?: number;
  creatives?: any[];
  reels?: any[];
}

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = React.useState("");
  const [loginLoading, setLoginLoading] = React.useState(false);

  const [clients, setClients] = React.useState<ClientItem[]>([]);
  const [loadingClients, setLoadingClients] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Currently editing client (null = list view)
  const [editingClient, setEditingClient] = React.useState<ClientItem | null>(null);
  const [activeTab, setActiveTab] = React.useState<
    "details" | "thumbnail" | "links" | "creatives" | "reels"
  >("details");

  // Add client modal state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newClientName, setNewClientName] = React.useState("");
  const [addLoading, setAddLoading] = React.useState(false);

  // Check login state
  const checkAuth = React.useCallback(async () => {
    try {
      const res = await fetch("/api/admin/check");
      const data = await res.json();
      setIsAuthenticated(Boolean(data.authenticated));
      if (data.authenticated) {
        fetchClients();
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch all clients
  const fetchClients = async (keepEditingState: boolean = false) => {
    try {
      setLoadingClients(true);
      const res = await fetch("/api/admin/clients");
      if (!res.ok) throw new Error("Failed to fetch clients");
      const data = await res.json();
      if (data.success && Array.isArray(data.clients)) {
        setClients(data.clients);
        if (keepEditingState && editingClient) {
          const updated = data.clients.find((c: ClientItem) => c.id === editingClient.id);
          if (updated) setEditingClient(updated);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load clients");
    } finally {
      setLoadingClients(false);
    }
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      toast.error("Please enter the admin password");
      return;
    }
    try {
      setLoginLoading(true);
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        toast.success("Welcome to ROYAL300 Admin Studio");
        fetchClients();
      } else {
        toast.error(data.error || "Invalid password");
      }
    } catch {
      toast.error("Network error during login");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setEditingClient(null);
    toast.info("Logged out successfully");
  };

  // Create Client
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) {
      toast.error("Client name is required");
      return;
    }
    try {
      setAddLoading(true);
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClientName.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Client "${newClientName}" created!`);
        setIsAddModalOpen(false);
        setNewClientName("");
        await fetchClients();
        const created = data.client;
        if (created) {
          const freshRes = await fetch("/api/admin/clients");
          const freshData = await freshRes.json();
          const target = freshData.clients?.find((c: ClientItem) => c.id === created.id);
          if (target) {
            setEditingClient(target);
            setActiveTab("details");
          }
        }
      } else {
        toast.error(data.error || "Failed to create client");
      }
    } catch (err: any) {
      toast.error(err.message || "Error creating client");
    } finally {
      setAddLoading(false);
    }
  };

  // Delete Client
  const handleDeleteClient = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? All related media will also be deleted.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success(`"${name}" deleted successfully`);
        if (editingClient?.id === id) setEditingClient(null);
        fetchClients();
      } else {
        toast.error(data.error || "Failed to delete client");
      }
    } catch {
      toast.error("Error deleting client");
    }
  };

  // Toggle Active/Live status
  const handleToggleActive = async (client: ClientItem) => {
    try {
      const updatedStatus = !client.is_active;
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: updatedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          `"${client.name}" is now ${updatedStatus ? "LIVE on Homepage" : "Hidden"}`
        );
        fetchClients();
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative w-full max-w-md bg-[#0e131f]/90 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/20 mb-6 border border-white/20 bg-[#0e131f]">
              <img src="/favicon.png" alt="ROYAL300 Logo" className="h-full w-full object-cover" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              ROYAL300 Admin
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-gray-400">
              Content & Client Management Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Security Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password..."
                  required
                  className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Access Admin Studio →</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link
              to="/"
              className="text-xs text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED DASHBOARD
  // -------------------------------------------------------------
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCreatives = clients.reduce((acc, c) => acc + (c.creatives?.length || 0), 0);
  const totalReels = clients.reduce((acc, c) => acc + (c.reels?.length || 0), 0);
  const liveCount = clients.filter((c) => c.is_active).length;

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 font-sans pb-24">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0e131f]/80 backdrop-blur-xl border-b border-white/10">
        <div className="w-[90%] mx-auto px-2 sm:px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl overflow-hidden shadow-md shadow-blue-500/20 border border-white/20 bg-[#0e131f]">
              <img src="/favicon.png" alt="ROYAL300 Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-base tracking-tight">
                ROYAL300
              </span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                Admin Studio
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>MySQL: royal300_portfolio</span>
            </div>

            <Link
              to="/"
              target="_blank"
              className="text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="w-[90%] mx-auto px-2 sm:px-4 pt-8">
        {editingClient ? (
          <ClientEditorStudio
            client={editingClient}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onBack={() => {
              setEditingClient(null);
              fetchClients(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onClientUpdated={async () => {
              await fetchClients(true);
            }}
          />
        ) : (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-[#0e131f]/90 border border-white/10 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Total Clients</span>
                  <Layers className="w-4 h-4 text-blue-400" />
                </div>
                <div className="mt-3 font-display text-3xl font-bold text-white">
                  {clients.length}
                </div>
                <div className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                  <span>{liveCount} active on homepage</span>
                </div>
              </div>

              <div className="bg-[#0e131f]/90 border border-white/10 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Campaign Creatives</span>
                  <ImageIcon className="w-4 h-4 text-purple-400" />
                </div>
                <div className="mt-3 font-display text-3xl font-bold text-white">
                  {totalCreatives}
                </div>
                <div className="mt-1 text-xs text-gray-400">Carousel images</div>
              </div>

              <div className="bg-[#0e131f]/90 border border-white/10 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Video Reels</span>
                  <Film className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="mt-3 font-display text-3xl font-bold text-white">
                  {totalReels}
                </div>
                <div className="mt-1 text-xs text-gray-400">9:16 vertical reels</div>
              </div>

              <div className="bg-[#0e131f]/90 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div className="flex items-center justify-between text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  <span>Quick Action</span>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Client</span>
                </button>
              </div>
            </div>

            {/* Clients List Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Managed Clients & Case Studies
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Click on any client card to manage their descriptions, media, links, and reels.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search clients..."
                    className="w-full bg-[#121724] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => fetchClients()}
                  title="Refresh clients"
                  className="bg-white/5 hover:bg-white/10 border border-white/10 p-2 rounded-xl text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingClients ? "animate-spin" : ""}`} />
                </button>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Client</span>
                </button>
              </div>
            </div>

            {/* Clients Cards Grid */}
            {filteredClients.length === 0 ? (
              <div className="text-center py-20 bg-[#0e131f]/50 border border-white/10 rounded-3xl p-8">
                <Layers className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="font-display font-semibold text-lg text-white">No Clients Found</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery
                    ? `No clients matched "${searchQuery}"`
                    : "Get started by creating your first client."}
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Client</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    className="group bg-[#0e131f]/90 border border-white/10 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail Header */}
                      <div className="relative aspect-[16/9] w-full bg-[#161c2c] overflow-hidden">
                        {client.hero_image ? (
                          <img
                            src={cldImage(client.hero_image, { width: 500, height: 280, crop: "fill" })}
                            alt={client.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                            <ImageIcon className="w-8 h-8 mb-1" />
                            <span className="text-[10px]">No Thumbnail</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0e131f] via-transparent to-black/40" />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-blue-600/90 text-white px-2.5 py-0.5 rounded-md backdrop-blur-md">
                            NO. {client.no || "01"}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(client)}
                            title={client.is_active ? "Visible on site" : "Hidden"}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                              client.is_active
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : "bg-red-500/20 text-red-300 border-red-500/30"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                client.is_active ? "bg-emerald-400" : "bg-red-400"
                              }`}
                            />
                            <span>{client.is_active ? "LIVE" : "DRAFT"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-5">
                        <h3 className="font-display text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                          {client.name}
                        </h3>
                        {client.client_title && (
                          <div className="text-xs text-blue-400 mt-0.5 line-clamp-1">
                            {client.client_title}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                          {client.copy || client.full_description || "No description set yet."}
                        </p>

                        {/* Media Counts */}
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                            <span>{client.creatives?.length || 0} Creatives</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Film className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{client.reels?.length || 0} Reels</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-5 pt-0 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Link
                          to="/projects/$slug"
                          params={{ slug: client.slug }}
                          target="_blank"
                          title="View public case study"
                          className="text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDeleteClient(client.id, client.name)}
                          title="Delete client"
                          className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 p-2 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setEditingClient(client);
                          setActiveTab("details");
                        }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Manage & Media</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL: ADD NEW CLIENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0e131f] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white">Create New Client</h3>
                <p className="text-xs text-gray-400">
                  URL slug will be auto-generated from client name.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Client / Brand Name *
                </label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. TITAN EYEPLUS, BURGER KING"
                  required
                  className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {addLoading ? "Creating..." : "Create & Open Studio →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===============================================================
   CLIENT EDITOR STUDIO COMPONENT
   =============================================================== */
interface ClientEditorStudioProps {
  client: ClientItem;
  activeTab: "details" | "thumbnail" | "links" | "creatives" | "reels";
  setActiveTab: (tab: "details" | "thumbnail" | "links" | "creatives" | "reels") => void;
  onBack: () => void;
  onClientUpdated: () => Promise<void>;
}

function ClientEditorStudio({
  client,
  activeTab,
  setActiveTab,
  onBack,
  onClientUpdated,
}: ClientEditorStudioProps) {
  const [formData, setFormData] = React.useState({
    name: client.name || "",
    client_title: client.client_title || "",
    slug: client.slug || "",
    no: client.no || "01",
    copy: client.copy || "",
    full_description: client.full_description || "",
    hero_image: client.hero_image || "",
    links: {
      website: client.links?.website || "",
      instagram: client.links?.instagram || "",
      facebook: client.links?.facebook || "",
    },
    services_provided: Array.isArray(client.services_provided)
      ? [...client.services_provided]
      : [],
  });

  const [saving, setSaving] = React.useState(false);
  const [newServiceInput, setNewServiceInput] = React.useState("");

  // Media upload modal states
  const [creativeTitle, setCreativeTitle] = React.useState("");
  const [creativeCategory, setCreativeCategory] = React.useState("Social Campaign");
  const [creativeDesc, setCreativeDesc] = React.useState("");
  const [uploadingCreative, setUploadingCreative] = React.useState(false);

  const [reelTitle, setReelTitle] = React.useState("");
  const [reelViews, setReelViews] = React.useState("150K");
  const [reelDuration, setReelDuration] = React.useState("0:30");
  const [reelCategory, setReelCategory] = React.useState("Reels");
  const [reelPosterUrl, setReelPosterUrl] = React.useState("");
  const [uploadingReel, setUploadingReel] = React.useState(false);

  React.useEffect(() => {
    setFormData({
      name: client.name || "",
      client_title: client.client_title || "",
      slug: client.slug || "",
      no: client.no || "01",
      copy: client.copy || "",
      full_description: client.full_description || "",
      hero_image: client.hero_image || "",
      links: {
        website: client.links?.website || "",
        instagram: client.links?.instagram || "",
        facebook: client.links?.facebook || "",
      },
      services_provided: Array.isArray(client.services_provided)
        ? [...client.services_provided]
        : [],
    });
  }, [client]);

  // Save General Changes
  const handleSaveDetails = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Client details saved successfully!");
        await onClientUpdated();
      } else {
        toast.error(data.error || "Failed to save client");
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving changes");
    } finally {
      setSaving(false);
    }
  };

  // Upload Thumbnail File
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading thumbnail image (1200x900px)...");
    try {
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("type", "thumbnails");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadForm,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, hero_image: data.url }));
        await fetch(`/api/admin/clients/${client.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hero_image: data.url }),
        });
        await onClientUpdated();
        toast.success("Thumbnail uploaded & saved!", { id: toastId });
      } else {
        toast.error(data.error || "Upload failed", { id: toastId });
      }
    } catch {
      toast.error("Upload failed", { id: toastId });
    }
  };

  // Delete/Clear Thumbnail
  const handleRemoveThumbnail = async () => {
    if (!confirm("Are you sure you want to remove this thumbnail?")) return;
    try {
      setFormData((prev) => ({ ...prev, hero_image: "" }));
      await fetch(`/api/admin/clients/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero_image: "" }),
      });
      await onClientUpdated();
      toast.success("Thumbnail removed");
    } catch {
      toast.error("Error removing thumbnail");
    }
  };

  // Upload Creative File & Add Media
  const handleAddCreative = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileInput = document.getElementById("creative-file-input") as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) {
      toast.error("Please select an image file to upload");
      return;
    }

    try {
      setUploadingCreative(true);
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("type", "creatives");

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadForm,
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error(uploadData.error || "Upload failed");

      const mediaRes = await fetch(`/api/admin/clients/${client.id}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "creative",
          title: creativeTitle || file.name.replace(/\.[^/.]+$/, ""),
          category: creativeCategory,
          file_url: uploadData.url,
          description: creativeDesc,
        }),
      });
      const mediaData = await mediaRes.json();
      if (mediaData.success) {
        toast.success("Creative image uploaded & added to client carousel!");
        setCreativeTitle("");
        setCreativeDesc("");
        fileInput.value = "";
        await onClientUpdated();
      } else {
        toast.error(mediaData.error || "Failed to add media");
      }
    } catch (err: any) {
      toast.error(err.message || "Error adding creative");
    } finally {
      setUploadingCreative(false);
    }
  };

  // Upload Reel File & Add Media
  const handleAddReel = async (e: React.FormEvent) => {
    e.preventDefault();
    const videoFileInput = document.getElementById("reel-video-input") as HTMLInputElement;
    const posterFileInput = document.getElementById("reel-poster-input") as HTMLInputElement;

    const videoFile = videoFileInput?.files?.[0];
    if (!videoFile) {
      toast.error("Please select an MP4 video reel to upload");
      return;
    }

    try {
      setUploadingReel(true);
      // Upload Video
      const videoForm = new FormData();
      videoForm.append("file", videoFile);
      videoForm.append("type", "reels");

      const videoRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: videoForm,
      });
      const videoData = await videoRes.json();
      if (!videoData.success) throw new Error(videoData.error || "Video upload failed");

      // Upload Poster if provided, else fall back to the frame Cloudinary
      // auto-extracted from the video itself (never the raw video URL — that
      // isn't a valid image src).
      let finalPoster = reelPosterUrl || videoData.posterUrl || "";
      const posterFile = posterFileInput?.files?.[0];
      if (posterFile) {
        const posterForm = new FormData();
        posterForm.append("file", posterFile);
        posterForm.append("type", "thumbnails");
        const posterRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: posterForm,
        });
        const pData = await posterRes.json();
        if (pData.success) finalPoster = pData.url;
      }

      // Save to client_media
      const mediaRes = await fetch(`/api/admin/clients/${client.id}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "reel",
          title: reelTitle || videoFile.name.replace(/\.[^/.]+$/, ""),
          category: reelCategory,
          file_url: videoData.url,
          poster_url: finalPoster,
          views: reelViews,
          duration: reelDuration,
        }),
      });
      const mediaData = await mediaRes.json();
      if (mediaData.success) {
        toast.success("Reel uploaded & added to client carousel!");
        setReelTitle("");
        videoFileInput.value = "";
        if (posterFileInput) posterFileInput.value = "";
        await onClientUpdated();
      } else {
        toast.error(mediaData.error || "Failed to add reel");
      }
    } catch (err: any) {
      toast.error(err.message || "Error adding reel");
    } finally {
      setUploadingReel(false);
    }
  };

  // Delete a media item (Creative or Reel)
  const handleDeleteMedia = async (mediaId: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title || "this media"}"?`)) return;
    try {
      const res = await fetch(`/api/admin/media/${mediaId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Media deleted successfully");
        await onClientUpdated();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Error deleting media");
    }
  };

  // Add/Remove Service Chip
  const addService = () => {
    if (!newServiceInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      services_provided: [...prev.services_provided, newServiceInput.trim()],
    }));
    setNewServiceInput("");
  };

  const removeService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services_provided: prev.services_provided.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBack();
          }}
          className="hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer font-medium"
        >
          <span>Dashboard</span>
        </button>
        <span>/</span>
        <span className="text-gray-200 font-semibold">{formData.name || "Client Studio"}</span>
      </div>

      {/* Studio Header Bar */}
      <div className="bg-[#0e131f]/95 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBack();
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 hover:border-blue-500/50 rounded-xl text-blue-300 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm group"
            title="Back to Main Dashboard"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Dashboard</span>
          </button>

          <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                PROJECT {formData.no}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-400 font-mono">/projects/{formData.slug}</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">
              {formData.name || "Client Studio"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/projects/$slug"
            params={{ slug: formData.slug }}
            target="_blank"
            className="text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Public Page</span>
          </Link>

          <button
            onClick={handleSaveDetails}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 text-xs">
        {[
          { id: "details", label: "Client Details", icon: Edit3 },
          { id: "thumbnail", label: "Thumbnail / Hero", icon: ImageIcon },
          { id: "links", label: "Services & Social Links", icon: Globe },
          {
            id: "creatives",
            label: `Creatives Carousel (${client.creatives?.length || 0})`,
            icon: ImageIcon,
          },
          {
            id: "reels",
            label: `Reels Carousel (${client.reels?.length || 0})`,
            icon: Film,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DETAILS */}
      {activeTab === "details" && (
        <div className="bg-[#0e131f]/90 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Client Brand Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Full Client Title / Subtitle
              </label>
              <input
                type="text"
                value={formData.client_title}
                onChange={(e) => setFormData({ ...formData, client_title: e.target.value })}
                placeholder="e.g. Happy Valley Water Park & Resort"
                className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                URL Slug (/projects/:slug) *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Project Number Badge
              </label>
              <input
                type="text"
                value={formData.no}
                onChange={(e) => setFormData({ ...formData, no: e.target.value })}
                placeholder="01"
                className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Elevator Copy (Featured on Homepage Project Card)
              </label>
              <textarea
                rows={3}
                value={formData.copy}
                onChange={(e) => setFormData({ ...formData, copy: e.target.value })}
                placeholder="A concise 2-sentence summary of what ROYAL300 achieved for this client..."
                className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-y"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Full Case Study Narrative (For Project Detail Page)
              </label>
              <textarea
                rows={6}
                value={formData.full_description}
                onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                placeholder="Detailed narrative describing the client's business challenge, our strategic creative direction, and the outcome..."
                className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-y"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: THUMBNAIL */}
      {activeTab === "thumbnail" && (
        <div className="bg-[#0e131f]/90 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <h3 className="font-display font-bold text-white text-base">
                Client Hero & Homepage Thumbnail
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                This image represents the client on the homepage parallax card and the case study header.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-xl text-xs font-semibold">
              <span>Ratio: 4:3</span>
              <span className="text-gray-500">•</span>
              <span className="font-mono text-[11px]">1200 × 900 px</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
            {/* Preview Box */}
            <div>
              <div className="relative aspect-[4/3] rounded-2xl border border-white/15 bg-[#161c2c] overflow-hidden shadow-2xl">
                {formData.hero_image ? (
                  <img
                    src={cldImage(formData.hero_image, { width: 700, height: 525, crop: "fill" })}
                    alt={formData.name}
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                    <ImageIcon className="w-12 h-12 mb-2" />
                    <span className="text-xs">No image uploaded</span>
                  </div>
                )}
              </div>

              {formData.hero_image && (
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleRemoveThumbnail}
                    className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Thumbnail</span>
                  </button>
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-white/15 hover:border-blue-500/50 rounded-2xl p-6 text-center bg-white/5 transition-all">
                <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <span className="block text-sm font-semibold text-white">
                  Upload Thumbnail Image
                </span>
                <div className="mt-2 space-y-1">
                  <span className="block text-xs font-bold text-blue-400">
                    Exact Size: 1200 × 900 px (4:3 Aspect Ratio)
                  </span>
                  <span className="block text-[11px] text-gray-400">
                    Supports JPG, PNG, WEBP (Max 10MB)
                  </span>
                </div>
                <label className="mt-5 inline-block bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-md shadow-blue-600/20 transition-all">
                  Select File (1200x900px)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Or manual image path:
                </label>
                <input
                  type="text"
                  value={formData.hero_image}
                  onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                  placeholder="/uploads/thumbnails/..."
                  className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SERVICES & LINKS */}
      {activeTab === "links" && (
        <div className="bg-[#0e131f]/90 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-8">
          {/* Social & Web Links */}
          <div>
            <h3 className="font-display font-bold text-white text-base mb-1">
              Client Social & Website Links
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Displayed as direct external buttons on the case study page.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 mb-2">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Website URL</span>
                </label>
                <input
                  type="url"
                  value={formData.links.website}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      links: { ...formData.links, website: e.target.value },
                    })
                  }
                  placeholder="https://..."
                  className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 mb-2">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>Instagram Profile</span>
                </label>
                <input
                  type="url"
                  value={formData.links.instagram}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      links: { ...formData.links, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/..."
                  className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 mb-2">
                  <Facebook className="w-3.5 h-3.5 text-blue-500" />
                  <span>Facebook Page</span>
                </label>
                <input
                  type="url"
                  value={formData.links.facebook}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      links: { ...formData.links, facebook: e.target.value },
                    })
                  }
                  placeholder="https://facebook.com/..."
                  className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Services Provided */}
          <div className="pt-6 border-t border-white/10">
            <h3 className="font-display font-bold text-white text-base mb-1">
              "We Provide" Services
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              Services provided tag pills shown under "We Provide" on the case study page.
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {formData.services_provided.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs px-3 py-1.5 rounded-xl font-medium"
                >
                  <span>{s}</span>
                  <button
                    onClick={() => removeService(i)}
                    className="text-blue-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newServiceInput}
                onChange={(e) => setNewServiceInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addService())}
                placeholder="e.g. Paid Media Campaigns"
                className="flex-1 bg-[#161c2c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addService}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-xl"
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CREATIVES CAROUSEL */}
      {activeTab === "creatives" && (
        <div className="space-y-6">
          {/* Add New Creative Card */}
          <div className="bg-[#0e131f]/90 border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-white/10 pb-3">
              <div>
                <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-400" />
                  <span>Upload Campaign Creative</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  High-resolution promotional images displayed in the interactive carousel.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-xl text-xs font-semibold">
                <span>Square: 1080 × 1080 px (1:1)</span>
                <span className="text-gray-500">•</span>
                <span>Portrait: 1080 × 1350 px (4:5)</span>
              </div>
            </div>

            <form onSubmit={handleAddCreative} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Select Image File * (1080x1080px or 1080x1350px)
                  </label>
                  <input
                    id="creative-file-input"
                    type="file"
                    accept="image/*"
                    required
                    className="w-full bg-[#161c2c] border border-white/10 rounded-xl p-2 text-xs text-gray-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Creative Title
                  </label>
                  <input
                    type="text"
                    value={creativeTitle}
                    onChange={(e) => setCreativeTitle(e.target.value)}
                    placeholder="e.g. Summer Festival Banner"
                    className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={creativeCategory}
                    onChange={(e) => setCreativeCategory(e.target.value)}
                    placeholder="e.g. Social Campaign, Ad Creatives"
                    className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Caption / Short Description
                  </label>
                  <input
                    type="text"
                    value={creativeDesc}
                    onChange={(e) => setCreativeDesc(e.target.value)}
                    placeholder="e.g. High-impact seasonal promotional banner."
                    className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={uploadingCreative}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {uploadingCreative ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Creative</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Existing Creatives Grid with Prominent Delete Option */}
          <div className="bg-[#0e131f]/90 border border-white/10 rounded-2xl p-6">
            <h4 className="font-display font-bold text-white text-sm mb-4">
              Current Campaign Creatives ({client.creatives?.length || 0})
            </h4>

            {(!client.creatives || client.creatives.length === 0) ? (
              <p className="text-xs text-gray-500 py-6 text-center">
                No creatives added yet. Use the upload box above to add your first creative image.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {client.creatives.map((c: any) => (
                  <div
                    key={c.id}
                    className="bg-[#161c2c] border border-white/10 hover:border-white/20 rounded-xl overflow-hidden flex flex-col justify-between shadow-lg"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-black">
                      <img
                        src={cldImage(c.file_url || c.image, { width: 400, height: 400, crop: "fill" })}
                        alt={c.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md">
                        {c.category}
                      </span>
                    </div>

                    <div className="p-3.5">
                      <h5 className="font-semibold text-xs text-white line-clamp-1">{c.title}</h5>
                      <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                        {c.description || "No description provided"}
                      </p>
                    </div>

                    {/* Prominent Always-Visible Delete Button */}
                    <div className="p-3 pt-0 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-mono">ID: {c.id}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteMedia(c.id, c.title)}
                        className="text-xs text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: REELS CAROUSEL */}
      {activeTab === "reels" && (
        <div className="space-y-6">
          {/* Add New Reel Card */}
          <div className="bg-[#0e131f]/90 border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-white/10 pb-3">
              <div>
                <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
                  <Plus className="w-4 h-4 text-indigo-400" />
                  <span>Upload Video Reel (MP4)</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Upload vertical video reel for the interactive player carousel.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-semibold">
                <span>Ratio: 9:16 Vertical</span>
                <span className="text-gray-500">•</span>
                <span className="font-mono text-[11px]">1080 × 1920 px</span>
              </div>
            </div>

            <form onSubmit={handleAddReel} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Select MP4 Video File * (1080 × 1920 px, 9:16)
                  </label>
                  <input
                    id="reel-video-input"
                    type="file"
                    accept="video/mp4,video/*"
                    required
                    className="w-full bg-[#161c2c] border border-white/10 rounded-xl p-2 text-xs text-gray-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                  />
                  <span className="block text-[10px] text-gray-500 mt-1">
                    Recommended: 1080 × 1920 px • MP4 format • Max 100MB
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Poster Thumbnail (1080 × 1920 px, Optional)
                  </label>
                  <input
                    id="reel-poster-input"
                    type="file"
                    accept="image/*"
                    className="w-full bg-[#161c2c] border border-white/10 rounded-xl p-2 text-xs text-gray-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white"
                  />
                  <span className="block text-[10px] text-gray-500 mt-1">
                    Recommended: 1080 × 1920 px (9:16 ratio) • JPG or PNG
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Reel Title
                  </label>
                  <input
                    type="text"
                    value={reelTitle}
                    onChange={(e) => setReelTitle(e.target.value)}
                    placeholder="e.g. Behind the Scenes Experience"
                    className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Views Counter
                  </label>
                  <input
                    type="text"
                    value={reelViews}
                    onChange={(e) => setReelViews(e.target.value)}
                    placeholder="e.g. 185K"
                    className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={reelDuration}
                    onChange={(e) => setReelDuration(e.target.value)}
                    placeholder="0:30"
                    className="w-full bg-[#161c2c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={uploadingReel}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {uploadingReel ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Uploading Video Reel...</span>
                    </>
                  ) : (
                    <>
                      <Film className="w-3.5 h-3.5" />
                      <span>Upload Reel (1080x1920px)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Existing Reels Grid with Prominent Delete Option */}
          <div className="bg-[#0e131f]/90 border border-white/10 rounded-2xl p-6">
            <h4 className="font-display font-bold text-white text-sm mb-4">
              Current Video Reels ({client.reels?.length || 0})
            </h4>

            {(!client.reels || client.reels.length === 0) ? (
              <p className="text-xs text-gray-500 py-6 text-center">
                No reels uploaded yet. Use the upload box above to upload 9:16 vertical video reels.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {client.reels.map((r: any) => (
                  <div
                    key={r.id}
                    className="bg-[#161c2c] border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
                  >
                    <div className="relative aspect-[9/16] w-full bg-black overflow-hidden">
                      <video
                        src={cldVideo(r.file_url || r.videoUrl, { width: 480 })}
                        poster={cldImage(r.poster_url || r.poster, { width: 480 })}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                        <span className="font-semibold text-indigo-400">{r.views} Views</span>
                        <span>{r.duration}</span>
                      </div>
                      <h5 className="font-semibold text-xs text-white line-clamp-1">{r.title}</h5>

                      {/* Prominent Always-Visible Delete Button */}
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-mono">ID: {r.id}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteMedia(r.id, r.title)}
                          className="text-xs text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Reel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
