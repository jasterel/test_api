var email = 'uvet@gov.spb.ru';
var query = email.replace(/@/g, '%40');
var token = '9c00cf16aa7a619196174004b09a6cc1868f9197';
var secret = '3253c433d992f6887859183de7ca142a6bbd6207';
var url = 'http://suggestions.dadata.ru/suggestions/api/4_1/rs/findByEmail/company?query=' + query + 
    '&token=' + token + '&secret=' + secret;

async function fetchDataINN() {
    try {
        const response = await axios.get(url);
        const data = response.data;
        // Сохранение данных в MongoDB
        console.log(data)

    } catch (err) {
        console.error('Error fetching data or saving to MongoDB:', err);
    }
}

fetchDataINN();