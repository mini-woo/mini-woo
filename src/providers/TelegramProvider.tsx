"use client"
import Script from "next/script";
import {createContext, useContext, useEffect, useMemo, useState} from "react";

export interface ITelegramContext {
    webApp?: WebApp;
    user?: WebAppUser;
}

export const TelegramContext = createContext<ITelegramContext>({});

export function TelegramProvider({
                                     children,
                                 }: {
    children: React.ReactNode
}) {

    const [webApp, setWebApp] = useState<WebApp | null>(null);

    useEffect(() => {
        const telegram: Telegram | null = (window as any).Telegram;
        const app = telegram?.WebApp;
        if (app) {
            app.ready();
            setWebApp(app);
        }
    }, []);

    const value = useMemo(() => {
        return webApp
            ? {
                webApp,
                unsafeData: webApp.initDataUnsafe,
                user: webApp.initDataUnsafe.user,
            }
            : {};
    }, [webApp]);

    return (
        <TelegramContext.Provider value={value}>
            {/* Make sure to include script tag with "beforeInteractive" strategy to preload web-app script */}
            <Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy="beforeInteractive"
            />
            {children}
        </TelegramContext.Provider>
    );
}

export const useTelegram = () => useContext(TelegramContext);