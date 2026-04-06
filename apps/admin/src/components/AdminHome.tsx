import { handleLogout } from "../app/actions/authAction";
import PostList from "./PostList";

export default function AdminHome() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#F1D7DA" }}
    >
      <header 
        className="border-b"
        style={{
          backgroundColor: "#1A5134",
          borderColor: "#1A5134",
        }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl text-white font-semibold">Admin of Full Stack Blog</h1>
          <button 
            onClick={handleLogout} 
            className="bg-white text-[#1A5134] hover:bg-gray-100 rounded-md px-3 py-2 font-medium">
            Logout
          </button>
        </div>
      </header>
      <PostList />
    </div>
  );
}