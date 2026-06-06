// Utility to provide a valid base64 blurDataURL for next/image
// If a provided thumbnail is already a data URL, use it, otherwise fallback to a tiny SVG shimmer

export const isDataURL = (str) => typeof str === 'string' && str.startsWith('data:');

const toBase64 = (str) =>
  (typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str));

export const shimmer = (w = 16, h = 9) =>
  `data:image/svg+xml;base64,${toBase64(
    `<svg width="${w}" height="${h}" xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'>
      <defs>
        <linearGradient id='g'>
          <stop stop-color='#f6f7f8' offset='20%' />
          <stop stop-color='#edeef1' offset='50%' />
          <stop stop-color='#f6f7f8' offset='70%' />
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='#f6f7f8' />
      <rect id='r' width='100%' height='100%' fill='url(#g)' />
      <animate xlink:href='#r' attributeName='x' from='-100%' to='100%' dur='1s' repeatCount='indefinite'  />
    </svg>`)}>`;

export const getBlur = (thumb, fallbackWidth = 16, fallbackHeight = 9) =>
  isDataURL(thumb) ? thumb : shimmer(fallbackWidth, fallbackHeight);
