export default function VideoPlayer({ public_id }) {
  return (
    <>
      <iframe
        src={`https://player.cloudinary.com/embed/?cloud_name=${
          import.meta.env.VITE_CLOUDINARY_ID
        }&public_id=${public_id}`}
        height="360"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowfullscreen
        frameborder="0"
        className="w-full rounded-lg"
      ></iframe>
    </>
  );
}
