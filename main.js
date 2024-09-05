import { MongoClient } from 'mongodb';
import axios from 'axios';

// Настройки API
var email = "info@krt.gov.spb.ru";
var query = email.replace(/@/g, '%40');
var apiKey = "4bc2b3f48ce9b9a2178bc1f8c313ce35242d4b13";
const url = 'https://api-fns.ru/api/search?q=' + query + '&key=' + apiKey;

// Настройки подключения к MongoDB
const mongoUrl = 'mongodb+srv://jasterelafis777:cbhttjlFI6fh3fjR@cluster0.0w7rw.mongodb.net/';
const dbName = 'databaseTest';
const collectionName = 'fns';

async function saveDataToMongo(data) {
    const client = new MongoClient(mongoUrl);

    try {
        // Подключение к MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Проверка, что data - массив, если нет, обернуть его в массив
        var docs = Array.isArray(data) ? data : [data];

        const customId = data.items[0]['ЮЛ']['ИНН']

        // Создаем документ с собственным _id
        docs = [{
            _id: customId, // задаем собственный идентификатор
            ...data       // копируем все остальные данные из оригинального объекта
        }];

        // Вставка данных в коллекцию
        const result = await collection.insertMany(docs);
        console.log(`${result.insertedCount} documents were inserted with _id: ${inn}`);
        // CHECK - MAY BE ERROR IN 39 AND 43

    } catch (err) {
        if (err.code === 11000) {
            console.error('Duplicate key error: Document with this _id already exists');
        } else {
            console.error('Error connecting to MongoDB or inserting data:', err);
        }
    } finally {
        // Закрытие подключения
        await client.close();
    }
}

async function fetchDataAndSave() {
    try {
        const inn_response = await axios.get(url);
        const inn = inn_response.data.items[0]['ЮЛ']['ИНН']
        
        if (!inn) {
            throw new Error('ИНН не найден в ответе первого API');
        }

        const apiUrl = 'https://api-fns.ru/api/multinfo?req=' + inn + '&key=' + apiKey;

        const response = await axios.get(apiUrl);
        const data = response.data;
        // Сохранение данных в MongoDB

        // if (response.data.items[0]['ЮЛ']['Статус'] == "Действующее") {
        //     await saveDataToMongo(data);
        // }
        await saveDataToMongo(data);

    } catch (err) {
        console.error('Error fetching data or saving to MongoDB:', err);
    }
}

fetchDataAndSave()