export default function App() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Quiz Application
        </h1>
        <p className="text-lg text-gray-600">
          Your quiz app is ready! 🚀
        </p>
        
        {/* Temporary demo section - we'll replace this later */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Admin Panel</h2>
            <p className="text-gray-600">Manage questions and set configuration</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Participant Interface</h2>
            <p className="text-gray-600">Join and answer questions</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Video Generation</h2>
            <p className="text-gray-600">Create and sync video playback</p>
          </div>
        </div>
      </div>
    </div>
  )
}
