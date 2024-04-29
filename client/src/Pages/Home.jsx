import React from 'react'

function Home() {
  return (
    <div>
      Home
      <br />
      <a href="/signup" className="text-blue-500">
        Sign up here
      </a>
      <br />
      <a href="/login" className="text-blue-500">
        login here
      </a>
      <br />
      <a href="/forgot-password" className="text-blue-500">
        forgot-password
      </a>
      <br />
      <a href="/reset-password" className="text-blue-500">
        reset-password
      </a>
    </div>
  );
}

export default Home