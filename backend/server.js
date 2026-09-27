var QRCode = require('qrcode')

QRCode.toDataURL('Meja 1', function (err, url) {
    console.log(url)
})

var QRCode = require('qrcode')

QRCode.toString('Meja 1',{type:'terminal'}, function (err, url) {
  console.log(url)
})