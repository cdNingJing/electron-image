const { ipcRenderer } = require('electron');
const path = require('path');

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('file-input');
  const thumbnailList = document.getElementById('thumbnail-list');
  const previewImage = document.getElementById('preview-image');
  const imageInfo = document.getElementById('image-info');
  const infoContent = document.getElementById('info-content');
  const closeInfo = document.getElementById('close-info');

  fileInput.addEventListener('change', handleFileSelection);
  previewImage.addEventListener('contextmenu', showImageInfo);
  closeInfo.addEventListener('click', () => imageInfo.classList.add('hidden'));

  function handleFileSelection(event) {
    const files = event.target.files;
    if (files.length > 0) {
      displayFiles(Array.from(files));
    }
  }

  function displayFiles(files) {
    files.forEach((file, index) => {
      const thumbnailItem = document.createElement('div');
      thumbnailItem.className = 'thumbnail-item';

      const thumbnail = document.createElement('img');
      thumbnail.className = 'thumbnail';
      thumbnail.src = URL.createObjectURL(file);
      thumbnail.addEventListener('click', () => {
        selectFile(thumbnail, file);
      });

      thumbnailItem.appendChild(thumbnail);
      thumbnailList.insertBefore(thumbnailItem, thumbnailList.firstChild.nextSibling);

      if (index === 0) {
        selectFile(thumbnail, file);
      }
    });
    sortThumbnails();
  }

  function selectFile(thumbnail, file) {
    document.querySelectorAll('.thumbnail').forEach(item => {
      item.classList.remove('selected');
    });

    thumbnail.classList.add('selected');
    previewImage.src = URL.createObjectURL(file);
    previewImage.dataset.fileInfo = JSON.stringify(getFileInfo(file));
  }

  function showImageInfo(event) {
    event.preventDefault();
    const fileInfo = JSON.parse(event.target.dataset.fileInfo);
    updateImageInfo(fileInfo);
    imageInfo.classList.remove('hidden');
  }

  function getFileInfo(file) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };
  }

  function updateImageInfo(fileInfo) {
    infoContent.innerHTML = ''; // Clear previous info

    addInfoItem('文件名', fileInfo.name);
    addInfoItem('文件大小', formatFileSize(fileInfo.size));
    addInfoItem('文件类型', fileInfo.type);
    addInfoItem('最后修改日期', new Date(fileInfo.lastModified).toLocaleString());

    // Get image dimensions
    const img = new Image();
    img.onload = function() {
      addInfoItem('图片尺寸', `${this.width} x ${this.height}`);
      const aspectRatio = (this.width / this.height).toFixed(2);
      addInfoItem('宽高比', aspectRatio);
    };
    img.src = previewImage.src;
  }

  function addInfoItem(label, value) {
    const div = document.createElement('div');
    div.textContent = `${label}: ${value}`;
    infoContent.appendChild(div);
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function sortThumbnails() {
    const thumbnails = Array.from(thumbnailList.querySelectorAll('.thumbnail-item:not(#add-image)'));
    thumbnails.sort((a, b) => {
      return a.querySelector('img').src.localeCompare(b.querySelector('img').src);
    });
    thumbnails.forEach(thumbnail => thumbnailList.appendChild(thumbnail));
    thumbnailList.insertBefore(document.getElementById('add-image'), thumbnailList.firstChild);
  }
});