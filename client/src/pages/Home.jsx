import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Hero Section */}
      <div className="text-center mb-12 pt-16">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Todo Dashboard
        </h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Stay organized and get things done
        </p>
      </div>
      
      {/* Dashboard Cards */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* My Todos Card */}
        <div 
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer p-8 border border-gray-100"
          onClick={() => navigate("/todos")}
        >
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">
            My Todos
          </h3>
          <p className="text-gray-600 text-lg">
            View and manage your tasks
          </p>
        </div>
        
        {/* Create Todo Card */}
        <div 
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer p-8 border border-gray-100"
          onClick={() => navigate("/create-todo")}
        >
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">
            Create Todo
          </h3>
          <p className="text-gray-600 text-lg">
            Add a new task to your list
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
