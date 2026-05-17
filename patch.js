const fs = require('fs');
const file = 'eduflow/app/login/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<div className="space-y-2">\n              <Input\n                id="email"',
  '<div className="space-y-2">\n              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">\n                Email\n              </label>\n              <Input\n                id="email"'
);

content = content.replace(
  '<div className="space-y-2">\n              <Input\n                id="password"',
  '<div className="space-y-2">\n              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">\n                Password\n              </label>\n              <Input\n                id="password"'
);

fs.writeFileSync(file, content);
