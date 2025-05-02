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

      // Получаем base64-строку изображения с качеством 0.5
      const photoData = canvas.toDataURL('image/jpeg', 0.5);
      console.log("Фото получено");

      // Проверяем доступность API Telegram
      if (tg && tg.sendData) {
        tg.sendData(photoData);
        console.log("Данные отправлены в бота");

        // Останавливаем камеру
        if (video.srcObject) {
          video.srcObject.getTracks().forEach(track => track.stop());
          console.log("Камера остановлена");
        }

        // Закрываем мини-эпп
        tg.close();
      } else {
        alert("Ошибка: Telegram WebApp API недоступен. Убедитесь, что мини-эпп открыт из Telegram.");
        console.error("Telegram WebApp API недоступен");
      }
    } catch (error) {
      alert("Произошла ошибка: " + error.message);
      console.error("Ошибка при обработке фото:", error);
    }
  };
});
