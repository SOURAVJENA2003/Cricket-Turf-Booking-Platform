import "./globals.css";

export const metadata = {
  title: "Runmakers Arena Box Cricket",
  description: "Experience Jeypore's premier Cushioned AstroTurf Box ground. Book floodlight slots instantly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
