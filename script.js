/**
 * [영덕 나우] 모바일 웹 고도화 자바스크립트 (script.js)
 * - Leaflet.js 기반 영덕 관광 인터랙티브 지도 & 코스 경로선
 * - [핵심 체험 요소 4선 반영]
 *   1) 퐁당자무질 (영덕 해녀 물질 체험 & 바다한상 미식)
 *   2) 별파랑 짚라인 (풍력발전단지 742m 왕복 활강)
 *   3) 상대산 관어대 모노레일 (360도 파노라마 뷰)
 *   4) 사계 플라워 팜 (원예 힐링 체험 & 꽃차 시음)
 * - [영덕 타보게 관광택시 (군청 60% 지원)] 전용 섹션 및 모달 연동
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================
  // 1. DATA DEFINITIONS (영덕 실제 좌표 & 핵심 체험/명소)
  // ========================================================

  const spotDatabase = {
    // 1. 강구항 & 해파랑공원 (거점)
    "ganggu": {
      id: "ganggu",
      title: "강구항 & 영덕 해파랑공원",
      lat: 36.3601,
      lng: 129.3902,
      category: "먹거리·산책",
      badge: "연중 상시 · 무료 입장",
      location: "경북 영덕군 강구면 영덕대게로 132",
      desc: "영덕대게의 본고장 강구항과 바로 연결된 대표 해안 테마공원입니다. 거대한 황금 대게 조형물과 넓은 잔디광장, 야간 음악분수가 조성되어 있어 대게 식사 후 여유롭게 산책하기 가장 좋습니다.",
      tip: "💡 저녁 8시 야간 경관조명이 점등되면 동해 밤바다 인생샷 명소로 변신합니다.",
      externalQuery: "영덕 해파랑공원"
    },

    // 2. 별파랑 짚라인 (체험 1)
    "zipline": {
      id: "zipline",
      title: "별파랑 짚라인 (영덕 풍력발전단지)",
      lat: 36.4255,
      lng: 129.4182,
      category: "익스트림 액티비티",
      badge: "총 연장 742m 왕복 복선",
      location: "경북 영덕군 영덕읍 해맞이길 254-33 (별파랑공원)",
      desc: "24기의 거대한 하얀 풍력발전기와 쪽빛 동해 바다 사이를 새처럼 가로지르는 742m 왕복형 복선 짚라인 어드벤처! 해발 200m 바람의 언덕에서 바다로 활강하는 스릴이 일품입니다.",
      tip: "💡 이용료: 성인 왕복 15,000원 (영덕 관내 숙박객/디지털관광주민증 제시 시 20% 우대 감면)",
      externalQuery: "영덕 별파랑 짚라인"
    },

    // 3. 퐁당자무질 해녀체험 (체험 2)
    "pongdang": {
      id: "pongdang",
      title: "퐁당자무질 (영덕 해녀 물질 체험)",
      lat: 36.4850,
      lng: 129.4380,
      category: "로컬 어촌·미식체험",
      badge: "현직 해녀 동행 · 사전예약제",
      location: "경북 영덕군 축산면 경정리 해녀마을 일원",
      desc: "영덕문화관광재단과 영덕위캔드협동조합이 운영하는 이색 해양 체험! 현직 해녀 어무이들과 함께 안전하게 동해 바다에 들어가 전통 물질을 배우고, 물질 후에는 자연산 돌미역국, 전복죽, 소라무침, 대게주먹밥으로 차려진 '바다 한 상'을 맛보는 프리미엄 체험입니다.",
      tip: "💡 인기 프로그램으로 조기 마감되므로 사전 예약 필수! 초보자도 안전하게 참여 가능합니다.",
      externalQuery: "영덕 퐁당자무질 해녀체험"
    },

    // 4. 사계 플라워 팜 (체험 3)
    "flowerfarm": {
      id: "flowerfarm",
      title: "사계 플라워 팜 (원예 힐링 체험)",
      lat: 36.5290,
      lng: 129.3850,
      category: "원예체험·반려견동반",
      badge: "매일 10:00~16:00 (사전예약)",
      location: "경북 영덕군 영해면 대동로 385",
      desc: "사계절 꽃과 식물이 가득한 감성 원예 체험장 겸 복합 문화 쉼터입니다. 나만의 반려식물 화분 심기, 원예 공예 만들기 체험을 즐길 수 있으며, 반려견 동반도 환영합니다. 영덕 디지털관광주민증 참여업체입니다.",
      tip: "💡 디지털관광주민증 제시 후 체험 참여 시 '향긋한 메리골드 수제 꽃차'를 무료 서비스로 제공합니다.",
      externalQuery: "영덕 사계플라워팜"
    },

    // 5. 상대산 관어대 모노레일 (체험 4)
    "mono": {
      id: "mono",
      title: "상대산 관어대 모노레일",
      lat: 36.5450,
      lng: 129.4230,
      category: "파노라마 전망·모노레일",
      badge: "연중 상시 운행",
      location: "경북 영덕군 영해면 대진리 상대산 일원",
      desc: "등산 부담 없이 최신 모노레일을 타고 상대산 정상(관어대)까지 편안하게 오를 수 있는 영덕의 신규 랜드마크! 정상에 서면 에메랄드빛 동해 바다와 유서 깊은 괴시리 전통마을, 드넓은 영해 평야가 360도 파노라마로 펼쳐집니다.",
      tip: "💡 어르신, 아이 동반 가족 모두 힘들이지 않고 영덕 최고의 절경을 감상할 수 있습니다.",
      externalQuery: "상대산 관어대 모노레일"
    },

    // 6. 벌영리 메타세콰이어 숲길
    "metasequoia": {
      id: "metasequoia",
      title: "벌영리 메타세콰이어 숲길",
      lat: 36.5385,
      lng: 129.3920,
      category: "자연·힐링 숲",
      badge: "연중 상시 (무료 개방)",
      location: "경북 영덕군 영해면 벌영리 산54-1",
      desc: "개인 독림가가 수십 년간 정성껏 가꿔 무료로 개방한 비밀의 숲입니다. 하늘 높이 솟은 메타세콰이어 나무 사이로 맑은 피톤치드를 마시며 평탄한 흙길을 걸을 수 있어 어르신과 유모차 동반 가족에게 최고의 힐링 코스입니다.",
      tip: "💡 경사가 완만하고 입구 주차장이 넓어 사계 플라워 팜과 함께 연계 방문하기 좋습니다.",
      externalQuery: "벌영리 메타세콰이어숲"
    },

    // 7. 창포말등대 & 해맞이공원
    "changpo": {
      id: "changpo",
      title: "창포말등대 & 해맞이공원",
      lat: 36.4262,
      lng: 129.4320,
      category: "경관·블루로드",
      badge: "연중 상시 개방",
      location: "경북 영덕군 영덕읍 영덕대게로 968",
      desc: "거대한 대게 집게다리가 등대를 감싸 쥐고 있는 독창적인 창포말등대와 기암절벽을 따라 조성된 목재 데크 산책로입니다. 영덕 블루로드의 정수로 꼽힙니다.",
      tip: "💡 일출과 일몰 시간대 바다 수평선이 황금빛으로 물드는 뷰포인트입니다.",
      externalQuery: "영덕 창포말등대"
    },

    // 8. 고래불 국민야영장 & 해변
    "goraebul": {
      id: "goraebul",
      title: "고래불 국민야영장 & 해변",
      lat: 36.5820,
      lng: 129.4120,
      category: "캠핑·힐링 페스타",
      badge: "상시 캠핑 / 10월 웰니스페스타",
      location: "경북 영덕군 병곡면 고래불로 68",
      desc: "명사 20리 고래불 해변과 울창한 솔숲 사이에 자리한 영덕 최대 규모의 국민야영장입니다. 솔향기 가득한 산책로와 카라반 존이 조성되어 있으며, 가을에는 '영덕 웰니스페스타'가 열립니다.",
      tip: "💡 솔숲 산책로를 걸으며 파도 소리를 듣는 것만으로도 최고의 힐링이 됩니다.",
      externalQuery: "고래불국민야영장"
    }
  };

  // 코스별 방문 경로 및 순서 정의
  const courseRoutes = {
    // 1코스: 초록 힐링체험 (대게 ➔ 메타세콰이어 ➔ 사계플라워팜 ➔ 관어대 모노레일)
    courseA: {
      title: "1코스 힐링체험",
      color: "#005BAC",
      spots: ["ganggu", "metasequoia", "flowerfarm", "mono"],
      desc: "대게 식사 후 숲 산책, 나만의 화분 심기, 관어대 모노레일로 이어지는 부모님·가족 맞춤 힐링 동선"
    },
    // 2코스: 이색 액티비티 (대게 ➔ 별파랑 짚라인 ➔ 창포말등대 ➔ 퐁당자무질)
    courseB: {
      title: "2코스 이색액티비티",
      color: "#FF5E36",
      spots: ["ganggu", "zipline", "changpo", "pongdang"],
      desc: "742m 짚라인 활강과 현직 해녀와 함께하는 동해 물질 체험 & 바다한상 미식을 엮은 이색 코스"
    },
    // 전체 명소 보기
    allSpots: {
      title: "영덕 8대 추천 스팟",
      color: "#00A896",
      spots: ["ganggu", "zipline", "changpo", "pongdang", "flowerfarm", "metasequoia", "mono", "goraebul"],
      desc: "영덕군 전역의 볼거리·즐길거리·이색체험 8대 핵심 거점"
    }
  };

  // [섹션 3] 위치별 주변 10분 동선 데이터
  const nearbyDataByLocation = {
    ganggu: {
      desc: "강구항 대게 식사 후 바로 떠나기 아쉬울 때 도보 10분 코스!",
      spots: [
        {
          id: "near-1",
          spotKey: "ganggu",
          title: "영덕 해파랑공원 야간산책 & 분수",
          timeBadge: "도보 2분",
          tagBadge: "연중 상시",
          desc: "대게 식사 후 소화 겸 걷기 좋은 해안 야경·분수 명소. 바다 위 거대 대게 조형물과 넓은 잔디광장이 펼쳐집니다.",
          tip: "💡 저녁 8시 경관조명 점등 시 인생샷 명소"
        },
        {
          id: "near-2",
          spotKey: "ganggu",
          title: "영덕 로컬픽 감성 카페 거리",
          timeBadge: "도보 5분",
          tagBadge: "상생쿠폰 적용",
          desc: "영덕 동해 바다가 통창으로 펼쳐지는 로컬 로스터리 카페. 시원한 복숭아 에이드와 커피를 즐겨보세요.",
          tip: "💡 '영덕 나우' 상생 쿠폰 제시 시 음료 10% 즉시 할인"
        }
      ]
    },
    yeonghae: {
      desc: "영해 메타세콰이어 숲과 사계 플라워 팜 주변 10분 힐링 동선!",
      spots: [
        {
          id: "near-3",
          spotKey: "flowerfarm",
          title: "사계 플라워 팜 원예 힐링 체험",
          timeBadge: "차량 4분",
          tagBadge: "디지털주민증 혜택",
          desc: "사계절 꽃이 가득한 감성 정원에서 화분 심기 체험과 향긋한 메리골드 꽃차 시음을 즐겨보세요.",
          tip: "💡 디지털관광주민증 제시 시 메리골드 꽃차 무료 제공"
        },
        {
          id: "near-4",
          spotKey: "metasequoia",
          title: "벌영리 메타세콰이어 숲길 산책",
          timeBadge: "차량 3분",
          tagBadge: "무료 개방",
          desc: "키 큰 메타세콰이어 나무들이 빽빽하게 솟은 비밀의 숲. 평탄한 흙길을 걸으며 피톤치드를 듬뿍 마셔보세요.",
          tip: "💡 넓은 전용 주차장 완비, 어르신 걷기 최적"
        }
      ]
    },
    chuksan: {
      desc: "축산항과 해녀마을 퐁당자무질 주변 동선!",
      spots: [
        {
          id: "near-5",
          spotKey: "pongdang",
          title: "퐁당자무질 해녀 물질 & 바다한상",
          timeBadge: "도보 3분",
          tagBadge: "이색체험 인기",
          desc: "현직 해녀와 함께하는 동해 바다 물질 체험 후 자연산 전복죽과 미역국으로 즐기는 바다 한 상!",
          tip: "💡 사전 예약 필수, 물놀이 복장 준비 권장"
        },
        {
          id: "near-6",
          spotKey: "changpo",
          title: "창포말등대 & 블루로드 해안데크",
          timeBadge: "차량 8분",
          tagBadge: "포토존 명소",
          desc: "대게 다리 등대와 푸른 동해 절벽을 따라 걷는 명품 해안 산책로.",
          tip: "💡 바다 절벽 위 데크길에서 멋진 사진을 남겨보세요"
        }
      ]
    },
    goraebul: {
      desc: "청정 백사장과 고래불 해송 숲 주변 10분 산책 동선!",
      spots: [
        {
          id: "near-7",
          spotKey: "goraebul",
          title: "고래불 국민야영장 솔숲 산책로",
          timeBadge: "도보 3분",
          tagBadge: "힐링 쉼터",
          desc: "수십 년 된 울창한 해송 숲 사이로 조성된 데크길. 바다 바람과 솔향기가 어우러지는 걷기 명소입니다.",
          tip: "💡 웰니스 요가 및 솔숲 물멍 최적 장소"
        },
        {
          id: "near-8",
          spotKey: "mono",
          title: "상대산 관어대 모노레일 전망대",
          timeBadge: "차량 6분",
          tagBadge: "신규 명소",
          desc: "모노레일 타고 상대산 정상까지 편안하게 올라 동해바다와 평야를 360도 감상해보세요.",
          tip: "💡 일몰 시간대 영해 평야 노을이 장관입니다"
        }
      ]
    }
  };

  // [섹션 4] 타깃별 맞춤 코스 카드 데이터 (체험 4선 전면 배치)
  const courseCardData = [
    {
      id: "course-1",
      spotKey: "pongdang",
      title: "퐁당자무질 (영덕 해녀 물질 체험)",
      season: "사전예약제 운영 (시즌 상시)",
      themeClass: "theme-teal",
      icon: "🤿",
      tags: ["experience", "kids"],
      tagLabels: ["#이색체험·액티비티", "#아이동반가족"],
      desc: "제주도 부럽지 않은 영덕 동해 바다 해녀 물질 체험! 현직 해녀 어무이들과 바다에 들어가 물질을 배우고, 직접 채취한 해산물과 자연산 전복죽·돌미역국 '바다 한 상'을 맛보는 영덕 최고 인기 로컬 체험입니다."
    },
    {
      id: "course-2",
      spotKey: "zipline",
      title: "별파랑 짚라인 (풍력발전단지)",
      season: "연중 상시 운행 (기상 시 탄력)",
      themeClass: "theme-blue",
      icon: "🪁",
      tags: ["experience", "kids"],
      tagLabels: ["#이색체험·액티비티", "#아이동반가족"],
      desc: "거대한 24기의 풍력발전기와 쪽빛 바다 사이를 가르는 742m 왕복 짚라인! 성인 15,000원(숙박/디지털주민증 20% 할인)으로 바람의 언덕에서 바다로 날아가는 짜릿한 해방감을 느껴보세요."
    },
    {
      id: "course-3",
      spotKey: "flowerfarm",
      title: "사계 플라워 팜 (원예 힐링 체험)",
      season: "매일 10:00 ~ 16:00 (사전예약)",
      themeClass: "theme-pink",
      icon: "🌸",
      tags: ["experience", "healing", "kids"],
      tagLabels: ["#이색체험·액티비티", "#부모님·중장년힐링", "#아이동반가족"],
      desc: "영해면에 자리한 감성 원예 체험 농장. 나만의 식물 화분 심기 체험과 공예 클래스를 즐길 수 있으며 반려견 동반도 가능합니다. 디지털관광주민증 소지 시 향긋한 메리골드 수제 꽃차가 무료로 제공됩니다."
    },
    {
      id: "course-4",
      spotKey: "mono",
      title: "상대산 관어대 모노레일",
      season: "연중 상시 운행",
      themeClass: "theme-green",
      icon: "🚡",
      tags: ["experience", "healing"],
      tagLabels: ["#이색체험·액티비티", "#부모님·중장년힐링"],
      desc: "등산 부담 없이 최신 모노레일을 타고 상대산 정상(관어대)까지 편안하게 오를 수 있는 영덕의 신규 랜드마크! 동해 바다와 영해 평야, 괴시리 전통마을이 한눈에 담기는 360도 파노라마 절경을 감상하세요."
    },
    {
      id: "course-5",
      spotKey: "metasequoia",
      title: "벌영리 메타세콰이어 숲",
      season: "연중 상시 (무료 개방)",
      themeClass: "theme-coral",
      icon: "🌲",
      tags: ["healing"],
      tagLabels: ["#부모님·중장년힐링"],
      desc: "개인 독림가가 가꿔 무료 개방한 피톤치드 가득한 숲길. 평탄한 흙길로 어르신과 유모차 동반 가족 모두 편안하게 산책할 수 있는 영덕 대표 힐링 코스입니다."
    },
    {
      id: "course-6",
      spotKey: "goraebul",
      title: "고래불 웰니스페스타 & 국민야영장",
      season: "매년 10월 개최 / 상시 캠핑",
      themeClass: "theme-purple",
      icon: "🧘‍♀️",
      tags: ["festival", "healing"],
      tagLabels: ["#시즌한정축제", "#부모님·중장년힐링"],
      desc: "명사 20리 고래불 바다와 해송 숲속에서 요가, 싱잉볼 사운드배스, 한방 웰니스를 즐기는 체류형 치유 축제! 사계절 힐링 솔숲 캠핑 명소로도 손꼽힙니다."
    }
  ];

  // ========================================================
  // 2. DOM ELEMENTS
  // ========================================================
  const locationSelect = document.getElementById('locationSelect');
  const nearbyDesc = document.getElementById('nearbyDesc');
  const nearbyCardsContainer = document.getElementById('nearbyCardsContainer');
  const filterChips = document.querySelectorAll('.filter-chip');
  const courseListContainer = document.getElementById('courseList');
  const routeTabs = document.querySelectorAll('.route-tab');
  const mapStatusPill = document.getElementById('mapStatusPill');

  // Modals & Triggers
  const btnTabogeDetailOpen = document.getElementById('btnTabogeDetailOpen');
  const btnOpenTaxiModal = document.getElementById('btnOpenTaxiModal');
  const modalTaxi = document.getElementById('modalTaxi');

  const btnOpenDigitalPass = document.getElementById('btnOpenDigitalPass');
  const modalDigitalPass = document.getElementById('modalDigitalPass');

  const btnOpenCoupon = document.getElementById('btnOpenCoupon');
  const modalCoupon = document.getElementById('modalCoupon');
  const btnRedeemCoupon = document.getElementById('btnRedeemCoupon');
  const couponStatus = document.getElementById('couponStatus');

  const modalDetail = document.getElementById('modalDetail');
  const detailTitle = document.getElementById('detailTitle');
  const detailBody = document.getElementById('detailBody');
  const btnFocusOnMap = document.getElementById('btnFocusOnMap');
  const btnExternalNavi = document.getElementById('btnExternalNavi');

  const toastMessage = document.getElementById('toastMessage');
  const btnShare = document.getElementById('btnShare');

  let currentActiveSpot = null;

  // ========================================================
  // 3. LEAFLET MAP INITIALIZATION
  // ========================================================
  let map;
  let activeMarkers = [];
  let activePolyline = null;

  function initMap() {
    map = L.map('yeongdeokMap', {
      center: [36.47, 129.41],
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    renderCourseOnMap('courseA');
  }

  // 코스별 경로선 및 마커 렌더링
  function renderCourseOnMap(routeKey) {
    const route = courseRoutes[routeKey] || courseRoutes.courseA;

    activeMarkers.forEach(m => map.removeLayer(m));
    activeMarkers = [];
    if (activePolyline) {
      map.removeLayer(activePolyline);
      activePolyline = null;
    }

    const latLngList = [];

    route.spots.forEach((spotKey, index) => {
      const spot = spotDatabase[spotKey];
      if (!spot) return;

      const latLng = [spot.lat, spot.lng];
      latLngList.push(latLng);

      const customIcon = L.divIcon({
        className: 'custom-map-pin-wrap',
        html: `<div class="custom-map-pin" id="pin-${spot.id}" title="${spot.title}">${index + 1}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker(latLng, { icon: customIcon }).addTo(map);

      const popupContent = `
        <div class="popup-inner-card">
          <strong class="popup-inner-title">${index + 1}. ${spot.title}</strong>
          <span style="font-size: 11px; color: #005BAC; font-weight: 700;">${spot.badge}</span>
          <p class="popup-inner-desc">${spot.desc.slice(0, 50)}...</p>
          <button type="button" class="popup-btn-detail" onclick="window.showSpotDetailFromMap('${spot.id}')">
            상세정보 & 길찾기 보기
          </button>
        </div>
      `;
      marker.bindPopup(popupContent, { maxWidth: 240 });

      marker.on('click', () => {
        highlightPin(spot.id);
      });

      activeMarkers.push(marker);
    });

    if (latLngList.length > 1) {
      activePolyline = L.polyline(latLngList, {
        color: route.color,
        weight: 4.5,
        opacity: 0.85,
        dashArray: '6, 8',
        lineJoin: 'round'
      }).addTo(map);

      map.fitBounds(activePolyline.getBounds(), { padding: [35, 35] });
    }

    mapStatusPill.innerHTML = `<span>🧭 <strong>${route.title}</strong>: ${route.desc}</span>`;
  }

  window.showSpotDetailFromMap = function(spotId) {
    const spot = spotDatabase[spotId];
    if (spot) {
      openDetailModal(spot);
    }
  };

  function highlightPin(spotId) {
    document.querySelectorAll('.custom-map-pin').forEach(pin => pin.classList.remove('pin-active'));
    const targetPin = document.getElementById(`pin-${spotId}`);
    if (targetPin) {
      targetPin.classList.add('pin-active');
    }
  }

  // ========================================================
  // 4. RENDER FUNCTIONS
  // ========================================================

  // [섹션 3] 주변 10분 동선 렌더링
  function renderNearbySpots(locationKey) {
    const data = nearbyDataByLocation[locationKey] || nearbyDataByLocation.ganggu;
    nearbyDesc.textContent = data.desc;

    nearbyCardsContainer.innerHTML = '';
    data.spots.forEach(spot => {
      const card = document.createElement('article');
      card.className = 'nearby-card';
      card.innerHTML = `
        <div class="nearby-card-top">
          <h3 class="nearby-card-title">${spot.title}</h3>
          <div class="nearby-card-badges">
            <span class="badge-walk">${spot.timeBadge}</span>
            <span class="badge-tag">${spot.tagBadge}</span>
          </div>
        </div>
        <p class="nearby-card-desc">${spot.desc}</p>
        <div class="nearby-card-action">
          <span class="action-tip">${spot.tip}</span>
          <button type="button" class="btn-mini-nav" data-spot-key="${spot.spotKey}">
            상세 & 지도보기 ➔
          </button>
        </div>
      `;

      const btnNav = card.querySelector('.btn-mini-nav');
      btnNav.addEventListener('click', () => {
        const fullSpot = spotDatabase[spot.spotKey] || {
          title: spot.title,
          badge: spot.timeBadge + " · " + spot.tagBadge,
          location: "영덕 관내",
          desc: spot.desc,
          tip: spot.tip,
          lat: 36.3601,
          lng: 129.3902,
          externalQuery: spot.title
        };
        openDetailModal(fullSpot);
      });

      nearbyCardsContainer.appendChild(card);
    });
  }

  // [섹션 4] 코스 리스트 렌더링 (필터 적용)
  function renderCourses(activeFilter = 'all') {
    courseListContainer.innerHTML = '';

    const filtered = activeFilter === 'all'
      ? courseCardData
      : courseCardData.filter(item => item.tags.includes(activeFilter));

    if (filtered.length === 0) {
      courseListContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; background: #fff; border-radius: 18px; border: 1.5px dashed #cbd5e1;">
          <p style="font-size: 30px; margin-bottom: 8px;">🔍</p>
          <strong style="color: #1e293b; font-size: 16px;">해당 테마의 코스를 준비 중입니다</strong>
          <p style="font-size: 13.5px; color: #64748b; margin-top: 4px;">다른 테마를 선택해보세요!</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const fullSpot = spotDatabase[item.spotKey] || {};
      const card = document.createElement('article');
      card.className = 'course-card';
      card.innerHTML = `
        <div class="card-banner ${item.themeClass}">
          <div class="banner-overlay"></div>
          <div class="banner-content">
            <span class="banner-icon">${item.icon}</span>
            <span class="banner-season">${item.season}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="card-title-row">
            <h3 class="card-title">${item.title}</h3>
            <span class="card-location">📍 ${fullSpot.location ? fullSpot.location.split(' ')[2] : '영덕'}</span>
          </div>
          <div class="card-tags">
            ${item.tagLabels.map(tag => `<span class="tag-badge accent">${tag}</span>`).join('')}
          </div>
          <p class="card-desc">${item.desc}</p>
          <div class="card-footer">
            <button type="button" class="btn-card-map" data-spot-key="${item.spotKey}">
              🗺️ 지도에서 위치보기
            </button>
            <button type="button" class="btn-card-detail" data-spot-key="${item.spotKey}">
              상세소개 보기 <span style="font-size: 12px;">→</span>
            </button>
          </div>
        </div>
      `;

      const btnMap = card.querySelector('.btn-card-map');
      btnMap.addEventListener('click', () => {
        focusSpotOnMap(item.spotKey);
      });

      const btnDetail = card.querySelector('.btn-card-detail');
      btnDetail.addEventListener('click', () => {
        openDetailModal(fullSpot);
      });

      courseListContainer.appendChild(card);
    });
  }

  // ========================================================
  // 5. EVENT LISTENERS
  // ========================================================

  routeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      routeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const routeKey = tab.getAttribute('data-route');
      renderCourseOnMap(routeKey);

      showToast(`🧭 [${tab.querySelector('strong').textContent}] 경로로 지도가 전환되었습니다.`);
    });
  });

  locationSelect.addEventListener('change', (e) => {
    const selectedKey = e.target.value;
    renderNearbySpots(selectedKey);
    const selectedText = e.target.options[e.target.selectedIndex].text.replace('📍 ', '');
    showToast(`📍 [${selectedText}] 기준 추천 스팟으로 변경되었습니다.`);

    if (selectedKey === 'ganggu') focusSpotOnMap('ganggu');
    else if (selectedKey === 'yeonghae') focusSpotOnMap('flowerfarm');
    else if (selectedKey === 'chuksan') focusSpotOnMap('pongdang');
    else if (selectedKey === 'goraebul') focusSpotOnMap('goraebul');
  });

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filterValue = chip.getAttribute('data-filter');
      renderCourses(filterValue);
    });
  });

  // ========================================================
  // 6. MODAL & MAP FOCUS ACTIONS
  // ========================================================

  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.btn-close-modal') || e.target.closest('.btn-close-modal-footer')) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => closeModal(modal));
    }
  });

  // 타보게 버튼들 연동
  if (btnTabogeDetailOpen) {
    btnTabogeDetailOpen.addEventListener('click', () => openModal(modalTaxi));
  }
  btnOpenTaxiModal.addEventListener('click', () => openModal(modalTaxi));

  btnOpenDigitalPass.addEventListener('click', () => openModal(modalDigitalPass));
  btnOpenCoupon.addEventListener('click', () => openModal(modalCoupon));

  // 상세 모달 열기
  function openDetailModal(spot) {
    if (!spot) return;
    currentActiveSpot = spot;

    detailTitle.textContent = spot.title;
    detailBody.innerHTML = `
      <div class="modal-callout">
        <strong>${spot.badge || '영덕 대표 추천 명소'}</strong>
        <p style="margin-top: 4px;">📍 위치: ${spot.location || '영덕 관내'}</p>
      </div>
      <div>
        <h4 style="font-size: 15px; font-weight: 800; color: #111827; margin-bottom: 6px;">스팟 상세 소개</h4>
        <p style="font-size: 14.5px; color: #374151; line-height: 1.6;">${spot.desc}</p>
      </div>
      <div style="background: #FFF7ED; border: 1.5px solid #FFEDD5; padding: 14px; border-radius: 12px;">
        <span style="font-size: 13px; font-weight: 800; color: #C2410C;">💡 추천 방문 팁 & 혜택</span>
        <p style="font-size: 14px; color: #7C2D12; margin-top: 4px; line-height: 1.5;">${spot.tip || '편안한 복장으로 방문하시는 것을 추천합니다.'}</p>
      </div>
    `;

    btnFocusOnMap.onclick = () => {
      closeModal(modalDetail);
      focusSpotOnMap(spot.id);
    };

    btnExternalNavi.onclick = () => {
      const query = encodeURIComponent(spot.externalQuery || spot.title);
      const kakaoMapUrl = `https://map.kakao.com/link/search/${query}`;
      window.open(kakaoMapUrl, '_blank');
      showToast(`'${spot.title}' 카카오맵 검색 화면으로 연결합니다.`);
    };

    openModal(modalDetail);
  }

  // 지도를 해당 장소로 스크롤 & 확대 포커스
  function focusSpotOnMap(spotId) {
    const spot = spotDatabase[spotId];
    if (!spot) return;

    const mapElement = document.getElementById('yeongdeokMap');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    setTimeout(() => {
      map.flyTo([spot.lat, spot.lng], 13, {
        animate: true,
        duration: 1.2
      });

      highlightPin(spot.id);

      activeMarkers.forEach(m => {
        const mLatLng = m.getLatLng();
        if (Math.abs(mLatLng.lat - spot.lat) < 0.001 && Math.abs(mLatLng.lng - spot.lng) < 0.001) {
          m.openPopup();
        }
      });
    }, 400);

    showToast(`🗺️ 지도에서 '${spot.title}' 위치를 표시합니다.`);
  }

  // 쿠폰 사용 시뮬레이션
  let isCouponUsed = false;
  btnRedeemCoupon.addEventListener('click', () => {
    if (!isCouponUsed) {
      isCouponUsed = true;
      couponStatus.innerHTML = `<span class="status-badge used">사용 완료 (10% 할인 적용됨)</span>`;
      btnRedeemCoupon.textContent = '🔄 쿠폰 상태 초기화 (테스트용)';
      btnRedeemCoupon.style.background = '#FEE2E2';
      btnRedeemCoupon.style.borderColor = '#FCA5A5';
      btnRedeemCoupon.style.color = '#B91C1C';
      showToast('🎉 매장 10% 할인이 정상 적용되었습니다!');
    } else {
      isCouponUsed = false;
      couponStatus.innerHTML = `<span class="status-badge valid">사용 가능</span>`;
      btnRedeemCoupon.textContent = '[매장 직원 확인] 터치하여 사용 처리';
      btnRedeemCoupon.style.background = '';
      btnRedeemCoupon.style.borderColor = '';
      btnRedeemCoupon.style.color = '';
      showToast('쿠폰 상태가 사용 가능으로 복구되었습니다.');
    }
  });

  // 공유 버튼
  btnShare.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({
        title: '영덕 나우 | 실시간 코스 지도 & 이색체험 가이드',
        text: '앱 설치 없이 QR로 바로 보는 영덕 여행 코스 지도, 이색체험, 타보게 관광택시!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('🔗 영덕 나우 링크가 클립보드에 복사되었습니다.');
      }).catch(() => {
        showToast('영덕 나우 서비스를 방문해주셔서 감사합니다.');
      });
    }
  });

  function showToast(msg) {
    clearTimeout(toastTimeout);
    toastMessage.textContent = msg;
    toastMessage.classList.add('active');
    toastTimeout = setTimeout(() => {
      toastMessage.classList.remove('active');
    }, 2400);
  }

  // ========================================================
  // 7. INITIALIZATION
  // ========================================================
  initMap();
  renderNearbySpots('ganggu');
  renderCourses('all');

});
