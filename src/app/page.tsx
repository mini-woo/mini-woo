"use client"
import {useTelegram} from "@/app/TelegramProvider";

export default function Home() {
    const {webApp, user} = useTelegram()
    return (
        <main>
            <div>
                <h2>
                    User Data:
                </h2>
                <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>
            <div>
                <h2>
                    App Data:
                </h2>
                <pre>{JSON.stringify(webApp, null, 2)}</pre>
            </div>
        </main>
    )
}
