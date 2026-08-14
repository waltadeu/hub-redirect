// ===== Shipping calculator (CTT-based) =====
// Approximate CTT International Economic rates to Brazil (Zona 3)
// Values in EUR, based on 2024 public CTT tariff table.

window.HR_FRETE_TABLE = [
  { max: 0.5,  ctt: 18.90 },
  { max: 1,    ctt: 26.40 },
  { max: 2,    ctt: 38.80 },
  { max: 3,    ctt: 51.20 },
  { max: 5,    ctt: 68.90 },
  { max: 7,    ctt: 89.50 },
  { max: 10,   ctt: 118.20 },
  { max: 15,   ctt: 172.80 },
  { max: 20,   ctt: 228.50 },
  { max: 30,   ctt: 342.00 }
];
window.HR_HANDLING = { reception: 5, packaging: 5 }; // EUR fees

async function buscarCotacao(total) {
    const response = await fetch(
        'https://api.frankfurter.dev/v1/latest?from=EUR&to=BRL'
    );

    const data = await response.json();
    const convert = data.rates.BRL;
    const totalReal = total * convert;
    const fmt = v => 'R$ ' + v.toFixed(2).replace('.', ',');

    console.log(convert);
    console.log(totalReal);

    document.getElementById('resTotalReal').textContent = fmt(totalReal);
}

window.HR = window.HR || {};
window.HR.calcFrete = function(evt) {
  evt.preventDefault();
  const f = evt.target;
  const kg = parseFloat(f.weight.value) || 0;
  const L = parseFloat(f.length.value) || 0;
  const W = parseFloat(f.width.value) || 0;
  const H = parseFloat(f.height.value) || 0;
  const volKg = (L * W * H) / 5000; // volumetric kg
  const billable = Math.max(kg, volKg);
  let ctt = null;
  for (const row of window.HR_FRETE_TABLE) {
    if (billable <= row.max) { ctt = row.ctt; break; }
  }
  if (ctt == null) ctt = window.HR_FRETE_TABLE[window.HR_FRETE_TABLE.length - 1].ctt;
  const handling = window.HR_HANDLING.reception + window.HR_HANDLING.packaging;
  const total = ctt + handling;
  const fmt = v => '€ ' + v.toFixed(2).replace('.', ',');
  document.getElementById('resActual').textContent = kg.toFixed(2) + ' kg';
  document.getElementById('resVol').textContent = volKg.toFixed(2) + ' kg';
  document.getElementById('resBillable').textContent = billable.toFixed(2) + ' kg';
  document.getElementById('resCtt').textContent = fmt(ctt);
  document.getElementById('resHandling').textContent = fmt(handling);
  document.getElementById('resTotal').textContent = fmt(total);
  document.getElementById('resultBox').style.display = 'block';

  buscarCotacao(total);
};

window.HR.renderFreteTable = function() {
  const tbody = document.getElementById('freteTableBody');
  if (!tbody) return;
  const handling = window.HR_HANDLING.reception + window.HR_HANDLING.packaging;
  let prev = 0;
  tbody.innerHTML = window.HR_FRETE_TABLE.map(row => {
    const label = `${prev.toFixed(1)} – ${row.max.toFixed(1)} kg`;
    prev = row.max;
    return `<tr>
      <td>${label}</td>
      <td>€ ${row.ctt.toFixed(2).replace('.', ',')}</td>
      <td><strong>€ ${(row.ctt + handling).toFixed(2).replace('.', ',')}</strong></td>
    </tr>`;
  }).join('');

  
};
