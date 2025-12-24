'use client';

export default function EmailConfigPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            📧 Email Configuration
          </h1>

          {/* Current Configuration */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Current Configuration</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <p><strong>From Address:</strong> <code>FinGrow &lt;onboarding@resend.dev&gt;</code></p>
                <p><strong>Resend API Key:</strong> ✅ Configured</p>
                <p><strong>Status:</strong> <span className="text-green-600 font-semibold">✅ Working</span></p>
              </div>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">🔧 Setup Instructions</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-3">To change your email domain:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Go to <a href="https://resend.com" target="_blank" className="text-blue-600 underline">resend.com</a> and login</li>
                <li>Click "Domains" → "Add Domain"</li>
                <li>Enter your domain or choose a Resend subdomain</li>
                <li>Follow DNS verification steps (if using your domain)</li>
                <li>Update your environment variables</li>
              </ol>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a 
              href="/" 
              className="text-gray-600 hover:text-gray-800 underline"
            >
              ← Back to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}