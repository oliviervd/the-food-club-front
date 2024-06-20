import {useEffect, useState} from "react";
import { floydSteinbergDither } from '../utils/dither';
import {useNavigate} from "react-router-dom";

const DitherImage = ({ url, link }) => {
    const [ditheredImage, setDitheredImage] = useState(null);
    const nav = useNavigate()

    useEffect(() => {
        if (url) {
            const dither = (url) => {
                const img = new Image();
                img.crossOrigin = 'Anonymous'; // Handle CORS issues if the image is from a different origin
                img.src = url;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const ditheredData = floydSteinbergDither(imageData);
                    ctx.putImageData(ditheredData, 0, 0);
                    setDitheredImage(canvas.toDataURL());
                };
            };

            dither(url);
        }
    }, [url]);

    return (
        <div>
            {ditheredImage ? (
                <img src={ditheredImage} alt="Dithered" onClick={()=>nav(link)}/>
            ) : (
                 <div style={{width: "100%", height: "33vh", border: "2px solid black"}}></div>
            )}
        </div>
    );
};

export default DitherImage;