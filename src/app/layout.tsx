import "./globals.css";
import { Poppins } from "next/font/google";
import SessionProviderWrapper from "@/components/Providers/SessionProvider";
import ReduxProvider from "@/components/Providers/ReduxProvider";
import AppLoadingOverlay from "@/app/layout-loading";
import MainLayout from "@/components/Layout/MainLayout";
import ClientConditionalLayout from "@/components/Providers/AuthClientLayout";

export const metadata = {
    title: "Silverwood Technologies",
    description:"Useful Multipurpose app",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: [
    "100", // Thin
    "200", // Extra Light
    "300", // Light
    "400", // Regular
    "500", // Medium
    "600", // Semi Bold
    "700", // Bold
    "800", // Extra Bold
    "900", // Black
  ],
});



export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={poppins.className}>
            <body>
                <SessionProviderWrapper>
                    <AppLoadingOverlay>
                        <ReduxProvider />{" "}
                        <ClientConditionalLayout>
                            {children}
                        </ClientConditionalLayout>
                    </AppLoadingOverlay>
                </SessionProviderWrapper>
            </body>
        </html>
    );
}
