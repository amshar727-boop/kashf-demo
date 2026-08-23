import fs from 'node:fs';
const html = fs.readFileSync('v12-validation.html','utf8');
const required = [
  ['Arabic RTL','lang="ar" dir="rtl"'],
  ['viewport','name="viewport"'],
  ['two recommendations','أهم توصيتين لك الآن'],
  ['structured survey','v12SurveyHighlight'],
  ['consent layer','v12-privacy-layer'],
  ['private browsing option','متابعة دون حفظ'],
  ['no session recording disclosure','لا نسجل ضغطات المفاتيح ولا نصوّر الشاشة'],
  ['client error tracking','validation_client_error'],
  ['onboarding funnel','validation_onboarding_step'],
  ['subscription intent','subscription_intent'],
  ['completion event','feedback_survey_completed'],
  ['v12.1 version','version:\'v12.1\''],
  ['fresh session lifecycle','state.completed||stale'],
  ['stable participant','kashf_validation_participant'],
  ['survey duplicate guard','state.surveySubmitted'],
  ['clarity score','v12SurveyClarity'],
  ['trust score','v12SurveyTrust'],
  ['onboarding validation','validateMove'],
  ['early experience disclosure','تجربة خاصة مبكرة'],
  ['no fake SIMAH detail','لا نعرض سجل سداد أو استعلامات'],
  ['pilot endpoint','kashf-pilot-ingest']
];
const missing = required.filter(([,needle])=>!html.includes(needle));
if(missing.length){
  console.error('Missing v12 requirements:', missing.map(([name])=>name).join(', '));
  process.exit(1);
}
const recTitleCount = (html.match(/id="v12Rec(?:One|Two)Title"/g)||[]).length;
if(recTitleCount !== 2){
  console.error('Expected exactly two recommendation titles, found',recTitleCount);
  process.exit(1);
}
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const duplicates = [...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
if(duplicates.length){
  console.error('Duplicate element IDs:',duplicates.join(', '));
  process.exit(1);
}
console.log('v12 smoke checks passed:',required.length,'requirements,',ids.length,'unique IDs');
