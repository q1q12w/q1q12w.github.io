const OPENAI_API_KEY = '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'; // Замените на свой API-ключ OpenAI


document.addEventListener("DOMContentLoaded", function() {
    var loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            var username = document.getElementById('username').value;
            if (username) {
                localStorage.setItem("username", username);
                window.location.href = 'chat.html'; // Перенаправление на основную страницу после входа
            } else {
                alert('Введите логин!');
            }
        });
    }
});
// Функция toggleTheme теперь определена в глобальной области видимости

function toggleTheme() {
    var body = document.body;
    body.classList.toggle("dark-theme");
    var theme = body.classList.contains("dark-theme") ? "dark" : "light";
    localStorage.setItem("theme", theme);

    // Добавляем класс анимации при смене темы
    body.classList.add("theme-transition");

    // Убираем класс анимации после завершения перехода
    setTimeout(function() {
        body.classList.remove("theme-transition");
    }, 500);
}


// При загрузке страницы проверяем сохраненную тему и применяем ее
document.addEventListener("DOMContentLoaded", function() {
    var savedTheme = localStorage.getItem("theme") || "light";
    if(savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
    }

     var username = localStorage.getItem("username") || "Гость";

    // Выводим приветствие и логин пользователя
    var greetingContainer = document.getElementById('greeting-container');
    greetingContainer.innerHTML = '<p>Здравствуй, ' + username + '!</p>';
});

// Функция sendMessage остается в глобальной области видимости
function sendMessage() {
    var userInput = document.getElementById('user-input').value;
    var chatMessages = document.getElementById('chat-messages');
    var username = localStorage.getItem("username") || "Гость";

    // Выводим сообщение пользователя
    chatMessages.innerHTML += '<div><strong>' + username + ':</strong> ' + userInput + '</div>';

    // Отправляем запрос к API OpenAI
    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + OPENAI_API_KEY,
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{role: 'user', content: userInput}],
            max_tokens: 4000,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при запросе к OpenAI. Статус: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        var botResponse = data.choices[0].message.content.trim();
        chatMessages.innerHTML += '<div><strong>VoronSoft:</strong> ' + botResponse + '</div>';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    })
    .catch(error => {
        console.error('Ошибка:', error.message);
        chatMessages.innerHTML += '<div><strong>Ошибка:</strong> Не удалось получить ответ от OpenAI. ' + error.message + '</div>';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

document.getElementById('user-input').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
// Функция для обработки эффекта скролла
function handleScroll() {
    var scrollPosition = window.scrollY;

    // Изменение прозрачности фона при прокрутке
    var transparency = Math.min(scrollPosition / 500, 1); // Вы можете настроить значение 500 под свои потребности

    document.body.style.backgroundColor = `rgba(249, 249, 249, ${1 - transparency})`;
}

// Добавление слушателя событий для скролла
window.addEventListener('scroll', handleScroll);

