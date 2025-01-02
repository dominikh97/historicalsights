const countryCoordinates = {
    "Afghanistan": "29.3, 60.9, 38.5, 77.1",
    "Albania": "39.6, 19.3, 42.6, 21.1",
    "Algeria": "19.0, -8.0, 37.1, 11.0",
    "Andorra": "42.4, 1.4, 42.7, 1.8",
    "Angola": "-18.0, 11.0, -4.0, 24.0",
    "Antigua and Barbuda": "17.2, -62.5, 17.7, -61.8",
    "Argentina": "-55.1, -73.4, -21.8, -53.7",
    "Armenia": "38.8, 40.1, 41.3, 47.0",
    "Australia": "-43.6, 112.0, -10.0, 153.6",
    "Austria": "47.0, 9.5, 49.0, 17.0",
    "Azerbaijan": "38.0, 44.0, 41.0, 51.0",
    "Bahamas": "20.9, -78.2, 25.0, -73.2",
    "Bahrain": "25.5, 50.2, 26.3, 50.7",
    "Bangladesh": "20.7, 88.0, 26.7, 92.5",
    "Barbados": "13.1, -59.3, 13.5, -59.0",
    "Belarus": "53.0, 23.0, 56.0, 32.0",
    "Belgium": "49.5, 2.5, 51.5, 6.5",
    "Belize": "15.8, -89.2, 18.0, -87.7",
    "Benin": "6.2, 2.3, 12.5, 3.9",
    "Bolivia": "-22.9, -69.4, -9.6, -57.4",
    "Bosnia and Herzegovina": "42.0, 15.7, 44.3, 19.6",
    "Botswana": "-26.4, 20.0, -17.8, 30.0",
    "Brazil": "-33.7, -74.1, 5.3, -34.9",
    "Brunei": "4.5, 114.0, 5.0, 115.0",
    "Burkina Faso": "9.4, -5.5, 15.0, 2.0",
    "Burundi": "-4.4, 29.5, -2.0, 30.9",
    "Cabo Verde": "14.7, -25.0, 16.3, -22.5",
    "Cambodia": "10.5, 102.5, 14.5, 107.5",
    "Cameroon": "1.5, 9.7, 13.5, 16.1",
    "Canada": "41.7, -141.0, 83.1, -52.6",
    "Central African Republic": "2.2, 14.5, 11.1, 27.5",
    "Chad": "7.4, 12.0, 23.4, 20.0",
    "Chile": "-56.0, -75.5, -17.5, -66.0",
    "China": "18.0, 73.5, 53.5, 135.0",
    "Colombia": "12.5, -79.0, 4.2, -66.0",
    "Comoros": "-12.0, 43.0, -11.5, 44.5",
    "Costa Rica": "8.1, -85.0, 11.2, -82.5",
    "Croatia": "42.5, 13.0, 45.3, 19.5",
    "Cuba": "19.8, -85.0, 23.1, -74.0",
    "Cyprus": "35.0, 32.0, 35.5, 34.0",
    "Czech Republic (Czechia)": "49.5, 12.0, 51.5, 19.0",
    "Denmark": "54.0, 8.0, 57.8, 15.0",
    "Dominica": "15.2, -61.2, 15.6, -60.5",
    "Dominican Republic": "17.6, -71.7, 19.9, -68.3",
    "Djibouti": "10.9, 41.5, 12.8, 43.0",
    "Ecuador": "-5.0, -81.0, 1.5, -75.0",
    "Egypt": "22.0, 25.0, 31.0, 34.0",
    "El Salvador": "12.9, -90.2, 13.7, -87.7",
    "Equatorial Guinea": "1.5, 5.5, 3.5, 11.0",
    "Estonia": "57.0, 21.5, 59.5, 28.2",
    "Eswatini (fmr. Swaziland)": "-27.5, 31.0, -25.5, 32.5",
    "Ethiopia": "3.5, 33.0, 15.0, 48.0",
    "Fiji": "-20.4, 175.0, -16.5, 178.0",
    "Finland": "60.0, 20.0, 70.0, 32.0",
    "France": "41.3, -5.1, 51.1, 9.5",
    "Georgia": "41.0, 40.0, 43.6, 46.7",
    "Germany": "47.3, 5.8, 55.1, 15.0",
    "Gabon": "-3.9, 9.5, 3.0, 15.5",
    "Gambia": "13.1, -16.8, 13.5, -13.5",
    "Ghana": "4.5, -3.0, 11.5, 1.5",
    "Grenada": "11.9, -61.4, 12.7, -60.8",
    "Guatemala": "13.0, -92.2, 15.1, -88.2",
    "Guinea": "7.0, -15.5, 12.7, -7.0",
    "Guinea-Bissau": "10.0, -15.0, 12.5, -13.5",
    "Haiti": "18.0, -74.2, 19.7, -71.7",
    "Honduras": "13.0, -89.3, 15.5, -83.2",
    "Hungary": "45.8, 16.0, 48.0, 22.5",
    "Iceland": "63.5, -23.5, 66.5, -13.0",
    "Ireland": "51.0, -10.5, 55.5, -5.0",
    "India": "6.5, 68.0, 35.0, 97.4",
    "Indonesia": "-11.0, 95.0, 6.5, 141.0",
    "Iran": "24.5, 44.0, 39.8, 63.5",
    "Iraq": "29.0, 38.0, 37.5, 48.5",
    "Israel": "29.5, 34.3, 33.3, 35.5",
    "Italy": "36.6, 6.5, 47.1, 18.5",
    "Jamaica": "17.7, -78.0, 18.5, -76.0",
    "Japan": "24.2, 122.9, 45.6, 153.9",
    "Jordan": "29.2, 35.0, 33.4, 39.0",
    "Kazakhstan": "40.0, 46.0, 55.0, 87.0",
    "Kenya": "-4.5, 34.5, 5.0, 42.0",
    "Kiribati": "-0.1, 169.0, 4.5, 174.0",
    "Kosovo": "41.8, 20.2, 42.7, 21.8",
    "Kuwait": "28.6, 46.0, 30.1, 48.3",
    "Kyrgyzstan": "39.0, 69.5, 42.0, 80.0",
    "Laos": "13.0, 100.0, 22.0, 107.6",
    "Latvia": "56.0, 20.0, 58.0, 28.2",
    "Lebanon": "33.0, 35.0, 34.6, 36.7",
    "Lesotho": "-30.6, 27.0, -28.5, 30.0",
    "Liberia": "4.3, -9.5, 9.5, -7.5",
    "Libya": "19.0, 9.0, 33.0, 25.0",
    "Liechtenstein": "47.0, 9.5, 47.3, 9.7",
    "Lithuania": "54.5, 20.9, 56.5, 26.5",
    "Luxembourg": "49.5, 5.9, 50.2, 6.5",
    "Madagascar": "-25.5, 43.2, -12.5, 50.5",
    "Malawi": "-15.0, 34.0, -9.5, 36.5",
    "Malaysia": "1.5, 101.5, 7.5, 119.0",
    "Maldives": "3.0, 72.0, 7.0, 74.0",
    "Mali": "10.0, -12.0, 24.0, 4.0",
    "Malta": "35.8, 14.2, 36.0, 14.6",
    "Marshall Islands": "5.0, 160.0, 14.5, 172.0",
    "Mauritania": "14.5, -17.0, 27.0, -5.0",
    "Mauritius": "-20.5, 63.5, -19.5, 64.5",
    "Mexico": "14.5, -118.5, 32.7, -86.7",
    "Micronesia (Federated States of)": "0.0, 137.0, 10.0, 163.0",
    "Moldova": "45.0, 26.0, 49.5, 30.5",
    "Monaco": "43.7, 7.4, 43.8, 7.5",
    "Mongolia": "41.0, 87.0, 52.0, 120.0",
    "Montenegro": "42.0, 18.5, 43.5, 20.5",
    "Morocco": "27.5, -13.0, 36.0, -0.5",
    "Mozambique": "-26.0, 30.0, -10.0, 41.0",
    "Myanmar (Burma)": "9.0, 92.0, 28.0, 101.0",
    "Namibia": "-29.0, 11.5, -16.5, 25.0",
    "Nauru": "-0.5, 166.9, 0.1, 167.9",
    "Nepal": "26.3, 80.0, 30.4, 88.2",
    "Netherlands": "50.0, 3.4, 53.5, 7.5",
    "New Zealand": "-47.0, 166.0, -34.5, 179.0",
    "Nicaragua": "11.0, -87.5, 14.6, -82.0",
    "Niger": "12.0, 0.0, 23.5, 16.0",
    "Nigeria": "4.0, 3.5, 13.9, 14.0",
    "North Korea": "37.9, 124.3, 41.6, 130.8",
    "North Macedonia": "41.7, 20.4, 42.6, 23.1",
    "Norway": "57.8, 4.5, 71.2, 31.5",
    "Oman": "16.5, 51.0, 26.5, 59.5",
    "Pakistan": "23.7, 60.9, 37.1, 77.0",
    "Palau": "5.0, 131.0, 7.0, 134.5",
    "Panama": "7.1, -82.8, 9.6, -77.0",
    "Papua New Guinea": "-11.5, 141.0, -1.0, 156.0",
    "Paraguay": "-27.5, -62.5, -19.3, -54.3",
    "Peru": "-18.0, -81.0, -0.5, -68.5",
    "Philippines": "4.5, 116.0, 21.5, 126.0",
    "Poland": "49.0, 14.0, 55.0, 24.0",
    "Portugal": "36.0, -9.5, 42.0, -6.0",
    "Qatar": "24.5, 50.5, 26.0, 51.5",
    "Romania": "43.5, 20.5, 48.2, 30.5",
    "Russia": "41.0, 19.0, 81.0, 190.0",
    "Rwanda": "-2.5, 28.9, -1.0, 30.9",
    "Saint Kitts and Nevis": "17.2, -62.8, 17.5, -62.5",
    "Saint Lucia": "13.7, -61.2, 14.1, -60.9",
    "Saint Vincent and the Grenadines": "12.5, -61.2, 13.3, -60.5",
    "Samoa": "-14.0, -173.0, -13.0, -168.0",
    "San Marino": "43.9, 12.4, 44.0, 12.5",
    "Sao Tome and Principe": "0.0, 6.5, 1.0, 7.5",
    "Saudi Arabia": "16.0, 34.0, 32.0, 56.0",
    "Senegal": "12.0, -17.5, 16.7, -11.0",
    "Serbia": "43.0, 18.8, 46.0, 23.0",
    "Seychelles": "-10.0, 46.0, -4.0, 56.5",
    "Sierra Leone": "7.5, -13.5, 10.5, -5.5",
    "Singapore": "1.1, 103.6, 1.5, 104.0",
    "Slovakia": "47.7, 16.0, 49.6, 22.0",
    "Slovenia": "45.5, 13.3, 46.5, 16.6",
    "Solomon Islands": "-11.0, 157.0, -6.0, 160.0",
    "Somalia": "1.0, 41.0, 11.0, 51.5",
    "South Africa": "-34.5, 16.5, -22.0, 32.9",
    "South Korea": "33.0, 124.5, 38.6, 130.5",
    "South Sudan": "3.5, 28.0, 13.4, 35.5",
    "Spain": "27.6, -18.0, 43.7, -5.5",
    "Sri Lanka": "5.8, 79.9, 9.8, 81.5",
    "Sudan": "8.0, 21.0, 23.0, 38.0",
    "Suriname": "2.0, -58.5, 6.0, -53.0",
    "Sweden": "55.5, 11.0, 69.0, 24.0",
    "Switzerland": "45.8, 5.9, 47.8, 10.5",
    "Syria": "32.0, 35.0, 37.5, 42.0",
    "Taiwan": "20.7, 119.2, 25.2, 122.0",
    "Tajikistan": "36.5, 67.0, 41.0, 75.0",
    "Tanzania": "-11.7, 29.0, -0.5, 40.0",
    "Thailand": "5.5, 97.0, 20.5, 106.5",
    "Togo": "6.5, 0.8, 11.2, 1.3",
    "Tonga": "-21.5, -179.0, -15.5, -175.0",
    "Trinidad and Tobago": "10.0, -61.5, 11.5, -60.5",
    "Tunisia": "32.0, 7.5, 37.5, 11.5",
    "Turkey": "36.0, 26.0, 42.1, 45.0",
    "Turkmenistan": "35.0, 52.5, 42.0, 66.0",
    "Tuvalu": "-7.0, 176.0, -5.0, 179.0",
    "Uganda": "1.5, 29.6, 4.5, 35.0",
    "Ukraine": "44.0, 22.1, 52.0, 40.0",
    "United Arab Emirates": "22.5, 51.0, 26.0, 56.0",
    "United Kingdom": "49.9, -8.6, 58.9, 1.8",
    "United States": "24.4, -125.0, 49.4, -66.9",
    "Uruguay": "-35.0, -58.0, -30.1, -53.3",
    "Uzbekistan": "37.0, 56.0, 45.0, 73.5",
    "Vanuatu": "-17.7, 166.5, -13.0, 170.0",
    "Vatican City": "41.9, 12.4, 41.9, 12.5",
    "Venezuela": "0.7, -73.0, 12.0, -59.0",
    "Vietnam": "8.0, 102.1, 23.4, 109.5",
    "Yemen": "12.0, 42.0, 19.0, 54.0",
    "Zambia": "-18.0, 22.0, -8.0, 33.0",
    "Zimbabwe": "-22.0, 25.0, -15.5, 33.0"
};
