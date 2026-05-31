import VideoConnector from "./video-connector.js";

const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// connectors/twitch.js
class TwitchConnector extends VideoConnector {
  constructor() {
    super();

    console.log("Mikan: creating twitch connector")

    this.title = "";
    this.japaneseTag = "";
  }

  scrapData() {
    this.title = document.querySelector('[data-a-target="stream-title"]').getAttribute('title');
    this.japaneseTag = document.querySelector('[data-a-target="日本語"]');
  }

  getName() {
    return "Twitch";
  }

  getTargetLanguage() {
    this.scrapData();

    if (!this.title || this.title == "") {
      console.error("No title found")
      return "";
    }

    let hasTag = false;
    if(!this.japaneseTag || this.japaneseTag == ""){
      console.error("No tag found")
      hasTag = false;
    }else{
      hasTag = true;
    }

    // Analyze Japanese content
    //const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF]/;
    const hiraganaKatakana = (this.title.match(/[\u3040-\u309F\u30A0-\u30FF]/g) || []).length;
    const kanji = (this.title.match(/[\u4E00-\u9FAF]/g) || []).length;

    const hasKana = hiraganaKatakana > 0;
    const hasKanji = kanji > 0;

    let isJapanese = false;

    if (hasKana || hasKanji || hasTag) {
      isJapanese = true;
    }
    else {
      isJapanese = false;
    }

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
    return window.location.href.slice(22).length > 1;
  }

  isActive() {
    let video = this.getVideoElement();
    if (video != undefined) {
      this.attachVideoListeners(video);
      return true;
    }
    return false;
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
  return new TwitchConnector();
}
