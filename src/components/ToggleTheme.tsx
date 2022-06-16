type Theme = "light" | "dark"

const stylesheets = {
  light: "https://cdnjs.cloudflare.com/ajax/libs/antd/4.9.4/antd.min.css",
  dark: "https://cdnjs.cloudflare.com/ajax/libs/antd/4.9.4/antd.dark.min.css"
}

const createStylesheetLink = (): HTMLLinkElement => {
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.id = "antd-stylesheet"
  document.head.appendChild(link)
  return link
}

const getStylesheetLink = (): HTMLLinkElement =>
  document.head.querySelector("#antd-stylesheet") || createStylesheetLink()

const systemTheme = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"

const getTheme = () => (localStorage.getItem("theme") as Theme) || systemTheme()

const setTheme = (t: Theme) => {
  console.log('set theme', t)
  localStorage.setItem("theme", t)
  getStylesheetLink().href = stylesheets[t]
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

export const toggleTheme = () => setTheme(getTheme() === "dark" ? "light" : "dark")

export const forceSetTheme = () => setTheme(getTheme())