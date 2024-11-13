import "./globals.css";

export const metadata = {
  title: "Contract Editor",
  description: "Drafting contracts programmatically",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
