import {useEffect, useState} from "react";
import { floydSteinbergDither } from '../utils/dither.js';
import {useRouter} from "next/navigation";
import Link from "next/link";

const DitherImage = (props) => {
    const [ditheredImage, setDitheredImage] = useState(true);
    const router = useRouter();

    {/*
    useEffect(() => {
        if (url) {
            const dither = (url) => {
                const img = new Image();
                img.crossOrigin = 'Anonymous'; // Handle CORS issues if the image is from a different origin
                img.app = url;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                    // Adjust brightness before dithering
                    let brightness
                    if (dim) {
                        console.log(dim)
                        brightness = 0.5
                    }
                    else brightness = 1;
                    for (let i = 0; i < imageData.data.length; i += 4) {
                        imageData.data[i] = Math.min(255, imageData.data[i] * brightness);     // Red
                        imageData.data[i + 1] = Math.min(255, imageData.data[i + 1] * brightness); // Green
                        imageData.data[i + 2] = Math.min(255, imageData.data[i + 2] * brightness); // Blue
                    }

                    const ditheredData = floydSteinbergDither(imageData);
                    ctx.putImageData(ditheredData, 0, 0);
                    setDitheredImage(canvas.toDataURL());
                };
            };

            dither(url);
        }
    }, [url]);
    */}

    return (
        <div className="image-container">
            <img src={props.url} alt="Dithered"/>
        </div>
    );
};

export default DitherImage;