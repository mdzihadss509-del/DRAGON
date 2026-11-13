import "./globals.css";

export const metadata = {
  title: "Arctic Forge — Minecraft Marketplace",
  description: "Premium Minecraft servers, mods, modpacks, plugins, texture packs and development services."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}