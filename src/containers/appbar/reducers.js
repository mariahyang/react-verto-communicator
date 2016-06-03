import VideoConstants from '../../js/VideoConstants';

const app = (state, action)=>{

  if (typeof state === 'undefined') {
    //TODO ta Figure out what the default store will look like... it won't
    // be a direct copy of the 'local storage' that Verto originally used...
    // This is just here to get the 'store' started up
    return  { settings :{
                selectedVideo: null,
                selectedAudio: null,
                selectedShare: null,
                selectedSpeaker: null,
                selectedBestFrameRate: "15",
                useStereo: true,
                useVideo: true,
                useSTUN: true,

                mirrorInput: false, // scale video
                askRecoverCall: false, // ask before recovering
                language: 'en',
                languages: [
                     {id: 'en', name: 'English'},
                     {id: 'it', name: 'Italiano'},
                     {id: 'fr', name: 'Français'},
                     {id: 'de', name: 'Deutsch'},
                     {id: 'pt', name: 'Português'},
                     {id: 'pl', name: 'Polski'},
                     {id: 'zh', name: '中國'},
                     {id: 'ru', name: 'Pусский'},
                     {id: 'sv', name: 'Svenska'},
                     {id: 'da', name: 'Dansk'},
                     {id: 'es', name: 'Español'},
                     {id: 'id', name: 'Indonesia'}
                ],
                googEchoCancellation: true,
                googNoiseSuppression: true,
                googHighpassFilter: true,
                useDedenc: false, // use dedicated encoder
                autoBand: true,
                testSpeedJoin: true,
                vidQual: undefined,
                outgoingBandwidth: 'default',
                incomingBandwidth: 'default',
                bandwidth: VideoConstants.BAND_WIDTH,
                bestFrameRate: VideoConstants.FRAME_RATE
              },

              bandwidthInfo: {
                outgoingBandwidth: undefined,
                incomingBandwidth: undefined,
                vidQual: undefined //TODO ta - is this the same value as the 'settings' vidQual?  if so it can be removed
              }
            };
  }

  switch (action.type) {
    case "SPEED_TEST":
      //video quality only is available after login which is speed test time
      return { ...state, "bandwidthInfo": action.data, settings: { ...state.settings, vidQual: action.data.vidQual, videoQuality: action.videoQuality } };
    case "SETTINGS_UPDATE":
      //console.log("settings update JES: ", action.data);
      return { ...state, settings: { ...state.settings, ...action.data, bandwidth: VideoConstants.BAND_WIDTH} };
    default:
      return state;
    }
};

export { app };
