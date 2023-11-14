const words =
{
    0: {
        eng: "An apple",
        ukr: "Яблуко",
        answer: "",
    },
    1: {
        eng: "A pen",
        ukr: "Ручка",
        answer: "",
    },
    2: {
        eng: "Always",
        ukr: "Завжди",
        answer: "",
    },
    3: {
        eng: "Never",
        ukr: "Ніколи",
        answer: "",
    },
    4: {
        eng: "Sometimes",
        ukr: "Іноді",
        answer: "",
    },
    5: {
        eng: "Fish",
        ukr: "Риба",
        answer: "",
    },
    6: {
        eng: "Summer",
        ukr: "Літо",
        answer: "",
    },
    7: {
        eng: "Winter",
        ukr: "Зима",
        answer: "",
    },
    8: {
        eng: "A book",
        ukr: "Книга",
        answer: "",
    },
    9: {
        eng: "A mouse",
        ukr: "Миша",
        answer: "",
    },
    10: {
        eng: "A planet",
        ukr: "Планета",
        answer: "",
    },
    11: {
        eng: "A plate",
        ukr: "Тарілка",
        answer: "",
    },
    12: {
        eng: "A guitar",
        ukr: "Гітара",
        answer: "",
    },
    13: {
        eng: "A game",
        ukr: "Гра",
        answer: "",
    },
    14: {
        eng: "Knowledge",
        ukr: "знання",
        answer: "",
    },
    length: 15,
}

