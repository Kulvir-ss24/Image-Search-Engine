let input = document.querySelector(".search-box input");
let btn = document.querySelector(".btn button");
let images = document.querySelector(".images");
let load = document.querySelector("#load");
let imageUrls = {};

const accessKey = "C4uwqz3-DQBFEGqut_egKu8gRCr6cyI5ZXBWvnHF4QM";
let page = 1;
let keyword = "";

function download(imgurl) {
    fetch(imgurl)
        .then(res => res.blob())
        .then(file => {
            let a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = new Date().getTime();
            a.click();
        })
        .catch(() => alert("failed download"));
}

async function getResponse() {
    keyword = input.value;
    let url = `https://api.unsplash.com/search/collections?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`;
    let response = await fetch(url);
    let data = await response.json();
    let results = data.results;

    if (page == 1) {
        images.innerHTML = "";
    }
    load.style.display = "block";

    results.map((result) => {
        imageUrls[result.id] = {
            small: result.preview_photos[0].urls.small,
            medium: result.preview_photos[0].urls.regular,
            large: result.preview_photos[0].urls.large,
            full: result.preview_photos[0].urls.full
        };
        let li = document.createElement("li");
        li.classList.add("image");
        let html = `
        <img src="${result.preview_photos[0].urls.small}" alt="img" class="photo" onclick="openImageIn4K('${result.preview_photos[0].urls.full}')">
        <div class="details">
            <div class="user">
                <img src="camera.svg" alt="img">
                <span>${result.title}</span>
            </div>
            <select class="resolution" onchange="updateDownloadUrl('${result.id}', this.value)">
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="full">Full</option>
            </select>
            <div class="download" onclick="download('${result.id}')">
                <img src="download.svg" alt="img">
            </div>
        </div>`;
        li.innerHTML = html;
        images.appendChild(li);
    });
    load.style.display = "none";
}

function updateDownloadUrl(imageId, resolution) {
    const selectedUrl = imageUrls[imageId][resolution];
    const downloadButton = document.querySelector(`.download[onclick="download('${imageId}')"]`);
    downloadButton.setAttribute('data-url', selectedUrl);
}

function updateAspectRatio(imageId, aspectRatio) {
    const downloadButton = document.querySelector(`.download[onclick="download('${imageId}')"]`);
    downloadButton.setAttribute('data -aspect-ratio', aspectRatio);
}

function download(imageId) {
    const downloadButton = document.querySelector(`.download[onclick="download('${imageId}')"]`);
    const imgUrl = downloadButton.getAttribute('data-url');
    const aspectRatio = downloadButton.getAttribute('data-aspect-ratio');

    fetch(imgUrl)
        .then(res => res.blob())
        .then(file => {
            let a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = `${imageId}_${aspectRatio}.jpg`;
            a.click();
        })
        .catch(() => alert("failed download"));
}

function openImageIn4K(imgurl) {
    window.open(imgurl, '_blank'); // Open the 4K image in a new tab
}

input.addEventListener("keyup", (e) => {
    page = 1;
    if (e.key == "Enter") {
        getResponse();
    }
});
btn.addEventListener("click", () => {
    page = 1;
    getResponse();
});
load.addEventListener("click", () => {
    page++;
    getResponse();
});


