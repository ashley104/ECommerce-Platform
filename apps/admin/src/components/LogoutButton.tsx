'use client';

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/auth", {
      method: "DELETE",
    });
    window.location.href = "/";
  }

  return (
    <button 
      onClick={handleLogout} 
      className="bg-white text-[#1A5134] hover:bg-gray-100 rounded-md px-3 py-2 font-medium">
      Logout
    </button>
  );
}