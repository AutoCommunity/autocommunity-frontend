import { action, makeObservable, observable } from "mobx";

type Theme = "light" | "dark"


class GlobalStorage {
    @observable
    theme = 'light'

    @observable
    username = '';

    @observable
    markerInfoVisible = false;

    constructor() {
        makeObservable(this);
    }

    @action
    changeTheme(theme: string) {
        this.theme = theme;
    }

    @action
    changeMarkerInfoVisible(markerVisible: boolean) {
        this.markerInfoVisible = markerVisible;
    }

    @action
    userLogin(username: string) {
        this.username = username;
    }


    stylesheets = {
        light: "https://cdnjs.cloudflare.com/ajax/libs/antd/4.9.4/antd.min.css",
        dark: "https://cdnjs.cloudflare.com/ajax/libs/antd/4.9.4/antd.dark.min.css"
    }

    createStylesheetLink = (): HTMLLinkElement => {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.id = "antd-stylesheet"
        document.head.appendChild(link)
        return link
    }

    getStylesheetLink = (): HTMLLinkElement =>
        document.head.querySelector("#antd-stylesheet") || this.createStylesheetLink()

    systemTheme = () =>
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"

    getTheme = () => (localStorage.getItem("theme") as Theme) || this.systemTheme()

    @action
    setTheme = (t: Theme) => {
        console.log('set theme', t)
        localStorage.setItem("theme", t)
        this.getStylesheetLink().href = this.stylesheets[t]
        this.changeTheme(t);
        if (t === "dark") {
            document.body.querySelector(".leaflet-tile-pane")?.classList.add("dark-leaflet-theme")
            document.body.querySelector(".leaflet-control-attribution")?.classList.add("dark-leaflet-theme")
            document.body.querySelector(".leaflet-control-zoom")?.classList.add("dark-leaflet-theme")
        } else {
            document.body.querySelector(".leaflet-tile-pane")?.classList.remove("dark-leaflet-theme")
            document.body.querySelector(".leaflet-control-attribution")?.classList.remove("dark-leaflet-theme")
            document.body.querySelector(".leaflet-control-zoom")?.classList.remove("dark-leaflet-theme")
        }
    }

    toggleTheme = () => this.setTheme(this.getTheme() === "dark" ? "light" : "dark")

    forceSetTheme = () => this.setTheme(this.getTheme())

}

export default GlobalStorage;