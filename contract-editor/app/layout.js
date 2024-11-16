import NavBar from "./components/nav";
import ToolBar from "./components/toolbar";
import "./globals.css";

export const metadata = {
  title: "Contract Editor",
  description: "Drafting contracts programmatically",
  keywords: "contract editor, lawyers, law, contracts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* body sets the container */}
      <body className="bg-background text-foreground font-sans antialiased mb-40 mx-4 mt-2">
        {/* main sets the alignment */}
        <main className="flex flex-col">
          <NavBar />
          <ToolBar />
          {children}
        </main>
      </body>
    </html>
  );
}
