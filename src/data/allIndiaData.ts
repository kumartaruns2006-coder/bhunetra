// Master Administrative Data for All 28 States and 8 Union Territories of India
// LGD (Local Government Directory) compliant codes and comprehensive district registries

export interface AdminState {
  code: string;
  name: string;
  hindiName: string;
  type: 'STATE' | 'UT';
  lgdCode: string;
  capital: string;
  districtsCount: number;
  isPrimaryDemo?: boolean;
  isDemoDataset?: boolean;
  districts: string[];
}

export const ALL_INDIA_STATES_AND_UTS: AdminState[] = [
  // -------------------------------------------------------------
  // 1. WEST BENGAL (PRIMARY SHOWCASE DEMO LOCATION)
  // -------------------------------------------------------------
  {
    code: 'WB',
    name: 'West Bengal',
    hindiName: 'पश्चिम बंगाल',
    type: 'STATE',
    lgdCode: '19',
    capital: 'Kolkata',
    districtsCount: 23,
    isPrimaryDemo: true,
    districts: [
      'Kolkata',
      'Howrah',
      'North 24 Parganas',
      'South 24 Parganas',
      'Hooghly',
      'Nadia',
      'Murshidabad',
      'Purba Bardhaman',
      'Paschim Bardhaman',
      'Birbhum',
      'Bankura',
      'Purulia',
      'Paschim Medinipur',
      'Purba Medinipur',
      'Jhargram',
      'Malda',
      'Uttar Dinajpur',
      'Dakshin Dinajpur',
      'Jalpaiguri',
      'Alipurduar',
      'Cooch Behar',
      'Darjeeling',
      'Kalimpong'
    ]
  },

  // -------------------------------------------------------------
  // 2. BIHAR (EXISTING DEMO / CORRIDOR REFERENCE LOCATION)
  // -------------------------------------------------------------
  {
    code: 'BR',
    name: 'Bihar',
    hindiName: 'बिहार',
    type: 'STATE',
    lgdCode: '10',
    capital: 'Patna',
    districtsCount: 38,
    isDemoDataset: true,
    districts: [
      'Patna',
      'Saran',
      'Bhojpur',
      'Vaishali',
      'Nalanda',
      'Gaya',
      'Jehanabad',
      'Muzaffarpur',
      'Darbhanga',
      'Bhagalpur',
      'Begusarai',
      'Samastipur',
      'Purnia',
      'Katihar',
      'Rohtas',
      'Kaimur',
      'Buxar',
      'Siwan',
      'Gopalganj',
      'Purba Champaran',
      'Paschim Champaran',
      'Sitamarhi',
      'Sheohar',
      'Madhubani',
      'Supaul',
      'Araria',
      'Kishanganj',
      'Saharsa',
      'Madhepura',
      'Munger',
      'Khagaria',
      'Jamui',
      'Lakhisarai',
      'Sheikhpura',
      'Nawada',
      'Aurangabad',
      'Arwal',
      'Banka'
    ]
  },

  // -------------------------------------------------------------
  // REMAINING 26 STATES OF INDIA
  // -------------------------------------------------------------
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    hindiName: 'आंध्र प्रदेश',
    type: 'STATE',
    lgdCode: '28',
    capital: 'Amaravati',
    districtsCount: 26,
    districts: ['Visakhapatnam', 'Vijayawada (NTR)', 'Guntur', 'Tirupati', 'Kurnool', 'Nellore', 'Anantapur', 'Kadapa', 'Kakinada', 'Chittoor', 'Prakasam', 'Srikakulam', 'Vizianagaram']
  },
  {
    code: 'AR',
    name: 'Arunachal Pradesh',
    hindiName: 'अरुणाचल प्रदेश',
    type: 'STATE',
    lgdCode: '12',
    capital: 'Itanagar',
    districtsCount: 26,
    districts: ['Papum Pare', 'Changlang', 'West Kameng', 'East Siang', 'Tawang', 'Lower Subansiri', 'Lohit']
  },
  {
    code: 'AS',
    name: 'Assam',
    hindiName: 'असम',
    type: 'STATE',
    lgdCode: '18',
    capital: 'Dispur',
    districtsCount: 31,
    districts: ['Kamrup Metropolitan (Guwahati)', 'Kamrup Rural', 'Dibrugarh', 'Silchar (Cachar)', 'Jorhat', 'Nagaon', 'Sonitpur (Tezpur)', 'Tinsukia']
  },
  {
    code: 'CG',
    name: 'Chhattisgarh',
    hindiName: 'छत्तीसगढ़',
    type: 'STATE',
    lgdCode: '22',
    capital: 'Raipur',
    districtsCount: 33,
    districts: ['Raipur', 'Durg (Bhilai)', 'Bilaspur', 'Rajnandgaon', 'Korba', 'Raigarh', 'Bastar (Jagdalpur)', 'Surguja']
  },
  {
    code: 'GA',
    name: 'Goa',
    hindiName: 'गोवा',
    type: 'STATE',
    lgdCode: '30',
    capital: 'Panaji',
    districtsCount: 2,
    districts: ['North Goa', 'South Goa']
  },
  {
    code: 'GJ',
    name: 'Gujarat',
    hindiName: 'गुजरात',
    type: 'STATE',
    lgdCode: '24',
    capital: 'Gandhinagar',
    districtsCount: 33,
    districts: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Kutch', 'Bharuch', 'Mehsana', 'Anand']
  },
  {
    code: 'HR',
    name: 'Haryana',
    hindiName: 'हरियाणा',
    type: 'STATE',
    lgdCode: '06',
    capital: 'Chandigarh',
    districtsCount: 22,
    districts: ['Gurugram', 'Faridabad', 'Sonipat', 'Panipat', 'Ambala', 'Panchkula', 'Rohtak', 'Hisar', 'Karnal', 'Rewari', 'Jhajjar']
  },
  {
    code: 'HP',
    name: 'Himachal Pradesh',
    hindiName: 'हिमाचल प्रदेश',
    type: 'STATE',
    lgdCode: '02',
    capital: 'Shimla',
    districtsCount: 12,
    districts: ['Shimla', 'Kangra (Dharamshala)', 'Mandi', 'Solan', 'Kullu', 'Sirmaur', 'Hamirpur', 'Una', 'Chamba', 'Bilaspur']
  },
  {
    code: 'JH',
    name: 'Jharkhand',
    hindiName: 'झारखंड',
    type: 'STATE',
    lgdCode: '20',
    capital: 'Ranchi',
    districtsCount: 24,
    districts: ['Ranchi', 'East Singhbhum (Jamshedpur)', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar', 'Ramgarh', 'Giridih', 'Palamu']
  },
  {
    code: 'KA',
    name: 'Karnataka',
    hindiName: 'कर्नाटक',
    type: 'STATE',
    lgdCode: '29',
    capital: 'Bengaluru',
    districtsCount: 31,
    districts: ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Dharwad (Hubballi)', 'Dakshina Kannada (Mangaluru)', 'Belagavi', 'Tumakuru', 'Ballari', 'Kalaburagi', 'Shivamogga']
  },
  {
    code: 'KL',
    name: 'Kerala',
    hindiName: 'केरल',
    type: 'STATE',
    lgdCode: '32',
    capital: 'Thiruvananthapuram',
    districtsCount: 14,
    districts: ['Thiruvananthapuram', 'Ernakulam (Kochi)', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Malappuram', 'Kannur', 'Kottayam', 'Alappuzha']
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
    hindiName: 'मध्य प्रदेश',
    type: 'STATE',
    lgdCode: '23',
    capital: 'Bhopal',
    districtsCount: 55,
    districts: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Singrauli']
  },
  {
    code: 'MH',
    name: 'Maharashtra',
    hindiName: 'महाराष्ट्र',
    type: 'STATE',
    lgdCode: '27',
    capital: 'Mumbai',
    districtsCount: 36,
    districts: ['Mumbai City', 'Mumbai Suburban', 'Thane', 'Pune', 'Nagpur', 'Nashik', 'Chhatrapati Sambhajinagar', 'Solapur', 'Kolhapur', 'Raigad', 'Palghar', 'Amravati']
  },
  {
    code: 'MN',
    name: 'Manipur',
    hindiName: 'मणिपुर',
    type: 'STATE',
    lgdCode: '14',
    capital: 'Imphal',
    districtsCount: 16,
    districts: ['Imphal West', 'Imphal East', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Senapati', 'Ukhrul']
  },
  {
    code: 'ML',
    name: 'Meghalaya',
    hindiName: 'मेघालय',
    type: 'STATE',
    lgdCode: '17',
    capital: 'Shillong',
    districtsCount: 12,
    districts: ['East Khasi Hills (Shillong)', 'West Garo Hills (Tura)', 'Ri-Bhoi', 'West Khasi Hills', 'South Garo Hills']
  },
  {
    code: 'MZ',
    name: 'Mizoram',
    hindiName: 'मिजोरम',
    type: 'STATE',
    lgdCode: '15',
    capital: 'Aizawl',
    districtsCount: 11,
    districts: ['Aizawl', 'Lunglei', 'Champhai', 'Kolasib', 'Serchhip', 'Mamit']
  },
  {
    code: 'NL',
    name: 'Nagaland',
    hindiName: 'नागालैंड',
    type: 'STATE',
    lgdCode: '13',
    capital: 'Kohima',
    districtsCount: 16,
    districts: ['Kohima', 'Dimapur', 'Mokokchung', 'Wokha', 'Mon', 'Tuensang', 'Chumoukedima']
  },
  {
    code: 'OD',
    name: 'Odisha',
    hindiName: 'ओडिशा',
    type: 'STATE',
    lgdCode: '21',
    capital: 'Bhubaneswar',
    districtsCount: 30,
    districts: ['Khordha (Bhubaneswar)', 'Cuttack', 'Sundargarh (Rourkela)', 'Ganjam (Berhampur)', 'Puri', 'Sambalpur', 'Balasore', 'Bhadrak', 'Angul', 'Jharsuguda']
  },
  {
    code: 'PB',
    name: 'Punjab',
    hindiName: 'पंजाब',
    type: 'STATE',
    lgdCode: '03',
    capital: 'Chandigarh',
    districtsCount: 23,
    districts: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'SAS Nagar (Mohali)', 'Bathinda', 'Hoshiarpur', 'Pathankot', 'Moga']
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
    hindiName: 'राजस्थान',
    type: 'STATE',
    lgdCode: '08',
    capital: 'Jaipur',
    districtsCount: 50,
    districts: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar', 'Pali', 'Barmer']
  },
  {
    code: 'SK',
    name: 'Sikkim',
    hindiName: 'सिक्किम',
    type: 'STATE',
    lgdCode: '11',
    capital: 'Gangtok',
    districtsCount: 6,
    districts: ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Pakyong', 'Soreng']
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    hindiName: 'तमिलनाडु',
    type: 'STATE',
    lgdCode: '33',
    capital: 'Chennai',
    districtsCount: 38,
    districts: ['Chennai', 'Coimbatore', 'Chengalpattu', 'Kanchipuram', 'Tiruvallur', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore']
  },
  {
    code: 'TG',
    name: 'Telangana',
    hindiName: 'तेलंगाना',
    type: 'STATE',
    lgdCode: '36',
    capital: 'Hyderabad',
    districtsCount: 33,
    districts: ['Hyderabad', 'Medchal-Malkajgiri', 'Rangareddy', 'Warangal', 'Hanamkonda', 'Karimnagar', 'Khammam', 'Nizamabad', 'Nalgonda', 'Sangareddy']
  },
  {
    code: 'TR',
    name: 'Tripura',
    hindiName: 'त्रिपुरा',
    type: 'STATE',
    lgdCode: '16',
    capital: 'Agartala',
    districtsCount: 8,
    districts: ['West Tripura (Agartala)', 'Gomati (Udaipur)', 'South Tripura', 'North Tripura (Dharmanagar)', 'Dhalai', 'Unakoti', 'Sepahijala', 'Khowai']
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    hindiName: 'उत्तर प्रदेश',
    type: 'STATE',
    lgdCode: '09',
    capital: 'Lucknow',
    districtsCount: 75,
    districts: ['Lucknow', 'Kanpur Nagar', 'Gautam Buddha Nagar (Noida)', 'Ghaziabad', 'Varanasi', 'Prayagraj', 'Agra', 'Meerut', 'Gorakhpur', 'Bareilly', 'Aligarh', 'Moradabad', 'Ayodhya', 'Mathura', 'Jhansi']
  },
  {
    code: 'UK',
    name: 'Uttarakhand',
    hindiName: 'उत्तराखंड',
    type: 'STATE',
    lgdCode: '05',
    capital: 'Dehradun',
    districtsCount: 13,
    districts: ['Dehradun', 'Haridwar', 'Nainital (Haldwani)', 'Udham Singh Nagar (Rudrapur)', 'Almora', 'Pauri Garhwal', 'Tehri Garhwal', 'Chamoli']
  },

  // -------------------------------------------------------------
  // 8 UNION TERRITORIES OF INDIA
  // -------------------------------------------------------------
  {
    code: 'DL',
    name: 'Delhi (NCT)',
    hindiName: 'दिल्ली',
    type: 'UT',
    lgdCode: '07',
    capital: 'New Delhi',
    districtsCount: 11,
    districts: ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'South West Delhi', 'North West Delhi', 'North East Delhi', 'South East Delhi', 'Shahdara']
  },
  {
    code: 'JK',
    name: 'Jammu and Kashmir',
    hindiName: 'जम्मू और कश्मीर',
    type: 'UT',
    lgdCode: '01',
    capital: 'Srinagar / Jammu',
    districtsCount: 20,
    districts: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Kathua', 'Budgam', 'Pulwama', 'Kupwara', 'Samba']
  },
  {
    code: 'LA',
    name: 'Ladakh',
    hindiName: 'लद्दाख',
    type: 'UT',
    lgdCode: '37',
    capital: 'Leh',
    districtsCount: 2,
    districts: ['Leh', 'Kargil']
  },
  {
    code: 'CH',
    name: 'Chandigarh',
    hindiName: 'चंडीगढ़',
    type: 'UT',
    lgdCode: '04',
    capital: 'Chandigarh',
    districtsCount: 1,
    districts: ['Chandigarh']
  },
  {
    code: 'PY',
    name: 'Puducherry',
    hindiName: 'पुडुचेरी',
    type: 'UT',
    lgdCode: '34',
    capital: 'Puducherry',
    districtsCount: 4,
    districts: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
  },
  {
    code: 'AN',
    name: 'Andaman and Nicobar Islands',
    hindiName: 'अंडमान और निकोबार द्वीप समूह',
    type: 'UT',
    lgdCode: '35',
    capital: 'Port Blair',
    districtsCount: 3,
    districts: ['South Andaman (Port Blair)', 'North and Middle Andaman', 'Nicobar']
  },
  {
    code: 'DH',
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    hindiName: 'दादरा और नगर हवेली और दमन और दीव',
    type: 'UT',
    lgdCode: '38',
    capital: 'Daman',
    districtsCount: 3,
    districts: ['Daman', 'Diu', 'Dadra and Nagar Haveli']
  },
  {
    code: 'LD',
    name: 'Lakshadweep',
    hindiName: 'लक्षद्वीप',
    type: 'UT',
    lgdCode: '31',
    capital: 'Kavaratti',
    districtsCount: 1,
    districts: ['Lakshadweep (Kavaratti)']
  }
];

// Helper functions for administrative lookups
export const allIndiaAdminService = {
  getAllStatesAndUTs: (): AdminState[] => {
    return [...ALL_INDIA_STATES_AND_UTS];
  },

  getStateByCode: (code: string): AdminState | undefined => {
    return ALL_INDIA_STATES_AND_UTS.find(s => s.code.toUpperCase() === code.toUpperCase());
  },

  getStateByName: (name: string): AdminState | undefined => {
    return ALL_INDIA_STATES_AND_UTS.find(s => s.name.toLowerCase() === name.toLowerCase());
  },

  getDistrictsByState: (stateIdentifier: string): string[] => {
    const found = ALL_INDIA_STATES_AND_UTS.find(
      s => s.code.toUpperCase() === stateIdentifier.toUpperCase() ||
           s.name.toLowerCase() === stateIdentifier.toLowerCase()
    );
    return found ? [...found.districts] : [];
  },

  getAllStatesList: (): { code: string; name: string; type: string }[] => {
    return ALL_INDIA_STATES_AND_UTS.map(s => ({
      code: s.code,
      name: s.name,
      type: s.type
    }));
  }
};

export const getDistrictsForState = (stateIdentifier: string): string[] => {
  return allIndiaAdminService.getDistrictsByState(stateIdentifier);
};
