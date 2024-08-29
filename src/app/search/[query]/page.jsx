"use client";
import SwiperLayout from "@/components/Homepage/Swiper";
import SongCard from "@/components/Homepage/SongCard";
import { getSearchedData, getSongData, getYtSearchedData } from "@/services/dataAPI";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SwiperSlide } from "swiper/react";
import { BsPlayFill, BsYoutube } from "react-icons/bs";
import { playPause, setActiveSong, setFullScreen } from "@/redux/features/playerSlice";
import Image from "next/image";
import Link from "next/link";
import SongListSkeleton from "@/components/SongListSkeleton";
import { setProgress } from "@/redux/features/loadingBarSlice";

const Page = ({ params }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState(params.query);
  const [searchedData, setSearchedData] = useState(null);
  const [youtubeResults, setYoutubeResults] = useState(null);
  const [loadingJiosaavn, setLoadingJiosaavn] = useState(true);
  const [loadingYoutube, setLoadingYoutube] = useState(true);
  const { currentSongs } = useSelector((state) => state.player);
  const [activeTab, setActiveTab] = useState("jiosaavn");

  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingJiosaavn(true);
      dispatch(setProgress(70));
      const response = await getSearchedData(query);
      setSearchedData(response);
      setLoadingJiosaavn(false);
      dispatch(setProgress(100));
    };
    fetchData();
  }, [query]);

  useEffect(() => {
    const fetchYtData = async () => {
      setLoadingYoutube(true);
      dispatch(setProgress(70));
      const response = await getYtSearchedData(query);
      setYoutubeResults(response);
      setLoadingYoutube(false);
      dispatch(setProgress(100));
    };
    fetchYtData();
  }, [query]);

  const handlePlayClick = async (song) => {
    if (song?.type === "song") {
      const Data = await getSongData(song?.id);
      const songData = await Data?.[0];
      dispatch(
        setActiveSong({
          song: songData,
          data: currentSongs?.find((s) => s?.id === songData?.id)
            ? currentSongs
            : [...currentSongs, songData],
          i: currentSongs?.find((s) => s?.id === songData?.id)
            ? currentSongs?.findIndex((s) => s?.id === songData?.id)
            : currentSongs?.length,
        })
      );
      dispatch(setFullScreen(true));
      dispatch(playPause(true));
    }
  };

  const handlePlayVideo = async (item) => {
    try {
      const videoId = item.id.videoId;
  
      // Call the YouTube-to-MP3 conversion API
      const url = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '43db6998cdmsh2ebabcbb7bfe84ep1865b9jsn0406325a9b5c',
          'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com'
        }
      };
      
      const response = await fetch(url, options);
      const result = await response.json();
  
      if (result && result.status === 'ok') {
        const mp3Url = result.link;
        const duration = result.duration;
        const name = result.title;
  
        // Simulate the structure for the active song (adjust as necessary)
        const songData = {
          name: item.snippet.title,
          artists: [
            {
              name: item.snippet.channelTitle
            }
          ],
          url: mp3Url,
          image : [
            {
              "quality": "50x50",
              "url": item.snippet.thumbnails.default.url
            },
            {
              "quality": "150x150",
              "url": item.snippet.thumbnails.medium.url
            },
            {
              "quality": "500x500",
              "url": item.snippet.thumbnails.high.url
            }
          ],
          artist: item.snippet.channelTitle,
          downloadUrl: [
            {
              "quality": "12kbps",
              "url": "https://aac.saavncdn.com/259/8cda4df29a90d73c44cc5b1eafca5cf8_12.mp4"
            },
            {
              "quality": "48kbps",
              "url": "https://aac.saavncdn.com/259/8cda4df29a90d73c44cc5b1eafca5cf8_48.mp4"
            },
            {
              "quality": "96kbps",
              "url": "https://aac.saavncdn.com/259/8cda4df29a90d73c44cc5b1eafca5cf8_96.mp4"
            },
            {
              "quality": "160kbps",
              "url": "https://aac.saavncdn.com/259/8cda4df29a90d73c44cc5b1eafca5cf8_160.mp4"
            },
            {
              "quality": "320kbps",
              "url": mp3Url
            }
          ],
          duration: duration,
          id: videoId
        };

        console.log(songData);
  
        dispatch(
          setActiveSong({
            song: songData,
            data: currentSongs?.find((s) => s?.id === songData?.id)
              ? currentSongs
              : [...currentSongs, songData],
            i: currentSongs?.find((s) => s?.id === songData?.id)
              ? currentSongs?.findIndex((s) => s?.id === songData?.id)
              : currentSongs?.length,
          })
        );
        dispatch(setFullScreen(true));
        dispatch(playPause(true));
      } else {
        console.error("Failed to convert YouTube video to MP3");
      }
    } catch (error) {
      console.error("Error converting YouTube video to MP3: ", error);
    }
  };

  const handleTabClick = (platform) => {
    setActiveTab(platform);
    localStorage.setItem('activeTab', platform);
  };

  return (
    <div>
      <div className="w-11/12 m-auto mt-16">
        {/* Tabs for JioSaavn and YouTube */}
        <div className="flex gap-5">
          <div
            onClick={() => handleTabClick("jiosaavn")}
            className={`flex items-center gap-2 mt-5 group rounded-3xl py-2 px-3 cursor-pointer border ${
              activeTab === "jiosaavn" ? "border-[#00e6e6] text-[#00e6e6]" : "border-white"
            }`}
          >
            <BsPlayFill
              size={25}
              className={`text-gray-200 ${
                activeTab === "jiosaavn" ? "text-[#00e6e6]" : ""
              }`}
            />
            <p className="text-lg font-semibold text-gray-200">JioSaavn</p>
          </div>
          <div
            onClick={() => handleTabClick("youtube")}
            className={`flex items-center gap-2 mt-5 group rounded-3xl py-2 px-3 cursor-pointer border ${
              activeTab === "youtube" ? "border-[#00e6e6] text-[#00e6e6]" : "border-white"
            }`}
          >
            <BsYoutube
              size={25}
              className={`text-gray-200 ${
                activeTab === "youtube" ? "text-[#00e6e6]" : ""
              }`}
            />
            <p className="text-lg font-semibold text-gray-200">YouTube</p>
          </div>
        </div>

        {activeTab === "jiosaavn" && (
          <div className="mt-10 text-gray-200">
            <h1 className="text-3xl font-bold">
              Search results for "{query.replaceAll("%20", " ")}"
            </h1>
            <div className="mt-10 text-gray-200">
              <h2 className="text-lg lg:text-4xl font-semibold">Songs</h2>
              {loadingJiosaavn ? (
                <SongListSkeleton />
              ) : (
                searchedData && searchedData?.songs?.results?.length > 0 ? (
                  <div className="mt-5">
                    {searchedData?.songs?.results?.map((song, index) => (
                      <div
                        key={index}
                        onClick={() => handlePlayClick(song)}
                        className="flex items-center mt-5 cursor-pointer group border-b-[1px] border-gray-400 justify-between"
                      >
                        <div className="flex items-center gap-5">
                          <div className="relative">
                            <img
                              src={song?.image?.[2]?.url}
                              alt={song?.title}
                              width={50}
                              height={50}
                              className="mb-3"
                            />
                            <BsPlayFill
                              size={25}
                              className="group-hover:block hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-200"
                            />
                          </div>
                          <div className="w-32 lg:w-80">
                            <p className="text-sm lg:text-lg font-semibold truncate">
                              {song?.title
                                ?.replace("&#039;", "'")
                                ?.replace("&amp;", "&")}
                            </p>
                          </div>
                        </div>
                        <div className="hidden lg:block max-w-56">
                          {song?.primaryArtists && (
                            <p className="text-gray-400 truncate">
                              By: {song?.primaryArtists}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <SongListSkeleton />
                )
              )}
            </div>

            {/* Other JioSaavn sections */}
            <div className="mt-10 text-gray-200">
              <SwiperLayout title={"Albums"}>
                {searchedData &&
                  searchedData?.albums?.results?.length > 0 &&
                  searchedData?.albums?.results?.map((song) => (
                    <SwiperSlide key={song?.id}>
                      <SongCard song={song} />
                    </SwiperSlide>
                  ))}
              </SwiperLayout>
            </div>
            <div className="mt-10 text-gray-200">
              <SwiperLayout title={"Artists"}>
                {searchedData &&
                  searchedData?.artists?.results?.length > 0 &&
                  searchedData?.artists?.results?.map((artist) => (
                    <SwiperSlide key={artist?.id}>
                      <Link href={`/artist/${artist?.id}`}>
                        <div className="flex flex-col justify-center items-center">
                          <Image
                            src={artist?.image?.[2]?.url}
                            alt={artist?.title}
                            width={200}
                            height={200}
                            className="rounded-full"
                          />
                          <p className="lg:text-base lg:w-44 w-24 text-center text-xs font-semibold mt-3 truncate">
                            {artist?.title?.replace("&amp;", "&")}
                          </p>
                          <div>
                            {artist?.description && (
                              <p className="text-gray-400 truncate text-[8px] lg:text-xs">
                                {artist?.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
              </SwiperLayout>
            </div>
            <div className="mt-10 text-gray-200">
              <SwiperLayout title={"Playlists"}>
                {searchedData &&
                  searchedData?.playlists?.results?.length > 0 &&
                  searchedData?.playlists?.results?.map((song) => (
                    <SwiperSlide key={song?.id}>
                      <SongCard song={song} />
                    </SwiperSlide>
                  ))}
              </SwiperLayout>
            </div>
          </div>
        )}

        {activeTab === "youtube" && (
          <div className="mt-10 text-gray-200">
            <h1 className="text-3xl font-bold">
              YouTube search results for "{query.replaceAll("%20", " ")}"
            </h1>
            <div className="mt-10 text-gray-200">
              <h2 className="text-lg lg:text-4xl font-semibold">Songs</h2>
              {loadingYoutube ? (
                <SongListSkeleton />
              ) : (
                youtubeResults?.length > 0 ? (
                  <div className="mt-5">
                    {youtubeResults.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handlePlayVideo(item)}
                        className="flex items-center mt-5 cursor-pointer group border-b-[1px] border-gray-400 justify-between"
                      >
                        <div className="flex items-center gap-5">
                          <div className="relative">
                            <img
                              src={item.snippet.thumbnails.default.url}
                              alt={item.snippet.title}
                              width={50}
                              height={50}
                              className="mb-3"
                            />
                            <BsPlayFill
                              size={25}
                              className="group-hover:block hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-200"
                            />
                          </div>
                          <div className="w-32 lg:w-80">
                            <p className="text-sm lg:text-lg font-semibold truncate">
                              {item.snippet.title
                                ?.replace("&#039;", "'")
                                ?.replace("&amp;", "&")}
                            </p>
                          </div>
                        </div>
                        <div className="hidden lg:block max-w-56">
                          {item.snippet.channelTitle && (
                            <p className="text-gray-400 truncate">
                              By: {item.snippet.channelTitle}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <SongListSkeleton />
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
