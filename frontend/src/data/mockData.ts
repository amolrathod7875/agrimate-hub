// All 28 States and 8 Union Territories of India with their districts
export const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export const districtsByState: Record<string, string[]> = {
  // States
  "Andhra Pradesh": [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna",
    "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam",
    "Vizianagaram", "West Godavari", "YSR Kadapa"
  ],
  "Arunachal Pradesh": [
    "Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey",
    "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang",
    "East Siang", "Siang", "Upper Siang", "Dibang Valley", "Anjaw",
    "Lohit", "Namsang", "Tirap", "Changlang", "Longding"
  ],
  "Assam": [
    "Barpeta", "Bongaigaon", "Cachar", "Chirang", "Darrang",
    "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat",
    "Hailakandi", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong",
    "Karimganj", "Kokrajhar", "Lakhimpur", "Marigaon", "Nagaon",
    "Nalbari", "Sivasagar", "Sonitpur", "Tinsukia", "Udalguri"
  ],
  "Bihar": [
    "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai",
    "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran",
    "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur",
    "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura",
    "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada",
    "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur",
    "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan",
    "Supaul", "Vaishali", "West Champaran"
  ],
  "Chhattisgarh": [
    "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara",
    "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband",
    "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon",
    "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur",
    "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur",
    "Surguja"
  ],
  "Goa": [
    "North Goa", "South Goa"
  ],
  "Gujarat": [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha",
    "Bharuch", "Bhavnagar", "Botad", "Chhota Udepur", "Dahod",
    "Dangs", "Devbhumi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar",
    "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana",
    "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan",
    "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar",
    "Tapi", "Vadodara", "Valsad"
  ],
  "Haryana": [
    "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad",
    "Gurgaon", "Hisar", "Jhajjar", "Jind", "Kaithal",
    "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal",
    "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa",
    "Sonipat", "Yamunanagar"
  ],
  "Himachal Pradesh": [
    "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur",
    "Kullu", "Lahul and Spiti", "Mandi", "Shimla", "Sirmaur",
    "Solan", "Una"
  ],
  "Jharkhand": [
    "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka",
    "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh",
    "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga",
    "Pakur", "Palamu", "Ranchi", "Sahebganj", "Seraikela Kharsawan",
    "Simdega", "West Singhbhum"
  ],
  "Karnataka": [
    "Bagalkot", "Bangalore Rural", "Bangalore Urban", "Belgaum", "Bellary",
    "Bidar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada",
    "Davanagere", "Gadag", "Gulbarga", "Hassan", "Haveri",
    "Hubli", "Kalaburagi", "Karnataka", "Kolar", "Koppal",
    "Madhya Karnataka", "Mandya", "Mysore", "Raichur", "Ramanagara",
    "Shimoga", "Tumkur", "Udupi", "Uttara Kannada", "Vijayapura",
    "Yadgir"
  ],
  "Kerala": [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod",
    "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad",
    "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"
  ],
  "Madhya Pradesh": [
    "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat",
    "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur",
    "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas",
    "Dhar", "Dindori", "Guna", "Gwalior", "Harda",
    "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni",
    "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena",
    "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh",
    "Ratlam", "Rewa", "Sagar", "Satna", "Sehore",
    "Seoni", "Shajapur", "Sheopur", "Shivpuri", "Sidhi",
    "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"
  ],
  "Maharashtra": [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed",
    "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli",
    "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur",
    "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded",
    "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani",
    "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
    "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim",
    "Yavatmal"
  ],
  "Manipur": [
    "Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West",
    "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney",
    "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal",
    "Ukhrul"
  ],
  "Meghalaya": [
    "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills",
    "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills",
    "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"
  ],
  "Mizoram": [
    "Aizawl", "Champhai", "Hnahthial", "Kolasib", "Lawngtlai",
    "Lunglei", "Mamit", "Saitual", "Serchhip", "Siaha"
  ],
  "Nagaland": [
    "Chumoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng",
    "Mokokchung", "Mon", "Niuland", "Noklak", "Peren",
    "Phek", "Shamator", "Tuensang", "Wokha", "Zunheboto"
  ],
  "Odisha": [
    "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak",
    "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati",
    "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi",
    "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput",
    "Malkangiri", "Mayurbhanj", "Nayagarh", "Nuapada", "Puri",
    "Rayagada", "Sambalpur", "Sonepur", "Sundargarh"
  ],
  "Punjab": [
    "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib",
    "Fazilka", "Firozpur", "Gurdaspur", "Hoshiarpur", "Jalandhar",
    "Kapurthala", "Ludhiana", "Mansa", "Moga", "Mohali",
    "Muktsar", "Pathankot", "Patiala", "Rupnagar", "S.A.S. Nagar",
    "Sangrur", "Shahid Bhagat Singh Nagar", "Tarn Taran"
  ],
  "Rajasthan": [
    "Ajmer", "Alwar", "Banswara", "Baran", "Barmer",
    "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh",
    "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh",
    "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu",
    "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali",
    "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi",
    "Sri Ganganagar", "Tonk", "Udaipur"
  ],
  "Sikkim": [
    "East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"
  ],
  "Tamil Nadu": [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
    "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
    "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
    "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
    "Ramanathapuram", "Salem", "Sivaganga", "Tenkasi", "Thanjavur",
    "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur",
    "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
    "Viluppuram", "Virudhunagar"
  ],
  "Telangana": [
    "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon",
    "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
    "Khammam", "Komaram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial",
    "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda",
    "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla",
    "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad",
    "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"
  ],
  "Tripura": [
    "Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala",
    "South Tripura", "Unakoti", "West Tripura"
  ],
  "Uttar Pradesh": [
    "Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi",
    "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich",
    "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly",
    "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr",
    "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah",
    "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar",
    "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur",
    "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur",
    "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj",
    "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow",
    "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau",
    "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit",
    "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sambhal",
    "Sant Kabir Nagar", "Sant Ravidas Nagar", "Shahjahanpur", "Shamli",
    "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur",
    "Unnao", "Varanasi"
  ],
  "Uttarakhand": [
    "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun",
    "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag",
    "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"
  ],
  "West Bengal": [
    "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur",
    "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram",
    "Kalimpong", "Kolkata", "Maldah", "Murshidabad", "Nadia",
    "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman",
    "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"
  ],
  // Union Territories
  "Andaman and Nicobar Islands": [
    "Nicobar", "North and Middle Andaman", "South Andaman"
  ],
  "Chandigarh": [
    "Chandigarh"
  ],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Dadra and Nagar Haveli", "Daman", "Diu"
  ],
  "Delhi": [
    "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi",
    "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi",
    "West Delhi"
  ],
  "Jammu and Kashmir": [
    "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda",
    "Ganderbal", "Jammu", "Katham", "Kishtwar", "Kulgam",
    "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi",
    "Samba", "Shopian", "Srinagar", "Udhampur"
  ],
  "Ladakh": [
    "Kargil", "Leh"
  ],
  "Lakshadweep": [
    "Lakshadweep"
  ],
  "Puducherry": [
    "Karaikal", "Mahe", "Puducherry", "Yanam"
  ]
};

