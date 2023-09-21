// 7. CLI: Google Uploader [ F | B ]

import inquirer from "inquirer";
import axios from "axios";
import path from "path";
import fs from "fs";
import {google} from "googleapis";

const KEY_PATH = "C:\\Users\\romav\\WebstormProjects\\untitled1\\GoogleUploader\\able-copilot-393911-c68a7c25349b.json";

const axiosInstance = axios.create();
async function googleUploader() {
    try {
        const keyContent = fs.readFileSync(KEY_PATH, "utf8");
        const key = JSON.parse(keyContent);

        const authClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            ["https://www.googleapis.com/auth/drive"]
        );

        const drive = google.drive({version: "v3", auth: authClient});

        inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: 'Drag or type the path to your image in the terminal and hit Enter for upload:',
        }])
            .then(answerPath => {
                if (answerPath.name !== '') {

                    const file = {
                        filePath: answerPath.name,
                        fileName: path.basename(answerPath.name),
                        fileExtension: path.extname(answerPath.name).slice(1),
                    }

                    console.log(`Path to file > ${file.filePath}`);
                    console.log(`File name > ${file.fileName}`);
                    console.log(`File Extension > ${file.fileExtension}`);

                    inquirer.prompt([{
                        type: 'confirm',
                        name: 'confirmation',
                        message: `You\`re uploading the file with the name > ${file.fileName}\nWould you like to change it? >`,
                    }])
                        .then(changeFilename => {
                            if (changeFilename.confirmation) {
                                inquirer.prompt([{
                                    type: 'input',
                                    name: 'newFileName',
                                    message: 'Enter your new file name >',
                                }])
                                    .then(newFileName => {
                                        file.fileName = newFileName
                                        console.log(file.fileName)
                                        console.log(file.filePath)

                                        const media = {
                                            mimeType: `image/${file.fileExtension}`,
                                            body: fs.createReadStream(file.filePath),
                                        };

                                        drive.files.create({
                                            requestBody: {
                                                name: file.fileName['newFileName'],
                                                parents: ["1cIFJo5RAnJuX5DduUbwqLxO1QVgtkddB"], // ID папки на Google Диске
                                            },
                                            media,
                                        })
                                            .then(response => {
                                                console.log("File uploaded successfully");
                                                const fileId = response.data.id;
                                                const updatedFileLink = `https://drive.google.com/file/d/${fileId}/view`;

                                                inquirer.prompt([{
                                                    type: 'confirm',
                                                    name: 'confirmation',
                                                    message: 'Would you like to shorten you link? > '
                                                }])
                                                    .then(async shortLinkPhoto => {
                                                        if (shortLinkPhoto.confirmation) {

                                                            const apiKayTiniUrl = '8dbb93502902e65b0a5ec3fbd5910316a8874'
                                                            const apiUrl = `https://cutt.ly/api/api.php?key=${apiKayTiniUrl}&short=${encodeURIComponent(updatedFileLink)}`;

                                                            axios.post(apiUrl)
                                                                .then((response) => {
                                                                    if (response.data.url.status === 7) {
                                                                        const shortUrl = response.data.url.shortLink;
                                                                        console.log('You short link is >', shortUrl);
                                                                    } else {
                                                                        console.error('Failed to create an abbreviated link. Error code:', response.data.url.status);
                                                                    }
                                                                })
                                                                .catch((error) => {
                                                                    console.error('Link shortening request error:', error.message);
                                                                });
                                                        } else {
                                                            console.log(`Long link photo > ${updatedFileLink}`);
                                                        }
                                                    })
                                            })
                                            .catch(err => {
                                                console.error("Error uploading file to Google Drive:", err.message);
                                            });
                                    })
                            }
                        });
                }
            });
    } catch (err) {
        console.error("Error:", err.message);
    }
}

googleUploader();
