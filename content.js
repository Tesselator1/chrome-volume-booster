(function () {
  let audioContext;
  let gainNode;

  function initializeAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();

    let videoElements = document.querySelectorAll("video, audio");
    videoElements.forEach((element) => {
      let source = audioContext.createMediaElementSource(element);
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
    });

    console.log("Audio context and gain node initialized.");
  }

  window.setVolume = function (volume, tabId) {
    if (!audioContext || !gainNode) {
      initializeAudioContext();
    }
    console.log(`Changing gain to: ${volume}`);
    gainNode.gain.value = volume;
  };

  window.getVolume = function () {
    if (!audioContext || !gainNode) {
      initializeAudioContext();
    }
    return gainNode.gain.value;
  };

  console.log("Volume booster script injected.");
})();
