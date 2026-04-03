function Navbar() {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#333', color: 'white' }}>
      <h2>DevConnect</h2>
      <ul style={{ display: 'flex', gap: '15px', listStyle: 'none' }}>
        <li>Home</li>
        <li>Login</li>
        <li>Register</li>
      </ul>
    </nav>
  );
}

export default Navbar;