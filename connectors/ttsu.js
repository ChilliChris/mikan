import TimerAfkConnector from "./template/timer-afk-connector.js";

class TtsuConnector extends TimerAfkConnector {
  constructor() {
    super();
  }

  getName() {
    return "っつ reader";
  }

  getTargetLanguage() {
    return "ja";
  }

  isWatchPage() {
    return window.location.href.includes("id=");
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
  return new TtsuConnector();
}

