const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function countSymbol(text) { // 1. Подсчет символов в тексте ( 1. Character count in the text )
    return text.trim().length;
}

function countWord(words) { // 2. Подсчет слов в массиве ( 2. Character count in the words )
    return words.length;
}

function countNum(num) { // 3. Подсчет чисел в массиве ( 3. Counting numbers in an array )
    return num.length;
}

function sumNumber(num) { // 4. Сумма чисел в массиве ( 4. The sum of the numbers in the array )
    return num.reduce((sum, num) => sum + num, 0);
}

function sortWordsLength(text) { // 5. Сортировка слов по величине строки от меньшего к большему ( 5. Sorting words by line size from smaller to larger )
    return text.sort((a, b) => a.length - b.length);
}

function sortWordsReduction(text) { // 6. Сортировка слов по величине строки от большего к меньшему ( 6. Sorting words by line size from larger to smaller )
    return text.sort((a, b) => b.length - a.length);
}

function sortNumberIncrease(numbers) { // 7. Сортировка чисел от меньшего к большему ( 7. Sorting numbers from lesser to greater )
    return numbers.sort((a, b) => a - b);
}

function sortNumberReduction(numbers) { // 8. Сортировка чисел от большего к меньшему ( 8. Sorting numbers from higher to lower )
    return numbers.sort((a, b) => b - a);
}

function uniqueNums(numbers) { // 9. Показать только уникальные числа ( 9. Show only unique numbers )
    return [...new Set(numbers)];
}

function uniqueWords(words) { // 10. Показать только уникальные слова ( 10. Show only unique words )
    return [...new Set(words)];
}

function uniqueText(text) { // 11. Показать только уникальные слова и числа ( 11. Show only unique words and numbers )
    return [...new Set(text)];
}

function showText(text) { // 12. Показать текст ( 12. Show text )
    return text
}


function questionUser() {
    rl.question('Enter any text with words and numbers separated by a space ("exit" to leave) > ', (input) => {
        if (input.toLocaleLowerCase() === 'exit') {
            console.log('The program is finished');
            rl.close();
            return;
        }

        const arrayUsers = input.split(' ');
        const userArrayWord = arrayUsers.filter(i => isNaN(i));
        const userArrayNumbers = arrayUsers.filter(i => !isNaN(i)).map(Number);


        rl.question('\n1. Character count in the text.\n' +
            '2. Character count in the words.\n' +
            '3. Counting numbers in an array.\n' +
            '4. The sum of the numbers in the array.\n' +
            '5. Sorting words by line size from smaller to larger.\n' +
            '6. Sorting words by line size from larger to smaller.\n' +
            '7. Sorting numbers from lesser to greater.\n' +
            '8. Sorting numbers from higher to lower.\n' +
            '9. Show only unique numbers.\n' +
            '10. Show only unique words.\n' +
            '11. Show only unique words and numbers.\n' +
            '12. Show text.\n\n' +
            'Select an operation (1 - 12) and press ENTER > ', (operation) => {

            let result;

            switch (operation) {
                case '1':
                    result = countSymbol(input);
                    break;
                case '2':
                    result = countWord(userArrayWord);
                    break;
                case '3':
                    result = countNum(userArrayNumbers);
                    break;
                case '4':
                    result = sumNumber(userArrayNumbers);
                    break;
                case '5':
                    result = sortWordsLength(userArrayWord);
                    break;
                case '6':
                    result = sortWordsReduction(userArrayWord);
                    break;
                case '7':
                    result = sortNumberIncrease(userArrayNumbers);
                    break;
                case '8':
                    result = sortNumberReduction(userArrayNumbers);
                    break;
                case '9':
                    result = uniqueNums(userArrayNumbers);
                    break;
                case '10':
                    result = uniqueWords(userArrayWord)
                    break;
                case '11':
                    result = uniqueText(input)
                    break;
                case '12':
                    result = showText(input)
                    break;
                default:
                    result = 'Incorrect operation'


            }
            console.log(`\nresult > ${result}\n`)
            questionUser()
        });

    });
}

questionUser()
