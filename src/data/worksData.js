import weather from '../Assets/weather.png'
import qrcode from '../Assets/qrcode.png'
import logo from '../Assets/logo.png'
import news from '../Assets/news.jpg'
import mcq from '../Assets/mcq.png'
import netflix from '../Assets/netflix.png'
import taktekha from '../Assets/taktekha.webp'
export const worksData = [
  {
    title: 'Freevee',
    img: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg',
    website: 'https://freevee.vercel.app',
    github: 'https://github.com/RamFarid/freevee',
    status: {
      react: false,
      pure: false,
      sass: false,
      mui: true,
      next: true,
    },
  },
  {
    title: 'Taktekha',
    img: taktekha,
    website: 'https://taktekha.vercel.app',
    github: 'https://github.com/RamFarid/taktekha',
    status: {
      react: true,
      pure: false,
      sass: false,
      mui: false,
    },
  },
  {
    title: 'Netflix clone',
    img: netflix,
    website: 'https://netflix-ram.netlify.app',
    github: 'https://github.com/RamFarid/netflix-clone',
    status: {
      react: true,
      pure: false,
      sass: false,
      mui: false,
    },
  },
  // {
  //   title: 'TicTacToe online game',
  //   img: 'https://play-lh.googleusercontent.com/anLbS8SyY8e0O733iV9RKOY983pGb4vPHOgSLExg9QgeAFUDmbhLXgqK8Az0ncPYmEk=w240-h480-rw',
  //   website: 'https://xo-ram.netlify.app',
  //   github: 'https://github.com/RamFarid/tic-tac-toe-online',
  //   status: {
  //     react: true,
  //     pure: false,
  //     sass: false,
  //     mui: false,
  //   },
  // },
  {
    title: 'My CV',
    img: logo,
    website: '',
    github: 'https://github.com/RamFarid/ram-farid-cv',
    status: {
      react: true,
      pure: false,
      sass: false,
      mui: false,
    },
  },

  {
    title: 'Weather App',
    img: weather,
    website:
      'https://welcome0to0rams0server.on.drv.tw/weatherFullUpdateTesting2/',
    github: '',
    status: {
      react: false,
      pure: true,
      sass: false,
      mui: false,
    },
  },

  {
    title: 'QR code generator',
    img: qrcode,
    website: 'https://qrcode-generation.vercel.app/',
    github: 'https://github.com/RamFarid/qrcode-generator',
    status: {
      next: true,
      react: false,
      pure: false,
      sass: false,
      mui: false,
    },
  },

  {
    title: 'ElAssema news',
    img: news,
    website: '',
    github: 'https://github.com/RamFarid/elaseema-clone/',
    status: {
      react: true,
      pure: false,
      sass: true,
      mui: false,
    },
  },
  {
    title: 'Demo quiz App',
    img: mcq,
    website: 'https://welcome0to0rams0server.on.drv.tw/mcq/',
    github: '',
    status: {
      react: false,
      pure: true,
      sass: false,
      mui: false,
    },
  },
]
