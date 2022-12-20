import { Image } from '@shopify/hydrogen';
const imageLoader = ({ src, width, height, scale }) => {
    return `https://foo.com/${src}?w=${width}&h=${height}&scale=${scale}`;
};
export default function ExternalImageWithLoader() {
    return (
        <Image
            src="fancyImage.png"
            width={500}
            height={500}
            loader={imageLoader}
            loaderOptions={{ scale: 2 }}
        />
    );
}