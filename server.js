const express = require('express');
const app = express();
const port = 3000;

// Middleware untuk JSON parsing
app.use(express.json());

// Variable untuk menyimpan data terkini
let currentData = null;

// Fungsi untuk menghasilkan angka random dalam range tertentu
function getRandomNumber(min, max, decimals = 0) {
    const num = Math.random() * (max - min) + min;
    return Number(num.toFixed(decimals));
}

// Fungsi untuk menghasilkan timestamp saat ini
function getCurrentTimestamp() {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

// Fungsi untuk menghasilkan month_year dari timestamp saat ini
function getCurrentMonthYear() {
    const date = new Date();
    return `${date.getMonth() + 1}-${date.getFullYear()}`;
}

// Fungsi untuk menghasilkan data dinamis
function generateDynamicData() {
    // Generate suhu maksimum antara 30-38°C
    const suhumax = getRandomNumber(30, 38);
    // Generate suhu minimum antara 20-25°C
    const suhumin = getRandomNumber(20, 25);
    // Generate suhu rata-rata antara suhu min dan max
    const suhurata = Number(((suhumax + suhumin) / 2).toFixed(2));

    const currentTime = getCurrentTimestamp();
    const currentMonthYear = getCurrentMonthYear();

    return {
        "suhumax": suhumax,
        "suhumin": suhumin,
        "suhurata": suhurata,
        "nilai_suhu_max_humid_max": [
            {
                "0": {
                    "idx": getRandomNumber(100, 200),
                    "suhun": getRandomNumber(30, suhumax),
                    "humid": getRandomNumber(60, 90),
                    "kecerahan": getRandomNumber(20, 30),
                    "timestamp": currentTime
                }
            },
            {
                "1": {
                    "idx": getRandomNumber(201, 300),
                    "suhun": getRandomNumber(30, suhumax),
                    "humid": getRandomNumber(60, 90),
                    "kecerahan": getRandomNumber(20, 30),
                    "timestamp": currentTime
                }
            }
        ],
        "month_year_max": [
            {
                "0": {
                    "month_year": currentMonthYear
                }
            },
            {
                "1": {
                    "month_year": currentMonthYear
                }
            }
        ]
    };
}

// Fungsi untuk memperbarui data
function updateData() {
    currentData = generateDynamicData();
    console.log('Data diperbarui pada:', getCurrentTimestamp());
}

// Inisialisasi data pertama kali
updateData();

// Set interval untuk memperbarui data setiap 3 detik
setInterval(updateData, 3000);

// Root endpoint
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Data Sensor Suhu dan Kelembaban</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                #data-container { margin: 20px; padding: 20px; border: 1px solid #ccc; }
                pre { background: #f4f4f4; padding: 10px; }
            </style>
            <script>
                function updateDataDisplay() {
                    fetch('/api/data')
                        .then(response => response.json())
                        .then(data => {
                            document.getElementById('data-container').innerHTML = 
                                '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
                        });
                }
                
                // Update setiap 3 detik
                setInterval(updateDataDisplay, 3000);
                // Update pertama kali
                updateDataDisplay();
            </script>
        </head>
        <body>
            <h1>Data Sensor Suhu dan Kelembaban</h1>
            <p>Data diperbarui setiap 5 detik secara otomatis</p>
            <div id="data-container">
                Loading...
            </div>
        </body>
        </html>
    `);
});

// API endpoint /api/data dengan data terkini
app.get('/api/data', (req, res) => {
    res.json(currentData);
});

// Error handling
app.use((req, res) => {
    res.status(404).send('Endpoint tidak ditemukan');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Terjadi kesalahan!');
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
    console.log(`Akses data di http://localhost:${port}/api/data`);
});