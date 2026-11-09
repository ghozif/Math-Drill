// Keypad angka di layar. Pakai onPointerDown (bukan onClick) supaya
// respon lebih cepat di HP dan tidak memicu zoom saat ketuk dua kali.
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

export default function Keypad({ onDigit, onBackspace, onClear }) {
  const press = (k) => (e) => {
    e.preventDefault();
    if (k === '⌫') onBackspace();
    else if (k === 'C') onClear();
    else onDigit(k);
  };

  return (
    <div className="keypad" role="group" aria-label="Keypad angka">
      {KEYS.map((k) => (
        <button
          key={k}
          type="button"
          className={k === 'C' || k === '⌫' ? 'fn' : ''}
          aria-label={k === '⌫' ? 'Hapus satu digit' : k === 'C' ? 'Kosongkan' : k}
          onPointerDown={press(k)}
        >
          {k}
        </button>
      ))}
    </div>
  );
}
