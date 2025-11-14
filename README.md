# OpenSourceEvalution-FoodTracker
# 🥗FreshMeter

FreshMeter is a **React web application** that empowers users to make healthier and more sustainable food choices. By scanning barcodes or searching products, the app fetches **nutrition facts, Eco‑Scores, additives, health grades, and CO₂ impact** from the [OpenFoodFacts API](https://world.openfoodfacts.org/data). It also suggests **better alternatives** and gamifies the experience with **eco‑points**.

---

## ✨ Features

- 📷 **Scan or search products** by barcode or name  
- 📊 **Visualize nutrition** with interactive **Chart.js** graphs (macros, sugars, fats, fiber, salt)  
- 🟢 **Nutri‑Score & Eco‑Score badges** with clear color coding  
- 💚 **Health grade** derived from Nutri‑Score and nutrient analysis  
- 🌍 **CO₂ impact estimation** per 100g of product  
- ⚠️ **Additives list** with clean label awareness  
- 🔄 **Alternative suggestions** from the same category with better scores  
- 🎮 **Eco‑points gamification**: earn points for scanning, choosing alternatives, and reducing additives  
- 🕑 **Scan history** stored locally for quick reference  

---

## 🛠 Tech Stack

- **Frontend:** React 18, Vite  
- **Charts:** Chart.js via react‑chartjs‑2  
- **API:** OpenFoodFacts REST API  
- **State & Hooks:** React hooks (`useState`, `useEffect`, `useMemo`)  
- **Persistence:** LocalStorage for eco‑points and history  
- **Styling:** Modern CSS with dark gradient UI  

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/eco-scanner.git
cd eco-scanner

# Install dependencies
npm install

# Start development server
npm run dev