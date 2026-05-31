// inject/netflix.js

(() => {

    console.log("NETFLIX INJECT RUNNING");

    let lastState = {};

    setInterval(() => {

        try {

            if (!window.netflix?.appContext) {
                return;
            }

            const api =
                window.netflix.appContext.state.playerApp.getAPI();

            const sessions =
                api.getOpenPlaybackSessions();

            if (!sessions?.length) {
                return;
            }

            const sessionId = sessions[0];

            //console.log("SESSION", sessionId)

            const audioTrack = sessionId.currentAudioTrack;

            //console.log("AUDIOTRACK", audioTrack)

            const isPlaying = sessionId.playing;

            //console.log("ISPLAYING", isPlaying)

            const state = {
                //title: metadata?._video._video.title,
                playing: isPlaying,
                audio: {
                    language: audioTrack?.language,
                    displayName: audioTrack?.displayName,
                    code: audioTrack?.bcp47
                }
            };

            // only send updates if something changed
            if (
                JSON.stringify(state) !==
                JSON.stringify(lastState)
            ) {

                lastState = state;

                window.postMessage({
                    source: "netflix-extension",
                    data: state
                }, "*");

                console.log("STATE UPDATE", state);
            }

        } catch (err) {
            console.error(err);
        }

    }, 1000);

})();