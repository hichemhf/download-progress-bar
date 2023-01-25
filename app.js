const fileToDownload = "assets.zip";
const startDownloadElem = document.getElementById("startDownload");
const downloadProgressElem = document.querySelector(
  ".download-progress-bar__progress"
);

startDownloadElem.addEventListener("click", () => {
  console.log("Download Started");
  startDownloadElem.setAttribute("disabled", "true");
  const dataChunks = [];
  fetch(`./${fileToDownload}`)
    .then((response) => {
      const reader = response.body.getReader();
      const totalSize = Number(response.headers.get("content-length"));
      console.log(totalSize);
      let totalSizeDownloaded = 0;

      function readData() {
        return reader.read().then((result) => {
          //result.done
          //result.value
          if (result.value) {
            dataChunks.push(result.value);
            totalSizeDownloaded += result.value.length;
            const percentage = Math.floor(
              (totalSizeDownloaded / totalSize) * 100
            );
            console.log(`${totalSizeDownloaded}/${totalSize} (${percentage}%)`);
            downloadProgressElem.style.width = `${percentage}%`;
            downloadProgressElem.textContent = `${percentage}%`;
          }

          if (!result.done) {
            return readData();
          }
        });
      }

      return readData();
    })
    .then(() => {
      console.log("Download finshed");
      const downloadAnchor = document.createElement("a");
      const blob = new Blob(dataChunks);
      downloadAnchor.href = URL.createObjectURL(blob);
      downloadAnchor.download = fileToDownload;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
    })
    .catch((error) => {
      downloadProgressElem.textContent = "Download error";
      downloadProgressElem.classList.add("error");
      console.error(error);
    })
    .finally(() => {
      startDownloadElem.removeAttribute("disabled");
    });
});
