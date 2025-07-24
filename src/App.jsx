import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/organisms/Header";
import SearchPage from "@/components/pages/SearchPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-inter">
        <Header />
        
        <main>
          <Routes>
            <Route path="/" element={<SearchPage />} />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          className="z-[9999]"
          toastClassName="!bg-surface !border !border-gray-700 !text-white"
          progressClassName="!bg-primary"
        />
      </div>
    </Router>
  );
}

export default App;