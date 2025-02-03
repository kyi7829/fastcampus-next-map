import Script from "next/script";
import * as stores from '@/data/store_data.json';

declare global {
    interface Window {
        kakao: any;
    }
}

const DEFAULT_LAT = 37.559466;
const DEFAULT_LNG = 126.973587;

export default function Map() {
    const loadKakaoMap = () => {

        window.kakao.maps.load(() => {
            const mapContainer = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
            const mapOptions = { //지도를 생성할 때 필요한 기본 옵션
                center: new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG), //지도의 중심좌표.
                level: 3, //지도의 레벨(확대, 축소 정도)
            }
            const map = new window.kakao.maps.Map(mapContainer, mapOptions);

            // 식당 데이터 마커 띄우기
            stores?.['DATA']?.map((store) => {

                const imageSrc = store?.bizcnd_code_nm
                        ? `/images/markers/${store.bizcnd_code_nm}.png`
                        : "images/markers/default.png",
                    imageSize = new window.kakao.maps.Size(40, 40), // 마커이미지의 크기입니다
                    imageOption = {offset: new window.kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

                const markerImage = new window.kakao.maps.MarkerImage(
                        imageSrc,
                        imageSize,
                        imageOption
                    );

                const markerPosition = new window.kakao.maps.LatLng(
                        store?.y_dnts,
                        store?.x_cnts
                    );

                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                    image: markerImage
                });

                marker.setMap(map);
            });
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
