// netlify/functions/sheet-data.js

const SHEET_RANGES = [
  'Roster',
  'Flights',
  'Cars',
  'Schedule',
  'Equipment',
  'Links_Files',
  'Hotel',
  'Maps'
];

const parseBoolean = (val) => {
  if (val === undefined || val === null) return false;

  const normalized = String(val).toLowerCase().trim();
  if (!normalized) return false;

  const yesValues = [
    'true',
    'yes',
    'y',
    '1',
    '是',
    '有',
    '需要',
    '已申請',
    'v',
    'ok',
    '✓',
    '✔',
    '✅'
  ];

  const noValues = [
    'false',
    'no',
    'n',
    '0',
    '否',
    '無',
    '冇',
    '沒有',
    '不需要',
    'x',
    '✗',
    '✘',
    '❌'
  ];

  if (yesValues.includes(normalized)) return true;
  if (noValues.includes(normalized)) return false;

  return false;
};

const parsePassengers = (val) => {
  return val
    ? String(val).split(',').map(s => s.trim()).filter(Boolean)
    : [];
};

const rowsToObjects = (values = []) => {
  const [headers = [], ...rows] = values;

  return rows.map(row => {
    const obj = {};

    headers.forEach((header, index) => {
      const key = String(header || '').trim();
      if (key) {
        obj[key] = row[index] || '';
      }
    });

    return obj;
  });
};

const getField = (row, aliases, fallback = '') => {
  const normalizedRow = {};
  const compactRow = {};
  const normalizeKey = (value) => String(value || '').trim().toLowerCase();
  const compactKey = (value) => normalizeKey(value).replace(/[\s_\-/()?？:：]+/g, '');

  Object.keys(row).forEach(key => {
    normalizedRow[normalizeKey(key)] = row[key];
    compactRow[compactKey(key)] = row[key];
  });

  for (const alias of aliases) {
    const normalizedAlias = normalizeKey(alias);
    const compactAlias = compactKey(alias);

    if (
      normalizedRow[normalizedAlias] !== undefined &&
      normalizedRow[normalizedAlias] !== ''
    ) {
      return normalizedRow[normalizedAlias];
    }

    if (
      compactRow[compactAlias] !== undefined &&
      compactRow[compactAlias] !== ''
    ) {
      return compactRow[compactAlias];
    }
  }

  return fallback;
};


exports.handler = async function () {
  try {
    const SHEET_ID = process.env.SHEET_ID;
    const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

    if (!SHEET_ID || !API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Missing SHEET_ID or GOOGLE_SHEETS_API_KEY'
        })
      };
    }

    const rangesQuery = SHEET_RANGES
      .map(range => `ranges=${encodeURIComponent(range)}`)
      .join('&');

    const url =
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values:batchGet?${rangesQuery}&key=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();

      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: 'Failed to fetch Google Sheets data',
          details: text
        })
      };
    }

    const data = await response.json();

    const rosterRows = rowsToObjects(data.valueRanges[0]?.values || []);
    const flightRows = rowsToObjects(data.valueRanges[1]?.values || []);
    const carRows = rowsToObjects(data.valueRanges[2]?.values || []);
    const scheduleRows = rowsToObjects(data.valueRanges[3]?.values || []);
    const equipmentRows = rowsToObjects(data.valueRanges[4]?.values || []);
    const docsRows = rowsToObjects(data.valueRanges[5]?.values || []);
    const hotelRows = rowsToObjects(data.valueRanges[6]?.values || []);
    const mapRows = rowsToObjects(data.valueRanges[7]?.values || []);

    const rawRosterValues = data.valueRanges[0]?.values || [];
    const rawRosterHeaders = rawRosterValues[0] || [];
    
    const appData = {
      debugVersion: 'luggage-debug-v2',
  debugRosterHeaders: rawRosterHeaders,
  debugFirstRosterRow: rosterRows[0] || null,

roster: rosterRows.map(r => ({
  role: getField(r, ['role', 'Role', '職位', '角色']),
  name: getField(r, ['name', 'Name', '姓名', '隊員']),
  idp: parseBoolean(getField(r, [
    'idp',
    'IDP',
    'IDP?',
    'IDP yes/no',
    'IDP Yes/No',
    'IDP yes or no',
    'International Driving Permit',
    'internationalDrivingPermit',
    '國際車牌',
    '國際車牌?',
    '國際車牌 yes/no',
    '國際駕駛許可證',
    '國際駕駛執照'
  ])),
  luggageCount: getField(r, [
    'Number of Lugguages',
    'Number of Luggages',
    'numberOfLuggages',
    'luggageCount',
    'luggages',
    '行李數量',
    '行李'
  ], '0')
})),

flights: flightRows.map(r => ({
  type: getField(r, ['type', 'Type', '類型']),
  date: getField(r, ['date', 'Date', '日期']),
  flightNo: getField(r, ['flightNo', 'Flight No', 'flight_no', '航班編號', '航班']),
  status: getField(r, ['status', 'Status', '狀態', '備註']),
  passengers: parsePassengers(getField(r, ['passengers', 'Passengers', '乘客']))
})),

      cars: carRows.map(r => ({
  id: getField(r, ['id', 'ID', '車輛', '車牌']),
  usage: getField(r, ['usage', 'Usage', '用途']),
  driver: getField(r, ['driver', 'Driver', '司機']),
  rentalDocUrl: getField(r, [
    'rentalDocUrl',
    'Rental Doc URL',
    'Rental Document URL',
    'Car Rental Document URL',
    '租車文件',
    '租車文件連結',
    '租車文件URL',
    '文件連結',
    'Google Drive Link'
  ]),
  passengers: parsePassengers(getField(r, ['passengers', 'Passengers', '乘客']))
})),

      schedule: scheduleRows.map(r => ({
        day: getField(r, ['day', 'Day', '日期', '日子']),
        time: getField(r, ['time', 'Time', '時間', '開始時間', '比賽時間']),
        location: getField(r, ['location', 'Location', 'venue', 'Venue', '地點', '場地', '比賽地點']),
        desc: getField(r, ['desc', 'Description', '行程', '內容']),
        note: getField(r, ['note', 'Note', '備註'])
      })),

      equipment: equipmentRows.map(r => ({
        category: getField(r, ['category', 'Category', '分類']),
        item: getField(r, ['item', 'Item', '物品', '器材']),
        quantity: parseInt(getField(r, ['quantity', 'Quantity', '數量'], '0'), 10) || 0,
        owner: getField(r, ['owner', 'Owner', '負責人', '持有人']),
        notes: getField(r, ['notes', 'Notes', '備註'])
      })),

      docs: docsRows.map(r => ({
        type: getField(r, ['type', 'Type', '類型'], 'Link'),
        title: getField(r, ['title', 'Title', '標題']),
        url: getField(r, ['url', 'URL', '連結'], '#'),
        desc: getField(r, ['desc', 'Description', '描述'])
      })),

      hotel: hotelRows.map(r => ({
        room: getField(r, ['room', 'Room', '房間'], '未定'),
        type: getField(r, ['type', 'Type', '房型']),
        members: parsePassengers(getField(r, ['members', 'Members', '入住隊員', '成員'])),
        notes: getField(r, ['notes', 'Notes', '備註'])
      })),

      maps: mapRows.map((r, idx) => ({
        id: `map_${idx}`,
        placeName: getField(r, ['placeName', 'Place Name', '地點', '地點名稱']),
        url: getField(r, ['url', 'URL', 'Google Maps', '地圖連結'])
      }))
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      },
      body: JSON.stringify(appData)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || 'Unknown server error'
      })
    };
  }
};