export const subdivisionsByDistrict: Record<string, string[]> = {
  "Pune": ["Haveli", "Baramati", "Junnar", "Maval", "Mulshi"],
  "Nashik": ["Nashik City", "Igatpuri", "Malegaon", "Sinnar", "Yeola"],
  "Mumbai Suburban": ["Andheri", "Bandra", "Borivali", "Kurla", "Vikhroli"],
  "Bengaluru Urban": ["Bengaluru North", "Bengaluru South", "Anekal", "Yelahanka", "Dasarahalli"],
  "Chennai": ["Chennai Central", "Chennai North", "Chennai South", "Tiruvottiyur", "Ambattur"],
  "Lucknow": ["Lucknow East", "Lucknow West", "Lucknow Central", "Sadar", "Mohanlalganj"],
  "Jaipur": ["Jaipur City", "Jaipur East", "Jaipur West", "Amer", "Sanganer"],
  "Ahmedabad": ["Ahmedabad City", "Ahmedabad Rural", "Bopal", "Kalol", "Sanand"],
};

export const cropResults = [
  { name: "Rice" },
  { name: "Wheat" },
  { name: "Cotton" },
  { name: "Sugarcane" },
  { name: "Maize" },
  { name: "Soybean" },
  { name: "Groundnut" },
  { name: "Pulses" },
  { name: "Millets" },
  { name: "Oilseeds" },
];

export const mockSchemes = [
  { id: 1, title: "PM-KISAN Samman Nidhi", description: "₹6,000 annual income support to small and marginal farmers in 3 installments.", eligibility: "All farmers with cultivable land" },
  { id: 2, title: "Pradhan Mantri Fasal Bima Yojana", description: "Crop insurance scheme with affordable premiums to protect against natural calamities.", eligibility: "All farmers growing notified crops" },
  { id: 3, title: "Soil Health Card Scheme", description: "Free soil testing and nutrient-based recommendations for better crop yield.", eligibility: "All farmers" },
  { id: 4, title: "Kisan Credit Card", description: "Short-term credit for crop production at subsidized interest rates of 4%.", eligibility: "Farmers, fishermen, animal husbandry" },
];

export const mockMandiPrices = [
  { crop: "Wheat", minPrice: 2100, maxPrice: 2350, modalPrice: 2250 },
  { crop: "Rice", minPrice: 1900, maxPrice: 2200, modalPrice: 2050 },
  { crop: "Cotton", minPrice: 5500, maxPrice: 6200, modalPrice: 5800 },
  { crop: "Soybean", minPrice: 3800, maxPrice: 4200, modalPrice: 4000 },
  { crop: "Maize", minPrice: 1800, maxPrice: 2100, modalPrice: 1950 },
];

export const mockMarkets = [
  { name: "Krishi Upaj Mandi", address: "Sector 12, Near Bus Stand", contact: "+91 98765 43210", distance: "2.5 km" },
  { name: "Sahkari Mandi Samiti", address: "NH-48, Industrial Area", contact: "+91 87654 32109", distance: "5.1 km" },
  { name: "Kisan Bazaar", address: "Old City, Market Road", contact: "+91 76543 21098", distance: "7.8 km" },
  { name: "APMC Yard", address: "Ring Road, Plot No. 45", contact: "+91 65432 10987", distance: "12.3 km" },
];
