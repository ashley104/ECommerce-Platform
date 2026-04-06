import { handleLogin } from "../app/actions/authAction";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F0FCF5" }}>
      <div className="w-full max-w-md mx-4 border p-5 bg-white shadow-lg rounded-lg">
        <form action={handleLogin}>
          <p className="text-base font-semibold" style={{ color: "#1A5134" }}>Admin Sign In</p>
          <p className="text-base text-gray-500 pb-5">
            Sign in to your account
          </p>
          <label className="block text-base font-medium text-gray-700 pb-1" htmlFor="password">
            Password
          </label>
          <input
            className="w-full rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus-visible:ring-[#1A5134] mb-4"
            type="password"
            name="password"
            placeholder="Enter password"
            required
          />

          <button type="submit" className="w-full text-white py-2 px-4 rounded-md" style={{ backgroundColor: "#1A5134" }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}