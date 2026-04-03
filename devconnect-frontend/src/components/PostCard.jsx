import { useState } from 'react';

const PostCard = ({ title, content, likes, postId }) => {
  const [likesCount, setLikesCount] = useState(likes.length);

  const myId = localStorage.getItem('userId');
  const [isLiked, setIsLiked] = useState(likes.includes(myId));

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Please login to interact with posts!");
      return;
    }

    try {
      const response = await fetch(`https://YOUR_API_URL.onrender.com/api/posts/${postId}/like`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message === "Post liked") {
          setLikesCount(likesCount + 1);
          setIsLiked(true);
        } else {
          setLikesCount(likesCount - 1);
          setIsLiked(false);
        }
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', margin: '10px 0', borderRadius: '8px' }}>
      <h2>{title}</h2>
      <p>{content}</p>
      
      <button 
        onClick={handleLike}
        style={{ 
          cursor: 'pointer',
          backgroundColor: 'transparent',
          border: '1px solid #ddd',
          padding: '5px 10px',
          borderRadius: '20px',
          color: isLiked ? 'red' : 'black' 
        }}
      >
        {isLiked ? '❤️' : '🤍'} {likesCount} Likes
      </button>
    </div>
  );
};

export default PostCard;