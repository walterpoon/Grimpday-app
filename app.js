const {
  useState,
  useEffect
} = React;

// ==========================================
// 🔧 Google Sheets API 設定區 
// ==========================================

const parseBoolean = val => {
  if (!val) return false;
  return ['true', 'yes', 'y', '1', '是', 'v', 'ok'].includes(String(val).toLowerCase().trim());
};
const parsePassengers = val => val ? String(val).split(',').map(s => s.trim()).filter(Boolean) : [];
const emptyAppData = () => ({
  roster: [],
  flights: [],
  cars: [],
  schedule: [],
  equipment: [],
  docs: [],
  hotel: [],
  maps: []
});
const mockAppData = {
  ...emptyAppData(),
  roster: [{
    role: '領隊',
    name: '預覽隊員 A',
    idp: true,
    luggageCount: '1'
  }, {
    role: '隊員',
    name: '預覽隊員 B',
    idp: false,
    luggageCount: '2'
  }],
  flights: [{
    type: '去程',
    date: '2026-06-08',
    flightNo: 'MOCK001',
    status: '本地預覽資料',
    passengers: ['預覽隊員 A', '預覽隊員 B']
  }],
  schedule: [{
    day: '08/06/2026',
    desc: '到步',
    time: '',
    location: '',
    note: '酒店 Chk in'
  }, {
    day: '09/06/2026',
    desc: '休息, 適應時差, 裝備分配',
    time: '',
    location: '',
    note: '確認所有器材完整'
  }, {
    day: '10/06/2026',
    desc: '報到',
    time: '0800',
    location: '大會集合點',
    note: '報到及取紀念品'
  }, {
    day: '',
    desc: '贊助商器材展示',
    time: '0800-1730',
    location: '大會集合點',
    note: ''
  }, {
    day: '',
    desc: '開幕典禮',
    time: '1800',
    location: '大會集合點',
    note: ''
  }, {
    day: '',
    desc: '領隊會議',
    time: '1900',
    location: '大會集合點',
    note: ''
  }, {
    day: '',
    desc: '晚餐',
    time: '2000',
    location: '大會集合點',
    note: ''
  }, {
    day: '11/06/2026',
    desc: '到達比賽場地',
    time: '0730',
    location: 'Namur',
    note: ''
  }, {
    day: '',
    desc: '第一日比賽 (4個場景)',
    time: '0800-1800',
    location: 'Namur',
    note: ''
  }, {
    day: '',
    desc: '晚餐',
    time: '1930',
    location: '大會集合點',
    note: ''
  }, {
    day: '',
    desc: '領隊會議',
    time: '2100',
    location: '大會集合點',
    note: ''
  }, {
    day: '12/06/2026',
    desc: '到達比賽場地',
    time: '0730',
    location: 'Namur',
    note: ''
  }, {
    day: '',
    desc: '第二日比賽 (4個場景)',
    time: '0800-1800',
    location: 'Namur',
    note: ''
  }, {
    day: '',
    desc: '晚餐',
    time: '1930',
    location: '大會集合點',
    note: ''
  }, {
    day: '',
    desc: '領隊會議',
    time: '2100',
    location: '大會集合點',
    note: ''
  }, {
    day: '13/06/2026',
    desc: '到達比賽場地',
    time: '0730',
    location: 'Namur',
    note: ''
  }, {
    day: '',
    desc: '第三日比賽 (4個場景)',
    time: '0800-1800',
    location: 'Namur',
    note: ''
  }, {
    day: '',
    desc: '晚餐 + Live Band',
    time: '1900-2200',
    location: '大會集合點',
    note: ''
  }]
};
const Header = ({
  title,
  onBack
}) => /*#__PURE__*/React.createElement("div", {
  className: "sticky top-0 z-50 bg-white border-b border-gray-200 p-4 flex items-center shadow-sm"
}, onBack && /*#__PURE__*/React.createElement("button", {
  onClick: onBack,
  className: "min-h-[44px] min-w-[44px] bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center mr-4 active:bg-gray-100 transition-colors shadow-sm"
}, /*#__PURE__*/React.createElement("i", {
  className: "fa-solid fa-arrow-left text-gray-600 text-xl"
})), /*#__PURE__*/React.createElement("h1", {
  className: "text-xl font-bold text-gray-800 flex-1 leading-tight"
}, title));
function GrimpdayApp() {
  const [currentView, setCurrentView] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [appData, setAppData] = useState(emptyAppData());
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);
  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);
        const isMockMode = new URLSearchParams(window.location.search).get('mock') === '1';
        if (isMockMode) {
          setAppData(mockAppData);
          return;
        }
        const response = await fetch('/.netlify/functions/sheet-data');
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const message = errorData?.error || '無法讀取後勤資料，請稍後再試';
          throw new Error(message);
        }
        const data = await response.json();
        setAppData({
          roster: data.roster || [],
          flights: data.flights || [],
          cars: data.cars || [],
          schedule: data.schedule || [],
          equipment: data.equipment || [],
          docs: data.docs || [],
          hotel: data.hotel || [],
          maps: data.maps || []
        });
      } catch (err) {
        setErrorMsg(err.message || '讀取資料時發生錯誤');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSheetData();
  }, []);
  if (isLoading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen bg-[#eef2f5] text-gray-800 flex flex-col items-center justify-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-spinner fa-spin text-5xl text-gray-400 mb-4"
    }), /*#__PURE__*/React.createElement("h2", {
      className: "text-xl font-bold"
    }, "同步指揮中心資料..."));
  }

  // ================= 1. 首頁模組 =================
  const HomeView = () => {
    // 圖片設定：把圖片放在 Netlify 發佈目錄內，然後在這裡改路徑即可。
    // 例如：/assets/msar-logo.png
    const LOGO_SRC = './assets/msar-logo.png';
    const [weather, setWeather] = useState({
      temp: '--',
      high: '--',
      low: '--',
      humidity: '--',
      wind: '--',
      windText: '',
      code: null,
      forecast: [],
      loading: true
    });
    const [now, setNow] = useState(new Date());
    useEffect(() => {
      const timer = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);
    useEffect(() => {
      fetch('https://api.open-meteo.com/v1/forecast?latitude=50.4669&longitude=4.8675&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBrussels').then(res => res.json()).then(data => {
        const current = data.current || {};
        const daily = data.daily || {};
        const forecastDays = (daily.time || []).slice(0, 3).map((date, idx) => {
          const maxValue = (daily.temperature_2m_max || [])[idx];
          const minValue = (daily.temperature_2m_min || [])[idx];
          return {
            day: getForecastLabel(date),
            max: maxValue !== undefined ? Math.round(maxValue) : '--',
            min: minValue !== undefined ? Math.round(minValue) : '--'
          };
        });
        setWeather({
          temp: Math.round(current.temperature_2m),
          high: Math.round((daily.temperature_2m_max || [])[0]),
          low: Math.round((daily.temperature_2m_min || [])[0]),
          humidity: Math.round(current.relative_humidity_2m),
          wind: Math.round(current.wind_speed_10m),
          windText: getWindDirectionText(current.wind_direction_10m),
          code: current.weather_code,
          forecast: forecastDays,
          loading: false
        });
      }).catch(() => setWeather({
        temp: '--',
        high: '--',
        low: '--',
        humidity: '--',
        wind: '--',
        windText: '',
        code: null,
        forecast: [],
        loading: false
      }));
    }, []);
    const getTimeParts = (date, timeZone) => {
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).formatToParts(date).reduce((acc, part) => {
        acc[part.type] = part.value;
        return acc;
      }, {});
      return {
        hour: Number(parts.hour || 0),
        minute: Number(parts.minute || 0),
        second: Number(parts.second || 0),
        digital: `${parts.hour}:${parts.minute}:${parts.second}`
      };
    };
    const getDateText = (date, timeZone) => new Intl.DateTimeFormat('zh-HK', {
      timeZone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    }).format(date);
    const getForecastLabel = dateString => new Intl.DateTimeFormat('zh-HK', {
      weekday: 'short'
    }).format(new Date(dateString));
    const getWeatherIcon = code => {
      if (code === 0) return {
        icon: 'fa-sun',
        iconColor: '#D97706',
        cardBg: '#FEF3C7',
        borderColor: '#FDE68A',
        badgeBg: '#FDE68A'
      };
      if ([1, 2].includes(code)) return {
        icon: 'fa-cloud-sun',
        iconColor: '#B45309',
        cardBg: '#FEF3C7',
        borderColor: '#FDE68A',
        badgeBg: '#FDE68A'
      };
      if (code === 3) return {
        icon: 'fa-cloud',
        iconColor: '#334155',
        cardBg: '#E2E8F0',
        borderColor: '#CBD5E1',
        badgeBg: '#E2E8F0'
      };
      if ([45, 48].includes(code)) return {
        icon: 'fa-smog',
        iconColor: '#475569',
        cardBg: '#E2E8F0',
        borderColor: '#CBD5E1',
        badgeBg: '#E2E8F0'
      };
      if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return {
        icon: 'fa-cloud-rain',
        iconColor: '#2563EB',
        cardBg: '#DBEAFE',
        borderColor: '#BFDBFE',
        badgeBg: '#DBEAFE'
      };
      if ([71, 73, 75, 77, 85, 86].includes(code)) return {
        icon: 'fa-snowflake',
        iconColor: '#0284C7',
        cardBg: '#E0F2FE',
        borderColor: '#BAE6FD',
        badgeBg: '#E0F2FE'
      };
      if ([95, 96, 99].includes(code)) return {
        icon: 'fa-bolt',
        iconColor: '#B45309',
        cardBg: '#FEF3C7',
        borderColor: '#FDE68A',
        badgeBg: '#FDE68A'
      };
      return {
        icon: 'fa-cloud-sun',
        iconColor: '#334155',
        cardBg: '#E2E8F0',
        borderColor: '#CBD5E1',
        badgeBg: '#E2E8F0'
      };
    };
    const getWindDirectionText = degree => {
      if (degree === undefined || degree === null || Number.isNaN(Number(degree))) return '';
      const dirs = ['北風', '東北風', '東風', '東南風', '南風', '西南風', '西風', '西北風'];
      return dirs[Math.round(Number(degree) / 45) % 8];
    };
    const getWeatherText = code => {
      if (code === 0) return '晴朗';
      if ([1, 2].includes(code)) return '多雲間晴';
      if (code === 3) return '多雲';
      if ([45, 48].includes(code)) return '有霧';
      if ([51, 53, 55, 56, 57].includes(code)) return '毛毛雨';
      if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return '有雨';
      if ([71, 73, 75, 77, 85, 86].includes(code)) return '有雪';
      if ([95, 96, 99].includes(code)) return '雷暴';
      return '天氣資料';
    };
    const hkTime = getTimeParts(now, 'Asia/Hong_Kong');
    const beTime = getTimeParts(now, 'Europe/Brussels');
    const ClockCard = ({
      title,
      subtitle,
      flag,
      time,
      dateText,
      dark
    }) => {
      const hourAngle = time.hour % 12 * 30 + time.minute * 0.5;
      const minuteAngle = time.minute * 6 + time.second * 0.1;
      const secondAngle = time.second * 6;
      const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      return /*#__PURE__*/React.createElement("div", {
        className: `home-clock-card p-2 ${dark ? 'bg-[#071b31] text-white' : 'bg-[#fbf7ef] text-[#10233c]'}`
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2 mb-2 min-h-[42px]"
      }, /*#__PURE__*/React.createElement("div", {
        className: `w-9 h-9 rounded-full flex items-center justify-center text-xl shadow-md border-2 ${dark ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'}`
      }, flag), /*#__PURE__*/React.createElement("div", {
        className: "min-w-0"
      }, /*#__PURE__*/React.createElement("div", {
        className: `text-lg font-black leading-tight ${dark ? 'text-white' : 'text-[#10233c]'}`
      }, title), /*#__PURE__*/React.createElement("div", {
        className: `text-xs font-semibold ${dark ? 'text-slate-300' : 'text-slate-600'}`
      }, subtitle))), /*#__PURE__*/React.createElement("div", {
        className: `clock-face ${dark ? 'bg-[#0b2038]' : 'bg-white'}`
      }, [...Array(60)].map((_, i) => {
        const angle = (i * 6 - 90) * Math.PI / 180;
        const radius = i % 5 === 0 ? 44 : 46;
        return /*#__PURE__*/React.createElement("span", {
          key: i,
          className: `clock-tick ${dark ? 'bg-slate-100' : 'bg-slate-500'}`,
          style: {
            left: `${50 + Math.cos(angle) * radius}%`,
            top: `${50 + Math.sin(angle) * radius}%`,
            transform: `translate(-50%, -50%) rotate(${i * 6}deg)`,
            height: i % 5 === 0 ? '7px' : '4px',
            width: i % 5 === 0 ? '2px' : '1px',
            opacity: i % 5 === 0 ? 0.9 : 0.55
          }
        });
      }), numbers.map((num, idx) => {
        const angle = (idx * 30 - 90) * Math.PI / 180;
        const radius = 34;
        return /*#__PURE__*/React.createElement("span", {
          key: num,
          className: `clock-number ${dark ? 'text-white' : 'text-[#10233c]'}`,
          style: {
            left: `${50 + Math.cos(angle) * radius}%`,
            top: `${50 + Math.sin(angle) * radius}%`
          }
        }, num);
      }), /*#__PURE__*/React.createElement("span", {
        className: `clock-hand clock-hour ${dark ? 'bg-white' : 'bg-black'}`,
        style: {
          transform: `rotate(${hourAngle}deg)`,
          zIndex: 5
        }
      }), /*#__PURE__*/React.createElement("span", {
        className: `clock-hand clock-minute ${dark ? 'bg-white' : 'bg-black'}`,
        style: {
          transform: `rotate(${minuteAngle}deg)`,
          zIndex: 6
        }
      }), /*#__PURE__*/React.createElement("span", {
        className: "clock-hand clock-second bg-red-500",
        style: {
          transform: `rotate(${secondAngle}deg)`,
          zIndex: 7
        }
      }), /*#__PURE__*/React.createElement("span", {
        className: `clock-dot ${dark ? 'bg-white' : 'bg-black'}`
      })), /*#__PURE__*/React.createElement("div", {
        className: `text-center mt-2 text-xl font-black tracking-wider ${dark ? 'text-white' : 'text-[#10233c]'}`
      }, time.digital), /*#__PURE__*/React.createElement("div", {
        className: `text-center mt-0.5 text-[10px] font-bold ${dark ? 'text-slate-300' : 'text-slate-500'}`
      }, dateText));
    };
    const MenuButton = ({
      id,
      title,
      icon,
      color,
      onClick
    }) => /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onClick || (() => setCurrentView(id)),
      className: "bg-white rounded-2xl min-h-[68px] p-2 flex flex-col items-center justify-center gap-1 shadow-[0_10px_20px_rgba(15,23,42,0.07)] border border-slate-100 active:scale-95 transition-transform"
    }, /*#__PURE__*/React.createElement("i", {
      className: `fa-solid ${icon} text-2xl ${color}`
    }), /*#__PURE__*/React.createElement("span", {
      className: "text-[18px] font-black text-[#10233c] leading-tight"
    }, title));
    const menuItems = [{
      id: 'roster',
      title: '隊員名單',
      icon: 'fa-user-group',
      color: 'text-blue-600'
    }, {
      id: 'transport',
      title: '航班資料',
      icon: 'fa-plane',
      color: 'text-green-600'
    }, {
      id: 'transport',
      title: '交通安排',
      icon: 'fa-car',
      color: 'text-orange-500'
    }, {
      id: 'schedule',
      title: '行程時間表',
      icon: 'fa-calendar-days',
      color: 'text-purple-600'
    }, {
      id: 'equipment',
      title: '裝備清單',
      icon: 'fa-suitcase-rolling',
      color: 'text-red-600'
    }, {
      id: 'docs',
      title: '重要文件',
      icon: 'fa-file-lines',
      color: 'text-teal-600'
    }, {
      id: 'hotel',
      title: '酒店資訊',
      icon: 'fa-building',
      color: 'text-blue-700'
    }, {
      id: 'maps',
      title: '導航資訊',
      icon: 'fa-map-location-dot',
      color: 'text-emerald-600'
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "pb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg-white/95 sticky top-0 z-50 shadow-sm border-b border-slate-200"
    }, /*#__PURE__*/React.createElement("div", {
      className: "px-4 py-2.5 flex items-center justify-between gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3 min-w-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm overflow-hidden shrink-0 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement("img", {
      src: LOGO_SRC,
      alt: "MSaR logo",
      className: "w-full h-full object-contain p-1",
      onError: e => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.parentElement.innerHTML = '<i class="fa-solid fa-mountain text-2xl text-slate-700"></i>';
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "text-[22px] leading-6 font-black text-[#080c2b] tracking-tight truncate"
    }, "MSaR Grimpday 2026"), /*#__PURE__*/React.createElement("div", {
      className: "text-[20px] leading-6 font-black text-slate-500"
    }, "後勤中心"))), /*#__PURE__*/React.createElement("i", {
      className: "fa-regular fa-bell text-2xl text-slate-500 shrink-0"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "px-3 pt-3 space-y-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 sm:grid-cols-4 gap-2"
    }, menuItems.map((item, index) => /*#__PURE__*/React.createElement(MenuButton, {
      key: `${item.title}-${index}`,
      id: item.id,
      title: item.title,
      icon: item.icon,
      color: item.color
    }))), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-3 items-stretch"
    }, /*#__PURE__*/React.createElement(ClockCard, {
      title: "香港時間",
      subtitle: "Hong Kong",
      flag: "🇭🇰",
      time: hkTime,
      dateText: getDateText(now, 'Asia/Hong_Kong'),
      dark: true
    }), /*#__PURE__*/React.createElement(ClockCard, {
      title: "比利時時間",
      subtitle: "Brussels",
      flag: "🇧🇪",
      time: beTime,
      dateText: getDateText(now, 'Europe/Brussels'),
      dark: false
    })), /*#__PURE__*/React.createElement("div", {
      className: "bg-white rounded-2xl p-3 shadow-[0_12px_28px_rgba(15,23,42,0.08)] border border-slate-100 min-h-[236px]"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-16 h-14 relative shrink-0 flex items-center justify-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-sun text-yellow-400 text-3xl absolute top-1 left-2"
    }), /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-cloud text-slate-200 text-4xl absolute bottom-1 left-1 drop-shadow-md"
    })), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-black text-[#10233c]"
    }, "比利時・納慕爾 (Namur)"), /*#__PURE__*/React.createElement("div", {
      className: "mt-1 flex items-end gap-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-3xl leading-none font-black text-[#10233c]"
    }, weather.loading ? '--' : weather.temp, "°C")), /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-bold text-slate-500 mt-1"
    }, weather.loading ? '讀取天氣中' : getWeatherText(weather.code)))), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-1 mt-3 pt-3 border-t border-slate-100 text-center"
    }, /*#__PURE__*/React.createElement("div", {
      className: "border-r border-slate-100 px-2 py-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-black text-[#10233c]"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-temperature-half text-slate-500 mr-1"
    }), weather.high, "° / ", weather.low, "°"), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] font-bold text-slate-500 mt-1"
    }, "最高 / 最低")), /*#__PURE__*/React.createElement("div", {
      className: "border-r border-slate-100 px-2 py-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-black text-[#10233c]"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-droplet text-blue-500 mr-1"
    }), weather.humidity, "%"), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] font-bold text-slate-500 mt-1"
    }, "濕度")), /*#__PURE__*/React.createElement("div", {
      className: "px-2 py-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-black text-[#10233c]"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-wind text-slate-500 mr-1"
    }), weather.wind, " km/h"), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] font-bold text-slate-500 mt-1"
    }, weather.windText || '風速'))), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-3 gap-1 mt-2 text-slate-600"
    }, weather.forecast.map((item, idx) => {
      const iconInfo = getWeatherIcon(item.code);
      return /*#__PURE__*/React.createElement("div", {
        key: idx,
        className: "rounded-2xl border p-2 flex flex-col items-center gap-1",
        style: {
          backgroundColor: iconInfo.cardBg,
          borderColor: iconInfo.borderColor
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "w-9 h-9 rounded-full flex items-center justify-center shadow-sm",
        style: {
          backgroundColor: iconInfo.badgeBg
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: `fa-solid ${iconInfo.icon} text-base`,
        style: {
          color: iconInfo.iconColor
        }
      })), /*#__PURE__*/React.createElement("div", {
        className: "text-[12px] sm:text-sm font-black uppercase tracking-[0.16em] text-slate-600"
      }, item.day), /*#__PURE__*/React.createElement("div", {
        className: "text-sm sm:text-base font-black text-[#10233c] leading-tight"
      }, item.max, "° / ", item.min, "°"));
    })), /*#__PURE__*/React.createElement("div", {
      className: "text-right text-xs font-bold text-slate-500 mt-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-rotate mr-2"
    }), "更新時間：", getDateText(now, 'Europe/Brussels'), " ", beTime.digital)), errorMsg && /*#__PURE__*/React.createElement("div", {
      className: "bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-center text-sm font-bold"
    }, "⚠️ ", errorMsg)));
  };

  // ================= 2. 團隊名單模組 =================
  const RosterView = () => /*#__PURE__*/React.createElement("div", {
    className: "pb-10"
  }, /*#__PURE__*/React.createElement(Header, {
    title: "👥 隊友名單",
    onBack: () => setCurrentView('home')
  }), /*#__PURE__*/React.createElement("div", {
    className: "px-4 space-y-4 mt-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-users text-[#ffb300] text-2xl"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-lg font-bold text-gray-800"
  }, "全隊總人數")), /*#__PURE__*/React.createElement("div", {
    className: "bg-[#ffb300] text-white px-4 py-1 rounded-lg font-black text-xl shadow-sm"
  }, appData.roster.length, " 人")), appData.roster.map((person, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "bg-white rounded-xl p-5 flex flex-col gap-3 shadow-sm border border-gray-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-end border-b border-gray-100 pb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-black text-gray-800"
  }, person.name), /*#__PURE__*/React.createElement("span", {
    className: "text-[#ffb300] font-bold text-sm bg-yellow-50 px-2 py-1 rounded"
  }, person.role)), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center gap-3 pt-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 text-gray-600 font-medium"
  }, /*#__PURE__*/React.createElement("span", null, "國際車牌:"), person.idp ? /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check text-[#43a047] text-lg"
  }) : /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-xmark text-red-500 text-lg"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-sm bg-orange-50 px-3 py-2 rounded-lg border border-orange-100 text-gray-700 font-bold"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-suitcase-rolling text-[#f4511e]"
  }), /*#__PURE__*/React.createElement("span", null, "23KG 行李: ", person.luggageCount || 0)))))));

  // ================= 3. 航班交通模組 =================
  const TransportView = () => /*#__PURE__*/React.createElement("div", {
    className: "pb-10"
  }, /*#__PURE__*/React.createElement(Header, {
    title: "✈️ 航班及車輛",
    onBack: () => setCurrentView('home')
  }), /*#__PURE__*/React.createElement("div", {
    className: "px-4 space-y-6 mt-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-xl p-5 shadow-sm border border-gray-100"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-black text-[#f4511e] mb-4 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plane"
  }), " 航班資訊"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, appData.flights.map((flight, idx) => {
    const cleanFlightNo = flight.flightNo ? flight.flightNo.replace(/\s+/g, '') : '';
    const googleSearchUrl = `https://www.google.com/search?q=${cleanFlightNo}+flight+status`;
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "bg-gray-50 p-4 rounded-xl border border-gray-100 relative"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-slate-800 text-sm sm:text-base font-bold mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-base sm:text-lg font-extrabold text-slate-900"
    }, flight.type, " | ", flight.date), flight.status && /*#__PURE__*/React.createElement("span", {
      className: "text-[#c2410c] bg-orange-50 px-2 py-1 rounded border border-orange-100 text-sm"
    }, "備註: ", flight.status)), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col mb-3 pb-3 border-b border-gray-200"
    }, /*#__PURE__*/React.createElement("a", {
      href: googleSearchUrl,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "inline-flex flex-col sm:flex-row items-start sm:items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm hover:border-[#f4511e] hover:bg-[#fff4eb] hover:text-[#c2410c] transition-all"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-2xl sm:text-3xl font-black leading-none"
    }, flight.flightNo), /*#__PURE__*/React.createElement("span", {
      className: "text-sm sm:text-base font-bold uppercase tracking-[0.18em] text-slate-700 sm:ml-2"
    }, "點我查航班狀態"), /*#__PURE__*/React.createElement("i", {
      className: "fa-brands fa-google text-lg text-slate-500 sm:ml-auto"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-base sm:text-lg font-black text-gray-700 leading-relaxed break-words"
    }, flight.passengers.join(', '))));
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-black text-gray-800 mt-8 mb-4 px-1"
  }, "🚗 車輛分配 (共 ", appData.cars.length, " 部)"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, appData.cars.map((car, idx) => {
    const rentalDocUrl = car.rentalDocUrl && String(car.rentalDocUrl).startsWith('http') ? car.rentalDocUrl : '#';
    const hasRentalDoc = rentalDocUrl !== '#';
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "bg-white border border-gray-100 shadow-sm rounded-xl p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-3xl sm:text-4xl font-black text-slate-900"
    }, car.id), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => hasRentalDoc ? window.open(rentalDocUrl, '_blank', 'noopener,noreferrer') : alert('請在 Google Sheet 的 Cars 分頁填寫租車文件連結'),
      className: `text-sm px-3 py-2 rounded-lg border flex items-center gap-1 font-black transition-colors active:scale-95 ${hasRentalDoc ? 'bg-orange-50 border-orange-100 text-[#f4511e]' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}`
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-file-lines"
    }), "租車文件")), /*#__PURE__*/React.createElement("div", {
      className: "text-sm sm:text-base text-gray-500 font-medium mt-1 border-b border-gray-100 pb-2 mb-2"
    }, car.usage), /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-users text-gray-400 mt-0.5 text-base"
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-sm sm:text-base font-black text-gray-700 break-words"
    }, car.passengers.join(', ')), /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-gray-400 mt-1"
    }, car.passengers.length, " 人"))));
  }))));

  // ================= 4. 每日行程模組 =================
  const ScheduleView = () => {
    const scheduleRows = appData.schedule.filter(item => item.day || item.time || item.location || item.desc || item.note);
    const scheduleDays = scheduleRows.reduce((days, item, rowIndex) => {
      const hasNewDay = item.day && String(item.day).trim();
      let currentDay = days[days.length - 1];
      if (hasNewDay || !currentDay) {
        currentDay = {
          day: hasNewDay ? String(item.day).trim() : '未定日期',
          activities: []
        };
        days.push(currentDay);
      }
      if (item.time || item.location || item.desc || item.note) {
        currentDay.activities.push({
          time: item.time,
          location: item.location,
          desc: item.desc,
          note: item.note,
          rowIndex
        });
      }
      return days;
    }, []);
    const getDayText = dayGroup => [dayGroup.day, ...dayGroup.activities.map(activity => `${activity.time || ''} ${activity.location || ''} ${activity.desc || ''} ${activity.note || ''}`)].join(' ');
    const getScheduleStyle = dayGroup => {
      const text = getDayText(dayGroup);
      const lowerText = text.toLowerCase();
      if (text.includes('比賽')) {
        return {
          label: '比賽日',
          icon: 'fa-flag-checkered',
          dot: 'bg-[#00acc1] ring-[#b2ebf2]',
          badge: 'bg-[#e0f7fa] text-[#007c89] border-[#80deea]',
          card: 'border-[#80deea] shadow-[0_14px_30px_rgba(0,172,193,0.12)]'
        };
      }
      if (text.includes('起飛') || text.includes('航班') || text.includes('抵達') || text.includes('到步') || text.includes('交通')) {
        return {
          label: '交通',
          icon: 'fa-plane-departure',
          dot: 'bg-[#f4511e] ring-[#ffccbc]',
          badge: 'bg-[#fff3e0] text-[#bf360c] border-[#ffcc80]',
          card: 'border-[#ffcc80] shadow-sm'
        };
      }
      if (text.includes('報到') || text.includes('準備') || lowerText.includes('briefing')) {
        return {
          label: '準備',
          icon: 'fa-clipboard-check',
          dot: 'bg-[#43a047] ring-[#c8e6c9]',
          badge: 'bg-[#e8f5e9] text-[#1b5e20] border-[#a5d6a7]',
          card: 'border-[#a5d6a7] shadow-sm'
        };
      }
      return {
        label: '行程',
        icon: 'fa-calendar-day',
        dot: 'bg-gray-400 ring-gray-200',
        badge: 'bg-gray-50 text-gray-600 border-gray-200',
        card: 'border-gray-100 shadow-sm'
      };
    };
    const competitionDays = scheduleDays.filter(dayGroup => getDayText(dayGroup).includes('比賽')).length;
    const timedItems = scheduleRows.filter(item => item.time).length;
    const locatedItems = scheduleRows.filter(item => item.location).length;
    const totalActivities = scheduleDays.reduce((total, dayGroup) => total + dayGroup.activities.length, 0);
    return /*#__PURE__*/React.createElement("div", {
      className: "pb-10"
    }, /*#__PURE__*/React.createElement(Header, {
      title: "📅 每日行程",
      onBack: () => setCurrentView('home')
    }), /*#__PURE__*/React.createElement("div", {
      className: "px-4 mt-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg-[#003f46] text-white rounded-xl p-4 shadow-[0_10px_24px_rgba(0,63,70,0.16)]"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between gap-3"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-xs font-bold text-[#9adce4] tracking-wide"
    }, "GRIMPDAY 2026"), /*#__PURE__*/React.createElement("div", {
      className: "text-2xl font-black mt-1"
    }, "每日任務時間線")), /*#__PURE__*/React.createElement("div", {
      className: "text-right shrink-0"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-3xl font-black leading-none"
    }, scheduleDays.length), /*#__PURE__*/React.createElement("div", {
      className: "text-xs font-bold text-[#9adce4] mt-1"
    }, "日行程"))), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-3 mt-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg-white/10 rounded-lg p-3 border border-white/10"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-[#9adce4] font-bold"
    }, "比賽日"), /*#__PURE__*/React.createElement("div", {
      className: "text-xl font-black mt-1"
    }, competitionDays, " 日")), /*#__PURE__*/React.createElement("div", {
      className: "bg-white/10 rounded-lg p-3 border border-white/10"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-[#9adce4] font-bold"
    }, "活動項目"), /*#__PURE__*/React.createElement("div", {
      className: "text-xl font-black mt-1"
    }, totalActivities, " 項"))), /*#__PURE__*/React.createElement("div", {
      className: "mt-3 text-xs font-bold text-[#9adce4]"
    }, "已填時間 ", timedItems, " 項 / 已填地點 ", locatedItems, " 項")), scheduleDays.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "bg-white rounded-xl p-8 text-center mt-5 border border-gray-100 shadow-sm"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-regular fa-calendar-xmark text-4xl text-gray-300 mb-3"
    }), /*#__PURE__*/React.createElement("div", {
      className: "text-lg font-black text-gray-700"
    }, "暫未有行程資料")) : /*#__PURE__*/React.createElement("div", {
      className: "relative mt-6 pl-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "absolute left-[23px] top-3 bottom-3 w-[3px] bg-[#b2ebf2] rounded-full"
    }), /*#__PURE__*/React.createElement("div", {
      className: "space-y-5"
    }, scheduleDays.map((dayGroup, idx) => {
      const style = getScheduleStyle(dayGroup);
      return /*#__PURE__*/React.createElement("div", {
        key: idx,
        className: "relative pl-10"
      }, /*#__PURE__*/React.createElement("div", {
        className: `absolute left-0 top-5 w-10 h-10 ${style.dot} rounded-full ring-4 flex items-center justify-center shadow-sm`
      }, /*#__PURE__*/React.createElement("i", {
        className: `fa-solid ${style.icon} text-white text-sm`
      })), /*#__PURE__*/React.createElement("div", {
        className: `bg-white rounded-xl p-5 border ${style.card}`
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex flex-wrap items-start justify-between gap-3 mb-4"
      }, /*#__PURE__*/React.createElement("div", {
        className: "min-w-0 flex-1"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-lg font-black text-gray-900 leading-snug break-words"
      }, dayGroup.day), /*#__PURE__*/React.createElement("div", {
        className: "text-xs font-bold text-gray-400 mt-1"
      }, dayGroup.activities.length, " 項安排")), /*#__PURE__*/React.createElement("span", {
        className: `inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-black ${style.badge}`
      }, /*#__PURE__*/React.createElement("i", {
        className: `fa-solid ${style.icon}`
      }), style.label)), dayGroup.activities.length > 0 ? /*#__PURE__*/React.createElement("div", {
        className: "border-t border-gray-100"
      }, dayGroup.activities.map((activity, activityIdx) => {
        const descLines = String(activity.desc || '').split('\n').map(line => line.trim()).filter(Boolean);
        const isLast = activityIdx === dayGroup.activities.length - 1;
        return /*#__PURE__*/React.createElement("div", {
          key: activity.rowIndex,
          className: `py-3 ${isLast ? '' : 'border-b border-gray-100'}`
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex gap-3"
        }, /*#__PURE__*/React.createElement("div", {
          className: "w-[86px] shrink-0 text-[13px] font-black text-[#00acc1] leading-6 break-words"
        }, activity.time || '時間未定'), /*#__PURE__*/React.createElement("div", {
          className: "min-w-0 flex-1"
        }, descLines.length > 0 ? /*#__PURE__*/React.createElement("div", {
          className: "space-y-1"
        }, descLines.map((line, lineIdx) => /*#__PURE__*/React.createElement("div", {
          key: lineIdx,
          className: "flex gap-2 text-base font-bold text-gray-800 leading-6 break-words"
        }, /*#__PURE__*/React.createElement("i", {
          className: "fa-solid fa-circle-check text-[#00acc1] text-xs mt-1.5 shrink-0"
        }), /*#__PURE__*/React.createElement("div", null, line)))) : /*#__PURE__*/React.createElement("div", {
          className: "text-base font-bold text-gray-400 leading-6"
        }, "未填行程內容"), activity.location && /*#__PURE__*/React.createElement("div", {
          className: "mt-2 flex items-start gap-2 text-sm font-bold text-gray-600 leading-5"
        }, /*#__PURE__*/React.createElement("i", {
          className: "fa-solid fa-location-dot text-[#f4511e] mt-0.5 shrink-0"
        }), /*#__PURE__*/React.createElement("span", {
          className: "break-words"
        }, activity.location)), activity.note && /*#__PURE__*/React.createElement("div", {
          className: "mt-3 bg-[#fff8e1] border border-[#ffe082] rounded-lg p-3 text-sm font-medium text-gray-700 leading-6 whitespace-pre-line break-words"
        }, /*#__PURE__*/React.createElement("div", {
          className: "font-black text-[#8d6e00] mb-1 flex items-center gap-2"
        }, /*#__PURE__*/React.createElement("i", {
          className: "fa-solid fa-circle-info"
        }), "備註"), /*#__PURE__*/React.createElement("div", null, activity.note)))));
      })) : /*#__PURE__*/React.createElement("div", {
        className: "border-t border-gray-100 pt-4 text-sm font-bold text-gray-400"
      }, "暫未有當日活動")));
    })))));
  };

  // ================= 5. 器材清單模組 =================
  const EquipmentView = () => {
    const [subView, setSubView] = useState('personal');
    const [expandedOwners, setExpandedOwners] = useState({});
    const [expandedCategories, setExpandedCategories] = useState({});
    const validEquipment = appData.equipment.filter(eq => eq.item);
    const equipmentDoc = appData.docs.find(doc => {
      const title = String(doc.title || '').toLowerCase();
      return title.includes('器材') || title.includes('equipment');
    });
    const getDocStyle = type => {
      const t = String(type || '').toLowerCase();
      if (t === 'file' || t === 'pdf') return {
        icon: 'fa-file-pdf',
        color: 'text-red-500',
        bg: 'bg-red-50'
      };
      return {
        icon: 'fa-link',
        color: 'text-[#1e88e5]',
        bg: 'bg-blue-50'
      };
    };
    const groupedByOwner = validEquipment.reduce((acc, eq) => {
      const ownerName = eq.owner || '未分配';
      if (!acc[ownerName]) acc[ownerName] = [];
      acc[ownerName].push(eq);
      return acc;
    }, {});
    const summaryItemMap = validEquipment.reduce((acc, eq) => {
      if (!acc[eq.item]) acc[eq.item] = {
        category: eq.category || '未分類',
        total: 0,
        details: []
      };
      acc[eq.item].total += eq.quantity;
      if (eq.owner && eq.quantity > 0) acc[eq.item].details.push(`${eq.owner}(${eq.quantity})`);
      return acc;
    }, {});
    const groupedByCategory = Object.keys(summaryItemMap).reduce((acc, itemName) => {
      const cat = summaryItemMap[itemName].category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push({
        name: itemName,
        ...summaryItemMap[itemName]
      });
      return acc;
    }, {});
    const toggleOwner = owner => setExpandedOwners(prev => ({
      ...prev,
      [owner]: !prev[owner]
    }));
    const toggleCategory = cat => setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
    return /*#__PURE__*/React.createElement("div", {
      className: "pb-10"
    }, /*#__PURE__*/React.createElement(Header, {
      title: "📦 器材清單",
      onBack: () => setCurrentView('home')
    }), /*#__PURE__*/React.createElement("div", {
      className: "px-4 space-y-5 mt-6"
    }, equipmentDoc && /*#__PURE__*/React.createElement("a", {
      href: equipmentDoc.url && equipmentDoc.url.startsWith('http') ? equipmentDoc.url : '#',
      target: "_blank",
      rel: "noopener noreferrer",
      className: "block bg-white border border-gray-200 rounded-3xl p-5 shadow-sm transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: `w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 ${getDocStyle(equipmentDoc.type).bg}`
    }, /*#__PURE__*/React.createElement("i", {
      className: `fa-solid ${getDocStyle(equipmentDoc.type).icon} ${getDocStyle(equipmentDoc.type).color} text-2xl`
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-base font-black text-gray-900"
    }, "器材清單 PDF"), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-gray-500 mt-1 leading-relaxed"
    }, equipmentDoc.desc || '直接開啟 Google Drive 上的最新器材清單。')), /*#__PURE__*/React.createElement("div", {
      className: "text-gray-300 text-xl mt-1"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-arrow-up-right-from-square"
    })))), /*#__PURE__*/React.createElement("div", {
      className: "flex bg-gray-100 rounded-xl p-1 shadow-inner border border-gray-200"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setSubView('personal'),
      className: `flex-1 py-2.5 text-sm font-black rounded-lg transition-colors ${subView === 'personal' ? 'bg-white text-[#43a047] shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-user-tag mr-1.5"
    }), " 個人清單"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setSubView('summary'),
      className: `flex-1 py-2.5 text-sm font-black rounded-lg transition-colors ${subView === 'summary' ? 'bg-white text-[#1e88e5] shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-layer-group mr-1.5"
    }), " 全隊總表")), subView === 'personal' && /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, Object.keys(groupedByOwner).map((owner, idx) => {
      const isExpanded = expandedOwners[owner];
      return /*#__PURE__*/React.createElement("div", {
        key: idx,
        className: "bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 transition-all"
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => toggleOwner(owner),
        className: "w-full bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center active:bg-gray-100 transition-colors"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "text-xl font-black text-gray-800 flex items-center"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-user text-[#43a047] mr-2"
      }), owner), /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-3"
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-xs font-bold bg-green-50 text-[#43a047] px-2.5 py-1 rounded-full border border-green-200"
      }, "共 ", groupedByOwner[owner].length, " 項"), /*#__PURE__*/React.createElement("i", {
        className: `fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-400 text-xs`
      }))), isExpanded && /*#__PURE__*/React.createElement("div", {
        className: "p-0 bg-white"
      }, groupedByOwner[owner].map((eq, eIdx) => /*#__PURE__*/React.createElement("div", {
        key: eIdx,
        className: "flex flex-col border-b border-gray-100 last:border-0 px-4 py-2.5"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex justify-between items-center gap-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex-1"
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-[9px] font-bold uppercase text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200 mb-1 inline-block"
      }, eq.category || '未分類'), /*#__PURE__*/React.createElement("div", {
        className: "text-lg font-bold text-gray-800 leading-tight"
      }, eq.item)), /*#__PURE__*/React.createElement("div", {
        className: "bg-green-50 text-[#43a047] px-3 py-1 rounded-lg font-black text-base border border-green-200 text-center min-w-[36px]"
      }, eq.quantity)), eq.notes && /*#__PURE__*/React.createElement("div", {
        className: "mt-1.5 text-xs font-bold text-yellow-700 flex items-start gap-1.5 bg-yellow-50 p-1.5 rounded-md border border-yellow-200"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-circle-info mt-0.5 text-[10px]"
      }), /*#__PURE__*/React.createElement("span", null, eq.notes))))));
    })), subView === 'summary' && /*#__PURE__*/React.createElement("div", {
      className: "space-y-3"
    }, Object.keys(groupedByCategory).sort().map((cat, idx) => {
      const isExpanded = expandedCategories[cat];
      const itemsInCat = groupedByCategory[cat];
      return /*#__PURE__*/React.createElement("div", {
        key: idx,
        className: "bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 transition-all"
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => toggleCategory(cat),
        className: "w-full bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center active:bg-gray-100 transition-colors"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "text-lg font-black text-gray-800 flex items-center"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-folder-open text-[#1e88e5] mr-2"
      }), cat), /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-3"
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-xs font-bold bg-blue-50 text-[#1e88e5] px-2.5 py-1 rounded-full border border-blue-200"
      }, "共 ", itemsInCat.length, " 項"), /*#__PURE__*/React.createElement("i", {
        className: `fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} text-gray-400 text-xs`
      }))), isExpanded && /*#__PURE__*/React.createElement("div", {
        className: "p-0 bg-white"
      }, itemsInCat.map((item, iIdx) => /*#__PURE__*/React.createElement("div", {
        key: iIdx,
        className: "flex flex-col border-b border-gray-100 last:border-0 px-4 py-2.5"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex justify-between items-center gap-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex-1"
      }, /*#__PURE__*/React.createElement("div", {
        className: "text-lg font-bold text-gray-800 leading-tight"
      }, item.name)), /*#__PURE__*/React.createElement("div", {
        className: "bg-blue-50 text-[#1e88e5] px-3 py-1 rounded-lg font-black text-base border border-blue-200 text-center min-w-[36px]"
      }, item.total)), item.details.length > 0 && /*#__PURE__*/React.createElement("div", {
        className: "mt-1.5 flex flex-wrap gap-1 bg-gray-50 p-1.5 rounded-md border border-gray-100"
      }, /*#__PURE__*/React.createElement("span", {
        className: "text-[9px] font-bold text-gray-400 mt-0.5"
      }, "分配："), item.details.map((detail, dIdx) => /*#__PURE__*/React.createElement("span", {
        key: dIdx,
        className: "bg-white px-1.5 py-0.5 rounded border border-gray-200 text-[10px] font-bold text-gray-600"
      }, detail)))))));
    }))));
  };

  // ================= 6. 重要文件模組 =================
  const DocsView = () => {
    const getStyleByType = type => {
      const t = String(type || '').toLowerCase();
      if (t === 'file' || t === 'pdf') return {
        icon: 'fa-file-pdf',
        color: 'text-red-500',
        bg: 'bg-red-50'
      };
      if (t === 'map' || t === 'location') return {
        icon: 'fa-map-location-dot',
        color: 'text-green-500',
        bg: 'bg-green-50'
      };
      return {
        icon: 'fa-link',
        color: 'text-[#1e88e5]',
        bg: 'bg-blue-50'
      };
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "pb-10"
    }, /*#__PURE__*/React.createElement(Header, {
      title: "📂 大會文件",
      onBack: () => setCurrentView('home')
    }), /*#__PURE__*/React.createElement("div", {
      className: "px-4 space-y-4 mt-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg-blue-50 border-l-4 border-[#1e88e5] p-4 rounded-r-xl mb-6 shadow-sm"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-bold text-[#1e88e5]"
    }, "點擊下方按鈕即可直接開啟檔案或啟動地圖導航。")), appData.docs.map((doc, idx) => {
      const style = getStyleByType(doc.type);
      const safeUrl = doc.url && doc.url.startsWith('http') ? doc.url : '#';
      return /*#__PURE__*/React.createElement("a", {
        key: idx,
        href: safeUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "block bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-transform"
      }, /*#__PURE__*/React.createElement("div", {
        className: `w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${style.bg}`
      }, /*#__PURE__*/React.createElement("i", {
        className: `fa-solid ${style.icon} ${style.color} text-2xl`
      })), /*#__PURE__*/React.createElement("div", {
        className: "flex-1"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "text-lg font-black text-gray-800 mb-0.5 leading-snug"
      }, doc.title), doc.desc && /*#__PURE__*/React.createElement("p", {
        className: "text-xs font-bold text-gray-400"
      }, doc.desc)), /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-chevron-right text-gray-300 text-xl shrink-0"
      }));
    })));
  };

  // ================= 7. 住宿分配模組 =================
  const HotelView = () => /*#__PURE__*/React.createElement("div", {
    className: "pb-10"
  }, /*#__PURE__*/React.createElement(Header, {
    title: "🏨 住宿安排",
    onBack: () => setCurrentView('home')
  }), /*#__PURE__*/React.createElement("div", {
    className: "px-4 space-y-6 mt-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center bg-white border border-gray-200 rounded-xl p-4 mb-2 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-bed text-[#8d6e63] text-2xl"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-lg font-bold text-gray-800"
  }, "住宿狀態")), /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[#8d6e63] font-black text-xl"
  }, appData.hotel.length, " 間房"), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-500 font-bold text-xs mt-0.5"
  }, "已分配 ", appData.hotel.reduce((sum, room) => sum + room.members.length, 0), " 人"))), appData.hotel.map((room, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-end border-b border-gray-100 pb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[#8d6e63] text-xl font-black"
  }, room.room.toLowerCase().includes('room') ? room.room : `Room ${room.room}`), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 font-bold bg-gray-50 px-3 py-1 rounded-lg text-xs border border-gray-200"
  }, room.type)), /*#__PURE__*/React.createElement("div", {
    className: "pt-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-user-group text-gray-400 mt-0.5 text-sm"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-bold text-gray-400 mb-0.5"
  }, "入住隊員 (", room.members.length, "人)："), /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-black text-gray-800"
  }, room.members.join(', ')))), room.notes && /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-bold text-amber-700 mt-2 flex items-start gap-1.5 bg-amber-50 p-2 rounded-lg border border-amber-100"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-info mt-0.5 text-[10px]"
  }), /*#__PURE__*/React.createElement("span", null, room.notes)))))));

  // ================= 🌟 8. 全新：極簡設定版 地圖及導航模組 =================
  const MapsView = () => {
    return /*#__PURE__*/React.createElement("div", {
      className: "pb-10"
    }, /*#__PURE__*/React.createElement(Header, {
      title: "📂 地圖及導航",
      onBack: () => setCurrentView('home')
    }), /*#__PURE__*/React.createElement("div", {
      className: "px-4 mt-6 space-y-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg-blue-50 border-l-4 border-[#1e88e5] p-4 rounded-r-xl shadow-sm border border-blue-100"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-bold text-[#1e88e5]"
    }, "按下地點卡下方的按鈕，即可開啟 Google Maps 開始導航。")), appData.maps.map(place => {
      // 防呆：確保 URL 是有效的 http 網址
      const safeUrl = place.url && String(place.url).startsWith('http') ? place.url : '#';
      return /*#__PURE__*/React.createElement("div", {
        key: place.id,
        className: "bg-white rounded-2xl overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.06)] border border-gray-100 group transition-all"
      }, /*#__PURE__*/React.createElement("div", {
        className: "w-full h-28 bg-gradient-to-br from-[#1e88e5] to-[#00acc1] relative overflow-hidden flex items-center p-5"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-map-location-dot text-white/20 text-7xl absolute -right-2 -bottom-4 transform -rotate-12"
      }), /*#__PURE__*/React.createElement("h3", {
        className: "text-2xl font-black text-white leading-tight z-10 w-4/5 line-clamp-2 drop-shadow-md"
      }, place.placeName)), /*#__PURE__*/React.createElement("div", {
        className: "p-5"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex gap-3 mt-1"
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => safeUrl !== '#' ? window.open(safeUrl, '_blank', 'noopener,noreferrer') : alert('請在 Google Sheet 中填寫正確的 Share Link'),
        className: `flex-1 rounded-full py-3 px-6 flex items-center justify-center gap-2.5 transition-colors shadow-lg active:scale-95 ${safeUrl !== '#' ? 'bg-gray-900 text-white active:bg-black' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`
      }, /*#__PURE__*/React.createElement("i", {
        className: `fa-solid fa-paper-plane ${safeUrl !== '#' ? 'text-white/70' : ''}`
      }), /*#__PURE__*/React.createElement("span", {
        className: "text-sm font-bold uppercase tracking-wider"
      }, "開始導航")))));
    })));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-[#eef2f5] text-gray-800 font-sans selection:bg-[#ffb300] selection:text-white flex justify-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md min-h-screen bg-[#eef2f5] shadow-[0_0_40px_rgba(0,0,0,0.05)] relative"
  }, currentView === 'home' && /*#__PURE__*/React.createElement(HomeView, null), currentView === 'roster' && /*#__PURE__*/React.createElement(RosterView, null), currentView === 'transport' && /*#__PURE__*/React.createElement(TransportView, null), currentView === 'schedule' && /*#__PURE__*/React.createElement(ScheduleView, null), currentView === 'equipment' && /*#__PURE__*/React.createElement(EquipmentView, null), currentView === 'docs' && /*#__PURE__*/React.createElement(DocsView, null), currentView === 'hotel' && /*#__PURE__*/React.createElement(HotelView, null), currentView === 'maps' && /*#__PURE__*/React.createElement(MapsView, null)));
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(GrimpdayApp, null));
