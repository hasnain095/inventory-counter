


const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const submitButton = document.getElementById("submit");
const displayText = document.getElementById("display-text")
const displayTextLabel = document.getElementById("display-text-label")
const inventoryLabel = document.getElementById("inventory-label")
const ulElement = document.getElementById("inventory-list")
const errorText = document.getElementById("error-text")
errorText.classList.add('d-none');


const conversionForm = document.getElementById('conversion-form');
const spinner = document.getElementById('spinner');


var recorder = null;
var audio = null;




conversionForm.addEventListener('submit', async (event) => {
  // event.preventDefault();
  submitButton.disabled = true;
  spinner.classList.remove('d-none');

  const formData = new FormData();
  debugger;
  // let blob = new Blob(audio.audioBlob, { type: "audio/ogg" });
  // let file = new File([audio.audioBlob], 'recording.ogg');
  // formData.append('files.file', file);
  formData.append('files.File', audio.audioBlob, 'audio.wav');
  const response = await fetch('/', {
    method: 'POST',
    body: formData,
  });


  // const downloadUrl = URL.createObjectURL(audio.audioBlob);
  // const link = document.createElement('a');
  // link.href = downloadUrl;
  // link.download = `${formData.get('filename')}.${formData.get('file_type')}`;
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
  submitButton.disabled = false;
  spinner.classList.add('d-none');
});

const sendAudioFile = file => {
  debugger;
  spinner.classList.remove('d-none');
  const formData = new FormData();
  formData.append('audio', file);
  formData.append("csrfmiddlewaretoken", csrftoken)
  return fetch('/', {
    method: 'POST',
    body: formData
  }).then((response) => response.json())
    .then(data => {
      console.log(data)
      displayTextLabel.classList.remove('d-none')
      displayText.innerText = data['text']

      if (!data['error']) {
        errorText.classList.add('d-none');
        inventoryLabel.classList.remove('d-none')
        var items = data["items"]

        ulElement.innerHTML = '';
        items.forEach(item => {
          const liElement = document.createElement('li');
          liElement.textContent = item.name + ": " + item.count;
          ulElement.appendChild(liElement);
        });
      }
      else{
        errorText.classList.remove('d-none');
        errorText.innerText = "Failed to process"
      }


      spinner.classList.add('d-none');
    })
};

const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
          sendAudioFile(audioBlob);

          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          stream.getTracks().forEach((track) => track.stop());
          resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
  });



const handleStart = async () => {
  console.log("Start")
  recorder = await recordAudio();
  const actionButton = document.getElementById("start");
  actionButton.disabled = true;
  recorder.start();
};

const handleStop = async () => {
  console.log("Stop")
  const actionButton = document.getElementById("start");
  const player = document.getElementById('player');
  audio = await recorder.stop();
  const url = URL.createObjectURL(audio.audioBlob);
  player.src = url;
  actionButton.disabled = false;
}

