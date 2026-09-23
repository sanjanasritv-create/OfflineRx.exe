import type { AIAnalysis } from '../types';

// Map of keywords to AI analysis responses for simulating AI behavior
export const aiResponseMap: Record<string, AIAnalysis> = {
  fever: {
    identifiedNeed: 'Persistent fever / diagnostic evaluation',
    suggestedDepartment: 'General Medicine',
    priority: 'Moderate',
    reason: 'Patient requires clinical evaluation and diagnostic testing for fever. Blood tests including CBC and peripheral smear may be needed.',
    keywords: ['fever', 'temperature', 'weakness', 'body pain'],
  },
  pregnancy: {
    identifiedNeed: 'Antenatal care / pregnancy checkup',
    suggestedDepartment: 'Obstetrics & Gynaecology',
    priority: 'Moderate',
    reason: 'Antenatal monitoring recommended for maternal and fetal health assessment. Regular checkups ensure safe pregnancy progression.',
    keywords: ['pregnant', 'pregnancy', 'antenatal', 'delivery', 'baby'],
  },
  chest: {
    identifiedNeed: 'Chest discomfort / cardiac evaluation',
    suggestedDepartment: 'General Medicine / Cardiology',
    priority: 'Urgent',
    reason: 'Chest symptoms require urgent cardiac evaluation. ECG, chest X-ray, and further investigation may be needed.',
    keywords: ['chest', 'heart', 'breathlessness', 'palpitation'],
  },
  blood: {
    identifiedNeed: 'Laboratory testing / blood investigation',
    suggestedDepartment: 'General Medicine',
    priority: 'Low',
    reason: 'Laboratory tests required for diagnosis or monitoring. Blood sample collection and analysis needed.',
    keywords: ['blood test', 'blood sugar', 'diabetes', 'laboratory'],
  },
  eye: {
    identifiedNeed: 'Vision problems / ophthalmological evaluation',
    suggestedDepartment: 'Ophthalmology',
    priority: 'Moderate',
    reason: 'Vision changes require ophthalmological assessment including refraction test and fundus examination.',
    keywords: ['eye', 'vision', 'blurred', 'cataract', 'glasses'],
  },
  skin: {
    identifiedNeed: 'Skin condition / dermatological evaluation',
    suggestedDepartment: 'Dermatology',
    priority: 'Low',
    reason: 'Skin condition requires specialist dermatological evaluation for proper diagnosis and management.',
    keywords: ['skin', 'rash', 'itching', 'allergy', 'eczema'],
  },
  bone: {
    identifiedNeed: 'Musculoskeletal problem / orthopaedic evaluation',
    suggestedDepartment: 'Orthopaedics',
    priority: 'Moderate',
    reason: 'Musculoskeletal symptoms require orthopaedic assessment. X-ray and physical examination recommended.',
    keywords: ['bone', 'joint', 'fracture', 'knee', 'back pain', 'walking'],
  },
  cough: {
    identifiedNeed: 'Respiratory symptoms / pulmonary evaluation',
    suggestedDepartment: 'General Medicine',
    priority: 'High',
    reason: 'Persistent cough requires investigation including chest X-ray and sputum examination to determine cause.',
    keywords: ['cough', 'breathing', 'respiratory', 'TB', 'tuberculosis', 'sputum'],
  },
  dental: {
    identifiedNeed: 'Dental problem / oral evaluation',
    suggestedDepartment: 'Dental',
    priority: 'Moderate',
    reason: 'Dental symptoms require professional evaluation and treatment by a dentist.',
    keywords: ['tooth', 'teeth', 'dental', 'gum', 'mouth'],
  },
  child: {
    identifiedNeed: 'Pediatric evaluation / child healthcare',
    suggestedDepartment: 'Pediatrics',
    priority: 'High',
    reason: 'Pediatric symptoms require evaluation by a physician experienced in child healthcare.',
    keywords: ['child', 'baby', 'infant', 'pediatric', 'vaccination', 'immunization'],
  },
  ear: {
    identifiedNeed: 'ENT evaluation / hearing assessment',
    suggestedDepartment: 'ENT',
    priority: 'Low',
    reason: 'Ear/hearing symptoms require ENT specialist evaluation and audiological assessment.',
    keywords: ['ear', 'hearing', 'deaf', 'ear pain', 'ENT'],
  },
  mental: {
    identifiedNeed: 'Mental health evaluation',
    suggestedDepartment: 'Psychiatry',
    priority: 'Moderate',
    reason: 'Mental health symptoms require evaluation by a trained mental health professional.',
    keywords: ['mental', 'depression', 'anxiety', 'sleep', 'stress', 'psychiatric'],
  },
};

export function analyzePatientNeed(description: string): AIAnalysis {
  const lowerDesc = description.toLowerCase();

  // Check each keyword mapping
  for (const [key, analysis] of Object.entries(aiResponseMap)) {
    if (lowerDesc.includes(key)) {
      return analysis;
    }
    // Also check the keywords array
    for (const keyword of analysis.keywords) {
      if (lowerDesc.includes(keyword)) {
        return analysis;
      }
    }
  }

  // Default response if no keywords match
  return {
    identifiedNeed: 'General healthcare evaluation',
    suggestedDepartment: 'General Medicine',
    priority: 'Moderate',
    reason: 'Patient needs require general medical evaluation. A physician can assess the condition and refer to a specialist if needed.',
    keywords: [],
  };
}

export function getMatchingFacilities(department: string, facilities: Array<{
  id: string;
  name: string;
  type: string;
  departments: string[];
  services: string[];
  distance: number;
  isOpen: boolean;
}>) {
  return facilities
    .map((facility) => {
      let score = 50; // base score
      const reasons: string[] = [];

      // Department match
      const deptMatch = facility.departments.some((d) =>
        department.toLowerCase().split('/').some((dept) =>
          d.toLowerCase().includes(dept.trim()) || dept.trim().toLowerCase().includes(d.toLowerCase())
        )
      );
      if (deptMatch) {
        score += 25;
        reasons.push('Appropriate department available');
      }

      // Distance scoring (closer = better)
      if (facility.distance <= 5) {
        score += 15;
        reasons.push('Nearby location');
      } else if (facility.distance <= 10) {
        score += 10;
        reasons.push('Reasonable distance');
      } else if (facility.distance <= 20) {
        score += 5;
        reasons.push('Accessible location');
      }

      // Open status
      if (facility.isOpen) {
        score += 5;
        reasons.push('Currently open');
      }

      // Service breadth
      if (facility.services.length > 5) {
        score += 5;
        reasons.push('Comprehensive services available');
      }

      // Cap at 98
      score = Math.min(score, 98);

      return {
        ...facility,
        matchScore: score,
        matchReasons: reasons,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

export const exampleSuggestions = [
  'Pregnant woman needs antenatal checkup',
  'Child has persistent fever for three days',
  'Patient needs blood sugar test',
  'Elderly patient needs specialist consultation for knee pain',
  'Patient has skin rash that won\'t go away',
  'Woman has severe headache and dizziness',
];
