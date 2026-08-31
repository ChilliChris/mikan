import TimerAfkConnector from "./template/timer-afk-connector.js";

class BilingualManguaConnector extends TimerAfkConnector {
  constructor() {
    super();
  }

  getName() {
    return "Bilingual Mangua";
  }

  getTargetLanguage() {
    // uncomment this for separating the en and jp version
    // if (this.getUrl().includes("lang=en"))
    //   return "en"

    return "ja";
  }

  getUrl() {
    return window.location.href
  }

  isWatchPage() {
    let url = this.getUrl();
    return (
      url.includes("chen=") &&
      url.includes("enp=") &&
      url.includes("jpp=")
    );
  }

  isActive() {
    return true;
  }

  getNavigationEvents() {
    return [];
  }

  getCategory() {
    return "Reading"
  }

};

export default function connectorFactory() {
  return new BilingualManguaConnector();
}

