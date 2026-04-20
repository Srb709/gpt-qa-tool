const button = document.getElementById("submit-btn");
const output = document.getElementById("response-box");

function formatMoney(n) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(n || 0);
}

button.addEventListener("click", () => {
  const list = Number(document.getElementById("list-price").value || 0);
  const offer = Number(document.getElementById("offer-price").value || 0);
  const assist = Number(document.getElementById("seller-assist").value || 0);
  const down = Number(document.getElementById("down-percent").value || 0);
  const gap = Number(document.getElementById("appraisal-gap").value || 0);
  const competing = Number(document.getElementById("competing-offers").value || 0);

  const inspection = document.getElementById("inspection-type").value;
  const financing = document.getElementById("financing-type").value;

  if (!list || !offer) {
    output.textContent = "Put in at least list price and offer price.";
    return;
  }

  let score = 50;

  const net = offer - assist;
  const overAsk = ((offer - list) / list) * 100;

  score += Math.min(20, Math.max(-15, overAsk * 3));
  score += Math.min(15, down * 0.5);
  score += Math.min(12, gap / 2500);

  if (inspection === "waived") score += 18;
  if (inspection === "info") score += 8;
  if (inspection === "full") score -= 8;

  if (financing === "cash") score += 18;
  if (financing === "conv") score += 8;
  if (financing === "fha") score -= 8;
  if (financing === "va") score -= 6;

  score -= Math.min(10, competing * 1.5);

  score = Math.max(1, Math.min(99, Math.round(score)));

  let strength = "Decent but not strong";

  if (score >= 75) strength = "Strong offer";
  else if (score < 45) strength = "Weak offer";

  const result = `
Strength: ${strength}
Score: ${score}/99

Seller Net: ${formatMoney(net)}
Over Asking: ${overAsk.toFixed(2)}%

What seller sees:
${score >= 75 ? "This is a serious offer and should compete." : score >= 45 ? "This has a shot but is not a lock." : "This likely loses in a multiple offer situation."}

Client text:
Based on everything, this looks ${score >= 75 ? "strong" : score >= 45 ? "competitive but not bulletproof" : "a little weak"}. The seller is focused on net money, risk, and clean terms. Right now your offer nets them ${formatMoney(net)}. If we want to improve it, the easiest levers are price, appraisal gap, or inspection terms.
`;

  output.textContent = result.trim();
});