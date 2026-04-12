import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "God of Graphics – Seat Booking",
  description: "Book your seat at God of Graphics Institute of Professional Design.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: '14px',
              fontFamily: 'inherit',
              fontWeight: '600',
              fontSize: '13px',
            },
            classNames: {
              success: 'border-l-4 border-green-500',
              error: 'border-l-4 border-red-500',
              warning: 'border-l-4 border-yellow-400',
            },
          }}
          richColors
        />
      </body>
    </html>
  );
}
