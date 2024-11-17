import NavBar from "./components/nav";
import ToolBar from "./components/toolBar";
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
      <body className="bg-background text-foreground font-sans antialiased h-screen">
        {/* main sets the alignment */}
        <main className="flex flex-col flex-grow h-full">
          {/* <NavBar /> */}
          {children}
        </main>
      </body>
    </html>
  );
}
