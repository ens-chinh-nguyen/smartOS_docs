import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={roboto.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen font-normal">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
