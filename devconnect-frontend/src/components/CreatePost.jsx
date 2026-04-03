import { useState } from 'react';

const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('https://devconnect-api-d0ou.onrender.com/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });

      const data = await res.json(); // We get the new post back from the server

      if (res.ok) {
        alert("Post Created!");
        setTitle('');
        setContent('');
        onPostCreated(data); 
      } else {
        console.error("Server error:", data.message);
      }
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  return (
    <div style={{ border: '1px solid green', padding: '20px', margin: '10px 0' }}>
      <h3>Create Post</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
        <button type="submit">Publish</button>
      </form>
    </div>
  );
};

export default CreatePost;