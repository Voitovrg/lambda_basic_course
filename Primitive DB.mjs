import inquirer from "inquirer";
import * as fs from "fs";

let profileUsers = [];

function createProfile() {

    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the user`s name, for cancel press Enter >'
        }
    ])
        .then((answersName) => {
            if (answersName.name !== '') {
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'gender',
                        message: 'Choose your gender?',
                        choices: ['male', 'female']
                    }
                ])
                    .then((answersGender) => {
                        inquirer.prompt([
                            {
                                type: 'input',
                                name: 'age',
                                message: 'Enter your age >'
                            }
                        ])
                            .then((answersAge) => {
                                inquirer.prompt([
                                    {
                                        type: 'input',
                                        name: 'city',
                                        message: 'Enter your city >'
                                    }
                                ])
                                    .then((answersCity) => {
                                        inquirer.prompt([
                                            {
                                                type: 'password',
                                                name: 'password',
                                                message: 'Create your password >',
                                                mask: '*'
                                            }
                                        ])
                                            .then((answersPassword) => {
                                                const profile = {
                                                    name: answersName.name[0].toUpperCase() + answersName.name.slice(1),
                                                    gender: answersGender.gender,
                                                    age: answersAge.age,
                                                    city: answersCity.city,
                                                    password: answersPassword.password
                                                }

                                                const us = [];

                                                for (let profileKey in profile) {
                                                    if (profile[profileKey]) {
                                                        us.push({[profileKey]: profile[profileKey]});
                                                    }
                                                }
                                                let usersDB = us.reduce((obj, item) => {
                                                    const key = Object.keys(item)[0];
                                                    obj[key] = item[key];
                                                    return obj
                                                }, {})

                                                try {
                                                    const existingData = fs.readFileSync('DBUsers.json', 'utf8');
                                                    profileUsers = JSON.parse(existingData)
                                                } catch (error) {
                                                }

                                                profileUsers.push(usersDB)

                                                // Преобразование профиля пользователя в строку JSON
                                                let jsonProfiles = JSON.stringify(profileUsers)

                                                // Сохранение профиля пользователя в базу данных (файл)
                                                fs.writeFileSync('DBUsers.json', jsonProfiles)

                                                createProfile()
                                            })
                                    })
                            })
                    })
            } else {
                // Пользователь нажал Enter, программа завершаетсяRoman
                inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'confirmation',
                        message: 'Would you to search values in DB?'
                    }
                ])
                    .then((answersFind) => {

                        try {
                            const existingData = fs.readFileSync('DBUsers.json', 'utf8');
                            profileUsers = JSON.parse(existingData)
                        } catch (error) {
                        }


                        profileUsers.forEach(user => {
                            console.log(user)
                        })

                        if (answersFind.confirmation) {
                            inquirer.prompt([
                                {
                                    type: 'input',
                                    name: 'name',
                                    message:
                                        'Enter user`s name you wanna find in DB >',
                                }
                            ])
                                .then((answer) => {
                                    const findUser = profileUsers.find((user) => user.name.toLowerCase() === answer.name.toLowerCase())

                                    if (findUser) {
                                        console.log(`Users ${findUser.name} has found`)
                                        console.log(JSON.stringify(findUser))
                                    }
                                    if (!findUser) {
                                        const keyToFind = answer.name.toLowerCase();

                                        const usersWithKey = profileUsers.filter((user) => user.name.toLowerCase().includes(keyToFind));

                                        if (usersWithKey.length > 0 && keyToFind.length > 0) {
                                            console.log(`No users named "${keyToFind}" were found, but maybe you were looking for one of them?:`);
                                            usersWithKey.forEach((user) => {
                                                console.log(JSON.stringify(user));
                                            });
                                        } else {
                                            console.log(`You must enter some value to search, you have entered an empty value, unfortunately you cannot search with an empty value`);
                                        }
                                    }
                                })
                        }
                    })
            }
        })

}

createProfile()
