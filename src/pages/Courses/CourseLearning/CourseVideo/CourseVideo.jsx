import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { Play } from "lucide-react";

const CourseVideo = ({
  thumbnail,
  videoUrl,
  onVideoComplete,
  lessonId,
  handleDuration,
}) => {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    if (state.played > 0.9 && onVideoComplete && lessonId) {
      onVideoComplete(lessonId);
    }
  };

  useEffect(() => {
    setPlaying(false);
  }, [videoUrl]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {videoUrl ? (
        <div className="relative player-wrapper w-full h-full">
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            width="100%"
            height="100%"
            playing={playing}
            controls={true}
            onProgress={handleProgress}
            onDuration={handleDuration}
            progressInterval={1000}
            config={{
              file: {
                attributes: {
                  controlsList: "nodownload",
                  disablePictureInPicture: true,
                },
              },
            }}
            style={{
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
        </div>
      ) : (
        <>
          <img src={thumbnail} className="w-full h-full object-cover" alt="" />
          <div
            onClick={handlePlayPause}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
              w-20 h-20 shadow-lg cursor-pointer transition hover:scale-110 bg-white
              rounded-full flex items-center justify-center"
          >
            <Play size={32} className="fill-black ml-1" />
          </div>
        </>
      )}
    </div>
  );
};

export default CourseVideo;
