import weather from '../Assets/weather.png'
import qrcode from '../Assets/qrcode.png'
import logo from '../Assets/logo.png'
import news from '../Assets/news.jpg'
export const worksData = [
  {
    title: 'My CV',
    img: logo,
    website: '',
    github: 'https://github.com/RamFarid/ram-farid-cv',
    isReact: true,
  },

  {
    title: 'Weather App',
    img: weather,
    website:
      'https://welcome0to0rams0server.on.drv.tw/weatherFullUpdateTesting2/',
    github: '',
    delay: '0.6',
    isReact: false,
  },

  {
    title: 'QR code generator',
    img: qrcode,
    website: 'https://welcome0to0rams0server.on.drv.tw/qr-code-generator/',
    github: '',
    delay: '0.6',
    isReact: false,
  },

  {
    title: 'ElAssema news',
    img: news,
    website: '',
    github: 'https://github.com/RamFarid/elaseema-clone/',
    delay: '0.6',
    isReact: true,
  },
]