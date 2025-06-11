export default function TestStyles() {
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">
          Tailwind CSS Test
        </h1>
        
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Basic Styles Test
            </h2>
            <p className="text-gray-600 mb-4">
              If you can see this styled properly, Tailwind CSS is working!
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Test Button
            </button>
          </div>
          
          <div className="bg-green-100 border border-green-300 rounded-lg p-4">
            <p className="text-green-800">
              ✅ This should be a green success message box
            </p>
          </div>
          
          <div className="bg-red-100 border border-red-300 rounded-lg p-4">
            <p className="text-red-800">
              ❌ This should be a red error message box
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 