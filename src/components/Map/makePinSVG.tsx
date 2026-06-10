export function makePinSVG(color: string): string {
  return `
  <div style="width:22px;height:28px;cursor:pointer">
    <svg viewBox="0 0 22 28" xmlns="http://www.w3.org/2000/svg"
         style="filter:drop-shadow(0 2px 5px rgba(0,0,0,.25));display:block;width:22px;height:28px;">
      <path d="M11 1C5.477 1 1 5.477 1 11c0 7.5 10 17 10 17S21 18.5 21 11C21 5.477 16.523 1 11 1z"
            fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="11" cy="11" r="3.8" fill="white" opacity="0.88"/>
    </svg>
    </div>
  `;
}
