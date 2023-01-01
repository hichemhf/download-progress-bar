const fileToDownloaded = "assets.zip";
const startDownloadElem = document.getElementById("startDownload");

startDownloadElem.addEventListener("click", () => {
  console.log("Download Started");

  fetch(`/${fileToDownloaded}`)
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
            totalSizeDownloaded += result.value.length;
            const percentage = Math.floor(
              (totalSizeDownloaded / totalSize) * 100
            );
            console.log(`${totalSizeDownloaded}/${totalSize} (${percentage}%)`);
          }

          if (!result.done) {
            return readData();
          }
        });
      }

      return readData();
    })
    .catch()
    .finally();
});
