import "./globals.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "Runmakers Arena Box Cricket",
  description: "Experience Jeypore's premier Cushioned AstroTurf Box ground. Book floodlight slots instantly.",
  openGraph: {
    title: "Runmakers Arena Box Cricket",
    description: "Experience Jeypore's premier Cushioned AstroTurf Box ground. Book floodlight slots instantly.",
    type: "website",
    locale: "en_IN",
    siteName: "Runmakers Arena",
  },
  twitter: {
    card: "summary_large_image",
    title: "Runmakers Arena Box Cricket",
    description: "Experience Jeypore's premier Cushioned AstroTurf Box ground. Book floodlight slots instantly.",
  }
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
