const text = document.getElementById("text");
const voiceSelect = document.getElementById("voiceSelect");
const speakBtn = document.getElementById("speakBtn");
const clearBtn = document.getElementById("clearBtn");
const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");

let voices = [];

// ------------------ LOAD VOICES (MOBILE SAFE) ------------------
function loadVoices() {
  voices = speechSynthesis.getVoices();

  // If voices are still not available, exit
  if (!voices.length) return;

  voiceSelect.innerHTML = "";

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

// Desktop + Mobile async loader
speechSynthesis.onvoiceschanged = loadVoices;

// Mobile fallback (important)
setTimeout(loadVoices, 500);

// Force voice init after first user interaction (mobile policy)
document.addEventListener(
  "click",
  () => {
    speechSynthesis.getVoices();
    loadVoices();
  },
  { once: true }
);

// ------------------ SPEAK BUTTON ------------------
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

speakBtn.addEventListener("click", () => {
  const content = text.value.trim();

  if (!content) {
    showToast("Please enter the text");
    return;
  }

  // 🔴 REQUIRED for Android (clears previous voice lock)
  speechSynthesis.cancel();

  // 🔴 ALWAYS create a new utterance
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = content;

  // 🔴 ANDROID-SAFE voice selection
  const selectedVoice = voices[voiceSelect.selectedIndex];
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  // 🔴 Small delay allows Android to apply the new voice
  setTimeout(() => {
    speechSynthesis.speak(utterance);
  }, 100);
});

clearBtn.addEventListener("click", () => {
  text.value = "";
  charCount.textContent = 0;
  wordCount.textContent = 0;
  speechSynthesis.cancel();
});


// ------------------ COUNTERS (FIX) ------------------
text.addEventListener("input", () => {
  const value = text.value;

  charCount.textContent = value.length;

  wordCount.textContent = value.trim()
    ? value.trim().split(/\s+/).length
    : 0;
});
