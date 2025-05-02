document.addEventListener('DOMContentLoaded', function() {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const captureBtn = document.getElementById('capture');
  const tg = window.Telegram.WebApp;

  // Инициализация WebApp API
  tg.ready();

  // Запуск камеры
  function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then(stream => {
        video.srcObject = stream;
        console.log("Камера включена");
      })
      .catch(err => {
        alert("Не удалось включить камеру: " + err);
      });
  }

  startCamera();

  // Обработка кнопки "Сделать фото"
  captureBtn.onclick = function() {
    try {
      // Создаем снимок
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Получаем фото и создаем уникальный ID
      const photoData = canvas.toDataURL('image/jpeg', 0.7);
      const photoId = "photo_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
      
      // Отправляем на сервер через AJAX
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "save_photo.php", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // Отправляем только ID фото в бота
            tg.sendData(photoId);
            // Останавливаем камеру и закрываем мини-эпп
            video.srcObject.getTracks().forEach(track => track.stop());
            tg.close();
          } else {
            alert("Ошибка при сохранении фото");
          }
        }
      };
      
      xhr.send(JSON.stringify({
        photoData: photoData,
        photoId: photoId
      }));
    } catch (error) {
      alert("Ошибка: " + error.message);
    }
  };
});
