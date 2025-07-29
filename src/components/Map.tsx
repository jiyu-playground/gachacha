import ShopItem from "./ShopItem";
import "../styles/Map.css";
import { useEffect, useRef, useState, useCallback } from "react";
import capsuleImage from "../assets/capsule.jpeg";

declare const window: typeof globalThis & {
  kakao: any;
};

interface GachaShop {
  id: string;
  place_name: string;
  x: string;
  y: string;
  distance?: string;
  road_address_name?: string;
  address_name: string;
  phone?: string;
}

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [nearbyShops, setNearbyShops] = useState<GachaShop[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // 검색 완료 여부

  // 거리 계산 함수를 useCallback으로 메모이제이션
  const calculateDistance = useCallback(
    (lat1: number, lng1: number, lat2: number, lng2: number) => {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    []
  );

  // 지도 초기화를 별도 함수로 분리
  const initializeMap = useCallback(
    async (userLat: number, userLng: number) => {
      if (!mapRef.current || hasSearched || isLoading) return;

      setIsLoading(true);
      console.log("지도 초기화 시작...");

      const options = {
        center: new window.kakao.maps.LatLng(userLat, userLng),
        level: 5,
      };
      const map = new window.kakao.maps.Map(mapRef.current, options);

      // 내 위치 마커
      const myLocationMarker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(userLat, userLng),
      });
      myLocationMarker.setMap(map);

      const ps = new window.kakao.maps.services.Places();

      // 키워드 수를 줄이고 우선순위 적용
      const keywords = [
        "가챠샵",
        "가챠",
        "가차샵",
        "가차",
        "플레이인더박스",
        "애니팝",
        "뽑기샵",
        "캡슐토이",
      ];
      const allPlaces: GachaShop[] = [];
      const processedPlaces = new Set();

      try {
        for (let i = 0; i < keywords.length; i++) {
          const keyword = keywords[i];
          console.log(`"${keyword}" 검색 중... (${i + 1}/${keywords.length})`);

          // Promise로 감싸서 async/await 사용
          await new Promise<void>((resolve, reject) => {
            // 딜레이를 1초로 증가 (API 제한 고려)
            setTimeout(() => {
              ps.keywordSearch(keyword, (data: any, status: any) => {
                try {
                  if (status === window.kakao.maps.services.Status.OK) {
                    console.log(
                      `"${keyword}" 검색 완료: ${data.length}개 발견`
                    );

                    data.forEach((place: any) => {
                      const placeKey = `${place.place_name}-${place.x}-${place.y}`;
                      if (!processedPlaces.has(placeKey)) {
                        processedPlaces.add(placeKey);

                        const distance = calculateDistance(
                          userLat,
                          userLng,
                          parseFloat(place.y),
                          parseFloat(place.x)
                        );

                        // 10km 이내만 저장 (메모리 최적화)
                        if (distance <= 10) {
                          allPlaces.push({
                            id: place.id,
                            place_name: place.place_name,
                            x: place.x,
                            y: place.y,
                            distance: distance.toFixed(1),
                            road_address_name: place.road_address_name,
                            address_name: place.address_name,
                            phone: place.phone,
                          });
                        }
                      }
                    });
                  } else {
                    console.log(`"${keyword}" 검색 실패 또는 결과 없음`);
                  }
                  resolve();
                } catch (error) {
                  console.error(`"${keyword}" 검색 중 오류:`, error);
                  resolve(); // 에러가 있어도 다음 검색 진행
                }
              });
            }, i * 1000); // 1초 딜레이로 증가
          });
        }

        // 거리순 정렬
        allPlaces.sort(
          (a, b) => parseFloat(a.distance!) - parseFloat(b.distance!)
        );
        setNearbyShops(allPlaces);

        console.log(`주변 10km 내 ${allPlaces.length}개 가챠샵 발견`);

        // 마커 생성 (10km 이내만)
        allPlaces.forEach((place: GachaShop) => {
          const placePosition = new window.kakao.maps.LatLng(
            parseFloat(place.y),
            parseFloat(place.x)
          );

          const imageSize = new window.kakao.maps.Size(30, 30);
          const imageOption = {
            offset: new window.kakao.maps.Point(15, 15),
          };

          const markerImage = new window.kakao.maps.MarkerImage(
            capsuleImage,
            imageSize,
            imageOption
          );

          const marker = new window.kakao.maps.Marker({
            position: placePosition,
            image: markerImage,
          });

          marker.setMap(map);

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `
            <div style="
              padding: 8px 12px; 
              font-size: 13px; 
              font-weight: bold;
              color: #333;
              white-space: nowrap;
              min-width: fit-content;
              background: white;
              border-radius: 4px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            ">
              <div>${place.place_name}</div>
              <div style="font-size: 11px; color: #666; font-weight: normal; margin-top: 2px;">
                📍 ${place.distance}km
              </div>
            </div>
          `,
            removable: true,
          });

          window.kakao.maps.event.addListener(marker, "click", () => {
            infowindow.open(map, marker);
          });
        });

        setHasSearched(true); // 검색 완료 표시
        console.log("모든 마커 생성 완료!");
      } catch (error) {
        console.error("가챠샵 검색 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [calculateDistance, hasSearched, isLoading]
  );

  // useEffect 최적화 - 빈 배열로 한 번만 실행
  useEffect(() => {
    const apiKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

    if (!apiKey) {
      console.error("카카오 API 키가 없습니다!");
      return;
    }

    // 이미 검색했으면 실행하지 않음
    if (hasSearched) {
      console.log("이미 검색 완료! API 호출 스킵");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              console.log(`📍 현재 위치: ${lat}, ${lng}`);
              setUserLocation({ lat, lng });
              initializeMap(lat, lng);
            },
            (error) => {
              console.log("위치 정보를 가져올 수 없어서 서울로 설정할게요!");
              const lat = 37.5665;
              const lng = 126.978;
              setUserLocation({ lat, lng });
              initializeMap(lat, lng);
            }
          );
        } else {
          console.log("이 브라우저는 위치 서비스를 지원하지 않아요!");
          const lat = 37.5665;
          const lng = 126.978;
          setUserLocation({ lat, lng });
          initializeMap(lat, lng);
        }
      });
    };

    script.onerror = () => {
      console.error("카카오맵 스크립트 로딩 실패");
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []); // 빈 배열로 한 번만 실행

  return (
    <div className="map-section">
      <div ref={mapRef} id="map" className="map-placeholder">
        {isLoading ? "가챠샵 검색 중..." : "카카오맵 로딩 중..."}
      </div>
      <ShopItem nearbyShops={nearbyShops} userLocation={userLocation} />
    </div>
  );
};

export default Map;
