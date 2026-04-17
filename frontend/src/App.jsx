import { useState } from 'react';
import Mainpage from './public-page/mainpage.jsx';
import Signup from "./public-page/signup.jsx";

function App() {
  const [section, setSection] = useState('public');

  if (section === 'candidate') {
    return (
      <main className="page-placeholder">
        <h1>Candidate page here</h1>
        <button onClick={() => setSection('public')}>
          Back to public page
        </button>
      </main>
    );
  }

  if (section === 'hr') {
    return (
      <main className="page-placeholder">
        <h1>HR page here</h1>
        <button onClick={() => setSection('public')}>
          Back to public page
        </button>
      </main>
    );
  }

  if (section === 'signup') {
    return <Signup />;
  }

  return (
    <Mainpage
      onGoCandidate={() => setSection('candidate')}
      onGoSignup={() => setSection('signup')}
    />
  );
}

export default App;