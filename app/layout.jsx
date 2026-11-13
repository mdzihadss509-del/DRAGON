import "./globals.css";

export const metadata = {
  title: "Arctic Forge — Minecraft Marketplace",
  description: "Discover free Minecraft mods, modpacks, plugins, texture packs, shaders and creator-made premium server services.",
  metadataBase: new URL("https://dragon-minecraft-marketplace-dialwh906-mdzihadss509-1195.vercel.app")
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}