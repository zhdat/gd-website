import React from "react";
import Page from "@/app/home/page";

function App() {
  return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Page />
        </main>
      </div>
  );
}

export default App;