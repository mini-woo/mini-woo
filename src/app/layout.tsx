import './globals.css'
import type {Metadata} from 'next'
import {TelegramProvider} from "@/app/TelegramProvider";

export const metadata: Metadata = {
    title: 'MiniWoo',
    description: 'Telegram mini app for woocommerce integration',
    viewport: {
        width: 'device-width',
        initialScale: 1,
        userScalable: false,
        viewportFit: "cover",
    },
    formatDetection: {
        telephone: false,
    },
    robots: {
        index: false,
        follow: false,
    },
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        <TelegramProvider>
            {children}
        </TelegramProvider>
        </body>
        </html>
    )
}
