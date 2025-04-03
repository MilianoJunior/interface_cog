import './App.css';
import Header from './components/Header/Header';
import Dashboard from './components/Dashboard/Dashboard';
function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
