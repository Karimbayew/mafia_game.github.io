// Проверяем наличие кнопки "start" перед добавлением события
const startButton = document.querySelector('.start');

// Получаем все элементы для изменения значений
const decrementButtons = document.querySelectorAll('.number-left');
const incrementButtons = document.querySelectorAll('.number-right');
const numberInputs = document.querySelectorAll('.number-quantity');

// Устанавливаем значение 0 в инпуты при загрузке страницы
numberInputs.forEach(input => {
    input.value = 0;
});

// Функция для обновления значения с ограничениями
function updateValue(input, operation) {
    let currentValue = parseInt(input.value) || 0;
    if (operation === 'increment') {
        // Ограничиваем значение для Дона, Комиссара и Доктора до 1
        if (input.name === 'don' || input.name === 'commissioner' || input.name === 'doctor') {
            if (currentValue < 1) {
                input.value = currentValue + 1;
            }
        } else {
            input.value = currentValue + 1; // Увеличиваем для остальных ролей
        }
    } else if (operation === 'decrement') {
        if (currentValue > 0) {
            input.value = currentValue - 1; // Уменьшаем значение на 1
        }
    }
}

// Добавляем обработчик для кнопок уменьшения
decrementButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        updateValue(numberInputs[index], 'decrement');
    });
});

// Добавляем обработчик для кнопок увеличения
incrementButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        updateValue(numberInputs[index], 'increment');
    });
});

if (startButton) {
    startButton.addEventListener('click', () => {
        // Собираем данные о количестве ролей
        const roles = {
            don: parseInt(document.querySelector('input[name="don"]').value) || 0,
            mafia: parseInt(document.querySelector('input[name="mafia"]').value) || 0,
            commissioner: parseInt(document.querySelector('input[name="commissioner"]').value) || 0,  // Комиссар
            doctor: parseInt(document.querySelector('input[name="doctor"]').value) || 0,
            civilian: parseInt(document.querySelector('input[name="civilian"]').value) || 0  // Мирный житель
        };

        // Логируем выбранные роли для проверки
        // console.log(roles);

        // Передаем данные в локальное хранилище
        localStorage.setItem('gameRoles', JSON.stringify(roles));

        // Переход на страницу с картами
        window.location.href = 'roles.html';  // Переход на страницу roles.html
    });
}


// Код для страницы roles.html
document.addEventListener('DOMContentLoaded', () => {

    let cardInner = document.querySelector('.card-inner');
    let cardFront = document.querySelector('.card-front');

    // Получаем сохраненные данные о ролях
    const roles = JSON.parse(localStorage.getItem('gameRoles'));
    console.log(roles);
    let totalPlayers = 0;
    // Проверяем, что данные существуют
    if (roles) {
        // Суммируем все роли, чтобы узнать количество игроков
        totalPlayers = roles.don + roles.mafia + roles.commissioner + roles.doctor + roles.civilian;
    
        console.log('Количество игроков: ', totalPlayers);
    }

    // Массивы с изображениями для каждой роли
    const mafiaImages = [
        'url(img/mafia/mafia_0.jpg)',
        'url(img/mafia/mafia_1.jpg)',
        'url(img/mafia/mafia_2.jpg)',
        'url(img/mafia/mafia_3.jpg)',
        'url(img/mafia/mafia_4.jpg)',
        'url(img/mafia/mafia_5.jpg)'
    ];

    const civilianImages = [
        'url(img/mir/mir_0.jpg)',
        'url(img/mir/mir_1.jpg)',
        'url(img/mir/mir_2.jpg)',
        'url(img/mir/mir_3.jpg)',
        'url(img/mir/mir_4.jpg)',
        'url(img/mir/mir_5.jpg)',
        'url(img/mir/mir_6.jpg)',
        'url(img/mir/mir_7.jpg)',
        'url(img/mir/mir_8.jpg)',
        'url(img/mir/mir_9.jpg)'
    ];

    // Изображения для комиссара и доктора
    const specialCivilianImages = [
        'url(img/mir/doctor.jpg)',  // для доктора
        'url(img/mir/komissar.jpg)' // для комиссара
    ];

    // Функция для генерации случайного индекса
    function getRandomIndex(arrayLength) {
        return Math.floor(Math.random() * arrayLength);
    }

    // Функция для назначения изображений каждому игроку
    function assignImagesToRoles() {
        let assignedImages = [];

        // Добавляем изображения для мафии
        for (let i = 0; i < roles.mafia; i++) {
            const randomIndex = getRandomIndex(mafiaImages.length);
            assignedImages.push(mafiaImages[randomIndex]);
            mafiaImages.splice(randomIndex, 1); // Убираем использованное изображение
        }

        // Добавляем изображения для дона (уникальность проверяется при добавлении)
        for (let i = 0; i < roles.don; i++) {
            if (!assignedImages.includes('url(img/mafia/don.jpg)')) {
                assignedImages.push('url(img/mafia/don.jpg)'); // В данном случае всегда одно и то же изображение для дона
            }
        }

        // Добавляем изображения для комиссара и доктора (если есть)
        for (let i = 0; i < roles.commissioner; i++) {
            assignedImages.push(specialCivilianImages[1]); // Комиссар
        }

        for (let i = 0; i < roles.doctor; i++) {
            assignedImages.push(specialCivilianImages[0]); // Доктор
        }

        // Добавляем изображения для мирных жителей
        for (let i = 0; i < roles.civilian; i++) {
            const randomIndex = getRandomIndex(civilianImages.length);
            assignedImages.push(civilianImages[randomIndex]);
            civilianImages.splice(randomIndex, 1); // Убираем использованное изображение
        }

        return assignedImages;
    }

    // Присваиваем изображения игрокам
    let imagesForPlayers = assignImagesToRoles();
    
    console.log('Изображения для игроков: ', imagesForPlayers);

    // Функция переворота карты
    function flipCard() {
        cardInner.style.transform = (cardInner.style.transform === 'rotateY(180deg)') ? 'rotateY(0deg)' : 'rotateY(180deg)';
    
        if (cardInner.style.transform === 'rotateY(180deg)' && imagesForPlayers.length > 0) {
            // Генерируем случайный индекс и устанавливаем изображение
            const randomIndex = getRandomIndex(imagesForPlayers.length);
            const selectedImage = imagesForPlayers[randomIndex];
    
            cardFront.style.backgroundImage = selectedImage;
    
            // Удаляем использованное изображение из массива
            imagesForPlayers.splice(randomIndex, 1);
        } else if (imagesForPlayers.length === 0) {
            // Показать модальное окно, если изображения закончились
            showModal();
        }
    }

    function showModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('hidden');

    const restartButton = document.getElementById('restartGame');
    restartButton.addEventListener('click', () => {
        // Сбрасываем данные игры
        localStorage.removeItem('gameRoles');
        window.location.href = 'index.html'; // Переход на стартовую страницу
        });
    }   

    // Добавляем обработчик события на карту
    cardInner.addEventListener('click', flipCard);
});
