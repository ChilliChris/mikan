// connectors/any-website.js
import VideoConnector from "./template/video-connector.js";

class AnyWebsiteConnector extends VideoConnector {
  constructor() {
    super();
  }

  isAsbplayerLoaded() {
    // class names present when using asbplayer
    const ASB_INDICATORS = [
      "asbplayer-mobile-video-overlay-container-top",
      "asbplayer-subtitles-container-top",
      "asbplayer-subtitles-container-bottom"
      //"asbplayer-token-container"
    ];
    // clases of div, only if they have children
    const ASB_INDICATORS_CHILDREN = [
      "asbplayer-offscreen"
    ];
    return (
      ASB_INDICATORS.some(cls => document.getElementsByClassName(cls).length > 0) ||
      ASB_INDICATORS_CHILDREN.some(cls => Array.from(document.getElementsByClassName(cls)).some(el => el.hasChildNodes()))
    );
  }


  async getName() {
    try {
      return window.top.location.hostname.replace('www.', '');
    } catch {
      return (await browserAPI.runtime.sendMessage({ type: "getTopHost" })).replace('www.', '');
    }
  }

  getTargetLanguage() {
    if (this.isAsbplayerLoaded()) {
      return "Custom";// Custom means always yes
    }
    else {
      return "";// will always be false
    }

  }

  getVideoElement() {
    let v = document.querySelector('video');
    return v;
  }

  isWatchPage() {
    if (this.isAsbplayerLoaded()) {
      return true;
    }
    let video = this.getVideoElement();
    if (video != undefined) {
      this.attachVideoListeners(video);
      return true;
    }
    return false;
  }

  isActive() {
    return true;
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
  return new AnyWebsiteConnector();
}
