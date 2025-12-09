import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Mail, Loader2 } from "lucide-react";
import "./Dashboard.css"; // Reuse dashboard styles for consistency

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) { navigate("/login"); return; }

        // Reuse the dashboard endpoint to get user stats and data
        const response = await fetch(`http://localhost:5000/api/dashboard/${storedUser.id}`);
        const data = await response.json();

        setUser(data.user);
        
        // Filter posts to show ONLY posts authored by this user
        // (Assuming the API returns a mix, we filter client-side for now)
        const myPosts = data.posts.filter(p => p.author === data.user.name);
        setPosts(myPosts);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="flex-center h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="dashboard-container">
      {/* Header with Back Button */}
      <header className="app-header">
        <div className="container" style={{display:'flex', alignItems:'center', gap:'1rem'}}>
          <button onClick={() => navigate("/dashboard")} className="icon-btn ghost">
            <ArrowLeft size={24} />
          </button>
          <h2>My Profile</h2>
        </div>
      </header>

      <div className="container" style={{maxWidth: '800px'}}>
        
        {/* Profile Hero Card */}
        {user && (
          <div className="card" style={{textAlign: 'center', padding: '3rem 1rem'}}>
            <div className="avatar gradient-bg" style={{width: 100, height: 100, fontSize: 36, margin: '0 auto 1.5rem'}}>
              {user.avatar}
            </div>
            <h1 style={{fontSize: '2rem', marginBottom: '0.5rem'}}>{user.name}</h1>
            <p className="subtitle" style={{fontSize: '1.1rem'}}>{user.username}</p>
            
            <div style={{display:'flex', justifyContent:'center', gap:'2rem', marginTop:'2rem'}}>
                <div style={{display:'flex', alignItems:'center', gap:'0.5rem', color:'var(--text-secondary)'}}>
                    <Mail size={16} /> {user.email || "user@example.com"}
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'0.5rem', color:'var(--text-secondary)'}}>
                    <Calendar size={16} /> Joined 2024
                </div>
            </div>

            {/* Stats Row */}
            <div className="profile-stats" style={{marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem'}}>
              <div className="stat-item">
                 <p className="stat-value" style={{fontSize: '1.5rem'}}>{user.stats.communities}</p>
                 <p className="stat-label">Communities</p>
              </div>
              <div className="stat-item">
                 <p className="stat-value" style={{fontSize: '1.5rem'}}>{posts.length}</p>
                 <p className="stat-label">Posts Created</p>
              </div>
              <div className="stat-item">
                 <p className="stat-value" style={{fontSize: '1.5rem'}}>{user.stats.followers}</p>
                 <p className="stat-label">Followers</p>
              </div>
            </div>
          </div>
        )}

        {/* User's Posts Feed */}
        <h3 style={{margin: '2rem 0 1rem'}}>My Recent Activity</h3>
        <div className="posts-container">
            {posts.length > 0 ? (
                posts.map(post => (
                    <article key={post.id} className="card post-card">
                        <div className="post-layout">
                            <div className="avatar gradient-bg">{post.avatar}</div>
                            <div className="post-body">
                                <div className="post-meta">
                                    <span className="author-name">{post.author}</span>
                                    <span>·</span>
                                    <span className="meta-text">{post.time}</span>
                                </div>
                                <h3 className="post-title">{post.title}</h3>
                                <p className="post-content">{post.content}</p>
                            </div>
                        </div>
                    </article>
                ))
            ) : (
                <div className="card" style={{textAlign:'center', padding:'3rem', color:'gray'}}>
                    <p>You haven't posted anything yet.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Profile;