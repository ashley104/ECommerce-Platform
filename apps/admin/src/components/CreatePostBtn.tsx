export default function CreatePostBtn() {
  return (
    <div className="mb-6">
      <div 
        style={{
          backgroundColor: "#1A5134",
          color: "white",
        }}
        className="hover:opacity-90 rounded-md px-4 py-2 font-semibold w-max">
          <a href="/posts/create">
            Create Post
          </a>
      </div>
    </div>
  )
}