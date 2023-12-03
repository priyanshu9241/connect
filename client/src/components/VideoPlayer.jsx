import { useSelector } from "react-redux";

export default function VideoPlayer({ public_id }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <>
      {theme === "light" ? (
        <iframe
          src={`https://player.cloudinary.com/embed/?cloud_name=${
            import.meta.env.VITE_CLOUDINARY_ID
          }&public_id=${public_id}&player[muted]=true&player[skin]=light&player[showJumpControls]=true&player[hideContextMenu]=false&player[floatingWhenNotVisible]=right&player[loop]=true`}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          className="w-full h-auto rounded-lg aspect-video"
        ></iframe>
      ) : (
        <iframe
          src={`https://player.cloudinary.com/embed/?cloud_name=${
            import.meta.env.VITE_CLOUDINARY_ID
          }&public_id=${public_id}&player[muted]=true&player[showJumpControls]=true&player[hideContextMenu]=false&player[floatingWhenNotVisible]=right&player[loop]=true`}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          className="w-full h-auto rounded-lg aspect-video"
        ></iframe>
      )}
    </>
  );
}