document.addEventListener("DOMContentLoaded", () => {
    let cardsCount; //Кількість карток на поточному рівні складності
    let isResultShown; //Прапорець чи був відображений результат
    let isInputEnabled; //Прапорець дозволу вводу
    let currentStep; //Поточний номер картки
    let withoutAnswers; //Кількість карток без відповіді
    let correctAnswers; //Кількість вірних відповідей
    let incorrectAnswers; //Кількість не вірних відповідей
    let words_list; //Массив з поточними картками

    function init(cardsCount) {
        //Очистка відповідей, якщо вони залишились після попередньої спроби
        for (let i = 0; i < words.length; i++) words[i].answer = '';

        isResultShown = false;
        isInputEnabled = true;
        currentStep = 0;
        withoutAnswers = cardsCount;
        correctAnswers = 0;
        incorrectAnswers = 0;
        words_list = [];

        //Заповнення масиву можливими картками
        for (let i = 0; i < words.length; i++) {
            words_list.push(words[i]);
        }

        //Рандомне змішування карток
        for (let i = 0; i < words.length; i++) {
            let random_index = Math.floor(Math.random() * cardsCount);
            let tmp = words_list[i];
            words_list[i] = words_list[random_index];
            words_list[random_index] = tmp;
        }

        //Підрізка масиву під поточний рівень складності
        words_list = words_list.slice(0, cardsCount);


        //Ініціалізація інтерфейсу початковими значеннями
        $("#word").html(words_list[currentStep].eng);
        updatePosition();
        updateStatistics();
        enableInput();
        $("#input-answer").focus();
    }

    //Початок виконання
    $("input[type='radio']").checkboxradio({ icon: false });
    cardsCount = Math.floor(words.length * 0.5)
    init(cardsCount);

    /* Функції та події */
    $("input[name='radio-difficulty']").change(function () {
        switch ($(this).val()) {
            case 'Beginner':
                cardsCount = Math.floor(words.length * 0.33)
                init(cardsCount);
                break;
            case 'Middle':
                cardsCount = Math.floor(words.length * 0.5)
                init(cardsCount);
                break;
            case 'Advanced':
                cardsCount = words.length;
                init(cardsCount);
                break;
            default:
                alert("Помилка вибору рівня складності!");
                break;
        }
    });

    //Оновити інформацію про номер поточної картки та відповідь в полі вводу
    function updatePosition() {
        $("#current-pos").html((currentStep + 1) + "/" + cardsCount);
        $("#input-answer").val(words_list[currentStep].answer);
    }

    //Порахувати відповіді та відобразити їх кількість
    function updateStatistics() {
        withoutAnswers = 0;
        correctAnswers = 0;
        incorrectAnswers = 0;

        words_list.forEach((card) => {
            if (card.answer == null || card.answer.trim() == "") {
                withoutAnswers++;
                return;
            }

            if (card.ukr.toLowerCase() == card.answer.trim().toLowerCase()) {
                correctAnswers++;
            }
            else {
                incorrectAnswers++;
            }
        });

        $("#correct-statistics-value").html(correctAnswers);
        $("#incorrect-statistics-value").html(incorrectAnswers);
        $("#without-answers-statistics-value").html(withoutAnswers);

        //Вивід результату, якщо отримано відповіді на всі картки
        if (withoutAnswers == 0 && !isResultShown) {
            showResult()
            isResultShown = true;
        }
    }

    //Відобразити діалогове вікно з результатом
    function showResult() {
        let msg = "Ваш результат " + correctAnswers + " вірних з " + cardsCount + ". Щоб повторити спробу - оновіть сторінку.";

        if (correctAnswers / cardsCount == 1) {
            msg = "Ви великий молодець! " + msg;
        } else if (correctAnswers / cardsCount >= 0.8) {
            msg = "Ви молодець! Ще трішечки і буде ідеально! " + msg;
        } else if (correctAnswers / cardsCount > 0.5) {
            msg = "Більше половини! Вам ще є над чим попрацювати! " + msg;
        } else {
            msg = "Ой! А Ви точно знаєте англійську? " + msg;
        }

        $("#dialog p").html(msg);
        $("#dialog").dialog();
    }

    //Заблокувати ввід
    function disableInput() {
        isInputEnabled = false;
        $("#input-answer").attr("disabled", true);
        $("#move-left, #move-right").css("background-color", "gray");
    };

    //Розблокувати ввід
    function enableInput() {
        isInputEnabled = true;
        $("#input-answer").attr("disabled", false);
        $("#move-left, #move-right").css("background-color", "white");

        if (currentStep == 0) $("#move-left").css("background-color", "gray");
        if (currentStep == (cardsCount - 1)) $("#move-right").css("background-color", "gray");
        $("#input-answer").focus();
    };

    //Зберегти відповідь
    function saveAnswer() {
        words_list[currentStep].answer = $("#input-answer").val();
    }

    //Очистити поле вводу
    function clearAnswer() {
        $("#input-answer").val('');
    }

    //Подія натиснута клавіша Enter в полі вводу
    $('#input-answer').keypress(function (e) {
        var key = e.which;
        if (key == 13)  // Enter
        {
            if (currentStep == cardsCount - 1 && withoutAnswers > 1)
                $("#move-left").click();
            else {

            }
            $("#move-right").click();
        }
    });

    //Подія клік кнопки вліво
    $("#move-left").click(function () {
        if (isInputEnabled && currentStep > 0) {
            disableInput();

            //Зберігати та рахувати статистику тільки якщо відповідб нова
            if (words_list[currentStep].answer == '') {
                saveAnswer();
                updateStatistics();
            }

            clearAnswer();
            currentStep--;
            updatePosition();

            $("#card").hide("slide", { direction: "right" }, 250).promise().done(function () {
                $("#word").html(words_list[currentStep].eng);
                $("#card").show("slide", 250).promise().done(enableInput);
            });
        }
    });

    //Подія клік кнопки вправо
    $("#move-right").click(function () {
        if (currentStep == cardsCount - 1 && withoutAnswers == 1) {
            if (words_list[currentStep].answer == '') {
                saveAnswer();
                updateStatistics();
            }
        }

        if (isInputEnabled && currentStep < cardsCount - 1) {
            disableInput();

            //Зберігати та рахувати статистику тільки якщо відповідб нова
            if (words_list[currentStep].answer == '') {
                saveAnswer();
                updateStatistics();
            }

            clearAnswer();
            currentStep++;
            updatePosition();

            $("#card").hide("slide", 250).promise().done(function () {
                $("#word").html(words_list[currentStep].eng);
                $("#card").show("slide", { direction: "right" }, 250).promise().done(enableInput);
            });
        }
    });

    //Події наведення курсору на кнопки вліво та вправо
    $("#move-left").hover(function () {
        if (isInputEnabled) {
            $("#move-left").css("background-color", "gray");
        }
    });
    $("#move-left").mouseleave(function () {
        if (isInputEnabled && currentStep != 0) {
            $("#move-left").css("background-color", "white");
        }
    });
    $("#move-right").hover(function () {
        if (isInputEnabled) {
            $("#move-right").css("background-color", "gray");
        }
    });
    $("#move-right").mouseleave(function () {
        if (isInputEnabled && currentStep != (cardsCount - 1)) {
            $("#move-right").css("background-color", "white");
        }
    });
});