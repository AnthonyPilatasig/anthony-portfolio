import React, { useState } from 'react';
import { FiShield, FiX, FiCheck, FiAlertTriangle, FiRotateCcw } from 'react-icons/fi';

interface Round {
  title: string;
  lang: string;
  lines: string[];
  vulnerableLine: number;
  explanation: string;
}

const ROUNDS: Round[] = [
  {
    title: 'Login endpoint (.NET)',
    lang: 'csharp',
    lines: [
      'var user = await _db.Users.FindAsync(id);',
      `var query = $"SELECT * FROM Users WHERE Name = '{username}'";`,
      'if (user == null) return NotFound();',
    ],
    vulnerableLine: 1,
    explanation: 'Concatenar el input del usuario directo en el SQL abre la puerta a SQL Injection. Usa parámetros (FromSqlInterpolated / SqlParameter).',
  },
  {
    title: 'Render de comentario (React)',
    lang: 'jsx',
    lines: [
      'const clean = comment.trim();',
      '<div>{comment}</div>',
      '<div dangerouslySetInnerHTML={{ __html: comment }} />',
    ],
    vulnerableLine: 2,
    explanation: '`dangerouslySetInnerHTML` con contenido de usuario sin sanitizar es la puerta clásica a XSS almacenado. React ya escapa `{comment}` por ti — úsalo así.',
  },
  {
    title: 'Config de cliente API',
    lang: 'ts',
    lines: [
      "const BASE_URL = 'https://api.miapp.com';",
      "const STRIPE_SECRET_KEY = 'sk_live_51Hx...';",
      'export const apiClient = axios.create({ baseURL: BASE_URL });',
    ],
    vulnerableLine: 1,
    explanation: 'Una clave secreta (`sk_live_...`) hardcodeada en código que se compila al cliente queda expuesta a cualquiera que abra el bundle JS. Va en variables de entorno del servidor, nunca en el frontend.',
  },
  {
    title: 'Guardar contraseña nueva',
    lang: 'csharp',
    lines: [
      'var hash = MD5.HashData(Encoding.UTF8.GetBytes(password));',
      'user.PasswordHash = Convert.ToBase64String(hash);',
      'await _db.SaveChangesAsync();',
    ],
    vulnerableLine: 0,
    explanation: 'MD5 es rápido y sin salt — perfecto para tablas rainbow, pésimo para contraseñas. Usa bcrypt, Argon2 o PBKDF2, diseñados para ser lentos a propósito.',
  },
  {
    title: 'Endpoint de administración',
    lang: 'csharp',
    lines: [
      '[HttpDelete("users/{id}")]',
      'public async Task<IActionResult> DeleteUser(int id)',
      '{ await _db.Users.Where(u => u.Id == id).ExecuteDeleteAsync(); return Ok(); }',
    ],
    vulnerableLine: 1,
    explanation: 'No hay `[Authorize(Roles = "Admin")]` ni verificación de sesión — cualquiera que conozca la ruta puede borrar usuarios. Autenticación/autorización nunca es opcional en endpoints destructivos.',
  },
  {
    title: 'CORS en el backend',
    lang: 'csharp',
    lines: [
      'services.AddCors(options => {',
      '  options.AddPolicy("Open", p => p.AllowAnyOrigin().AllowCredentials());',
      '});',
    ],
    vulnerableLine: 1,
    explanation: 'Combinar `AllowAnyOrigin()` con `AllowCredentials()` permite que cualquier sitio web lea respuestas autenticadas de tu API con las cookies de la víctima. Estos dos nunca deben ir juntos.',
  },
];

interface VulnHunterGameProps {
  onClose: () => void;
}

export const VulnHunterGame: React.FC<VulnHunterGameProps> = ({ onClose }) => {
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const round = ROUNDS[roundIndex];

  const pick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === round.vulnerableLine) setScore((s) => s + 1);
  };

  const next = () => {
    if (roundIndex + 1 >= ROUNDS.length) {
      setFinished(true);
      return;
    }
    setRoundIndex((i) => i + 1);
    setSelected(null);
  };

  const restart = () => {
    setRoundIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#0a0f1a] border border-red-500/25 rounded-2xl p-6 shadow-2xl relative font-mono"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800">
          <FiX className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-red-400 text-xs uppercase tracking-widest mb-4 pr-8">
          <FiShield className="w-4 h-4 shrink-0" />
          <span className="truncate">Detecta la Vulnerabilidad</span>
          {!finished && <span className="ml-auto shrink-0 text-slate-500 normal-case tracking-normal">Ronda {roundIndex + 1}/{ROUNDS.length} · Score {score}</span>}
        </div>

        {!finished ? (
          <>
            <h3 className="text-slate-100 text-sm font-bold mb-3">{round.title}</h3>
            <p className="text-[11px] text-slate-400 mb-3">Toca la línea que tiene el problema de seguridad.</p>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden mb-4">
              {round.lines.map((line, idx) => {
                const isPicked = selected === idx;
                const isAnswer = idx === round.vulnerableLine;
                const showResult = selected !== null;
                return (
                  <button
                    key={idx}
                    onClick={() => pick(idx)}
                    disabled={selected !== null}
                    className={`w-full text-left px-4 py-2.5 text-xs border-b border-slate-800/60 last:border-b-0 transition-colors flex items-start gap-3 ${
                      showResult && isAnswer
                        ? 'bg-emerald-500/10'
                        : showResult && isPicked
                          ? 'bg-red-500/10'
                          : 'hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-slate-600 shrink-0">{idx + 1}</span>
                    <code className="text-slate-300 flex-1 whitespace-pre-wrap break-all">{line}</code>
                    {showResult && isAnswer && <FiCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />}
                    {showResult && isPicked && !isAnswer && <FiAlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <div className="space-y-3">
                <p className={`text-xs leading-relaxed ${selected === round.vulnerableLine ? 'text-emerald-300' : 'text-slate-300'}`}>
                  {selected === round.vulnerableLine ? '✓ Correcto. ' : '✗ Esa no era. '}
                  {round.explanation}
                </p>
                <button
                  onClick={next}
                  className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
                >
                  {roundIndex + 1 >= ROUNDS.length ? 'Ver resultado' : 'Siguiente ronda →'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6 space-y-4">
            <p className="text-3xl font-bold text-slate-100">{score} / {ROUNDS.length}</p>
            <p className="text-xs text-slate-400">
              {score === ROUNDS.length
                ? 'Perfecto. Estas son exactamente las cosas que reviso en cada PR.'
                : score >= ROUNDS.length / 2
                  ? 'Nada mal — estos son bugs reales que he visto en producción.'
                  : 'Vale la pena repasarlos — son de los errores de seguridad más comunes en apps reales.'}
            </p>
            <button
              onClick={restart}
              className="mx-auto flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 hover:border-red-400 text-slate-300 hover:text-red-300 text-xs uppercase tracking-wider"
            >
              <FiRotateCcw className="w-3.5 h-3.5" />
              Jugar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
