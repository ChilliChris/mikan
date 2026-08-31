import TimerAfkConnector from "./template/timer-afk-connector.js";

class MokuroConnector extends TimerAfkConnector {
  constructor() {
    super();
  }

  getName() {
    return "Mokuro reader";
  }

  getTargetLanguage() {
    return "ja";
  }

  isWatchPage() {
    return window.location.href.includes("/reader/");
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
  return new MokuroConnector();
}

