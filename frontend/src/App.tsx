import React, { useState } from "react";
import { TicketForm } from "./components/TicketForm";
import { TicketList } from "./components/TicketList";
import { StatsDashboard } from "./components/StatsDashboard";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTicketCreated = () => {
    // Force refresh of list and stats
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AutoTicket.ai
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Tech Intern Assessment
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of support tickets and performance metrics.
          </p>
        </div>

        {/* Stats Section */}
        <section key={`stats-${refreshKey}`} className="mb-8">
          <StatsDashboard />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Form Section - Sticky on large screens */}
          <div className="xl:col-span-1">
            <div className="sticky top-24">
              <TicketForm onTicketCreated={handleTicketCreated} />
            </div>
          </div>

          {/* List Section */}
          <div className="xl:col-span-2">
            <section key={`list-${refreshKey}`}>
              <TicketList />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
