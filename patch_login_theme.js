const fs = require('fs');
const file = 'eduflow/app/login/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The background is currently: <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
// Let's replace it with an emoji background.
// Emojis: 🎓 📚 🖍️ 🎒 ✏️ 🎨 🍎 🌟
content = content.replace(
  '<div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">',
  `<div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-sky-100 dark:bg-sky-950">
      {/* Emoji Background Pattern */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none text-4xl leading-[3rem] select-none break-words flex flex-wrap content-start" aria-hidden="true">
        {Array.from({ length: 200 }).map((_, i) => (
          <span key={i} className="inline-block p-4">
            {['🎓', '📚', '🖍️', '🎒', '✏️', '🎨', '🍎', '🌟'][Math.floor(Math.random() * 8)]}
          </span>
        ))}
      </div>

      {/* Container to bring content above background */}
      <div className="relative z-10 w-full max-w-md">`
);

// We added an extra div wrapper for z-10, so we need to add a closing div before the end.
content = content.replace(
  '    </div>\n  );\n}',
  '      </div>\n    </div>\n  );\n}'
);

// We need to change the Card background transparency to 40% (60% opaque? No, 40% transparency = 60% opacity or 40% opacity?)
// Usually `bg-background/60` (40% transparent) or `bg-background/40` (40% opacity). Let's use bg-background/60 backdrop-blur-md
content = content.replace(
  '<Card className="w-full max-w-md">',
  '<Card className="w-full shadow-xl bg-background/60 backdrop-blur-md border-primary/20">'
);

fs.writeFileSync(file, content);
