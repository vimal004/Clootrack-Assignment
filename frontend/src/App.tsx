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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Support Ticket System
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and track customer support requests.
          </p>
        </header>

        {/* Stats Section */}
        <section key={`stats-${refreshKey}`}>
          <StatsDashboard />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <TicketForm onTicketCreated={handleTicketCreated} />
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <section key={`list-${refreshKey}`}>
              <TicketList />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
