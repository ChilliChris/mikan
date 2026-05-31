import VideoConnector from "./video-connector.js";

// connectors/netflix.js
class NetflixConnector extends VideoConnector {
  constructor() {
    super();

    console.log("Mikan: creating twitch connector")

    this.title = "";
    this.audioTrack = "";
    this.isPlaying = "";

    window.addEventListener("message", (event) => {

        if (event.data?.source !== "netflix-extension") {
            return;
        }

        const data = event.data.data;

        this.audioTrack = data.audio;
        this.isPlaying = data.playing;

        console.log(data);
    });

    const script = document.createElement("script");

    script.src = chrome.runtime.getURL("injector/netflix.js");

    document.documentElement.appendChild(script);
  }

  getName() {
    return "Twitch";
  }

  getTargetLanguage() {

    let isJapanese = this.audioTrack.displayName.toLowerCase().includes("japanese");

    if (isJapanese) {
      return "ja";
    }
    return "other";
  }

  getVideoElement() {
    const v = document.querySelector('video');
    return v;
  }

  isWatchPage() {
    return window.location.pathname.includes('/watch')
  }

  isActive() {
    
    this.attachVideoListeners(this.getVideoElement());

    return this.isPlaying;
  }

  getNavigationEvents() {
    return [];
  }

  isAdPlaying() {
    return false;// can't detect
  }

  getCategory() {
    return "Watching"
  }
};

export default function connectorFactory() {
  return new NetflixConnector();
}
