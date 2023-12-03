const OPENAI_API_KEY = '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'; // Замените на свой API-ключ OpenAI

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
            // Правильный формат заголовка Authorization
            'Authorization': 'Bearer ' + OPENAI_API_KEY,
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo', // Укажите модель, которую вы хотите использовать
            messages: [{role: 'user', content: userInput}], // Сообщения должны быть в формате массива объектов
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
        // Получаем ответ от OpenAI и выводим его
        var botResponse = data.choices[0].message.content.trim();
        chatMessages.innerHTML += '<div><strong>VoronSoft:</strong> ' + botResponse + '</div>';
        // Прокручиваем вниз, чтобы видеть последние сообщения
        chatMessages.scrollTop = chatMessages.scrollHeight;
    })
    .catch(error => {
        console.error('Ошибка:', error.message);
        // Выводим сообщение об ошибке с подробной информацией
        chatMessages.innerHTML += '<div><strong>Ошибка:</strong> Не удалось получить ответ от OpenAI. ' + error.message + '</div>';
        // Прокручиваем вниз, чтобы видеть последние сообщения
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}