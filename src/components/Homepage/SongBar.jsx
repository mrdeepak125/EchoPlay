import Link from "next/link";
import { FaPlayCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import getPixels from "get-pixels";
import { extractColors } from "extract-colors";

const SongBar = ({ playlist, i }) => {
  const [cardColor, setCardColor] = useState();

  useEffect(() => {
    const src = playlist?.image?.[1]?.link;
    getPixels(src, (err, pixels) => {
      if (!err) {
        const data = [...pixels.data];
        const width = Math.round(Math.sqrt(data.length / 4));
        const height = width;

        extractColors({ data, width, height })
          .then((colors) => {
            setCardColor(colors);
            console.log(colors[0].red, colors[0].blue, colors[0].green);
          })
          .catch(console.log);
      }
    });
  }, []);

  const getGradientBg = () => {
    if (cardColor && cardColor.length >= 3) {
      const c0 = cardColor[0];
      const c1 = cardColor[1];
      const c2 = cardColor[2];
      return `linear-gradient(135deg, rgba(${c0.red}, ${c0.green}, ${c0.blue}, 0.25) 0%, rgba(${c1.red}, ${c1.green}, ${c1.blue}, 0.15) 50%, rgba(${c2.red}, ${c2.green}, ${c2.blue}, 0.1) 100%)`;
    }
    if (cardColor && cardColor.length >= 1) {
      const c0 = cardColor[0];
      return `linear-gradient(135deg, rgba(${c0.red}, ${c0.green}, ${c0.blue}, 0.25) 0%, rgba(${c0.red}, ${c0.green}, ${c0.blue}, 0.05) 100%)`;
    }
    return "rgba(255, 255, 255, 0.03)";
  };

  return (
    <Link href={`/playlist/${playlist?.id}`} style={{ textDecoration: 'none' }}>
      <div
        className="w-full flex flex-row items-center group py-3 px-5 rounded-[24px] cursor-pointer mb-3 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
        style={{
          background: getGradientBg(),
          border: "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--accent-glow, rgba(168,85,247,0.3))";
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.3), 0 0 15px var(--accent-glow)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.2)";
        }}
      >
        <h3 className="text-base text-gray-300 mr-4 font-extrabold w-6 text-center">{i + 1}.</h3>
        <div className="flex-1 flex flex-row justify-between items-center min-w-0">
          <img
            width={72}
            height={72}
            loading="lazy"
            alt="song_img"
            srcSet={`${playlist.image?.[0]?.link} 320w, ${playlist.image?.[1]?.link} 480w, ${playlist.image?.[2]?.link} 800w`}
            sizes="(max-width: 320px) 280px, (max-width: 480px) 440px, 800px"
            src={playlist.image?.[1]?.link}
            className="w-16 h-16 rounded-2xl object-cover border border-white/10 flex-shrink-0 shadow-md"
          />
          <div className="flex-1 flex flex-col justify-center mx-4 min-w-0">
            <p className="font-bold text-base text-white truncate md:w-full group-hover:text-[var(--accent-primary)] transition-colors">
              {playlist?.title?.replace("&#039;", "'")?.replace("&amp;", "&")}
            </p>
            <p className="text-xs text-gray-400 mt-1 capitalize font-medium">
              {playlist?.language} • {playlist?.playCount ? `${Number(playlist.playCount).toLocaleString()} plays` : 'Charts'}
            </p>
          </div>
        </div>
        <FaPlayCircle
          size={36}
          className="text-gray-300 group-hover:text-[var(--accent-primary)] group-hover:scale-110 transform transition-all duration-300 ease-in-out flex-shrink-0"
        />
      </div>
    </Link>
  );};

export default SongBar;
