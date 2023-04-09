import React, { useState, useRef, useEffect } from "react";
import Stations from "../stations.json";
import { generateRandom } from "../utils/helpers";
import { api } from "../utils/api";
import { trim } from "../utils/helpers";
import CustomButton from "./Button";
import { faBackwardStep, faForwardStep, faPlay, faPause, faShuffle } from '@fortawesome/free-solid-svg-icons';

function Station() {
    var maxStationsLength = Stations.length;
    const [currentActiveIndex, setCurrentActiveIndex] = useState(0);
    const [currentActiveStation, setCurrentActiveStation] = useState(Stations[currentActiveIndex]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isShuffleActive, setIsShuffleActive] = useState(false);
    const [currentSongInfo, setCurrentSongInfo] = useState(null);
    const [songImageCode, setSongImageCode] = useState(null);
    const audioPlayerRef = useRef();

    var notASong = 0;
    var given_img = 0;
    var cfg_albumdisplay = 1;
    var hls_art = null;
    var hls_album = null;
    var cfg_albumapi = '';
    var defaultalbumpic = "configs/images/noalbum-black.png";

    const process_song = (artist_song, byRef, aws_callback, i) => {
        artist_song = artist_song.replace("Â ", " "); //&nbsp; to space
        var delim = " - ",
            e;
        if (artist_song.indexOf(delim) < 0) delim = "-";
        if (artist_song.indexOf(delim) < 0) delim = " / ";
        if (artist_song.indexOf(delim) < 0) {
            byRef.artist = "";
            byRef.song = artist_song;
            notASong = 1;
        } else {
            byRef.artist = artist_song.split(delim)[0];
            byRef.song = trim(artist_song.substr(byRef.artist.length + delim.length));
            byRef.artist = trim(byRef.artist);
            if (window.cfg_swap_art_title) {
                e = byRef.song;
                byRef.song = byRef.artist;
                byRef.artist = e;
            }
            e = byRef.song.match(/^[\d's]+ - (.*)/); //remove prefix "YYYY - "
            if (e) artist_song = byRef.artist + " - " + e[1];
            e = byRef.song.match(/ - (https:.*(?:jpg|jpeg|png))$/i);
            if (e && e.index > 1) {
                byRef.song = byRef.song.substr(0, e.index);
                artist_song = byRef.song + " - " + byRef.artist;
                given_img = e[1];
                if (e[1].indexOf("hottejano.live/nowplaying/images/default.") > 0) given_img = 0;
            }
        }
        if (!notASong) {
            if (i === -1 && hls_art && cfg_albumapi !== 'amz-only') { //override if found only
                aws_callback(hls_art, hls_art, hls_album, i, byRef.artist);
            } else if ((given_img || window.live365) && cfg_albumapi !== 'amz-only') {
                aws_callback(given_img, given_img, null, i, byRef.artist);
            } else if (cfg_albumapi === 'none') {
                aws_callback(defaultalbumpic, null, null, i, byRef.artist);
            } else { //API: Amazon

                let songImgUrl = "https://player.181fm.com/album.php?key=" + encodeURIComponent(artist_song);
                console.log("songImgUrl", songImgUrl);
                api.get(songImgUrl)
                    .then(res => {
                        var album = res
                        console.log("songImgUrl api get result ", res);
                        if (!album['Image']) {
                            album['Image'] = defaultalbumpic;
                        }
                        if (!album['Title']) album['Title'] = "";
                        if (i === -1 && hls_album) album['Title'] = hls_album;
                        if (cfg_albumdisplay === 1) { //2 means skip this
                            album['Title'] = album['Title'].split('(')[0].split('[')[0];
                        }
                        aws_callback(album['Image'], album['LargeImage'], album['Title'].substr(0, 200), i, byRef.artist);
                    })
                    .catch(error => {
                        console.log("ERROR", error);
                    })
            }
        } else aws_callback(defaultalbumpic, null, null, i);
    }

    const streamhist_success = (json) => {
        var byRef = "",
            lastsong_h = '-';
        var cfg_NotASongKeywords = "promo,adwtag,awbreak,ais1,ais3,ais6,adcor,admain,station id,stationid,181".split(",");
        var cfg_staticalbumpic = 0;

        for (var i = 0; i < json.length; i++) {
            byRef = {
                song: "",
                artist: ""
            };
            json[i].song = json[i].song.replace('.mp3', "").replace('.MP3', "").replace('.wma', "");
            if (json[i].song === lastsong_h) continue;
            lastsong_h = json[i].song;
            notASong = 0;
            for (var j = 0; j < cfg_NotASongKeywords.length; j++) {
                if (cfg_NotASongKeywords[j] && json[i].song.toLowerCase().indexOf(cfg_NotASongKeywords[j]) >= 0) notASong = 1;
            }
            if (notASong) continue;
            process_song(json[i].song, byRef, function (Img, LargeImage, Album, i, myartist) {
                if (cfg_staticalbumpic) Img = LargeImage = null;
                if (!Img) Img = defaultalbumpic;
                let songImageUrl = "https://player.181fm.com/" + Img;
                setSongImageCode(songImageUrl);
            }, i);
        }
    }

    useEffect(() => {
        if (currentActiveIndex > -1) {
            let newStation = Stations[currentActiveIndex];
            setCurrentActiveStation(newStation);
            let iVal = newStation.station_url.split("181fm.com/")[1];
            let seq = newStation.station_seq;
            let stationSongsUrl = `http://listen.181fm.com:8443/ice_history.php?h=listen.181fm.com&https=&f=ice&p=7080&i=${iVal}&c=${seq}`;
            api.get(stationSongsUrl)
            .then(res => {
                const allPastSongs = res;
                setCurrentSongInfo(allPastSongs[0]);
                streamhist_success([allPastSongs[0]]);
            })
            .catch(error => {
                console.log("ERROR", error);
            });

        }
    }, [currentActiveIndex]);

    useEffect(() => {
        if (currentActiveStation && isPlaying) {
            audioPlayerRef.current.pause();
            audioPlayerRef.current.load();
            audioPlayerRef.current.play();
        }
    }, [currentActiveStation,isPlaying]);

    const prevClicked = () => {
        if (isShuffleActive) {
            let randomIndex = generateRandom(0, maxStationsLength - 1, currentActiveIndex);
            if (randomIndex >= 0) {
                setCurrentActiveIndex(randomIndex);
            }
            else {
                setCurrentActiveIndex(0);
            }
        }
        else if (currentActiveIndex - 1 >= 0) {
            setCurrentActiveIndex(currentActiveIndex - 1);
        }
    }

    const togglePlay = () => {
        if (!isPlaying) {
            audioPlayerRef.current.play();
        }
        else {
            audioPlayerRef.current.pause();
        }
        setIsPlaying(!isPlaying);
    }

    const toggleShuffle = () => {
        setIsShuffleActive(!isShuffleActive);
    }

    const nextClicked = () => {
        if (isShuffleActive) {
            let randomIndex = generateRandom(0, maxStationsLength - 1, currentActiveIndex);
            if (randomIndex >= 0) {
                setCurrentActiveIndex(randomIndex);
            }
            else {
                setCurrentActiveIndex(0);
            }
        } else if (currentActiveIndex + 1 < maxStationsLength) {
            setCurrentActiveIndex(currentActiveIndex + 1);
        }
    }

    return (
        <div className="p-3" data-testid="station-wrapper">
            <h5 className="font-normal" data-testid="station-title">{currentActiveStation.station_title}</h5>
            <div>
                <img
                    data-testid={"songImage-testid"}
                    className="songImage"
                    src={songImageCode}
                    alt={currentSongInfo?.title}
                />
            </div>
            <h3 className="font-normal" data-testid="song-title">{currentSongInfo?.title}</h3>
            {/* <h6>{currentSongInfo?.artist}</h6> */}
            <audio ref={audioPlayerRef}>
                <source src={currentActiveStation.station_url} type="audio/mpeg" />
            </audio>
            <div className="mt-3">
                <CustomButton dataTestid={"button-prev"} disabled={currentActiveIndex === 0 && !isShuffleActive} buttonOnClick={prevClicked} icon={faBackwardStep} variant="ghost-button" />
                <CustomButton dataTestid={"button-play"} buttonOnClick={togglePlay} icon={isPlaying ? faPause : faPlay} variant="primary-button" />
                <CustomButton dataTestid={"button-next"} disabled={currentActiveIndex === maxStationsLength - 1 && !isShuffleActive} buttonOnClick={nextClicked} icon={faForwardStep} variant="ghost-button" />
            </div>
            <div className="mt-3">
                <CustomButton dataTestid={"button-shuffle"} buttonOnClick={toggleShuffle} icon={faShuffle} variant={isShuffleActive ? "primary-button" : "ghost-button"} />
            </div>
        </div>
    );
}

export default Station;