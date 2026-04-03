import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PostCard from './components/PostCard';
import Login from './components/Login';
import CreatePost from './components/CreatePost';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return savedToken ? "Logged In User" : null;
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('https://devconnect-api-d0ou.onrender.com/api/posts');
        const data = await res.json();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch posts:", err); 
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const addNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div>
      <Navbar />

      <div style={{ padding: '20px' }}>
        
        {!user ? (
          <Login onLoginSuccess={(username) => setUser(username)} />
        ) : (
          <div style={{ backgroundColor: '#f0f8ff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>Welcome back! <button onClick={handleLogout}>Logout</button></h3>
            <CreatePost onPostCreated={addNewPost} />
          </div>
        )}

        <hr />

        <h1>Global Feed</h1>
        {loading ? (
          <p>Fetching the latest developer tips...</p>
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post._id} 
              title={post.title} 
              content={post.content} 
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;