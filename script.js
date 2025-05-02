document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM загружен, мини-эпп готов");

  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const captureBtn = document.getElementById('capture');
  const tg = window.Telegram.WebApp;

  // Инициализация Telegram WebApp API
  if (tg && tg.ready) {
    tg.ready();
  }

  // Функция для запуска камеры
  function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then(stream => {
        video.srcObject = stream;
        console.log("Камера успешно включена");
      })
      .catch(err => {
        alert("Не удалось включить камеру: " + err);
        console.error("Ошибка камеры:", err);
      });
  }

  // Запускаем камеру при каждом открытии мини-эппа
  startCamera();

  // Обработчик нажатия кнопки
  captureBtn.onclick = function() {
    try {
      console.log("Кнопка нажата");

      // Рисуем текущий кадр на canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

      // Генерируем уникальный ID для фото
      const photoId = "photo_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
      console.log("Сгенерирован ID: " + photoId);

      // Получаем base64-строку изображения
      const photoData = canvas.toDataURL('image/jpeg', 0.7);
      
      // Отправляем фото на сервер
      fetch('/duck_spot_bot/save_photo.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photo_id: photoId,
          photo_data: photoData
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log("Фото загружено на сервер:", data);
        
        // Отправляем только ID фото в бота
        if (tg && tg.sendData) {
          tg.sendData(photoId);
          console.log("ID фото отправлен в бота");
          
          // Останавливаем камеру
          if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
          }
          
          // Закрываем мини-эпп
          tg.close();
        } else {
          alert("Ошибка: Telegram WebApp API недоступен");
        }
      })
      .catch(error => {
        alert("Ошибка загрузки фото на сервер: " + error.message);
        console.error("Ошибка загрузки:", error);
      });
      
    } catch (error) {
      alert("Произошла ошибка: " + error.message);
      console.error("Ошибка при обработке фото:", error);
    }
  };
});
