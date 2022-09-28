const {
    Board,
    LCD
} = require("johnny-five");
const board = new Board();
const moment = require("moment");
moment.locale("tr");
var weather = require('weather-js');
const fetch = require('node-fetch');

let lcd;
let dolar;
let euro;
let ethereum;
let bitcoin;
let uye;
let onlineuye;
board.on("ready", function() {
    lcd = new LCD({
        pins: [7, 8, 9, 10, 11, 12],
        backlight: 6,
        rows: 2,
        cols: 20
    });
    lcd.cursor(0, 0).print("Furtsy Saat");
    this.repl.inject({
        lcd: lcd
    });

    async function kur() {
        try {
            var usd = await fetch('https://api.codare.fun/kripto/usd/try')
                .then(response => response.json());
            var eur = await fetch('https://api.codare.fun/kripto/eur/try')
                .then(response => response.json());
            lcd.useChar("pointerup");
            lcd.useChar("pointerdown");
            if (dolar < usd.fiyat ? lcd.clear().cursor(0, 0).print(":pointerup: Dolar: " + usd.fiyat) : lcd.clear().cursor(0, 0).print(":pointerdown: Dolar: " + usd.fiyat))
                if (euro < eur.fiyat ? lcd.cursor(1, 0).print(":pointerup: Euro: " + eur.fiyat) : lcd.cursor(1, 0).print(":pointerdown: Euro: " + eur.fiyat))
                    dolar = usd.fiyat
            euro = eur.fiyat
            setTimeout(() => {
                kripto()
            }, 5000)
        } catch (error) {
            console.log(error)
            setTimeout(() => {
                kripto()
            }, 5000)
        }
    }

    async function kripto() {
        try {
            var btc = await fetch('https://api.codare.fun/kripto/btc/usdt')
                .then(response => response.json());
            var eth = await fetch('https://api.codare.fun/kripto/eth/usdt')
                .then(response => response.json());
            lcd.useChar("pointerup");
            lcd.useChar("pointerdown");
            if (bitcoin < btc.fiyat ? lcd.clear().cursor(0, 0).print(":pointerup: Bitcoin: " + btc.fiyat) : lcd.clear().cursor(0, 0).print(":pointerdown: Bitcoin: " + btc.fiyat))
                if (ethereum < eth.fiyat ? lcd.cursor(1, 0).print(":pointerup: Ethereum: " + eth.fiyat) : lcd.cursor(1, 0).print(":pointerdown: Ethereum: " + eth.fiyat))
                    bitcoin = btc.fiyat
            ethereum = eth.fiyat
            setTimeout(() => {
                dc()
            }, 5000)
        } catch (error) {
            console.log(error)
            setTimeout(() => {
                dc()
            }, 5000)
        }
    }


    async function dc() {
        var cudare = await fetch('https://discord.com/api/v10/invites/codare?with_counts=true&with_expiration=true')
            .then(response => response.json());
        try {
            if (uye < cudare.approximate_member_count ? lcd.clear().cursor(0, 0).print(":pointerup: total: " + cudare.approximate_member_count) : lcd.clear().cursor(0, 0).print(":pointerdown: total: " + cudare.approximate_member_count))
                if (onlineuye < cudare.approximate_presence_count ? lcd.cursor(1, 0).print(":pointerup: total: " + cudare.approximate_presence_count) : lcd.cursor(1, 0).print(":pointerdown: online: " + cudare.approximate_presence_count))
                    uye = cudare.approximate_member_count
            onlineuye = cudare.approximate_presence_count
            setTimeout(() => {
                saat()
            }, 5000)
        } catch (error) {
            console.log(error)
            setTimeout(() => {
                saat()
            }, 5000)
        }
    }

    async function saat() {
        lcd.useChar("ascprogress2")
        lcd.useChar("clock")
        lcd.clear().cursor(0, 0).print(`${moment(Date.now()).format('Do')} :ascprogress2: ${moment(Date.now()).format('dddd').replaceAll('Ç', 'C').replaceAll('ş', 's')}`)
        lcd.cursor(1, 0).print(":clock: " + moment(Date.now()).format('HH:mm:ss'))
        setTimeout(() => {
            havadurum()
        }, 5000)
    }

    async function havadurum() {
        weather.find({
            search: 'Türkiye, Ankara',
            degreeType: 'C'
        }, function(err, result) {
            if (err) console.log(err);
            var current = result[0].current;
            var tahminler = result[0].forecast;
            lcd.useChar("ascprogress2")
            lcd.clear().cursor(0, 0).print(`${current.temperature} C :ascprogress2: ${current.skytext
               .replace(`Sunny`, `Gunesli`)
               .replace(`Partly`, `Kismen`)
               .replace(`Mostly`, `Cogunlukla`)
               .replace(`Rain`, `Yagmurlu`)
               .replace(`Light`, `Hafif`)
               .replace(`Cloudy`, `Bulutlu`)
               .replace(`Clear`, `Acik`)}`)
            lcd.cursor(1, 0).print(`${tahminler[0].low}/${tahminler[0].high} :ascprogress2: Nem ${current.humidity}%`)

            setTimeout(() => {
                kur()
            }, 5000)

        })

    }


    kur()

})
