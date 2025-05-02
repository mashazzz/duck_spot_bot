// Получаем элементы DOM
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture');
const tg = window.Telegram.WebApp;

// Инициализируем WebApp API - ВАЖНОЕ ИСПРАВЛЕНИЕ!
tg.ready();

// Включаем камеру
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
  .then(stream => {
    video.srcObject = stream;
    console.log("Камера успешно включена");
  })
  .catch(err => {
    alert("Не удалось включить камеру: " + err);
    console.error("Ошибка камеры:", err);
  });

// Обработчик нажатия кнопки
captureBtn.onclick = function() {
  try {
    console.log("Кнопка нажата");
    
    // Рисуем текущий кадр на canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Получаем base64-строку изображения
    const photoData = canvas.toDataURL('image/jpeg');
    console.log("Фото получено");
    
    // Проверяем доступность API Telegram
    if (tg && tg.sendData) {
      // Отправляем фото в бота
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

// Добавляем обработчик для проверки загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM загружен, мини-эпп готов");
});
