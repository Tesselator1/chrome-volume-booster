document.addEventListener("DOMContentLoaded", function () {
  let volumeRange = document.getElementById("volumeRange");
  let volumeValue = document.getElementById("volumeValue");
  let pipButton = document.getElementById("pipButton");

  // Загрузить текущий уровень громкости для активной вкладки
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let tabId = tabs[0].id;
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        func: () => {
          if (typeof window.getVolume === "function") {
            return window.getVolume();
          } else {
            console.error("getVolume function is not defined");
            return 1;
          }
        },
      },
      (results) => {
        if (results && results[0]) {
          let currentVolume = results[0].result || 1;
          volumeRange.value = currentVolume;
          volumeValue.textContent = currentVolume + "x";
        }
      }
    );
  });

  volumeRange.addEventListener("input", function () {
    let volume = volumeRange.value;
    volumeValue.textContent = volume + "x";

    console.log(`Volume slider changed to: ${volume}`);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let tabId = tabs[0].id;
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          func: (volume) => {
            if (typeof window.setVolume === "function") {
              window.setVolume(volume);
            } else {
              console.error("setVolume function is not defined");
            }
          },
          args: [parseFloat(volume)],
        },
        (results) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          } else {
            console.log("Volume change script executed");
          }
        }
      );
    });
  });

  pipButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          let video = document.querySelector("video");
          if (video) {
            video.requestPictureInPicture().catch((error) => {
              console.error("Error entering Picture-in-Picture mode:", error);
            });
          } else {
            console.log("No video element found on the page.");
          }
        },
      });
    });
  });
});
