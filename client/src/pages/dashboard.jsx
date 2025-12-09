import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users, MessageSquare, TrendingUp, Plus, Search, Heart,
    MessageCircle, Share2, LogOut, X, Hash, Sparkles, Compass,
    Palette, Code, Laptop, Camera, Music, Gamepad2
} from "lucide-react";
import "./Dashboard.css";
import "./CreatePostModal.css";

// Extended Icon Map for the new Hobbies/Communities
const ICON_MAP = {
    Hash, Sparkles, Compass, Users, Palette, Code, Laptop,
    Camera, Music, Gamepad2, Default: Hash
};

// --- HEADER ---
const Header = ({ user, onLogout }) => (
    <header className="app-header">
        <div className="header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>HobbyNet</h2>
            {user && (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="avatar gradient-bg" style={{ width: 32, height: 32, fontSize: 12 }}>{user.avatar}</div>
                    <span style={{ fontWeight: 500 }}>{user.name}</span>
                    <button onClick={onLogout} className="icon-btn ghost" title="Logout"><LogOut size={20} /></button>
                </div>
            )}
        </div>
    </header>
);

// --- CREATE POST MODAL ---
const CreatePostModal = ({ isOpen, onClose, communities, userId, onPostCreated }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [communityId, setCommunityId] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!communityId) return alert("Please select a community");

        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/post/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, communityId, userId })
            });
            if (res.ok) {
                onPostCreated();
                onClose();
                setTitle(""); setContent(""); setCommunityId("");
            }
        } catch (err) { alert("Failed to create post", err); }
        finally { setLoading(false); }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Create Post</h3>
                    <button onClick={onClose} className="icon-btn ghost"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <input className="form-input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                    <textarea className="form-textarea" rows="4" placeholder="Share with your community..." value={content} onChange={e => setContent(e.target.value)} required />
                    
                    <select className="form-select" value={communityId} onChange={e => setCommunityId(e.target.value)} required>
                        <option value="">Select Community</option>
                        {communities.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Posting..." : "Post"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD ---
const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [myCommunities, setMyCommunities] = useState([]); // Changed from 'communities' to 'myCommunities' for clarity
    const [posts, setPosts] = useState([]);
    const [trending, setTrending] = useState([]);
    const [discover, setDiscover] = useState([]); // For suggested communities
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter Logic
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = useCallback(async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (!storedUser?.id) { navigate("/login"); return; }

            const response = await fetch(`http://localhost:5000/api/dashboard/${storedUser.id}`);
            const data = await response.json();

            setUser(data.user);
            setMyCommunities(data.myCommunities || []);
            setPosts(data.feed || []);
            setTrending(data.trending || []);
            setDiscover(data.discover || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleJoin = async (communityId) => {
        try {
            await fetch("http://localhost:5000/api/community/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, communityId })
            });
            alert("Joined successfully!");
            fetchData(); // Refresh to move from Discover to My Communities
        } catch (err) { alert("Failed to join", err); }
    };

    const handleLike = async (postId) => {
        // Optimistic UI Update
        setPosts(currentPosts => currentPosts.map(p => {
            if (p.id === postId) {
                return { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 };
            }
            return p;
        }));

        try {
            await fetch("http://localhost:5000/api/post/like", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, postId })
            });
        } catch (err) { console.error("Like failed", err); }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const renderIcon = (iconName) => {
        const IconComponent = ICON_MAP[iconName] || ICON_MAP.Default;
        return <IconComponent size={16} color="white" />;
    };

    // Search Filtering
    const filteredPosts = posts.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.community.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex-center h-screen">Loading...</div>;

    return (
        <div className="dashboard-container">
            <Header user={user} onLogout={handleLogout} />

            <div className="main-content container">
                <div className="dashboard-grid">

                    {/* LEFT SIDEBAR: MY COMMUNITIES */}
                    <aside className="sidebar left-sidebar">
                        {user && (
                            <div className="card profile-card" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
                                <div className="profile-header">
                                    <div className="avatar large gradient-bg">{user.avatar}</div>
                                    <div className="profile-info">
                                        <h3>{user.name}</h3>
                                        <p className="subtitle">{user.username}</p>
                                    </div>
                                </div>
                                <div className="profile-stats">
                                    <div className="stat-item"><p className="stat-value">{user.stats.communities}</p><p className="stat-label">Groups</p></div>
                                    <div className="stat-item"><p className="stat-value">{user.stats.posts}</p><p className="stat-label">Posts</p></div>
                                </div>
                            </div>
                        )}
                        <div className="card communities-card">
                            <div className="card-header">
                                <h3>My Communities</h3>
                            </div>
                            <div className="community-list">
                                {myCommunities.map((c) => (
                                    <button key={c.id} className="list-item">
                                        <div className="icon-box" style={{ backgroundColor: c.colorHex || '#6366f1' }}>
                                            {renderIcon(c.iconName)}
                                        </div>
                                        <div className="item-details"><p className="item-name">{c.name}</p></div>
                                    </button>
                                ))}
                                {myCommunities.length === 0 && <p className="text-muted p-2">Join a community to see it here!</p>}
                            </div>
                        </div>
                    </aside>

                    {/* CENTER: FEED */}
                    <main className="feed-column">
                        <div className="action-bar">
                            <div className="search-wrapper">
                                <Search className="search-icon" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Search posts..." 
                                    className="search-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                                <Plus size={16} /> Create Post
                            </button>
                        </div>

                        <div className="posts-container">
                            {filteredPosts.map((post) => (
                                <article key={post.id} className="card post-card">
                                    <div className="post-layout">
                                        <div className="avatar gradient-bg">{post.avatar}</div>
                                        <div className="post-body">
                                            <div className="post-meta">
                                                <span className="author-name">{post.author}</span>
                                                <span>·</span>
                                                <span className="meta-text" style={{ color: post.communityColor, fontWeight: 'bold' }}>{post.community}</span>
                                                <span>·</span>
                                                <span className="meta-text">{post.time}</span>
                                            </div>
                                            <h3 className="post-title">{post.title}</h3>
                                            <p className="post-content">{post.content}</p>

                                            <div className="post-actions">
                                                <button className={`action-btn ${post.isLiked ? 'active' : ''}`} onClick={() => handleLike(post.id)}>
                                                    <Heart size={16} className={post.isLiked ? 'fill-current' : ''} /> {post.likes}
                                                </button>
                                                <button className="action-btn"><MessageCircle size={16} /> {post.comments}</button>
                                                <button className="action-btn"><Share2 size={16} /> Share</button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                            {filteredPosts.length === 0 && <div className="card p-4 text-center">No posts found.</div>}
                        </div>
                    </main>

                    {/* RIGHT SIDEBAR: DISCOVER & TRENDING */}
                    <aside className="sidebar right-sidebar">
                        <div className="card">
                            <div className="card-header start">
                                <TrendingUp size={20} className="text-primary" />
                                <h3>Trending</h3>
                            </div>
                            <div className="list-group">
                                {trending.map((t, index) => (
                                    <div key={index} className="list-item simple">
                                        <p className="item-name">{t.name}</p>
                                        <p className="item-sub">{t.count} posts</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="section-title">Discover Communities</h3>
                            <div className="suggestion-list">
                                {discover.map((item) => (
                                    <div key={item.id} className="suggestion-item">
                                        <div className="icon-box" style={{ backgroundColor: item.colorHex || '#10b981' }}>
                                            {renderIcon(item.iconName)}
                                        </div>
                                        <div className="item-details"><p className="item-name">{item.name}</p></div>
                                        <button className="btn-outline" onClick={() => handleJoin(item.id)}>Join</button>
                                    </div>
                                ))}
                                {discover.length === 0 && <p className="text-muted">No new communities to suggest!</p>}
                            </div>
                        </div>
                    </aside>

                </div>
            </div>

            {/* MODAL */}
            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                communities={myCommunities} 
                userId={user?.id}
                onPostCreated={fetchData}
            />
        </div>
    );
};

export default Dashboard;