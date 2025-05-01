const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture');
const tg = window.Telegram.WebApp;

// Включаем камеру
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert("Не удалось включить камеру: " + err);
  });

captureBtn.onclick = function() {
  // Рисуем текущий кадр на canvas
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

  // Получаем base64-строку изображения
  const photoData = canvas.toDataURL('image/jpeg');

  // Отправляем фото в бота через WebAppData
  tg.sendData(photoData);

  // Останавливаем камеру и закрываем мини-эпп
  video.srcObject.getTracks().forEach(track => track.stop());
  tg.close();
};
