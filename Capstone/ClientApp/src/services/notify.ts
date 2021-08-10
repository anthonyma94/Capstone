// https://github.com/teodosii/react-notifications-component

import { ReactNotificationOptions, store } from "react-notifications-component";

export default function notify(
    message: string,
    opts?: Partial<ReactNotificationOptions>
) {
    const org: ReactNotificationOptions = {
        container: "top-right",
        message,
        type: "success",
        animationIn: ["animate__animated", "animate__slideInRight"],
        animationOut: ["animate__animated", "animate__slideOutRight"],
        dismiss: {
            duration: 3000,
            onScreen: true,
        },
    };
    store.addNotification({
        ...org,
        ...opts,
    });
}
