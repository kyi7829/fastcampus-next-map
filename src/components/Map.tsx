import Script from "next/script";
import { Dispatch, SetStateAction } from "react";

declare global {
    interface Window {
        kakao: any;
    }
}

const DEFAULT_LAT = 37.559466;
const DEFAULT_LNG = 126.973587;

interface MapProps {
    setMap: Dispatch<SetStateAction<any>>;
}

export default function Map({ setMap } : MapProps) {
    const loadKakaoMap = () => {

        window.kakao.maps.load(() => {
            const mapContainer = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
            const mapOptions = { //지도를 생성할 때 필요한 기본 옵션
                center: new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG), //지도의 중심좌표.
                level: 3, //지도의 레벨(확대, 축소 정도)
            }
            const map = new window.kakao.maps.Map(mapContainer, mapOptions);
        });
    };

    return (
        <>
            <Script
                strategy="afterInteractive"
                type="text/javascript"
                src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&autoload=false`}
                onReady={loadKakaoMap}
            />
            <div id="map" className="w-full h-screen"></div>
        </>
        )
}
