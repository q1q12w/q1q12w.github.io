const OPENAI_API_KEY = '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'; // Замените на свой API-ключ OpenAI

// Функция toggleTheme теперь определена в глобальной области видимости
function toggleTheme() {
    var body = document.body;
    body.classList.toggle("dark-theme");
    var theme = body.classList.contains("dark-theme") ? "dark" : "light";
    localStorage.setItem("theme", theme); // Сохраняем выбранную тему в localStorage
}

// При загрузке страницы проверяем сохраненную тему и применяем ее
document.addEventListener("DOMContentLoaded", function() {
    var savedTheme = localStorage.getItem("theme") || "light";
    if(savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
    }
});

// Функция sendMessage остается в глобальной области видимости
function sendMessage() {
    var userInput = document.getElementById('user-input').value;
    var chatMessages = document.getElementById('chat-messages');

    // Выводим сообщение пользователя
    chatMessages.innerHTML += '<div><strong>Вы:</strong> ' + userInput + '</div>';

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