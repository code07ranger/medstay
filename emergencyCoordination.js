// MedStay Integrated Emergency Healthcare Coordination System (Backend Module)
// Coordinates SOS Emergency Requests, Ambulance Tracking, ER Load Management,
// Patient Transfer Referral, Medical Supply Re-allocation, and AI Recommendations.

const crypto = require('crypto');

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
}

// Initial seed data for Emergency System
function seedEmergencyData(db) {
  let modified = false;

  if (!db.ambulances || db.ambulances.length === 0) {
    db.ambulances = [
      {
        id: 'AMB-BLR-01',
        regNumber: 'KA-01-EA-4412',
        city: 'Bengaluru',
        type: 'ALS (Advanced Life Support)',
        hospitalAffiliation: 'Greenview Multispecialty Hospital',
        hospitalId: 1,
        driver: 'Ramesh Kumar',
        paramedic: 'Nurse Priya S.',
        phone: '+91 98765 43210',
        status: 'Available', // Available, Dispatched, In Transit, Busy, Maintenance
        speedKmH: 0,
        fuelPercent: 92,
        equipment: ['Ventilator', 'Defibrillator', 'Oxygen Port (1000L)', 'Multipara Monitor', 'Syringe Infusion Pump'],
        location: { name: 'Indiranagar 100ft Road', lat: 12.9716, lng: 77.6412 },
        etaMinutes: 4,
        assignedSosId: null,
        updatedAt: new Date().toISOString()
      },
      {
        id: 'AMB-BLR-02',
        regNumber: 'KA-03-MB-8891',
        city: 'Bengaluru',
        type: 'ALS (Advanced Life Support)',
        hospitalAffiliation: 'Lakeside General Hospital',
        hospitalId: 4,
        driver: 'Suresh Gowda',
        paramedic: 'Paramedic Anand V.',
        phone: '+91 98765 43211',
        status: 'Available',
        speedKmH: 0,
        fuelPercent: 84,
        equipment: ['Ventilator', 'ECG Monitor', 'Emergency Suction', 'Oxygen Cylinders'],
        location: { name: 'MG Road Junction', lat: 12.9750, lng: 77.6090 },
        etaMinutes: 6,
        assignedSosId: null,
        updatedAt: new Date().toISOString()
      },
      {
        id: 'AMB-BLR-03',
        regNumber: 'KA-05-TR-2204',
        city: 'Bengaluru',
        type: 'BLS (Basic Life Support)',
        hospitalAffiliation: 'Pinegrove Oncology Centre',
        hospitalId: 9,
        driver: 'Mahesh Reddy',
        paramedic: 'Nurse Sunita K.',
        phone: '+91 98765 43212',
        status: 'Available',
        speedKmH: 0,
        fuelPercent: 78,
        equipment: ['Basic Oxygen', 'First Aid Trauma Kit', 'Stretcher Trolley', 'Automated External Defibrillator'],
        location: { name: 'Whitefield Main Road', lat: 12.9698, lng: 77.7499 },
        etaMinutes: 8,
        assignedSosId: null,
        updatedAt: new Date().toISOString()
      },
      {
        id: 'AMB-MUM-01',
        regNumber: 'MH-01-CR-9021',
        city: 'Mumbai',
        type: 'ALS (Advanced Life Support)',
        hospitalAffiliation: "St. Anne's Care Centre",
        hospitalId: 2,
        driver: 'Pradeep Patil',
        paramedic: 'Dr. Rahul Shinde (Trauma Fellow)',
        phone: '+91 98201 11223',
        status: 'Available',
        speedKmH: 0,
        fuelPercent: 89,
        equipment: ['Portable Transport Ventilator', 'Biphasic Defibrillator', 'Oxygen Station', 'Advanced Airway Kit'],
        location: { name: 'Marine Drive Bay', lat: 18.9438, lng: 72.8232 },
        etaMinutes: 5,
        assignedSosId: null,
        updatedAt: new Date().toISOString()
      },
      {
        id: 'AMB-MUM-02',
        regNumber: 'MH-02-TC-4402',
        city: 'Mumbai',
        type: 'ALS (Advanced Life Support)',
        hospitalAffiliation: 'Metro Orthopedic & Trauma Centre',
        hospitalId: 6,
        driver: 'Vikram Joshi',
        paramedic: 'Nurse Swati Sawant',
        phone: '+91 98201 33445',
        status: 'Available',
        speedKmH: 0,
        fuelPercent: 95,
        equipment: ['Spine Immobilizer', 'Pneumatic Splints', 'Defibrillator', 'Ventilator', 'Oxygen'],
        location: { name: 'Bandra Kurla Complex (BKC)', lat: 19.0657, lng: 72.8687 },
        etaMinutes: 7,
        assignedSosId: null,
        updatedAt: new Date().toISOString()
      },
      {
        id: 'AMB-DEL-01',
        regNumber: 'DL-01-EM-1122',
        city: 'Delhi',
        type: 'ALS (Advanced Life Support)',
        hospitalAffiliation: 'Sunrise Institute of Medical Sciences',
        hospitalId: 3,
        driver: 'Baljit Singh',
        paramedic: 'Nurse Gurpreet Kaur',
        phone: '+91 98110 55667',
        status: 'Available',
        speedKmH: 0,
        fuelPercent: 91,
        equipment: ['Ventilator', 'Defibrillator', 'Oxygen Manifold', 'CPR Mechanical Compressor'],
        location: { name: 'Ring Road AIIMS Flyover', lat: 28.5672, lng: 77.2100 },
        etaMinutes: 4,
        assignedSosId: null,
        updatedAt: new Date().toISOString()
      },
      {
        id: 'AMB-DEL-02',
        regNumber: 'DL-04-CR-8833',
        city: 'Delhi',
        type: 'ALS (Advanced Life Support)',
        hospitalAffiliation: 'Riverside Cardiac Institute',
        hospitalId: 7,
        driver: 'Manoj Sharma',
        paramedic: 'Cardiac Tech Deepak Verma',
        phone: '+91 98110 77889',
        status: 'Available',
        speedKmH: 0,
        fuelPercent: 86,
        equipment: ['12-Lead Tele-ECG', 'Defibrillator', 'External Pacing Unit', 'Oxygen Hub'],
        location: { name: 'Connaught Place Outer Circle', lat: 28.6328, lng: 77.2197 },
        etaMinutes: 5,
        assignedSosId: null,
        updatedAt: new Date().toISOString()
      },
      {
        id: 'AMB-MAA-01',
        regNumber: 'TN-01-ER-3344',
        city: 'Chennai',
        type: 'ALS (Advanced Life Support)',
        hospitalAffiliation: "Harborview Children's Hospital",
        hospitalId: 5,
        driver: 'Karthik Raja',
        paramedic: 'Pediatric Nurse Lakshmi M.',
        phone: '+91 98400 99881',
        status: 'Available',
        speedKmH: 0,
        fuelPercent: 94,
        equipment: ['Neonatal Transport Incubator', 'Pediatric Ventilator', 'Pediatric Defibrillator', 'Oxygen Flowmeter'],
        location: { name: 'Marina Beach Road', lat: 13.0500, lng: 80.2824 },
        etaMinutes: 5,
        assignedSosId: null,
        updatedAt: new Date().toISOString()
      },
      {
        id: 'AMB-MAA-02',
        regNumber: 'TN-09-EM-5511',
        city: 'Chennai',
        type: 'ALS (Advanced Life Support)',
        hospitalAffiliation: 'Everwell Women & Maternity Hospital',
        hospitalId: 8,
        driver: 'Murugan S.',
        paramedic: 'Midwife & Nurse Revathi R.',
        phone: '+91 98400 77662',
        status: 'Available',
        speedKmH: 0,
        fuelPercent: 88,
        equipment: ['Obstetric Delivery Kit', 'Incubator Port', 'Fetal Doppler', 'Oxygen Cylinder'],
        location: { name: 'Anna Nagar Roundtana', lat: 13.0850, lng: 80.2101 },
        etaMinutes: 6,
        assignedSosId: null,
        updatedAt: new Date().toISOString()
      }
    ];
    modified = true;
  }

  if (!db.sosRequests || db.sosRequests.length === 0) {
    db.sosRequests = [
      {
        id: 'SOS-9821',
        reference: 'EMERG-9821',
        patientName: 'Rohan Mehra (Bystander reported)',
        phone: '98450 12345',
        emergencyType: 'Severe Trauma / Accident',
        priority: 'Code Red',
        city: 'Bengaluru',
        location: { address: 'Outer Ring Road, Marathahalli flyover', lat: 12.9569, lng: 77.7011 },
        triageNotes: 'Multi-vehicle collision. Suspected blunt trauma and head injury. Conscious but disoriented.',
        status: 'En Route', // Received, Dispatched, En Route, At Scene, Transporting, Arrived at Hospital, Resolved
        assignedAmbulanceId: 'AMB-BLR-01',
        assignedAmbulanceReg: 'KA-01-EA-4412',
        assignedHospitalId: 1,
        assignedHospitalName: 'Greenview Multispecialty Hospital',
        etaMinutes: 4,
        contactPerson: 'Arun (Witness)',
        createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        dispatchLog: [
          { time: new Date(Date.now() - 8 * 60 * 1000).toISOString(), text: 'SOS signal received via 1-click mobile trigger.' },
          { time: new Date(Date.now() - 7 * 60 * 1000).toISOString(), text: 'AI Triage classified as Code Red. Nearest ALS AMB-BLR-01 dispatched.' },
          { time: new Date(Date.now() - 5 * 60 * 1000).toISOString(), text: 'Greenview Level 1 Trauma ER alerted; Trauma Bay #2 reserved.' }
        ]
      },
      {
        id: 'SOS-9819',
        reference: 'EMERG-9819',
        patientName: 'Kavita Sundaram',
        phone: '98200 45678',
        emergencyType: 'Cardiac Arrest / Acute Chest Pain',
        priority: 'Code Red',
        city: 'Mumbai',
        location: { address: 'Marine Drive Promenade, near Nariman Point', lat: 18.9280, lng: 72.8250 },
        triageNotes: 'Crushing retrosternal chest pain, radiating to left arm. Profuse diaphoresis, dyspnea.',
        status: 'Transporting',
        assignedAmbulanceId: 'AMB-MUM-01',
        assignedAmbulanceReg: 'MH-01-CR-9021',
        assignedHospitalId: 2,
        assignedHospitalName: "St. Anne's Care Centre",
        etaMinutes: 3,
        contactPerson: 'Siddharth (Son)',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        dispatchLog: [
          { time: new Date(Date.now() - 15 * 60 * 1000).toISOString(), text: 'SOS triggered for acute cardiac crisis.' },
          { time: new Date(Date.now() - 14 * 60 * 1000).toISOString(), text: 'AMB-MUM-01 dispatched with 12-lead ECG telemetry kit.' },
          { time: new Date(Date.now() - 6 * 60 * 1000).toISOString(), text: 'Paramedic arrived on scene; STEMI confirmed, patient boarded and en route.' }
        ]
      }
    ];
    modified = true;
  }

  if (!db.emergencyServices || db.emergencyServices.length === 0) {
    db.emergencyServices = [
      {
        id: 1,
        hospitalId: 1,
        hospitalName: 'Greenview Multispecialty Hospital',
        city: 'Bengaluru',
        address: '12 MG Road, Bengaluru',
        phone: '080-2244-9911 / 108',
        serviceType: 'Level 1 Trauma Center & Comprehensive 24/7 ER',
        capabilities: ['24/7 ER', 'Trauma Bay', 'Cardiac Cath Lab', 'Emergency Stroke Team', 'ICU Beds', 'Blood Bank'],
        erCapacity: 24,
        erOccupied: 16,
        triageQueue: 3,
        avgWaitMinutes: 11,
        erStatus: 'Normal', // Normal (green), Elevated (amber), Surge (red), Divert (black/red)
        ventilatorsAvailable: 5,
        icuAvailable: 3,
        lastUpdatedAt: new Date().toISOString()
      },
      {
        id: 2,
        hospitalId: 2,
        hospitalName: "St. Anne's Care Centre",
        city: 'Mumbai',
        address: '45 Marine Road, Mumbai',
        phone: '022-2655-4400 / 108',
        serviceType: 'Emergency & Acute Care Center',
        capabilities: ['24/7 ER', 'Pediatric ER', 'Orthopedic Emergency', 'ICU'],
        erCapacity: 18,
        erOccupied: 14,
        triageQueue: 5,
        avgWaitMinutes: 18,
        erStatus: 'Elevated',
        ventilatorsAvailable: 3,
        icuAvailable: 1,
        lastUpdatedAt: new Date().toISOString()
      },
      {
        id: 3,
        hospitalId: 3,
        hospitalName: 'Sunrise Institute of Medical Sciences',
        city: 'Delhi',
        address: '88 Ring Road, Delhi',
        phone: '011-2988-5500 / 108',
        serviceType: 'Apex Critical Care & Comprehensive Oncology/Trauma',
        capabilities: ['Level 1 Trauma', 'Comprehensive Stroke Center', 'Emergency ICU', 'Toxicology Unit'],
        erCapacity: 30,
        erOccupied: 27,
        triageQueue: 7,
        avgWaitMinutes: 28,
        erStatus: 'Surge',
        ventilatorsAvailable: 4,
        icuAvailable: 3,
        lastUpdatedAt: new Date().toISOString()
      },
      {
        id: 4,
        hospitalId: 4,
        hospitalName: 'Lakeside General Hospital',
        city: 'Bengaluru',
        address: '8 Lake View, Bengaluru',
        phone: '080-2566-3322 / 108',
        serviceType: 'Community Emergency & Acute Maternity Center',
        capabilities: ['24/7 ER', 'General Resuscitation', 'Obstetric Emergency', 'Burn Unit'],
        erCapacity: 20,
        erOccupied: 10,
        triageQueue: 2,
        avgWaitMinutes: 8,
        erStatus: 'Normal',
        ventilatorsAvailable: 4,
        icuAvailable: 2,
        lastUpdatedAt: new Date().toISOString()
      },
      {
        id: 5,
        hospitalId: 5,
        hospitalName: "Harborview Children's Hospital",
        city: 'Chennai',
        address: '19 Beach Road, Chennai',
        phone: '044-2811-9922 / 108',
        serviceType: 'Dedicated Pediatric & Neonatal Emergency Center',
        capabilities: ['Pediatric ER', 'NICU / PICU', 'Pediatric Trauma', 'Poisoning Care'],
        erCapacity: 16,
        erOccupied: 9,
        triageQueue: 1,
        avgWaitMinutes: 7,
        erStatus: 'Normal',
        ventilatorsAvailable: 6,
        icuAvailable: 2,
        lastUpdatedAt: new Date().toISOString()
      },
      {
        id: 6,
        hospitalId: 6,
        hospitalName: 'Metro Orthopedic & Trauma Centre',
        city: 'Mumbai',
        address: '77 Central Avenue, Mumbai',
        phone: '022-2433-8877 / 108',
        serviceType: 'Major Trauma & Limb Reconstruction Center',
        capabilities: ['Trauma Bay', 'Emergency OT', 'Spinal Cord Injury Unit', 'Microsurgery'],
        erCapacity: 22,
        erOccupied: 19,
        triageQueue: 6,
        avgWaitMinutes: 24,
        erStatus: 'Elevated',
        ventilatorsAvailable: 3,
        icuAvailable: 1,
        lastUpdatedAt: new Date().toISOString()
      },
      {
        id: 7,
        hospitalId: 7,
        hospitalName: 'Riverside Cardiac Institute',
        city: 'Delhi',
        address: '4 Riverside Drive, Delhi',
        phone: '011-2677-1122 / 108',
        serviceType: 'Comprehensive 24/7 Cardiac Emergency & Cath Lab Hub',
        capabilities: ['Primary PCI Cath Lab (24/7)', 'Cardiac Resuscitation Unit', 'CCU / ICU', 'ECMO Hub'],
        erCapacity: 18,
        erOccupied: 11,
        triageQueue: 2,
        avgWaitMinutes: 9,
        erStatus: 'Normal',
        ventilatorsAvailable: 7,
        icuAvailable: 4,
        lastUpdatedAt: new Date().toISOString()
      },
      {
        id: 8,
        hospitalId: 8,
        hospitalName: 'Everwell Women & Maternity Hospital',
        city: 'Chennai',
        address: '21 Anna Nagar, Chennai',
        phone: '044-2622-4411 / 108',
        serviceType: 'High-Risk Obstetric & Maternal Emergency Hospital',
        capabilities: ['Maternal Emergency Resuscitation', 'Emergency C-Section OT', 'Blood Transfusion Port'],
        erCapacity: 14,
        erOccupied: 13,
        triageQueue: 4,
        avgWaitMinutes: 20,
        erStatus: 'Elevated',
        ventilatorsAvailable: 2,
        icuAvailable: 0,
        lastUpdatedAt: new Date().toISOString()
      },
      {
        id: 9,
        hospitalId: 9,
        hospitalName: 'Pinegrove Oncology Centre',
        city: 'Bengaluru',
        address: '55 Tech Park Road, Bengaluru',
        phone: '080-4100-7788 / 108',
        serviceType: 'Oncology Acute Care & Neutropenic Emergency Unit',
        capabilities: ['Emergency Infusion', 'Septic Shock Management', 'Surgical Resuscitation', 'ICU'],
        erCapacity: 16,
        erOccupied: 8,
        triageQueue: 1,
        avgWaitMinutes: 6,
        erStatus: 'Normal',
        ventilatorsAvailable: 4,
        icuAvailable: 2,
        lastUpdatedAt: new Date().toISOString()
      }
    ];
    modified = true;
  }

  if (!db.criticalSupplies || db.criticalSupplies.length === 0) {
    db.criticalSupplies = [
      {
        id: 'SUP-01',
        hospitalId: 1,
        hospitalName: 'Greenview Multispecialty Hospital',
        city: 'Bengaluru',
        item: 'Medical Oxygen (Liquid & High-Pressure D Cylinders)',
        category: 'Respiratory',
        available: 3800,
        capacity: 5000,
        unit: 'Liters equivalent',
        minThreshold: 1200,
        status: 'Optimal',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'SUP-02',
        hospitalId: 1,
        hospitalName: 'Greenview Multispecialty Hospital',
        city: 'Bengaluru',
        item: 'ICU Mechanical Ventilators (Invasive & BiPAP)',
        category: 'Equipment',
        available: 5,
        capacity: 12,
        unit: 'units available',
        minThreshold: 2,
        status: 'Optimal',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'SUP-03',
        hospitalId: 1,
        hospitalName: 'Greenview Multispecialty Hospital',
        city: 'Bengaluru',
        item: 'Emergency Epinephrine (1mg/mL ampoules)',
        category: 'Critical Medication',
        available: 48,
        capacity: 80,
        unit: 'vials',
        minThreshold: 15,
        status: 'Optimal',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'SUP-04',
        hospitalId: 4,
        hospitalName: 'Lakeside General Hospital',
        city: 'Bengaluru',
        item: 'Medical Oxygen (Cylinders)',
        category: 'Respiratory',
        available: 420,
        capacity: 2500,
        unit: 'Liters equivalent',
        minThreshold: 800,
        status: 'Critical Shortage', // Surplus, Optimal, Adequate, Critical Shortage
        minDeficit: 380,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'SUP-05',
        hospitalId: 4,
        hospitalName: 'Lakeside General Hospital',
        city: 'Bengaluru',
        item: 'Polyvalent Snake Antivenom (Lyophilized)',
        category: 'Critical Medication',
        available: 1,
        capacity: 20,
        unit: 'vials',
        minThreshold: 5,
        status: 'Critical Shortage',
        minDeficit: 4,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'SUP-06',
        hospitalId: 1,
        hospitalName: 'Greenview Multispecialty Hospital',
        city: 'Bengaluru',
        item: 'Polyvalent Snake Antivenom (Lyophilized)',
        category: 'Critical Medication',
        available: 22,
        capacity: 25,
        unit: 'vials',
        minThreshold: 6,
        status: 'Surplus',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'SUP-07',
        hospitalId: 2,
        hospitalName: "St. Anne's Care Centre",
        city: 'Mumbai',
        item: 'Emergency Thrombolytic (Alteplase / Tenecteplase)',
        category: 'Critical Medication',
        available: 2,
        capacity: 10,
        unit: 'vials',
        minThreshold: 4,
        status: 'Critical Shortage',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'SUP-08',
        hospitalId: 6,
        hospitalName: 'Metro Orthopedic & Trauma Centre',
        city: 'Mumbai',
        item: 'Emergency Thrombolytic (Alteplase / Tenecteplase)',
        category: 'Critical Medication',
        available: 14,
        capacity: 15,
        unit: 'vials',
        minThreshold: 4,
        status: 'Surplus',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'SUP-09',
        hospitalId: 8,
        hospitalName: 'Everwell Women & Maternity Hospital',
        city: 'Chennai',
        item: 'O-Negative Emergency Universal Red Blood Cells (PRBC)',
        category: 'Blood & Fluids',
        available: 1,
        capacity: 10,
        unit: 'units',
        minThreshold: 3,
        status: 'Critical Shortage',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'SUP-10',
        hospitalId: 5,
        hospitalName: "Harborview Children's Hospital",
        city: 'Chennai',
        item: 'O-Negative Emergency Universal Red Blood Cells (PRBC)',
        category: 'Blood & Fluids',
        available: 8,
        capacity: 12,
        unit: 'units',
        minThreshold: 3,
        status: 'Surplus',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'SUP-11',
        hospitalId: 3,
        hospitalName: 'Sunrise Institute of Medical Sciences',
        city: 'Delhi',
        item: 'Biphasic Defibrillator with Pacing Leads',
        category: 'Equipment',
        available: 2,
        capacity: 8,
        unit: 'units available',
        minThreshold: 3,
        status: 'Critical Shortage',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'SUP-12',
        hospitalId: 7,
        hospitalName: 'Riverside Cardiac Institute',
        city: 'Delhi',
        item: 'Biphasic Defibrillator with Pacing Leads',
        category: 'Equipment',
        available: 9,
        capacity: 10,
        unit: 'units available',
        minThreshold: 3,
        status: 'Surplus',
        lastUpdated: new Date().toISOString()
      }
    ];
    modified = true;
  }

  if (!db.patientTransfers || db.patientTransfers.length === 0) {
    db.patientTransfers = [
      {
        id: 'TRF-101',
        reference: 'REF-TRF-101',
        patientName: 'Ananya Rao',
        age: 54,
        gender: 'Female',
        city: 'Bengaluru',
        referringHospitalId: 4,
        referringHospitalName: 'Lakeside General Hospital',
        receivingHospitalId: 1,
        receivingHospitalName: 'Greenview Multispecialty Hospital',
        transferReason: 'Emergent Coronary Angioplasty / STEMI Cath Lab deficit at origin facility.',
        authorizedDoctor: 'Dr. M. S. Venkatesh (Reg #KMC-44812)',
        clinicalAssessment: 'Authorized inter-facility emergency referral: Patient is stabilized with Dual Antiplatelet & Heparin bolus. Requires primary PCI within 90 minutes. Telemetric monitoring mandatory during transfer.',
        reservedRoomType: 'ICU',
        ambulanceAssigned: 'AMB-BLR-02',
        status: 'Ambulance En Route', // Pending Review, Approved & Bed Reserved, Ambulance En Route, Arrived & Admitted, Rejected
        urgency: 'Emergency (Immediate)',
        createdAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'TRF-102',
        reference: 'REF-TRF-102',
        patientName: 'Vikramaditya Sen',
        age: 38,
        gender: 'Male',
        city: 'Mumbai',
        referringHospitalId: 2,
        referringHospitalName: "St. Anne's Care Centre",
        receivingHospitalId: 6,
        receivingHospitalName: 'Metro Orthopedic & Trauma Centre',
        transferReason: 'Complex Pelvic & Femoral Polytrauma requiring specialized limb-salvage surgical team.',
        authorizedDoctor: 'Dr. F. D’Souza (Reg #MMC-77912)',
        clinicalAssessment: 'Hemodynamically stabilized with external pelvis binder and 2 units packed RBC. Specialist trauma orthopedic surgery required immediately.',
        reservedRoomType: 'ICU',
        ambulanceAssigned: 'AMB-MUM-02',
        status: 'Approved & Bed Reserved',
        urgency: 'Urgent (< 2 hours)',
        createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    modified = true;
  }

  if (!db.supplyTransfers || db.supplyTransfers.length === 0) {
    db.supplyTransfers = [
      {
        id: 'STR-501',
        reference: 'SUP-TRF-501',
        requestingHospitalId: 4,
        requestingHospitalName: 'Lakeside General Hospital',
        supplyingHospitalId: 1,
        supplyingHospitalName: 'Greenview Multispecialty Hospital',
        city: 'Bengaluru',
        item: 'Polyvalent Snake Antivenom (Lyophilized)',
        quantity: 5,
        unit: 'vials',
        urgency: 'Immediate Emergency',
        clinicalReason: 'Critical envenomation admitted; local stock depleted to 1 vial.',
        status: 'In Transit', // Requested, Approved, In Transit, Delivered, Cancelled
        courierOrAmbulance: 'AMB-BLR-03 (Rapid Logistics)',
        createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
        dispatchedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        deliveredAt: null
      },
      {
        id: 'STR-502',
        reference: 'SUP-TRF-502',
        requestingHospitalId: 8,
        requestingHospitalName: 'Everwell Women & Maternity Hospital',
        supplyingHospitalId: 5,
        supplyingHospitalName: "Harborview Children's Hospital",
        city: 'Chennai',
        item: 'O-Negative Emergency Universal Red Blood Cells (PRBC)',
        quantity: 3,
        unit: 'units',
        urgency: 'Critical',
        clinicalReason: 'Emergency peripartum hemorrhage with uncrossmatched blood needed.',
        status: 'Approved',
        courierOrAmbulance: 'Cold-chain Blood Courier TN-01',
        createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        dispatchedAt: null,
        deliveredAt: null
      }
    ];
    modified = true;
  }

  return modified;
}

// Compute AI Resource Recommendations
function generateAiRecommendations(db, cityFilter) {
  const recommendations = [];
  const activeCity = (!cityFilter || cityFilter === 'All') ? null : cityFilter;

  // 1. ER Load Balancing & Divert Analysis
  const erList = (db.emergencyServices || []).filter(e => !activeCity || e.city === activeCity);
  erList.forEach(er => {
    const occupancyPercent = er.erCapacity > 0 ? Math.round((er.erOccupied / er.erCapacity) * 100) : 0;
    if (occupancyPercent >= 85 || er.erStatus === 'Surge' || er.erStatus === 'Divert') {
      // Find candidate relief hospital in same city
      const alternative = erList
        .filter(other => other.id !== er.id && other.city === er.city && (other.erOccupied / other.erCapacity) < 0.70)
        .sort((a, b) => (a.erOccupied / a.erCapacity) - (b.erOccupied / b.erCapacity))[0];

      recommendations.push({
        id: 'REC-LOAD-' + er.id,
        category: 'ER Load Balancing & Diversion',
        priority: occupancyPercent >= 90 ? 'Critical' : 'High',
        title: `Surge Overload at ${er.hospitalName} (${occupancyPercent}% ER capacity)`,
        description: `${er.hospitalName} is experiencing severe emergency triage congestion (${er.triageQueue} patients in queue, avg wait ${er.avgWaitMinutes} mins).`,
        actionPlan: alternative 
          ? `Recommend temporary Divert protocol for non-trauma inbound ambulances to ${alternative.hospitalName} (only ${Math.round((alternative.erOccupied / alternative.erCapacity) * 100)}% occupied, ${alternative.ventilatorsAvailable} ventilators available).`
          : `Recommend mobilizing standby emergency staff and transitioning triage ward to rapid outpatient stabilization.`,
        affectedFacility: er.hospitalName,
        targetFacility: alternative ? alternative.hospitalName : 'Regional Standby',
        city: er.city,
        impact: 'Reduces critical triage wait time by an estimated 45-60%, preventing ER gridlock.'
      });
    }
  });

  // 2. Critical Medical Supply Re-allocation Analysis
  const supplies = (db.criticalSupplies || []).filter(s => !activeCity || s.city === activeCity);
  const shortages = supplies.filter(s => s.status === 'Critical Shortage' || (s.available <= s.minThreshold));

  shortages.forEach(shortage => {
    // Find matching surplus in same city or nearby
    const surplusCandidate = supplies.find(s => 
      s.hospitalId !== shortage.hospitalId && 
      s.item === shortage.item && 
      (s.status === 'Surplus' || s.available > (s.minThreshold * 2))
    );

    if (surplusCandidate) {
      const suggestedTransferQty = Math.min(
        Math.max(1, Math.floor(surplusCandidate.available / 3)),
        (shortage.minThreshold * 2) - shortage.available
      );

      recommendations.push({
        id: 'REC-SUP-' + shortage.id,
        category: 'Medical Supply Re-allocation',
        priority: 'High',
        title: `Critical Supply Deficit: ${shortage.item}`,
        description: `${shortage.hospitalName} (${shortage.city}) has only ${shortage.available} ${shortage.unit} remaining (safety threshold: ${shortage.minThreshold}).`,
        actionPlan: `Automated re-allocation recommendation: Transfer ${suggestedTransferQty} ${shortage.unit} from ${surplusCandidate.hospitalName} (surplus stock: ${surplusCandidate.available} ${surplusCandidate.unit}) via rapid medical courier.`,
        affectedFacility: shortage.hospitalName,
        targetFacility: surplusCandidate.hospitalName,
        city: shortage.city,
        item: shortage.item,
        suggestedQty: suggestedTransferQty,
        canAutoInitiate: true,
        sourceId: surplusCandidate.hospitalId,
        destinationId: shortage.hospitalId,
        impact: `Eliminates zero-stock vulnerability at ${shortage.hospitalName} within an estimated 30–45 minute transit window.`
      });
    } else {
      recommendations.push({
        id: 'REC-SUP-EXT-' + shortage.id,
        category: 'Regional Supply Procurement Alert',
        priority: 'Medium',
        title: `Regional Deficit Alert: ${shortage.item}`,
        description: `Multiple facilities in ${shortage.city} are reporting constrained stock of ${shortage.item}.`,
        actionPlan: `Alert State Health Mission & Central Medical Warehouse for expedited emergency shipment.`,
        affectedFacility: shortage.hospitalName,
        city: shortage.city,
        item: shortage.item,
        impact: 'Maintains minimum regional buffer before local stocks reach zero.'
      });
    }
  });

  // 3. Ambulance Pre-Positioning Optimization
  const ambulances = (db.ambulances || []).filter(a => !activeCity || a.city === activeCity);
  const busyCount = ambulances.filter(a => a.status !== 'Available').length;
  const totalCount = ambulances.length;
  if (totalCount > 0 && (busyCount / totalCount) >= 0.5) {
    recommendations.push({
      id: 'REC-AMB-DISPATCH',
      category: 'Fleet Dispatch Readiness',
      priority: 'Medium',
      title: 'High Fleet Utilization in ' + (activeCity || 'Regional Zone'),
      description: `${busyCount} of ${totalCount} ambulances are currently deployed or in transit (${Math.round((busyCount / totalCount) * 100)}% fleet load).`,
      actionPlan: 'Place auxiliary BLS ambulances on active standby and alert mutual-aid private ambulance partners.',
      city: activeCity || 'Regional',
      impact: 'Preserves rapid response window under 8 minutes for high-priority Code Red emergencies.'
    });
  }

  // 4. ICU Bed Availability & Inter-hospital referral readiness
  const hospitals = (db.hospitals || []).filter(h => h.verificationStatus === 'Verified' && (!activeCity || h.city === activeCity));
  let totalIcu = 0;
  let totalIcuAvail = 0;
  hospitals.forEach(h => {
    (h.rooms || []).forEach(r => {
      if (r.type === 'ICU') {
        totalIcu += Number(r.totalBeds || r.beds || 0);
        totalIcuAvail += Number(r.beds || 0);
      }
    });
  });

  if (totalIcu > 0 && (totalIcuAvail / totalIcu) < 0.25) {
    recommendations.push({
      id: 'REC-ICU-CRITICAL',
      category: 'Critical Bed Reserve',
      priority: 'Critical',
      title: 'Regional ICU Bed Saturation Alert',
      description: `Only ${totalIcuAvail} of ${totalIcu} ICU beds remain available across ${hospitals.length} verified hospitals in ${activeCity || 'the network'} (${Math.round((totalIcuAvail / totalIcu) * 100)}% buffer).`,
      actionPlan: 'Activate regional step-down transfer protocols to transition stable patients from ICU to High Dependency Units (HDU) to free up critical emergency capacity.',
      city: activeCity || 'Multi-City',
      impact: 'Restores emergency ICU surge buffer without denying critical trauma admissions.'
    });
  }

  return {
    recommendations,
    generatedAt: new Date().toISOString(),
    engineVersion: 'MedStay AI Coordination Engine v2.4 (Clinical Logistics Focus)',
    medicalDisclaimer: 'Notice: AI-powered recommendations assist emergency healthcare administrators, coordinators, and dispatchers with resource allocation, logistics, and facility discovery. These algorithms DO NOT make autonomous medical diagnoses, do not prescribe medication, and must not replace authorized clinical assessments.'
  };
}

// Main API Handler for Emergency System
async function handleEmergencyCoordination(req, res, pathname, q, db, user, save, send, body) {
  // Ensure seed data is populated
  const wasSeeded = seedEmergencyData(db);
  if (wasSeeded) {
    save(db);
  }

  // Helper check for authorization
  const isAuth = !!user;
  const isAdminOrOwner = user && (user.role === 'admin' || user.role === 'owner');

  // 1. GET /api/emergency/overview
  if (req.method === 'GET' && pathname === '/api/emergency/overview') {
    const city = q.city || 'All';
    let ambulances = db.ambulances || [];
    let sosRequests = db.sosRequests || [];
    let services = db.emergencyServices || [];
    let supplies = db.criticalSupplies || [];
    let transfers = db.patientTransfers || [];
    let supplyTransfers = db.supplyTransfers || [];

    if (city !== 'All') {
      ambulances = ambulances.filter(a => a.city === city);
      sosRequests = sosRequests.filter(s => s.city === city);
      services = services.filter(s => s.city === city);
      supplies = supplies.filter(s => s.city === city);
      transfers = transfers.filter(t => t.city === city);
      supplyTransfers = supplyTransfers.filter(st => st.city === city);
    }

    const availableAmbulances = ambulances.filter(a => a.status === 'Available').length;
    const activeSos = sosRequests.filter(s => s.status !== 'Resolved').length;
    const totalErBeds = services.reduce((acc, s) => acc + (Number(s.erCapacity) || 0), 0);
    const occupiedErBeds = services.reduce((acc, s) => acc + (Number(s.erOccupied) || 0), 0);
    const criticalShortages = supplies.filter(s => s.status === 'Critical Shortage').length;
    const activeTransfers = transfers.filter(t => t.status !== 'Arrived & Admitted' && t.status !== 'Rejected').length;
    const activeSupplyTransfers = supplyTransfers.filter(st => st.status !== 'Delivered' && st.status !== 'Cancelled').length;

    return send(res, 200, {
      city,
      stats: {
        totalAmbulances: ambulances.length,
        availableAmbulances,
        activeSos,
        totalErBeds,
        availableErBeds: Math.max(0, totalErBeds - occupiedErBeds),
        erOccupancyRate: totalErBeds > 0 ? Math.round((occupiedErBeds / totalErBeds) * 100) : 0,
        criticalSupplyShortages: criticalShortages,
        activePatientTransfers: activeTransfers,
        activeSupplyTransfers: activeSupplyTransfers
      },
      lastUpdated: new Date().toISOString()
    });
  }

  // 2. GET /api/emergency/sos - list active or all SOS requests
  if (req.method === 'GET' && pathname === '/api/emergency/sos') {
    const city = q.city || 'All';
    let list = db.sosRequests || [];
    if (city !== 'All') {
      list = list.filter(s => s.city === city);
    }
    // Sort active ones first, then newest
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return send(res, 200, { sosRequests: list });
  }

  // 3. POST /api/emergency/sos - create instant SOS emergency request
  if (req.method === 'POST' && pathname === '/api/emergency/sos') {
    const data = await body(req);
    const emergencyType = String(data.emergencyType || 'General Critical Emergency').trim();
    const city = String(data.city || 'Bengaluru').trim();
    const address = String(data.address || 'Reported Location').trim();
    const phone = String(data.phone || (user ? user.phone : '') || '').trim();
    const patientName = String(data.patientName || (user ? user.name : 'Emergency Caller')).trim();
    const priority = String(data.priority || 'Code Red').trim();
    const triageNotes = String(data.triageNotes || 'Rapid SOS distress signal initiated. Dispatch required immediately.').trim();

    if (!emergencyType || !city) {
      return send(res, 400, { error: 'Emergency type and city are required.' });
    }

    // Auto-match nearest available ambulance in the city
    const availableAmb = (db.ambulances || []).find(a => a.city === city && a.status === 'Available');
    const assignedAmb = availableAmb || (db.ambulances || []).find(a => a.city === city) || db.ambulances[0];

    // Find nearest / optimal hospital based on specialty or capacity
    const cityHospitals = (db.emergencyServices || []).filter(h => h.city === city);
    let targetHospital = null;
    if (emergencyType.includes('Cardiac') || emergencyType.includes('Chest Pain')) {
      targetHospital = cityHospitals.find(h => h.capabilities.some(c => c.includes('Cath Lab') || c.includes('Cardiac')));
    } else if (emergencyType.includes('Pediatric') || emergencyType.includes('Children')) {
      targetHospital = cityHospitals.find(h => h.capabilities.some(c => c.includes('Pediatric')));
    } else if (emergencyType.includes('Maternal') || emergencyType.includes('Maternity')) {
      targetHospital = cityHospitals.find(h => h.capabilities.some(c => c.includes('Obstetric') || c.includes('Maternal')));
    } else if (emergencyType.includes('Trauma') || emergencyType.includes('Accident')) {
      targetHospital = cityHospitals.find(h => h.capabilities.some(c => c.includes('Trauma')));
    }
    if (!targetHospital && cityHospitals.length > 0) {
      // Pick hospital with lowest ER occupancy
      targetHospital = [...cityHospitals].sort((a, b) => (a.erOccupied / a.erCapacity) - (b.erOccupied / b.erCapacity))[0];
    }
    if (!targetHospital && db.emergencyServices.length > 0) {
      targetHospital = db.emergencyServices[0];
    }

    const sosId = 'SOS-' + Math.floor(1000 + Math.random() * 9000);
    const newSos = {
      id: sosId,
      reference: 'EMERG-' + sosId.split('-')[1],
      patientName,
      phone: phone || 'Not provided',
      emergencyType,
      priority,
      city,
      location: {
        address,
        lat: data.lat || 12.9716,
        lng: data.lng || 77.5946
      },
      triageNotes,
      status: 'Dispatched',
      assignedAmbulanceId: assignedAmb ? assignedAmb.id : null,
      assignedAmbulanceReg: assignedAmb ? assignedAmb.regNumber : 'Standby Unit',
      assignedHospitalId: targetHospital ? targetHospital.hospitalId : 1,
      assignedHospitalName: targetHospital ? targetHospital.hospitalName : 'Regional Emergency Hospital',
      etaMinutes: Math.floor(4 + Math.random() * 5),
      contactPerson: data.contactPerson || patientName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dispatchLog: [
        { time: new Date().toISOString(), text: `SOS request created with priority ${priority}.` },
        { time: new Date().toISOString(), text: `Smart Dispatch assigned ${assignedAmb ? assignedAmb.id + ' (' + assignedAmb.type + ')' : 'Local emergency unit'}. ETA: 5 mins.` },
        { time: new Date().toISOString(), text: `Receiving facility alerted: ${targetHospital ? targetHospital.hospitalName : 'Nearest ER'}. Triage alert issued.` }
      ]
    };

    if (assignedAmb) {
      assignedAmb.status = 'Dispatched';
      assignedAmb.assignedSosId = sosId;
      assignedAmb.updatedAt = new Date().toISOString();
    }

    db.sosRequests.unshift(newSos);
    save(db);

    return send(res, 201, {
      sos: newSos,
      message: 'SOS successfully registered and emergency dispatch initiated.'
    });
  }

  // 4. PATCH /api/emergency/sos/:id - update SOS status
  if (req.method === 'PATCH' && pathname.startsWith('/api/emergency/sos/')) {
    const id = pathname.split('/').pop();
    const item = (db.sosRequests || []).find(s => s.id === id || s.reference === id);
    if (!item) return send(res, 404, { error: 'SOS request not found.' });

    const data = await body(req);
    const newStatus = data.status;
    const allowed = ['Received', 'Dispatched', 'En Route', 'At Scene', 'Transporting', 'Arrived at Hospital', 'Resolved'];
    if (newStatus && !allowed.includes(newStatus)) {
      return send(res, 400, { error: 'Invalid status. Allowed: ' + allowed.join(', ') });
    }

    if (newStatus) {
      item.status = newStatus;
      item.dispatchLog.push({
        time: new Date().toISOString(),
        text: `Status updated to "${newStatus}"${data.note ? ' - ' + data.note : ''}.`
      });

      // If resolved, free up ambulance
      if (newStatus === 'Resolved' && item.assignedAmbulanceId) {
        const amb = (db.ambulances || []).find(a => a.id === item.assignedAmbulanceId);
        if (amb) {
          amb.status = 'Available';
          amb.assignedSosId = null;
          amb.updatedAt = new Date().toISOString();
        }
      }
    }

    if (data.etaMinutes !== undefined) {
      item.etaMinutes = Math.max(0, Number(data.etaMinutes));
    }
    if (data.triageNotes) {
      item.triageNotes = String(data.triageNotes);
    }
    item.updatedAt = new Date().toISOString();
    save(db);

    return send(res, 200, { sos: item });
  }

  // 5. GET /api/emergency/ambulances - list ambulance fleet
  if (req.method === 'GET' && pathname === '/api/emergency/ambulances') {
    const city = q.city || 'All';
    const status = q.status || 'All';
    let list = db.ambulances || [];

    if (city !== 'All') {
      list = list.filter(a => a.city === city);
    }
    if (status !== 'All') {
      list = list.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }

    return send(res, 200, { ambulances: list });
  }

  // 6. PATCH /api/emergency/ambulances/:id - update ambulance telemetry or status
  if (req.method === 'PATCH' && pathname.startsWith('/api/emergency/ambulances/')) {
    const id = pathname.split('/').pop();
    const amb = (db.ambulances || []).find(a => a.id === id);
    if (!amb) return send(res, 404, { error: 'Ambulance not found.' });

    const data = await body(req);
    if (data.status) amb.status = data.status;
    if (data.location) amb.location = data.location;
    if (data.speedKmH !== undefined) amb.speedKmH = Number(data.speedKmH);
    if (data.fuelPercent !== undefined) amb.fuelPercent = Number(data.fuelPercent);
    if (data.etaMinutes !== undefined) amb.etaMinutes = Number(data.etaMinutes);
    amb.updatedAt = new Date().toISOString();

    save(db);
    return send(res, 200, { ambulance: amb });
  }

  // 7. GET /api/emergency/services - nearby emergency rooms and trauma centers
  if (req.method === 'GET' && pathname === '/api/emergency/services') {
    const city = q.city || 'All';
    let list = db.emergencyServices || [];
    if (city !== 'All') {
      list = list.filter(s => s.city === city);
    }
    return send(res, 200, { services: list });
  }

  // 8. PATCH /api/emergency/services/:id/er-load - update ER load & capacity
  if (req.method === 'PATCH' && pathname.includes('/er-load')) {
    const parts = pathname.split('/');
    const id = Number(parts[parts.indexOf('services') + 1]);
    const service = (db.emergencyServices || []).find(s => s.id === id);
    if (!service) return send(res, 404, { error: 'Emergency service facility not found.' });

    const data = await body(req);
    if (data.erOccupied !== undefined) service.erOccupied = Math.max(0, Number(data.erOccupied));
    if (data.erCapacity !== undefined) service.erCapacity = Math.max(1, Number(data.erCapacity));
    if (data.triageQueue !== undefined) service.triageQueue = Math.max(0, Number(data.triageQueue));
    if (data.avgWaitMinutes !== undefined) service.avgWaitMinutes = Math.max(0, Number(data.avgWaitMinutes));
    if (data.erStatus) service.erStatus = data.erStatus; // Normal, Elevated, Surge, Divert
    if (data.ventilatorsAvailable !== undefined) service.ventilatorsAvailable = Math.max(0, Number(data.ventilatorsAvailable));
    if (data.icuAvailable !== undefined) service.icuAvailable = Math.max(0, Number(data.icuAvailable));

    service.lastUpdatedAt = new Date().toISOString();
    save(db);
    return send(res, 200, { service });
  }

  // 9. GET /api/emergency/supplies - critical medicine and equipment inventory
  if (req.method === 'GET' && pathname === '/api/emergency/supplies') {
    const city = q.city || 'All';
    const category = q.category || 'All';
    let list = db.criticalSupplies || [];

    if (city !== 'All') list = list.filter(s => s.city === city);
    if (category !== 'All') list = list.filter(s => s.category.toLowerCase() === category.toLowerCase());

    return send(res, 200, { supplies: list });
  }

  // 10. POST /api/emergency/supplies/reallocate - initiate supply transfer request
  if (req.method === 'POST' && pathname === '/api/emergency/supplies/reallocate') {
    const data = await body(req);
    const requestingHospitalId = Number(data.requestingHospitalId);
    const supplyingHospitalId = Number(data.supplyingHospitalId);
    const item = String(data.item || '').trim();
    const quantity = Math.max(1, Number(data.quantity || 1));
    const urgency = String(data.urgency || 'Critical').trim();
    const clinicalReason = String(data.clinicalReason || 'Critical replenishment for emergency department.').trim();

    const reqHosp = (db.hospitals || []).find(h => h.id === requestingHospitalId);
    const supHosp = (db.hospitals || []).find(h => h.id === supplyingHospitalId);

    if (!item) return send(res, 400, { error: 'Supply item name is required.' });

    const newTransfer = {
      id: 'STR-' + Math.floor(100 + Math.random() * 900),
      reference: 'SUP-TRF-' + Math.floor(1000 + Math.random() * 9000),
      requestingHospitalId,
      requestingHospitalName: reqHosp ? reqHosp.name : (data.requestingHospitalName || 'Requesting Hospital'),
      supplyingHospitalId,
      supplyingHospitalName: supHosp ? supHosp.name : (data.supplyingHospitalName || 'Supplying Facility'),
      city: reqHosp ? reqHosp.city : (data.city || 'Bengaluru'),
      item,
      quantity,
      unit: data.unit || 'units',
      urgency,
      clinicalReason,
      status: 'Approved', // Auto-approved under emergency protocol
      courierOrAmbulance: 'Medical Logistics Courier ' + Math.floor(10 + Math.random() * 90),
      createdAt: new Date().toISOString(),
      dispatchedAt: new Date().toISOString(),
      deliveredAt: null
    };

    db.supplyTransfers.unshift(newTransfer);

    // Update supplying stock if present
    const sourceStock = (db.criticalSupplies || []).find(s => s.hospitalId === supplyingHospitalId && s.item === item);
    if (sourceStock && sourceStock.available >= quantity) {
      sourceStock.available -= quantity;
      sourceStock.lastUpdated = new Date().toISOString();
    }
    // Update requesting stock if present
    const destStock = (db.criticalSupplies || []).find(s => s.hospitalId === requestingHospitalId && s.item === item);
    if (destStock) {
      destStock.available += quantity;
      if (destStock.available > destStock.minThreshold) {
        destStock.status = 'Optimal';
      }
      destStock.lastUpdated = new Date().toISOString();
    }

    save(db);
    return send(res, 201, { transfer: newTransfer, message: 'Supply re-allocation transfer approved and dispatched.' });
  }

  // 11. GET /api/emergency/supply-transfers
  if (req.method === 'GET' && pathname === '/api/emergency/supply-transfers') {
    const city = q.city || 'All';
    let list = db.supplyTransfers || [];
    if (city !== 'All') list = list.filter(s => s.city === city);
    return send(res, 200, { supplyTransfers: list });
  }

  // 12. PATCH /api/emergency/supply-transfers/:id
  if (req.method === 'PATCH' && pathname.startsWith('/api/emergency/supply-transfers/')) {
    const id = pathname.split('/').pop();
    const trf = (db.supplyTransfers || []).find(s => s.id === id || s.reference === id);
    if (!trf) return send(res, 404, { error: 'Supply transfer not found.' });

    const data = await body(req);
    if (data.status) {
      trf.status = data.status;
      if (data.status === 'Delivered') trf.deliveredAt = new Date().toISOString();
      if (data.status === 'In Transit' && !trf.dispatchedAt) trf.dispatchedAt = new Date().toISOString();
    }
    save(db);
    return send(res, 200, { transfer: trf });
  }

  // 13. GET /api/emergency/transfers - patient referrals
  if (req.method === 'GET' && pathname === '/api/emergency/transfers') {
    const city = q.city || 'All';
    let list = db.patientTransfers || [];
    if (city !== 'All') list = list.filter(t => t.city === city);
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return send(res, 200, { patientTransfers: list });
  }

  // 14. POST /api/emergency/transfers - create patient referral transfer
  if (req.method === 'POST' && pathname === '/api/emergency/transfers') {
    const data = await body(req);
    const patientName = String(data.patientName || '').trim();
    const age = Number(data.age) || 0;
    const gender = String(data.gender || 'Not specified').trim();
    const city = String(data.city || 'Bengaluru').trim();
    const referringHospitalId = Number(data.referringHospitalId);
    const receivingHospitalId = Number(data.receivingHospitalId);
    const transferReason = String(data.transferReason || '').trim();
    const authorizedDoctor = String(data.authorizedDoctor || '').trim();
    const clinicalAssessment = String(data.clinicalAssessment || '').trim();
    const reservedRoomType = String(data.reservedRoomType || 'ICU').trim();
    const urgency = String(data.urgency || 'Emergency (Immediate)').trim();

    if (!patientName || !transferReason || !authorizedDoctor) {
      return send(res, 400, { error: 'Patient name, transfer reason, and authorized physician are required.' });
    }

    const refHosp = (db.hospitals || []).find(h => h.id === referringHospitalId);
    const recHosp = (db.hospitals || []).find(h => h.id === receivingHospitalId);

    // Find available ambulance in city
    const amb = (db.ambulances || []).find(a => a.city === city && a.status === 'Available');

    const newTrf = {
      id: 'TRF-' + Math.floor(100 + Math.random() * 900),
      reference: 'REF-TRF-' + Math.floor(1000 + Math.random() * 9000),
      patientName,
      age,
      gender,
      city,
      referringHospitalId,
      referringHospitalName: refHosp ? refHosp.name : 'Origin Facility',
      receivingHospitalId,
      receivingHospitalName: recHosp ? recHosp.name : 'Receiving Facility',
      transferReason,
      authorizedDoctor,
      clinicalAssessment: clinicalAssessment || 'Patient cleared for monitored inter-facility transport by attending consultant.',
      reservedRoomType,
      ambulanceAssigned: amb ? amb.id : 'Pending Dispatch',
      status: 'Approved & Bed Reserved',
      urgency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (amb) {
      amb.status = 'Dispatched';
      amb.updatedAt = new Date().toISOString();
    }

    db.patientTransfers.unshift(newTrf);
    save(db);

    return send(res, 201, { patientTransfer: newTrf, message: 'Patient transfer coordination initialized and bed reserved.' });
  }

  // 15. PATCH /api/emergency/transfers/:id
  if (req.method === 'PATCH' && pathname.startsWith('/api/emergency/transfers/')) {
    const id = pathname.split('/').pop();
    const trf = (db.patientTransfers || []).find(t => t.id === id || t.reference === id);
    if (!trf) return send(res, 404, { error: 'Patient transfer not found.' });

    const data = await body(req);
    if (data.status) {
      trf.status = data.status;
      if (data.status === 'Arrived & Admitted') {
        // Free ambulance if assigned
        if (trf.ambulanceAssigned && trf.ambulanceAssigned.startsWith('AMB-')) {
          const amb = (db.ambulances || []).find(a => a.id === trf.ambulanceAssigned);
          if (amb) {
            amb.status = 'Available';
            amb.updatedAt = new Date().toISOString();
          }
        }
      }
    }
    if (data.ambulanceAssigned) trf.ambulanceAssigned = data.ambulanceAssigned;
    trf.updatedAt = new Date().toISOString();
    save(db);
    return send(res, 200, { patientTransfer: trf });
  }

  // 16. GET /api/emergency/ai-recommendations
  if (req.method === 'GET' && pathname === '/api/emergency/ai-recommendations') {
    const city = q.city || 'All';
    const recs = generateAiRecommendations(db, city);
    return send(res, 200, recs);
  }

  return false; // not handled by emergency module
}

module.exports = {
  handleEmergencyCoordination,
  seedEmergencyData
};
