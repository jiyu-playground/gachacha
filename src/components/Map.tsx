import "../styles/Map.css";
import { useEffect, useRef, useState, useCallback } from "react";
import capsuleImage from "../assets/capsule.jpeg";
import gachaShopsData from "../data/gacha-shops.json";

declare const window: typeof globalThis & {
  kakao: unknown;
};

interface GachaShop {
  id: string;
  place_name: string;
  x: string;
  y: string;
  address_name: string;
  phone?: string;
  distance?: string;
}

const Map = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nearbyShops, setNearbyShops] = useState<GachaShop[]>([]);

  // 거리 계산 함수
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

  // 지도 생성 및 마커 표시
  const initializeMap = useCallback(
    (userLat: number, userLng: number) => {
      if (!mapRef.current) return;

      console.log("🗺️ 지도 생성 중...");

      try {
        // 카카오맵 생성
        const mapOptions = {
          center: new window.kakao.maps.LatLng(userLat, userLng),
          level: 6, // 지도 확대 레벨
        };
        const map = new window.kakao.maps.Map(mapRef.current, mapOptions);

        // 내 위치 마커 (기본 빨간 마커)
        const myMarker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(userLat, userLng),
        });
        myMarker.setMap(map);

        // 내 위치 정보창
        const myInfoWindow = new window.kakao.maps.InfoWindow({
          content: `
            <div style="padding: 8px; font-weight: bold; color: #e74c3c;">
              📍 내 위치
            </div>
          `,
        });
        myInfoWindow.open(map, myMarker);

        // JSON 데이터에서 가챠샵 정보 가져오기
        const allShops = gachaShopsData.shops || [];
        console.log("📊 전체 가챠샵 데이터:", allShops.length, "개");

        // 내 위치 기준으로 거리 계산하고 가까운 순으로 정렬
        const shopsWithDistance = allShops
          .map((shop) => {
            const distance = calculateDistance(
              userLat,
              userLng,
              parseFloat(shop.y),
              parseFloat(shop.x)
            );
            return {
              ...shop,
              distance: distance.toFixed(1),
            };
          })
          .filter((shop) => parseFloat(shop.distance!) <= 20) // 20km 이내만
          .sort((a, b) => parseFloat(a.distance!) - parseFloat(b.distance!)); // 가까운 순

        setNearbyShops(shopsWithDistance);
        console.log("🏪 20km 내 가챠샵:", shopsWithDistance.length, "개");

        // 각 가챠샵에 커스텀 마커 표시
        shopsWithDistance.forEach((shop, index) => {
          try {
            // 가챠샵 위치
            const shopPosition = new window.kakao.maps.LatLng(
              parseFloat(shop.y), // 위도
              parseFloat(shop.x) // 경도
            );

            // 커스텀 마커 이미지 설정
            const markerImageSize = new window.kakao.maps.Size(30, 30); // 마커 크기
            const markerImageOption = {
              offset: new window.kakao.maps.Point(15, 15), // 마커 중심점
            };

            // 원하는 이미지로 마커 생성
            const customMarkerImage = new window.kakao.maps.MarkerImage(
              capsuleImage, // src/assets/capsule.jpeg (원하는 이미지로 변경)
              markerImageSize,
              markerImageOption
            );

            // 가챠샵 마커 생성
            const shopMarker = new window.kakao.maps.Marker({
              position: shopPosition,
              image: customMarkerImage, // 커스텀 이미지 적용
            });

            // 지도에 마커 추가
            shopMarker.setMap(map);

            // 마커 클릭 시 정보창
            const shopInfoWindow = new window.kakao.maps.InfoWindow({
              content: `
                <div style="
                  padding: 12px; 
                  font-size: 13px; 
                  color: #333;
                  max-width: 220px;
                  background: white;
                  border-radius: 6px;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                ">
                  <div style="font-weight: bold; margin-bottom: 6px; color: #2c3e50;">
                    🎯 ${shop.place_name}
                  </div>
                  <div style="font-size: 13px; color: #7f8c8d; margin-bottom: 4px;">
                    📍 ${shop.distance}km 거리
                  </div>
                  <div style="font-size: 13px; color: #7f8c8d; margin-bottom: 4px;">
                    🏠 ${shop.address_name}
                  </div>
                  ${
                    shop.phone
                      ? `
                    <div style="font-size: 13px; color: #7f8c8d;">
                      📞 ${shop.phone}
                    </div>
                  `
                      : ""
                  }
                </div>
              `,
              removable: true,
            });

            // 마커 클릭 이벤트
            window.kakao.maps.event.addListener(shopMarker, "click", () => {
              shopInfoWindow.open(map, shopMarker);
            });

            console.log(
              `✅ [${index + 1}/${shopsWithDistance.length}] ${
                shop.place_name
              } 마커 생성`
            );
          } catch (error) {
            console.error(`❌ ${shop.place_name} 마커 생성 실패:`, error);
          }
        });

        console.log("🎉 지도 완성!");
      } catch (error) {
        console.error("❌ 지도 생성 실패:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [calculateDistance]
  );

  // 컴포넌트 시작
  useEffect(() => {
    const apiKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

    if (!apiKey) {
      console.error("❌ 카카오 API 키가 없습니다!");
      setIsLoading(false);
      return;
    }

    // 카카오맵 스크립트 로드 (지도 표시용만, 검색 기능 불필요)
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;

    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log("✅ 카카오맵 SDK 로드 완료");

        // 내 현재 위치 가져오기
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              console.log(`📱 내 현재 위치: ${lat}, ${lng}`);
              initializeMap(lat, lng);
            },
            (error) => {
              console.log(
                "🔍 위치를 가져올 수 없어서 청년취업사관학교 서대문캠퍼스로 설정"
              );
              const lat = 37.5568;
              const lng = 126.9352;
              initializeMap(lat, lng);
            }
          );
        } else {
          console.log("📱 이 브라우저는 위치 서비스를 지원하지 않습니다");
          const lat = 37.5568;
          const lng = 126.9352;
          initializeMap(lat, lng);
        }
      });
    };

    script.onerror = () => {
      console.error("❌ 카카오맵 스크립트 로딩 실패");
      setIsLoading(false);
    };

    document.head.appendChild(script);

    // 정리
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [initializeMap]);

  return (
    <div className="map-section">
      {/* 지도 영역 */}
      <div
        ref={mapRef}
        id="map"
        className="map-placeholder"
        style={{
          width: "100%",
          height: "500px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          backgroundColor: "#f8f9fa",
        }}
      >
        {isLoading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: "#666",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "15px" }}>🗺️</div>
            <div style={{ fontSize: "16px", marginBottom: "5px" }}>
              지도를 불러오는 중...
            </div>
            <div style={{ fontSize: "14px", color: "#999" }}>
              JSON 데이터에서 가챠샵 정보를 가져오고 있어요
            </div>
          </div>
        )}
      </div>

      {/* 간단한 정보 표시 */}
      {!isLoading && (
        <div
          style={{
            marginTop: "15px",
            padding: "12px",
            backgroundColor: "#e8f5e8",
            borderRadius: "6px",
            fontSize: "14px",
            textAlign: "center",
          }}
        >
          📊 총 {gachaShopsData.shops?.length || 0}개 중 근처{" "}
          {nearbyShops.length}개 표시 중
        </div>
      )}
    </div>
  );
};

export default Map;
