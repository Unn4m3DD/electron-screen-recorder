
const { desktopCapturer, remote } = require('electron');
const { writeFile } = require('fs');
const { dialog } = remote;

let media_recorder;
const recordedChunks = [];

const video_canvas = document.getElementById("video_canvas")
const start_button = document.getElementById("start_button")
const stop_button = document.getElementById("stop_button")
const select_button = document.getElementById("select_button")
const select_popup_container = document.getElementById("select_popup_container")
const select_popup_menu = document.getElementById("select_popup_menu")
const select_popup_loading = document.getElementById("select_popup_loading")

const select_source = async (source) => {

  select_button.innerText = source.name.slice(0, 13)
  const stream = await navigator.mediaDevices.getUserMedia(
    {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id
        }
      }
    }
  )

  video_canvas.srcObject = stream
  video_canvas.play()
  close_modal()
  media_recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });
  media_recorder.ondataavailable = handleDataAvailable;
  media_recorder.onstop = handleStop;
}

const get_video_sources = async () => {
  select_popup_container.style.display = "flex"
  select_popup_loading.innerText = "loading"
  const interval = setInterval(() => { select_popup_loading.innerText += "." }, 400)
  let sources = await desktopCapturer.getSources({
    types: ["window", "screen"]
  })
  clearInterval(interval);

  sources = group(sources, 3)
  select_popup_menu.innerHTML =
    sources.map(source => {
      let innerHTML = source.map((item) => (
        `
      <div class="thumbnail_container" id="${item.name}">
        <div class="thumbnail_text">${item.name}</div>
        <img class="thumbnail_image"src="${item.thumbnail.toDataURL()}" />
      </div>`
      )).join("")
      return `<div>${innerHTML}</div>`
    }).join("")
  sources.forEach(element => {
    element.forEach((source) => {
      if (document.getElementById(source.name))
        document.getElementById(source.name).onclick = () => select_source(source)
    })
  });
  select_popup_menu.style.display = "flex";
}

const close_modal = () => {
  select_popup_container.style.display = "none"
  select_popup_menu.style.display = "none";
}

function group(array, count) {
  let result = []
  for (let i = 0; i < array.length; i++) {
    if (i % count == 0) result.push([])
    result[result.length - 1].push(array[i]);
  }
  return result;
}





start_button.onclick = event => {
  media_recorder.start();
  start_button.innerText = 'Recording';
};
stop_button.onclick = e => {
  media_recorder.stop();
  start_button.classList.remove('is-danger');
  start_button.innerText = 'Start';
};

function handleDataAvailable(e) {
  recordedChunks.push(e.data);
}

async function handleStop(e) {
  const blob = new Blob(recordedChunks, {
    type: 'video/webm; codecs=vp9'
  });

  const buffer = Buffer.from(await blob.arrayBuffer());

  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save video',
    defaultPath: `vid-${Date.now()}.webm`
  });

  if (filePath) {
    writeFile(filePath, buffer, () => { });
  }

}